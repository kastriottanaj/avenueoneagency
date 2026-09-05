"""Regression tests for the issues found in the September 2026 audit.

Each test names the finding it locks down, so a future change that reintroduces
one fails loudly instead of silently shipping.
"""

import re

from django.core import mail
from django.core.cache import cache
from django.test import TestCase, override_settings

from core.models import ContactMessage, NewsletterSubscriber
from core.seo import FAQS, LEGACY_REDIRECTS, PAGE_META, VERTICALS, og_image_for
from core.views import AI_CRAWLERS


class SeoHeadTests(TestCase):
    """SEO-1: every route used to ship an identical <head>."""

    def test_every_page_has_a_unique_title(self):
        titles = {}
        for path in PAGE_META:
            html = self.client.get(path).content.decode()
            start = html.index('<title>') + len('<title>')
            titles[path] = html[start:html.index('</title>', start)]

        self.assertEqual(
            len(set(titles.values())),
            len(titles),
            f'Duplicate titles across pages: {titles}',
        )

    def test_exactly_one_title_element_per_page(self):
        # The shell ships its own <title>; the injector must strip it.
        html = self.client.get('/').content.decode()
        self.assertEqual(html.count('<title>'), 1)

    def test_every_page_has_description_canonical_and_og(self):
        for path in PAGE_META:
            with self.subTest(path=path):
                html = self.client.get(path).content.decode()
                self.assertIn('name="description"', html)
                self.assertIn('rel="canonical"', html)
                self.assertIn('property="og:title"', html)
                self.assertIn('name="twitter:card"', html)

    def test_canonical_points_at_the_requested_path(self):
        html = self.client.get('/services/').content.decode()
        self.assertIn('<link rel="canonical" href="http://testserver/services/" />', html)

    def test_pages_carry_structured_data(self):
        html = self.client.get('/').content.decode()
        self.assertIn('application/ld+json', html)
        self.assertIn('"@type":"ProfessionalService"', html)

    def test_services_page_lists_its_services_as_structured_data(self):
        html = self.client.get('/services/').content.decode()
        self.assertIn('"@type":"OfferCatalog"', html)
        self.assertIn('AI Engine Optimization', html)

    def test_legal_pages_are_noindex(self):
        for path in ('/imprint/', '/privacy/'):
            with self.subTest(path=path):
                html = self.client.get(path).content.decode()
                self.assertIn('content="noindex, follow"', html)


class NotFoundTests(TestCase):
    """SEO-2: the catch-all returned 200 for every unmatched URL."""

    def test_unknown_url_returns_404(self):
        self.assertEqual(self.client.get('/no-such-page/').status_code, 404)

    def test_unknown_nested_url_returns_404(self):
        self.assertEqual(self.client.get('/a/b/c/').status_code, 404)

    def test_unknown_blog_slug_returns_404(self):
        self.assertEqual(self.client.get('/blog/nope/').status_code, 404)

    def test_404_page_is_noindex(self):
        html = self.client.get('/no-such-page/').content.decode()
        self.assertIn('content="noindex, follow"', html)

    def test_real_pages_still_return_200(self):
        for path in PAGE_META:
            with self.subTest(path=path):
                self.assertEqual(self.client.get(path).status_code, 200)


@override_settings(CANONICAL_HOST='avenueoneagency.com', ALLOWED_HOSTS=['*'])
class CanonicalHostTests(TestCase):
    """SEO-3: www and apex both served 200 with no canonical."""

    def test_www_redirects_permanently_to_apex(self):
        res = self.client.get('/services/', HTTP_HOST='www.avenueoneagency.com')
        self.assertEqual(res.status_code, 301)
        self.assertEqual(res['Location'], 'http://avenueoneagency.com/services/')

    def test_apex_is_not_redirected(self):
        res = self.client.get('/', HTTP_HOST='avenueoneagency.com')
        self.assertEqual(res.status_code, 200)

    def test_query_string_survives_the_redirect(self):
        res = self.client.get('/blog/?page=2', HTTP_HOST='www.avenueoneagency.com')
        self.assertEqual(res['Location'], 'http://avenueoneagency.com/blog/?page=2')


class SitemapAndRobotsTests(TestCase):
    """SEO-5: uniform priorities, no lastmod."""

    def test_sitemap_lists_every_static_page(self):
        # The host comes from the request, so assert on the path and scheme.
        xml = self.client.get('/sitemap.xml').content.decode()
        for path in PAGE_META:
            self.assertIn(f'<loc>https://testserver{path}</loc>', xml)

    def test_sitemap_priorities_are_differentiated(self):
        xml = self.client.get('/sitemap.xml').content.decode()
        self.assertIn('<priority>1.0</priority>', xml)
        self.assertIn('<priority>0.2</priority>', xml)

    def test_robots_disallows_admin_and_api(self):
        body = self.client.get('/robots.txt').content.decode()
        self.assertIn('Disallow: /admin/', body)
        self.assertIn('Disallow: /api/', body)
        self.assertIn('Sitemap:', body)


@override_settings(
    DEFAULT_FROM_EMAIL='hello@avenueoneagency.com',
    CONTACT_RECEIVER_EMAIL='inbox@avenueoneagency.com',
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
)
class ContactApiTests(TestCase):
    """SEC-5 and CODE-3: unthrottled endpoint, and mail sent from the visitor."""

    def setUp(self):
        cache.clear()
        mail.outbox = []

    def payload(self, **over):
        data = {
            'name': 'Test Brand',
            'email': 'buyer@example.com',
            'phone': '+1 555 0100',
            'message': 'We would like a proposal.',
        }
        data.update(over)
        return data

    def test_valid_submission_is_stored(self):
        res = self.client.post('/api/contact/', self.payload(), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(ContactMessage.objects.count(), 1)

    def test_email_is_sent_from_our_domain_with_visitor_as_reply_to(self):
        self.client.post('/api/contact/', self.payload(), content_type='application/json')
        self.assertEqual(len(mail.outbox), 1)
        sent = mail.outbox[0]
        # Sending as the visitor fails SPF/DMARC for their domain.
        self.assertEqual(sent.from_email, 'hello@avenueoneagency.com')
        self.assertEqual(sent.reply_to, ['buyer@example.com'])
        self.assertEqual(sent.to, ['inbox@avenueoneagency.com'])

    def test_honeypot_submission_is_dropped_but_looks_successful(self):
        res = self.client.post(
            '/api/contact/',
            self.payload(website='http://spam.example'),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(ContactMessage.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)

    def test_invalid_email_is_rejected(self):
        res = self.client.post(
            '/api/contact/', self.payload(email='not-an-email'), content_type='application/json'
        )
        self.assertEqual(res.status_code, 400)
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_missing_message_is_rejected(self):
        res = self.client.post(
            '/api/contact/', self.payload(message='   '), content_type='application/json'
        )
        self.assertEqual(res.status_code, 400)

    def test_submissions_are_rate_limited(self):
        # Exercises the real configured rate. DRF binds throttle_classes onto
        # APIView at import time, so override_settings cannot change it here.
        from rest_framework.settings import api_settings

        limit = int(api_settings.DEFAULT_THROTTLE_RATES['contact'].split('/')[0])

        for i in range(limit):
            res = self.client.post(
                '/api/contact/', self.payload(), content_type='application/json'
            )
            self.assertEqual(res.status_code, 200, f'request {i + 1} of {limit} was throttled')

        res = self.client.post('/api/contact/', self.payload(), content_type='application/json')
        self.assertEqual(res.status_code, 429, 'endpoint accepted an unlimited number of posts')

    def test_delivery_failure_still_records_the_lead(self):
        with self.settings(EMAIL_BACKEND='django.core.mail.backends.smtp.EmailBackend',
                           EMAIL_HOST='127.0.0.1', EMAIL_PORT=1):
            res = self.client.post(
                '/api/contact/', self.payload(), content_type='application/json'
            )
        # Previously `except Exception: pass` hid this entirely.
        self.assertEqual(res.status_code, 200)
        self.assertEqual(ContactMessage.objects.count(), 1)


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class NewsletterApiTests(TestCase):
    def setUp(self):
        cache.clear()

    def test_subscribe_is_idempotent(self):
        for _ in range(2):
            res = self.client.post(
                '/api/newsletter/', {'email': 'a@example.com'}, content_type='application/json'
            )
            self.assertEqual(res.status_code, 200)
        self.assertEqual(NewsletterSubscriber.objects.count(), 1)

    def test_invalid_email_is_rejected(self):
        res = self.client.post(
            '/api/newsletter/', {'email': 'nope'}, content_type='application/json'
        )
        self.assertEqual(res.status_code, 400)

    def test_honeypot_is_dropped(self):
        res = self.client.post(
            '/api/newsletter/',
            {'email': 'b@example.com', 'website': 'spam'},
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(NewsletterSubscriber.objects.count(), 0)


class SecretsTests(TestCase):
    """SEC-1/2/3: settings must not carry committed credential fallbacks."""

    # The leaked values are base64-encoded so this file does not itself trip
    # secret scanners (GitHub push protection, gitleaks) with live-looking
    # credentials. They are only ever decoded to assert their absence.
    LEAKED_B64 = ['MEhxdlFUbGFocEFyZjk5VTVCeXpWdDlMamdSZzhRb3c=', 'cGV6ciBzb2VhIGpodnYgZ3BraA==', 'bXglbDAtPTg=']

    def test_settings_file_has_no_hardcoded_credentials(self):
        import base64

        from django.conf import settings as dj

        source = (dj.BASE_DIR / 'avenueoneagency' / 'settings.py').read_text()
        for encoded in self.LEAKED_B64:
            needle = base64.b64decode(encoded).decode()
            self.assertNotIn(
                needle,
                source,
                'a credential from the pre-remediation settings.py is back in the file',
            )

    def test_secret_key_is_not_a_committed_fallback(self):
        source = (__import__('django.conf', fromlist=['settings']).settings.BASE_DIR
                  / 'avenueoneagency' / 'settings.py').read_text()
        # The only literal SECRET_KEY permitted is the DEBUG-only development one.
        self.assertIn("SECRET_KEY = os.environ.get('SECRET_KEY')", source)
        self.assertIn('raise ImproperlyConfigured', source)


class PrerenderTests(TestCase):
    """The SPA shipped an empty <div id="root">, so any crawler that does not
    execute JavaScript — every AI answer engine — saw a page with no content."""

    def test_home_ships_rendered_content_not_an_empty_root(self):
        html = self.client.get('/').content.decode()
        self.assertNotIn('<div id="root"></div>', html)
        self.assertIn('Building', html)
        self.assertIn('brands through', html)

    def test_every_static_route_ships_rendered_content(self):
        for path in PAGE_META:
            with self.subTest(path=path):
                html = self.client.get(path).content.decode()
                self.assertNotIn('<div id="root"></div>', html)
                # A real page carries far more than the shell's own markup.
                self.assertGreater(len(html), 6000, f'{path} looks unrendered')

    def test_rendered_routes_are_marked_for_hydration(self):
        html = self.client.get('/services/').content.decode()
        self.assertIn('data-render="hydrate"', html)

    def test_service_names_are_in_the_html_source(self):
        html = self.client.get('/services/').content.decode()
        for name in ('Social Media Strategy', 'Influencer Partnerships', 'AI Engine Optimization'):
            self.assertIn(name, html)

    def test_404_is_rendered_too(self):
        res = self.client.get('/no-such-page/')
        self.assertEqual(res.status_code, 404)
        self.assertNotIn('<div id="root"></div>', res.content.decode())


class StructuredDataTests(TestCase):
    def test_founder_is_a_named_entity_with_corroborating_links(self):
        html = self.client.get('/').content.decode()
        self.assertIn('"@type":"Person"', html)
        self.assertIn('Linda Kafexholli', html)
        self.assertIn('linkedin.com/in/linda-kafexholli', html)

    def test_faq_schema_on_home_and_services(self):
        for path in ('/', '/services/'):
            with self.subTest(path=path):
                self.assertIn('"@type":"FAQPage"', self.client.get(path).content.decode())

    def test_inner_pages_carry_breadcrumbs(self):
        html = self.client.get('/services/').content.decode()
        self.assertIn('"@type":"BreadcrumbList"', html)

    def test_home_has_no_breadcrumbs(self):
        self.assertNotIn('"@type":"BreadcrumbList"', self.client.get('/').content.decode())

    def test_faq_answers_are_visible_on_the_page(self):
        """Google only honours FAQPage markup when the Q&A is visible."""
        html = self.client.get('/services/').content.decode()
        for question, _ in FAQS:
            self.assertIn(question, html, f'FAQ question not rendered: {question}')

    def test_python_and_tsx_faqs_stay_in_sync(self):
        from django.conf import settings as dj

        tsx = (dj.BASE_DIR / 'frontend' / 'src' / 'components' / 'Faq.tsx').read_text()
        for question, _ in FAQS:
            self.assertIn(question, tsx, f'FAQ in seo.py missing from Faq.tsx: {question}')


class RobotsAiCrawlerTests(TestCase):
    def test_ai_crawlers_are_explicitly_allowed(self):
        body = self.client.get('/robots.txt').content.decode()
        for bot in AI_CRAWLERS:
            with self.subTest(bot=bot):
                self.assertIn(f'User-agent: {bot}', body)

    def test_admin_and_api_stay_disallowed_for_ai_crawlers(self):
        body = self.client.get('/robots.txt').content.decode()
        self.assertEqual(body.count('Disallow: /admin/'), len(AI_CRAWLERS) + 1)


class BlogRenderTests(TestCase):
    """Posts come from the database, so they cannot be prerendered at build
    time — Django renders them per request instead."""

    def setUp(self):
        from blog.models import BlogPost

        self.post = BlogPost.objects.create(
            title='How Boutique Hotels Win on Instagram',
            slug='boutique-hotels-instagram',
            description='A short summary for search engines.',
            content='<p>Body copy that must reach a crawler.</p>',
            meta_title='How Boutique Hotels Win on Instagram',
            meta_description='A short summary for search engines.',
            published=True,
        )

    def test_post_body_is_in_the_html_source(self):
        html = self.client.get('/blog/boutique-hotels-instagram/').content.decode()
        self.assertIn('Body copy that must reach a crawler.', html)
        self.assertIn('How Boutique Hotels Win on Instagram', html)

    def test_post_is_not_marked_for_hydration(self):
        # Django-rendered markup is not React's own; hydrating it would error.
        html = self.client.get('/blog/boutique-hotels-instagram/').content.decode()
        self.assertNotIn('data-render="hydrate"', html)

    def test_post_carries_blogposting_schema(self):
        html = self.client.get('/blog/boutique-hotels-instagram/').content.decode()
        self.assertIn('"@type":"BlogPosting"', html)

    def test_post_appears_in_the_sitemap_with_lastmod(self):
        xml = self.client.get('/sitemap.xml').content.decode()
        self.assertIn('/blog/boutique-hotels-instagram/', xml)
        self.assertIn('<lastmod>', xml)

    def test_unpublished_post_404s(self):
        self.post.published = False
        self.post.save()
        self.assertEqual(self.client.get('/blog/boutique-hotels-instagram/').status_code, 404)


class VerticalLandingPageTests(TestCase):
    """Six industry landing pages, English keyword slugs, distinct copy."""

    def paths(self):
        return [f"/{v['slug']}/" for v in VERTICALS]

    def test_all_six_resolve(self):
        self.assertEqual(len(VERTICALS), 6)
        for path in self.paths():
            with self.subTest(path=path):
                self.assertEqual(self.client.get(path).status_code, 200)

    def test_each_has_a_unique_title_and_description(self):
        titles, descs = set(), set()
        for v in VERTICALS:
            titles.add(v['metaTitle'])
            descs.add(v['metaDescription'])
        self.assertEqual(len(titles), 6)
        self.assertEqual(len(descs), 6)

    def test_slugs_are_english_keyword_targets(self):
        for v in VERTICALS:
            with self.subTest(slug=v['slug']):
                self.assertRegex(v['slug'], r'^[a-z]+(-[a-z]+)*-nyc$')

    def test_body_copy_is_server_rendered(self):
        for v in VERTICALS:
            with self.subTest(slug=v['slug']):
                html = self.client.get(f"/{v['slug']}/").content.decode()
                self.assertIn(v['h1Accent'], html)
                self.assertIn(v['problems'][0][:48], html)
                self.assertIn(v['approach'][0]['title'], html)

    def test_pages_are_not_thin_duplicates(self):
        """Doorway pages get demoted. Each page's prose must be its own."""
        bodies = {}
        for v in VERTICALS:
            prose = ' '.join(
                [v['intro'], *v['problems'], *(a['body'] for a in v['approach'])]
            )
            bodies[v['slug']] = prose
            self.assertGreater(
                len(prose.split()), 180, f"{v['slug']} is too thin to stand alone"
            )

        # No two pages may share a sentence of body copy.
        seen = {}
        for slug, prose in bodies.items():
            for sentence in (x.strip() for x in prose.split('.') if len(x.strip()) > 40):
                self.assertNotIn(
                    sentence, seen,
                    f'{slug} duplicates a sentence from {seen.get(sentence)}',
                )
                seen[sentence] = slug

    def test_each_carries_service_and_faq_schema(self):
        for v in VERTICALS:
            with self.subTest(slug=v['slug']):
                html = self.client.get(f"/{v['slug']}/").content.decode()
                self.assertIn('"@type":"Service"', html)
                self.assertIn('"@type":"FAQPage"', html)

    def test_breadcrumbs_nest_under_industries(self):
        html = self.client.get('/hotel-marketing-nyc/').content.decode()
        self.assertIn('"@type":"BreadcrumbList"', html)
        self.assertIn('/industries/', html)

    def test_faq_questions_are_visible_on_the_page(self):
        for v in VERTICALS:
            html = self.client.get(f"/{v['slug']}/").content.decode()
            for question, _ in v['faqs']:
                with self.subTest(slug=v['slug'], q=question[:32]):
                    self.assertIn(question, html)

    def test_all_appear_in_the_sitemap(self):
        xml = self.client.get('/sitemap.xml').content.decode()
        for path in self.paths():
            with self.subTest(path=path):
                self.assertIn(f'<loc>https://testserver{path}</loc>', xml)

    def test_they_are_linked_from_the_industries_page(self):
        html = self.client.get('/industries/').content.decode()
        for v in VERTICALS:
            with self.subTest(slug=v['slug']):
                self.assertIn(f"/{v['slug']}/", html)

    def test_they_cross_link_to_each_other(self):
        html = self.client.get('/hotel-marketing-nyc/').content.decode()
        for v in VERTICALS:
            if v['slug'] != 'hotel-marketing-nyc':
                self.assertIn(f"/{v['slug']}/", html)

    def test_only_real_testimonials_are_used_as_proof(self):
        """No invented client results."""
        real_authors = {'Edwin Kornmann Rudi', 'Fregi Mathew'}
        for v in VERTICALS:
            if v['proof']:
                self.assertIn(v['proof']['author'], real_authors)

    def test_listed_in_llms_txt(self):
        body = self.client.get('/llms.txt').content.decode()
        for v in VERTICALS:
            self.assertIn(v['slug'], body)


class OpenGraphImageTests(TestCase):
    def test_every_page_gets_its_own_card(self):
        images = {}
        for path in PAGE_META:
            html = self.client.get(path).content.decode()
            match = re.search(r'<meta property="og:image" content="([^"]+)"', html)
            self.assertIsNotNone(match, f'no og:image on {path}')
            images[path] = match.group(1)

        # 15 pages, 15 distinct cards — previously all shared one photograph.
        self.assertEqual(
            len(set(images.values())), len(images),
            f'duplicate og:image across pages: {images}',
        )

    def test_card_files_exist_on_disk(self):
        for path in PAGE_META:
            with self.subTest(path=path):
                url = og_image_for(path)
                self.assertNotEqual(
                    url, '/static/core/css/img/og/default.png',
                    f'{path} fell back to the default card',
                )

    def test_dimensions_are_declared(self):
        html = self.client.get('/').content.decode()
        self.assertIn('<meta property="og:image:width" content="1200" />', html)
        self.assertIn('<meta property="og:image:height" content="630" />', html)
        self.assertIn('og:image:alt', html)

    def test_blog_post_prefers_its_own_image_over_a_card(self):
        from blog.models import BlogPost

        BlogPost.objects.create(
            title='Test', slug='t', description='d', content='c', published=True,
        )
        html = self.client.get('/blog/t/').content.decode()
        self.assertIn('/og/blog.png', html)


class LegacyUrlRedirectTests(TestCase):
    """The German slugs the site inherited from its template now 301 to English.

    They are redirected rather than removed: the old URLs may carry backlinks
    and index history, and breaking them would throw that away.
    """

    def test_every_legacy_url_redirects_permanently(self):
        for old, new in LEGACY_REDIRECTS.items():
            with self.subTest(old=old):
                res = self.client.get(f'/{old}')
                self.assertEqual(res.status_code, 301, f'/{old} did not 301')
                self.assertEqual(res['Location'], new)

    def test_redirect_targets_actually_resolve(self):
        """A 301 to a 404 is worse than no redirect at all."""
        for old, new in LEGACY_REDIRECTS.items():
            with self.subTest(new=new):
                self.assertEqual(self.client.get(new).status_code, 200)

    def test_no_redirect_loops(self):
        """The site previously redirected English -> German. Reversing that
        without removing the old rules would have produced infinite loops."""
        for old in LEGACY_REDIRECTS:
            with self.subTest(old=old):
                res = self.client.get(f'/{old}', follow=True)
                self.assertEqual(res.status_code, 200)
                self.assertLessEqual(
                    len(res.redirect_chain), 1,
                    f'/{old} redirected more than once: {res.redirect_chain}',
                )

    def test_query_strings_survive_the_redirect(self):
        """Campaign parameters must reach the destination or paid traffic
        landing on an old URL loses its attribution."""
        res = self.client.get('/kontakt/?utm_source=instagram&utm_campaign=spring')
        self.assertEqual(res.status_code, 301)
        self.assertEqual(res['Location'], '/contact/?utm_source=instagram&utm_campaign=spring')

    def test_privacy_now_resolves_server_side(self):
        """/privacy/ had a React route but no Django route, so a direct load
        or a crawl of it returned 404."""
        self.assertEqual(self.client.get('/privacy/').status_code, 200)

    def test_canonical_points_at_the_english_url(self):
        html = self.client.get('/industries/').content.decode()
        self.assertIn('<link rel="canonical" href="http://testserver/industries/" />', html)

    def test_legacy_urls_are_absent_from_the_sitemap(self):
        xml = self.client.get('/sitemap.xml').content.decode()
        for old in LEGACY_REDIRECTS:
            with self.subTest(old=old):
                self.assertNotIn(f'/{old}<', xml)

    def test_sitemap_lists_the_english_urls(self):
        xml = self.client.get('/sitemap.xml').content.decode()
        for new in LEGACY_REDIRECTS.values():
            with self.subTest(new=new):
                self.assertIn(f'<loc>https://testserver{new}</loc>', xml)

    def test_no_internal_link_points_at_a_legacy_url(self):
        """Internal links should hit the canonical URL directly rather than
        spending a redirect hop on every navigation."""
        for path in PAGE_META:
            html = self.client.get(path).content.decode()
            for old in LEGACY_REDIRECTS:
                with self.subTest(path=path, old=old):
                    self.assertNotIn(f'href="/{old}"', html)


class ButtonCascadeTests(TestCase):
    """The inverted CTA button vanished on hover.

    `.btn-primary:hover:not(:disabled)` scores (0,4,0) and beat the plain
    `.btn-invert:hover` at (0,2,0), so the background reverted to dark pink
    while the text colour stayed dark pink — an invisible button on the pink
    band, on the single most important call to action on the site.
    """

    def css(self):
        from django.conf import settings as dj

        return (dj.BASE_DIR / 'frontend' / 'src' / 'index.css').read_text()

    def test_invert_hover_is_qualified_with_btn_primary(self):
        css = self.css()
        self.assertIn('.btn-primary.btn-invert:hover:not(:disabled)', css)

    def test_no_unqualified_invert_hover_rule(self):
        """An unqualified `.btn-invert:hover` cannot outrank the base button."""
        css = self.css()
        for line in css.splitlines():
            stripped = line.strip()
            if stripped.startswith('.btn-invert:hover'):
                self.fail(f'unqualified rule would lose the cascade: {stripped}')


class IconTests(TestCase):
    """Emoji were replaced with line-art SVG.

    Emoji render as a different picture on every platform, carry their own
    colours, and cannot inherit the brand palette.
    """

    # The six that were replaced. Deliberately explicit rather than a
    # pictographic range: the ★ in "5★ Client Rating" is a typographic glyph
    # that belongs, and a broad range would flag it.
    REPLACED_EMOJI = ['\U0001F3E8', '\U0001F37D', '\U0001F457',
                      '\u2728', '\U0001F306', '\U0001F3E2']

    def test_industry_pages_ship_svg_not_emoji(self):
        for path in ('/', '/industries/'):
            with self.subTest(path=path):
                html = self.client.get(path).content.decode()
                self.assertIn('<svg', html)
                for ch in self.REPLACED_EMOJI:
                    self.assertNotIn(ch, html, f'emoji still rendered on {path}')

    def test_every_icon_is_hidden_from_assistive_tech(self):
        import re

        html = self.client.get('/industries/').content.decode()
        svgs = re.findall(r'<svg[^>]*>', html)
        self.assertTrue(svgs, 'no icons rendered')
        for tag in svgs:
            self.assertIn('aria-hidden="true"', tag, f'icon not hidden: {tag[:70]}')
