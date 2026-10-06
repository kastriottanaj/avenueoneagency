from django.contrib.sitemaps import Sitemap
from django.urls import reverse

from .seo import COMMERCIAL_PAGES, VERTICALS


class StaticViewSitemap(Sitemap):
    """Static pages.

    Priorities were previously a uniform 0.5 across every page, which tells a
    crawler nothing — the home page and the imprint were declared equally
    important. These are relative weights within the site only.
    """

    protocol = 'https'

    PRIORITIES = {
        'home': 1.0,
        'services': 0.9,
        'contact': 0.9,
        'industries': 0.8,
        'about': 0.8,
        'testimonials': 0.7,
        'blog': 0.7,
        'imprint': 0.2,
        'privacy': 0.2,
    }

    CHANGEFREQ = {
        'home': 'weekly',
        'blog': 'weekly',
        'services': 'monthly',
        'industries': 'monthly',
        'about': 'monthly',
        'testimonials': 'monthly',
        'contact': 'yearly',
        'imprint': 'yearly',
        'privacy': 'yearly',
    }

    # The vertical landing pages are the primary commercial search targets,
    # so they rank above the generic pages but below the home page.
    VERTICAL_NAMES = [
        f"vertical_{v['slug'].replace('-', '_')}" for v in VERTICALS
    ]
    COMMERCIAL_NAMES = [
        f"commercial_{page['slug'].replace('-', '_')}" for page in COMMERCIAL_PAGES
    ]

    def items(self):
        return list(self.PRIORITIES.keys()) + self.VERTICAL_NAMES + self.COMMERCIAL_NAMES

    def _is_vertical(self, item):
        return item in self.VERTICAL_NAMES or item in self.COMMERCIAL_NAMES

    def location(self, item):
        return reverse(item)

    def priority(self, item):
        if self._is_vertical(item):
            return 0.9
        return self.PRIORITIES.get(item, 0.5)

    def changefreq(self, item):
        if self._is_vertical(item):
            return 'monthly'
        return self.CHANGEFREQ.get(item, 'monthly')
