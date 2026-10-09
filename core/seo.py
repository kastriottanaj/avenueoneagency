"""Per-route metadata for the React shell.

The frontend is a client-rendered SPA served from a single index.html, so every
route used to ship the identical <head>: one shared title, no description, no
canonical, no Open Graph tags and no structured data. Crawlers and link
unfurlers read the HTML response, not the rendered DOM, so the entire site was
indistinguishable to them.

This module renders the correct <head> for each URL server-side, before React
boots. It is deliberately plain data rather than a CMS: these pages hardcode
their copy in .tsx files today, and the metadata should live next to something
until that changes.
"""

import json
import os
from html import escape

from django.conf import settings

SITE_NAME = 'Avenue One Agency'

# The site was built on a German template and inherited its URL scheme. The
# slugs were German while every word of content was English and the targeting
# was New York — /industries/ matches no query a US client will ever type.
#
# These are permanent (301) redirects, not deletions: the old URLs may hold
# backlinks and index history, so they keep working forever.
LEGACY_REDIRECTS = {
    'ueber-uns/': '/about/',
    'branchen/': '/industries/',
    'kontakt/': '/contact/',
    'datenschutz/': '/privacy/',
    'impressum/': '/imprint/',
}

# The vertical landing pages. This is the same file VerticalPage.tsx renders
# from, so the copy on the page and the metadata describing it cannot drift.
_VERTICALS_PATH = os.path.join(
    settings.BASE_DIR, 'frontend', 'src', 'data', 'verticals.json'
)
_COMMERCIAL_PAGES_PATH = os.path.join(
    settings.BASE_DIR, 'frontend', 'src', 'data', 'commercialPages.json'
)
_CASE_STUDIES_PATH = os.path.join(
    settings.BASE_DIR, 'frontend', 'src', 'data', 'caseStudies.json'
)

with open(_VERTICALS_PATH, encoding='utf-8') as _f:
    VERTICALS = json.load(_f)['verticals']

VERTICAL_BY_SLUG = {v['slug']: v for v in VERTICALS}

with open(_COMMERCIAL_PAGES_PATH, encoding='utf-8') as _f:
    COMMERCIAL_PAGES = json.load(_f)['pages']

COMMERCIAL_PAGE_BY_SLUG = {page['slug']: page for page in COMMERCIAL_PAGES}

with open(_CASE_STUDIES_PATH, encoding='utf-8') as _f:
    CASE_STUDIES = json.load(_f)['caseStudies']

CASE_STUDY_BY_SLUG = {study['slug']: study for study in CASE_STUDIES}
OG_DIR = '/static/core/css/img/og'
OG_W, OG_H = 1200, 630
DEFAULT_IMAGE = f'{OG_DIR}/default.png'


def og_image_for(path):
    """The Open Graph card for a URL.

    Every page previously shared one stock photograph, so every link shared to
    Instagram, LinkedIn, WhatsApp or Slack looked identical. These are rendered
    by `manage.py generate_og_images` from the same titles the pages use.
    """
    slug = path.strip('/')
    name = slug.replace('/', '__') if slug else 'index'
    candidate = os.path.join(
        settings.BASE_DIR, 'core', 'static', 'core', 'css', 'img', 'og', f'{name}.png'
    )
    if os.path.exists(candidate):
        return f'{OG_DIR}/{name}.png'
    return DEFAULT_IMAGE
LOCALE = 'en_US'

# path -> metadata. Keys must match the URLconf exactly, trailing slash included.
PAGE_META = {
    '/': {
        'title': 'NYC Social Media Agency for Hospitality | Avenue One',
        'description': (
            'Creator-led NYC social media agency for hotels, restaurants and lifestyle '
            'brands. Strategy, content and influencer partnerships built to drive growth.'
        ),
    },
    '/about/': {
        'title': 'About Avenue One — NYC-Born, Creator-Led Agency',
        'description': (
            'Meet Avenue One founder Linda Kafexholli, a global creator and marketing '
            'strategist building hospitality and lifestyle brands across the U.S. and Europe.'
        ),
    },
    '/linda-kafexholli/': {
        'title': 'Linda Kafexholli — Founder of Avenue One Agency',
        'description': (
            'Meet Linda Kafexholli, Avenue One founder and Chief Creative Officer: '
            'a New York creator and strategist with a 1.1M+ public Instagram audience.'
        ),
    },
    '/services/': {
        'title': 'Social Media & Creator Marketing Services NYC | Avenue One',
        'description': (
            'Social media strategy, content, influencer marketing, brand direction and '
            'paid media for hospitality and lifestyle brands in New York City.'
        ),
    },
    '/industries/': {
        'title': 'Industries — Hospitality, F&B, Fashion, Beauty & Real Estate',
        'description': (
            'Specialist marketing for boutique hotels, restaurants, fashion and '
            'luxury, beauty and wellness, lifestyle brands and real estate '
            'developers in NYC and Europe.'
        ),
    },
    '/testimonials/': {
        'title': 'Client Results & Testimonials — Avenue One Agency',
        'description': (
            'Real results from real brands, including a 25% booking-rate increase '
            'for Faralda Crane Hotel and engagement growth for Chatti New York.'
        ),
    },
    '/case-studies/': {
        'title': 'Hospitality Marketing Client Results | Avenue One',
        'description': (
            'Verified client-reported outcomes from Avenue One hospitality and '
            'restaurant marketing work, presented without invented attribution.'
        ),
    },
    '/blog/': {
        'title': 'Blog — Social Media, Creator Economy & Brand Strategy',
        'description': (
            'Insights on social media marketing, the creator economy, brand '
            'strategy and hospitality and lifestyle marketing from Avenue One Agency.'
        ),
    },
    '/contact/': {
        'title': 'Contact Avenue One Agency — NYC Creative Agency',
        'description': (
            'Tell us about your brand and what you want to achieve. We reply within '
            '24 hours. Based in New York City, working with brands across the U.S. '
            'and Europe.'
        ),
    },
    '/imprint/': {
        'title': 'Imprint — Avenue One Agency',
        'description': 'Legal and company information for Avenue One Agency, New York City.',
        'robots': 'noindex, follow',
    },
    '/privacy/': {
        'title': 'Privacy Policy — Avenue One Agency',
        'description': (
            'How Avenue One Agency collects, uses and protects your personal data, '
            'including analytics and advertising cookies.'
        ),
        'robots': 'noindex, follow',
    },
}

for _v in VERTICALS:
    PAGE_META[f"/{_v['slug']}/"] = {
        'title': _v['metaTitle'],
        'description': _v['metaDescription'],
    }

for _page in COMMERCIAL_PAGES:
    PAGE_META[f"/{_page['slug']}/"] = {
        'title': _page['metaTitle'],
        'description': _page['metaDescription'],
    }

for _study in CASE_STUDIES:
    PAGE_META[f"/case-studies/{_study['slug']}/"] = {
        'title': _study['metaTitle'],
        'description': _study['metaDescription'],
        'og_type': 'article',
        'published_time': _study['publishedAt'],
        'modified_time': _study['updatedAt'],
        'author_name': SITE_NAME,
    }


FALLBACK_META = {
    'title': f'{SITE_NAME} — NYC Social Media & Creator Marketing',
    'description': PAGE_META['/']['description'],
}

NOT_FOUND_META = {
    'title': f'Page not found — {SITE_NAME}',
    'description': 'The page you requested does not exist or has moved.',
    'robots': 'noindex, follow',
}


def _organization(base_url):
    return {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': f'{base_url}/#organization',
        'name': SITE_NAME,
        'alternateName': 'Avenue One',
        'url': f'{base_url}/',
        'image': f'{base_url}{DEFAULT_IMAGE}',
        'logo': f'{base_url}/static/core/brand/icon-512.png',
        'description': PAGE_META['/']['description'],
        'foundingDate': '2020',
        'founder': {'@id': f'{base_url}/linda-kafexholli/#person'},
        'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'New York',
            'addressRegion': 'NY',
            'addressCountry': 'US',
        },
        'areaServed': [
            {'@type': 'Place', 'name': 'United States'},
            {'@type': 'Place', 'name': 'Europe'},
        ],
        'sameAs': [
            'https://www.instagram.com/avenueone.agency/',
            'https://www.linkedin.com/company/avenue-one-agency',
        ],
        'knowsAbout': [
            'Social media strategy',
            'Content creation',
            'Influencer marketing',
            'Brand identity',
            'Paid media',
            'AI Engine Optimization',
            'Hospitality marketing',
            'Restaurant marketing',
            'Hotel marketing',
            'Hospitality content creation',
        ],
    }


def _founder(base_url):
    """Linda Kafexholli as a named entity.

    Search engines and AI answer engines both resolve people and organisations
    as entities, and cite the ones they can corroborate. The credentials below
    are publicly verifiable and were previously nowhere in the markup.
    """
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': f'{base_url}/linda-kafexholli/#person',
        'name': 'Linda Kafexholli',
        'jobTitle': 'Founder & Chief Creative Officer',
        'worksFor': {'@id': f'{base_url}/#organization'},
        'url': f'{base_url}/linda-kafexholli/',
        'description': (
            'Global digital creator, marketing strategist and founder of Avenue One '
            'Agency. Builds brand and creator-led marketing programmes for hospitality, '
            'fashion, beauty and lifestyle brands across the U.S. and Europe.'
        ),
        'knowsAbout': [
            'Social media strategy',
            'Creator and influencer marketing',
            'Brand identity',
            'Hospitality marketing',
        ],
        'sameAs': [
            'https://www.instagram.com/avenueone.agency/',
            'https://www.instagram.com/linda_kafexholli/',
            'https://www.linkedin.com/in/linda-kafexholli-a50438153',
        ],
    }


def _website(base_url):
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': f'{base_url}/#website',
        'url': f'{base_url}/',
        'name': SITE_NAME,
        'publisher': {'@id': f'{base_url}/#organization'},
    }


SERVICE_NAMES = [
    'Social Media Strategy',
    'Content Creation',
    'Influencer Partnerships',
    'Brand Identity & Creative Direction',
    'Campaign Production & Storytelling',
    'Hospitality & Lifestyle Marketing',
    'Advertising & Paid Media',
    'AEO — AI Engine Optimization',
]


def _services_catalog(base_url):
    return {
        '@context': 'https://schema.org',
        '@type': 'OfferCatalog',
        'name': 'Avenue One Agency Services',
        'url': f'{base_url}/services/',
        'itemListElement': [
            {
                '@type': 'Offer',
                'itemOffered': {
                    '@type': 'Service',
                    'name': name,
                    'provider': {'@id': f'{base_url}/#organization'},
                },
            }
            for name in SERVICE_NAMES
        ],
    }


FAQS = [
    (
        'What does Avenue One Agency do?',
        'Avenue One Agency is a New York City social media and marketing agency. It '
        'provides social media strategy, content creation, influencer and creator '
        'partnerships, brand identity and creative direction, campaign production, '
        'paid media, and AI Engine Optimization for hospitality, fashion, beauty, '
        'lifestyle and food and beverage brands.',
    ),
    (
        'Which industries does Avenue One Agency specialise in?',
        'Hotels and hospitality, restaurants and food and beverage, fashion and '
        'luxury, beauty and wellness, lifestyle and culture, and real estate and '
        'development.',
    ),
    (
        'Where is Avenue One Agency based?',
        'Avenue One Agency is based in New York City and works with brands across the '
        'United States and Europe.',
    ),
    (
        'Who founded Avenue One Agency?',
        'Avenue One Agency was founded in 2020 by Linda Kafexholli, a global digital '
        'creator and marketing strategist with an audience of over one million.',
    ),
    (
        'What is AEO, or AI Engine Optimization?',
        'AI Engine Optimization is the practice of making a brand discoverable and '
        'citable inside AI answer engines such as ChatGPT, Perplexity, Claude and '
        "Google's AI Overviews, rather than only in traditional search rankings. It "
        'combines server-rendered content, structured data, and clearly answered '
        'questions so that answer engines can retrieve and quote a brand accurately.',
    ),
    (
        'How quickly does Avenue One Agency respond to enquiries?',
        'Avenue One Agency replies to enquiries submitted through its contact form '
        'within 24 hours.',
    ),
]


def _faq(base_url):
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': f'{base_url}/#faq',
        'mainEntity': [
            {
                '@type': 'Question',
                'name': q,
                'acceptedAnswer': {'@type': 'Answer', 'text': a},
            }
            for q, a in FAQS
        ],
    }


def _breadcrumbs(path, base_url):
    """BreadcrumbList for any page below the root."""
    label = {
        '/about/': 'About',
        '/linda-kafexholli/': 'Linda Kafexholli',
        '/services/': 'Services',
        '/industries/': 'Industries',
        '/testimonials/': 'Testimonials',
        '/case-studies/': 'Client Results',
        '/blog/': 'Blog',
        '/contact/': 'Contact',
        '/imprint/': 'Imprint',
        '/privacy/': 'Privacy Policy',
    }.get(path)

    vertical = VERTICAL_BY_SLUG.get(path.strip('/'))
    if vertical:
        # Verticals sit a level below Industries, which is how they are linked.
        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
                {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': f'{base_url}/'},
                {'@type': 'ListItem', 'position': 2, 'name': 'Industries',
                 'item': f'{base_url}/industries/'},
                {'@type': 'ListItem', 'position': 3, 'name': vertical['eyebrow'],
                 'item': f'{base_url}{path}'},
            ],
        }

    commercial_page = COMMERCIAL_PAGE_BY_SLUG.get(path.strip('/'))
    if commercial_page:
        parent = commercial_page['breadcrumbParent']
        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
                {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': f'{base_url}/'},
                {'@type': 'ListItem', 'position': 2, 'name': parent['label'],
                 'item': f"{base_url}{parent['path']}"},
                {'@type': 'ListItem', 'position': 3, 'name': commercial_page['eyebrow'],
                 'item': f'{base_url}{path}'},
            ],
        }

    case_slug = path.removeprefix('/case-studies/').strip('/')
    case_study = CASE_STUDY_BY_SLUG.get(case_slug)
    if case_study:
        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
                {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': f'{base_url}/'},
                {'@type': 'ListItem', 'position': 2, 'name': 'Client Results',
                 'item': f'{base_url}/case-studies/'},
                {'@type': 'ListItem', 'position': 3, 'name': case_study['client'],
                 'item': f'{base_url}{path}'},
            ],
        }

    if not label:
        return None
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': f'{base_url}/'},
            {'@type': 'ListItem', 'position': 2, 'name': label, 'item': f'{base_url}{path}'},
        ],
    }


def _vertical_service(vertical, base_url):
    """Service schema for one vertical, with its FAQ attached.

    The FAQ questions here are the ones actually rendered on the page, which is
    what makes the markup eligible — and what answer engines quote.
    """
    url = f"{base_url}/{vertical['slug']}/"
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': f'{url}#service',
        'name': vertical['metaTitle'].split('—')[0].strip(),
        'serviceType': vertical['eyebrow'],
        'description': vertical['metaDescription'],
        'url': url,
        'provider': {'@id': f'{base_url}/#organization'},
        'areaServed': [
            {'@type': 'City', 'name': 'New York City'},
            {'@type': 'Place', 'name': 'United States'},
            {'@type': 'Place', 'name': 'Europe'},
        ],
    }


def _vertical_faq(vertical, base_url):
    url = f"{base_url}/{vertical['slug']}/"
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': f'{url}#faq',
        'mainEntity': [
            {
                '@type': 'Question',
                'name': q,
                'acceptedAnswer': {'@type': 'Answer', 'text': a},
            }
            for q, a in vertical['faqs']
        ],
    }


def _commercial_service(page, base_url):
    url = f"{base_url}/{page['slug']}/"
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': f'{url}#service',
        'name': page['metaTitle'].split('|')[0].strip(),
        'serviceType': page['serviceType'],
        'description': page['metaDescription'],
        'url': url,
        'provider': {'@id': f'{base_url}/#organization'},
        'areaServed': [
            {'@type': 'City', 'name': 'New York City'},
            {'@type': 'Place', 'name': 'United States'},
        ],
    }


def _commercial_faq(page, base_url):
    url = f"{base_url}/{page['slug']}/"
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': f'{url}#faq',
        'mainEntity': [
            {
                '@type': 'Question',
                'name': question,
                'acceptedAnswer': {'@type': 'Answer', 'text': answer},
            }
            for question, answer in page['faqs']
        ],
    }


def _case_studies_collection(base_url):
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': f'{base_url}/case-studies/#collection',
        'name': 'Avenue One Agency Client Results',
        'url': f'{base_url}/case-studies/',
        'publisher': {'@id': f'{base_url}/#organization'},
        'mainEntity': {
            '@type': 'ItemList',
            'itemListElement': [
                {
                    '@type': 'ListItem',
                    'position': position,
                    'name': study['client'],
                    'url': f"{base_url}/case-studies/{study['slug']}/",
                }
                for position, study in enumerate(CASE_STUDIES, start=1)
            ],
        },
    }


def _case_study_article(study, base_url):
    url = f"{base_url}/case-studies/{study['slug']}/"
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': f'{url}#article',
        'headline': f"{study['client']}: {study['headline']}",
        'description': study['metaDescription'],
        'datePublished': study['publishedAt'],
        'dateModified': study['updatedAt'],
        'url': url,
        'mainEntityOfPage': url,
        'about': {
            '@type': 'Organization',
            'name': study['client'],
            'location': study['location'],
        },
        'author': {'@id': f'{base_url}/#organization'},
        'publisher': {'@id': f'{base_url}/#organization'},
    }


def _json_ld_for(path, base_url, post=None):
    blocks = [_organization(base_url), _website(base_url), _founder(base_url)]

    crumbs = _breadcrumbs(path, base_url)
    if crumbs:
        blocks.append(crumbs)

    # The FAQ answers the questions people actually ask an answer engine about
    # this business, on the two pages where they are on-topic.
    if path == '/services/':
        blocks.append(_faq(base_url))

    vertical = VERTICAL_BY_SLUG.get(path.strip('/'))
    if vertical:
        blocks.append(_vertical_service(vertical, base_url))
        blocks.append(_vertical_faq(vertical, base_url))

    commercial_page = COMMERCIAL_PAGE_BY_SLUG.get(path.strip('/'))
    if commercial_page:
        blocks.append(_commercial_service(commercial_page, base_url))
        blocks.append(_commercial_faq(commercial_page, base_url))

    if path == '/services/':
        blocks.append(_services_catalog(base_url))

    if path == '/linda-kafexholli/':
        blocks.append({
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            '@id': f'{base_url}/linda-kafexholli/#profile',
            'url': f'{base_url}/linda-kafexholli/',
            'name': 'Linda Kafexholli — Founder of Avenue One Agency',
            'mainEntity': {'@id': f'{base_url}/linda-kafexholli/#person'},
            'isPartOf': {'@id': f'{base_url}/#website'},
        })

    if path == '/case-studies/':
        blocks.append(_case_studies_collection(base_url))

    case_slug = path.removeprefix('/case-studies/').strip('/')
    case_study = CASE_STUDY_BY_SLUG.get(case_slug)
    if case_study:
        blocks.append(_case_study_article(case_study, base_url))

    if post is not None:
        post_image = (
            post.featured_image.url
            if post.featured_image
            else og_image_for('/blog/')
        )
        if post_image.startswith('/'):
            post_image = f'{base_url}{post_image}'
        blocks.append({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': post.title,
            'description': post.meta_description or post.description,
            'datePublished': post.created_at.isoformat(),
            'dateModified': post.updated_at.isoformat(),
            'image': post_image,
            'url': f'{base_url}/blog/{post.slug}/',
            'mainEntityOfPage': f'{base_url}/blog/{post.slug}/',
            'author': (
                {'@id': f'{base_url}/linda-kafexholli/#person'}
                if post.display_author == 'Linda Kafexholli'
                else {'@type': 'Person', 'name': post.display_author}
            ),
            'publisher': {'@id': f'{base_url}/#organization'},
            'articleSection': post.category.name if post.category else 'Marketing',
        })

    return blocks


def meta_for_path(path, post=None):
    """Resolve the metadata dict for a request path."""
    if post is not None:
        return {
            'title': (post.meta_title or post.title)[:70],
            'description': (post.meta_description or post.description)[:160],
            'og_type': 'article',
            # A post's own featured image beats a generated card.
            'image': (
                post.featured_image.url
                if post.featured_image
                else og_image_for('/blog/')
            ),
            'published_time': post.created_at.isoformat(),
            'modified_time': post.updated_at.isoformat(),
            'author_name': post.display_author,
        }

    meta = dict(PAGE_META.get(path, FALLBACK_META))
    meta.setdefault('image', og_image_for(path))
    return meta


def render_head(path, base_url, meta):
    """Build the <head> fragment for a page as an HTML string."""
    title = escape(meta['title'])
    description = escape(meta['description'])
    robots = meta.get('robots', 'index, follow')
    og_type = meta.get('og_type', 'website')
    image = meta.get('image', DEFAULT_IMAGE)
    if image.startswith('/'):
        image = f'{base_url}{image}'
    canonical = f'{base_url}{path}'

    tags = [
        f'<title>{title}</title>',
        f'<meta name="description" content="{description}" />',
        f'<meta name="robots" content="{robots}" />',
        f'<link rel="canonical" href="{escape(canonical)}" />',

        f'<meta property="og:site_name" content="{escape(SITE_NAME)}" />',
        f'<meta property="og:type" content="{og_type}" />',
        f'<meta property="og:title" content="{title}" />',
        f'<meta property="og:description" content="{description}" />',
        f'<meta property="og:url" content="{escape(canonical)}" />',
        f'<meta property="og:image" content="{escape(image)}" />',
        f'<meta property="og:image:width" content="{OG_W}" />',
        f'<meta property="og:image:height" content="{OG_H}" />',
        f'<meta property="og:image:alt" content="{title}" />',
        f'<meta property="og:locale" content="{LOCALE}" />',

        '<meta name="twitter:card" content="summary_large_image" />',
        f'<meta name="twitter:title" content="{title}" />',
        f'<meta name="twitter:description" content="{description}" />',
        f'<meta name="twitter:image" content="{escape(image)}" />',

        '<meta name="geo.region" content="US-NY" />',
        '<meta name="geo.placename" content="New York City" />',
    ]

    if path == '/linda-kafexholli/':
        tags.append(
            f'<link rel="alternate" type="application/json" '
            f'title="Linda Kafexholli public evidence" '
            f'href="{base_url}/data/linda-kafexholli.json" />'
        )

    if og_type == 'article':
        if meta.get('published_time'):
            tags.append(
                f'<meta property="article:published_time" '
                f'content="{escape(meta["published_time"])}" />'
            )
        if meta.get('modified_time'):
            tags.append(
                f'<meta property="article:modified_time" '
                f'content="{escape(meta["modified_time"])}" />'
            )
        if meta.get('author_name'):
            tags.append(
                f'<meta property="article:author" content="{escape(meta["author_name"])}" />'
            )

    return '\n    '.join(tags)


def render_json_ld(path, base_url, post=None):
    blocks = _json_ld_for(path, base_url, post)
    return '\n    '.join(
        '<script type="application/ld+json">'
        + json.dumps(block, ensure_ascii=False, separators=(',', ':'))
        + '</script>'
        for block in blocks
    )
