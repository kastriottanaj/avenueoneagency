# core/views.py
import os
import re
from html import escape

from django.conf import settings
from django.db import connection
from django.http import HttpResponse

from .seo import (
    NOT_FOUND_META,
    meta_for_path,
    render_head,
    render_json_ld,
)

_TITLE_RE = re.compile(r'<title>.*?</title>', re.IGNORECASE | re.DOTALL)
_doc_cache = {}

_DIST = os.path.join(settings.BASE_DIR, 'frontend', 'dist')
_PRERENDERED = os.path.join(_DIST, 'prerendered')


def _base_url(request):
    scheme = 'https' if request.is_secure() else 'http'
    return f'{scheme}://{request.get_host()}'


def _prerender_name(path):
    """Map a URL path to the file prerender.mjs wrote for it."""
    slug = path.strip('/')
    return 'index' if not slug else slug.replace('/', '__')


def _read_document(filename):
    """Read a built HTML document, cached by mtime so a redeploy picks it up.

    Prefers the prerendered version of the route. Those files carry the fully
    rendered page inside #root, so crawlers that do not execute JavaScript —
    GPTBot, ClaudeBot, PerplexityBot, and every social unfurler — receive the
    actual content instead of an empty div.
    """
    path = os.path.join(_PRERENDERED, f'{filename}.html')
    if not os.path.exists(path):
        path = os.path.join(_DIST, 'index.html')

    try:
        mtime = os.path.getmtime(path)
    except OSError:
        return None

    cached = _doc_cache.get(path)
    if cached and cached[0] == mtime:
        return cached[1]

    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    # The build ships a hardcoded <title>. Strip it so the per-route title
    # injected below is the only one in the document.
    html = _TITLE_RE.sub('', html, count=1)
    _doc_cache[path] = (mtime, html)
    return html


def _render_shell(request, path, meta, post=None, status=200, document=None, body_html=None):
    html = _read_document(document if document is not None else _prerender_name(path))
    if html is None:
        return HttpResponse(
            '<h1>Frontend not built</h1>'
            '<p>Run: <code>cd frontend &amp;&amp; npm install &amp;&amp; npm run build</code></p>',
            status=503,
            content_type='text/html',
        )

    base_url = _base_url(request)
    head = render_head(path, base_url, meta)
    json_ld = render_json_ld(path, base_url, post)
    injected = f'    {head}\n    {json_ld}\n  </head>'

    html = html.replace('</head>', injected, 1)

    if body_html:
        # Rendered per request, so it is not React's own markup — the client
        # replaces it rather than hydrating (see main.tsx). Crawlers that never
        # run JavaScript still get the full article.
        html = html.replace(
            '<div id="root"></div>',
            f'<div id="root">{body_html}</div>',
            1,
        )

    return HttpResponse(html, status=status, content_type='text/html; charset=utf-8')


def react_app(request, **kwargs):
    """Serve the React shell with the metadata for this specific route."""
    path = request.path
    if not path.endswith('/'):
        path += '/'
    return _render_shell(request, path, meta_for_path(path))


def blog_detail_app(request, slug):
    """Serve the React shell for a blog post, with that post's real metadata.

    A slug that does not resolve to a published post must 404 rather than
    rendering the app with a 200.
    """
    from blog.models import BlogPost

    try:
        post = BlogPost.objects.get(slug=slug, published=True)
    except BlogPost.DoesNotExist:
        return page_not_found(request)

    path = f'/blog/{slug}/'
    return _render_shell(
        request,
        path,
        meta_for_path(path, post),
        post=post,
        body_html=_post_article_html(post),
    )


def _post_article_html(post):
    """Server-render a post as semantic HTML.

    Blog posts come from the database, so they cannot be prerendered at build
    time like the static routes. Without this the article body would exist only
    after React fetched it — invisible to every crawler that does not execute
    JavaScript, which is most of them and all of the AI engines.
    """
    published = post.created_at.strftime('%B %-d, %Y')
    author = ''
    if post.author:
        name = post.author.get_full_name() or post.author.username
        author = f'<p class="blog-card-date">By {escape(name)}</p>'

    image = ''
    if post.featured_image:
        image = (
            f'<img src="{escape(post.featured_image.url)}" '
            f'alt="{escape(post.title)}" class="blog-card-img" />'
        )

    # post.content is authored in the Django admin by the site owner, not by
    # visitors, so it is intentionally rendered as markup.
    return (
        '<div class="d-flex flex-column min-vh-100"><main id="main">'
        '<article class="page-section"><div class="container">'
        f'<h1>{escape(post.title)}</h1>'
        f'<p class="blog-card-date">{escape(published)}</p>'
        f'{author}'
        f'<p>{escape(post.description or post.meta_description)}</p>'
        f'{image}'
        f'<div class="blog-content">{post.content}</div>'
        '</div></article></main></div>'
    )


def page_not_found(request, exception=None):
    """404 handler.

    The previous catch-all served the SPA with a 200 for every unmatched URL,
    so Google saw an unlimited supply of soft-404 duplicates of the homepage.
    """
    return _render_shell(request, request.path, NOT_FOUND_META, status=404, document='404')


# Answer-engine crawlers. Named explicitly so the intent to allow them is
# unambiguous — several respect only a directive addressed to them by name,
# and a future blanket Disallow would otherwise cut the site out of AI answers.
AI_CRAWLERS = [
    'GPTBot',           # OpenAI / ChatGPT
    'OAI-SearchBot',    # ChatGPT Search
    'ChatGPT-User',
    'ClaudeBot',        # Anthropic
    'Claude-User',
    'PerplexityBot',    # Perplexity
    'Perplexity-User',
    'Google-Extended',  # Gemini / AI Overviews
    'Applebot-Extended',
    'CCBot',            # Common Crawl, feeds many models
]


def healthz(request):
    """Liveness probe for deploys and uptime monitoring.

    Checks the two things that actually break a deploy: the database is
    reachable, and the frontend bundle was built. Returns 503 on either
    failure so `deploy.sh` fails loudly instead of leaving a broken site up.
    """
    problems = []

    try:
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
    except Exception as exc:                     # noqa: BLE001 - reported, not raised
        problems.append(f'database: {exc.__class__.__name__}')

    index_html = os.path.join(settings.BASE_DIR, 'frontend', 'dist', 'index.html')
    if not os.path.isfile(index_html):
        problems.append('frontend: dist/index.html missing (run npm run build)')

    if problems:
        return HttpResponse(
            'unhealthy\n' + '\n'.join(problems) + '\n',
            status=503,
            content_type='text/plain',
        )

    return HttpResponse('ok\n', content_type='text/plain')


def robots_txt(request):
    lines = [
        "User-agent: *",
        "Allow: /",
        "",
        "Disallow: /admin/",
        "Disallow: /api/",
    ]

    for bot in AI_CRAWLERS:
        lines += ["", f"User-agent: {bot}", "Allow: /", "Disallow: /admin/", "Disallow: /api/"]

    lines += ["", "Sitemap: https://avenueoneagency.com/sitemap.xml"]
    return HttpResponse("\n".join(lines), content_type="text/plain")


def llms_txt(request):
    content = """# Avenue One Agency

> Creator-led NYC social media and marketing agency founded by Linda Kafexholli. Strategy, content and influencer partnerships for hospitality and lifestyle brands across the U.S. and Europe.

## Pages

- [Home](https://avenueoneagency.com/): NYC social media agency for hospitality and lifestyle brands. Agency overview, proof and core offerings.
- [About](https://avenueoneagency.com/about/): NYC-born, creator-led story. Founder Linda Kafexholli's background as a global digital creator with a 1M+ audience and cross-continental marketing expertise.
- [Services](https://avenueoneagency.com/services/): Social media strategy, content creation, influencer partnerships, brand identity, campaign production, hospitality marketing, paid media, and AI Engine Optimization (AEO).
- [Industries](https://avenueoneagency.com/industries/): Hospitality & hotels, restaurants & F&B, fashion & luxury, beauty & wellness, lifestyle & culture, real estate & development.
- [Hospitality Marketing Agency NYC](https://avenueoneagency.com/hospitality-marketing-agency-nyc/): Strategy, social media, content, creators and paid distribution for hotels, restaurants, bars and hospitality groups.
- [Social Media Management NYC](https://avenueoneagency.com/social-media-management-nyc/): Channel strategy, planning, publishing, community management and reporting for hospitality and lifestyle brands.
- [Influencer Marketing Agency NYC](https://avenueoneagency.com/influencer-marketing-agency-nyc/): Creator strategy, casting, briefing, usage rights, activations and reporting.
- [Hospitality Content Creation NYC](https://avenueoneagency.com/hospitality-content-creation-nyc/): Social-first photography and video for New York hotels, restaurants and bars.
- [Hotel Marketing NYC](https://avenueoneagency.com/hotel-marketing-nyc/): Social media, creator partnerships and paid media for boutique hotels and luxury properties, focused on direct bookings.
- [Restaurant Marketing NYC](https://avenueoneagency.com/restaurant-marketing-nyc/): Content, local creator partnerships and search visibility for restaurants, bars and F&B brands.
- [Fashion Marketing NYC](https://avenueoneagency.com/fashion-marketing-nyc/): Creative direction, creator casting and campaign production for fashion and luxury labels.
- [Beauty Marketing NYC](https://avenueoneagency.com/beauty-marketing-nyc/): Creator programmes, UGC direction and claims-safe content for beauty and wellness brands.
- [Lifestyle Marketing NYC](https://avenueoneagency.com/lifestyle-marketing-nyc/): Brand point of view, community building and cultural partnerships for lifestyle brands.
- [Real Estate Marketing NYC](https://avenueoneagency.com/real-estate-marketing-nyc/): Place-led positioning and long-cycle visual storytelling for developments and brokerages.
- [Testimonials](https://avenueoneagency.com/testimonials/): Client results and reviews, including Faralda Crane Hotel and Chatti New York.
- [Blog](https://avenueoneagency.com/blog/): Insights on social media marketing, creator economy, brand strategy, and hospitality/lifestyle marketing.
- [Contact](https://avenueoneagency.com/contact/): Get in touch for a free brand audit or discovery call. Replies within 24 hours.
- [Imprint](https://avenueoneagency.com/imprint/): Legal and company information.
- [Privacy Policy](https://avenueoneagency.com/privacy/): Data protection and privacy policy.

## Contact

- Email: avenueoneagency@gmail.com
- Instagram: https://www.instagram.com/avenueone.agency/
- Location: New York City, USA
"""
    return HttpResponse(content, content_type="text/plain; charset=utf-8")


def llms_full_txt(request):
    content = """# Avenue One Agency

> Creator-led NYC social media and marketing agency founded by Linda Kafexholli. Strategy, content and influencer partnerships for hospitality and lifestyle brands across the U.S. and Europe.

- Email: avenueoneagency@gmail.com
- Instagram: https://www.instagram.com/avenueone.agency/
- Location: New York City, USA
- Founded: 2020
- Markets: NYC & EU

---

## Home — https://avenueoneagency.com/

**Positioning:** NYC social media for hospitality and lifestyle brands.

Creator-led strategy, content and influencer partnerships for restaurants, boutique hotels and lifestyle brands built to be chosen.

**Key stats**
- 1M+ creator audience
- 50+ brands served
- NYC based & global
- 5-star client rating

---

## About — https://avenueoneagency.com/about/

**NYC-Born. Creator-Led. Built for Modern Brands.**

Avenue One was founded with one mission: to help brands build iconic identities that resonate with culture and convert in the market. We work with hospitality, fashion, beauty, lifestyle, and F&B brands — crafting moments, elevating identity, and building communities with purpose.

**Founder — Linda Kafexholli**
Global digital creator, marketing strategist, and 1M+ audience builder. Combines creative direction with real-world influence and deep industry expertise across the U.S. and Europe.

---

## Services — https://avenueoneagency.com/services/

1. **Social Media Strategy** — Data-driven strategies that grow audience and deepen engagement.
2. **Content Creation** — Photography, video, and copy tailored for brand voice and platform algorithms.
3. **Influencer Partnerships** — Curated creator collaborations and UGC direction.
4. **Brand Identity & Creative Direction** — Iconic, recognizable brand aesthetics end-to-end.
5. **Campaign Production & Storytelling** — Concept, production, execution, and analysis.
6. **Hospitality & Lifestyle Marketing** — Specialist expertise in hotels, restaurants, F&B, and luxury.
7. **Advertising & Paid Media** — AI-driven targeting across Meta, TikTok, Google, and beyond.
8. **AEO — AI Engine Optimization** — Optimization for ChatGPT, Perplexity, and Google AI Overview.

Dedicated service pages:
- [Social Media Management NYC](https://avenueoneagency.com/social-media-management-nyc/)
- [Influencer Marketing Agency NYC](https://avenueoneagency.com/influencer-marketing-agency-nyc/)
- [Hospitality Content Creation NYC](https://avenueoneagency.com/hospitality-content-creation-nyc/)

---

## Industries — https://avenueoneagency.com/industries/

- **Hospitality Marketing** — An integrated strategy for hotels, restaurants, bars and groups.
- **Hospitality & Hotels** — Boutique hotels to luxury chains.
- **Restaurants & F&B** — Dining experiences turned into viral moments.
- **Fashion & Luxury** — Editorial content and influencer strategy.
- **Beauty & Wellness** — Authentic content and creator partnerships.
- **Lifestyle & Culture** — Plugging brands into culture authentically.
- **Real Estate & Development** — Premium visual storytelling for residential and commercial brands.

---

## Testimonials — https://avenueoneagency.com/testimonials/

> "Through Avenue One Agency, we were able to streamline our services, increase local visibility and improve customer engagement — increasing booking rate by 25%."
> — Edwin Kornmann Rudi, Faralda Crane Hotel

> "Social Media Marketing services provided by Avenue One Agency helped us increase our online presence and customer engagement significantly."
> — Fregi Mathew, Chef, Chatti New York

---

## Blog — https://avenueoneagency.com/blog/

Insights on social media marketing, creator economy, brand strategy, and hospitality/lifestyle marketing.

---

## Contact — https://avenueoneagency.com/contact/

Tell us about your brand and what you want to achieve. Replies within 24 hours.

- Email: avenueoneagency@gmail.com
- Instagram: @avenueone.agency
- Location: New York City, USA

---

## Legal

- [Imprint](https://avenueoneagency.com/imprint/) — Legal and company information.
- [Privacy Policy](https://avenueoneagency.com/privacy/) — Data protection and privacy policy.
"""
    return HttpResponse(content, content_type="text/plain; charset=utf-8")
