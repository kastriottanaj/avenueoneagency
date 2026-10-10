from django.contrib.sitemaps import Sitemap
from django.urls import reverse

from .seo import CASE_STUDIES, COMMERCIAL_PAGES, VERTICALS


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
        'founder': 0.8,
        'testimonials': 0.7,
        'case_studies': 0.8,
        'blog': 0.7,
    }

    CHANGEFREQ = {
        'home': 'weekly',
        'blog': 'weekly',
        'services': 'monthly',
        'industries': 'monthly',
        'about': 'monthly',
        'founder': 'monthly',
        'testimonials': 'monthly',
        'case_studies': 'monthly',
        'contact': 'yearly',
    }

    # The vertical landing pages are the primary commercial search targets,
    # so they rank above the generic pages but below the home page.
    VERTICAL_NAMES = [
        f"vertical_{v['slug'].replace('-', '_')}" for v in VERTICALS
    ]
    COMMERCIAL_NAMES = [
        f"commercial_{page['slug'].replace('-', '_')}" for page in COMMERCIAL_PAGES
    ]
    CASE_STUDY_NAMES = [
        f"case_study_{study['slug'].replace('-', '_')}" for study in CASE_STUDIES
    ]

    def items(self):
        return (
            list(self.PRIORITIES.keys())
            + self.VERTICAL_NAMES
            + self.COMMERCIAL_NAMES
            + self.CASE_STUDY_NAMES
        )

    def _is_vertical(self, item):
        return (
            item in self.VERTICAL_NAMES
            or item in self.COMMERCIAL_NAMES
            or item in self.CASE_STUDY_NAMES
        )

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
