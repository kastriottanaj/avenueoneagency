# blog/sitemaps.py
from django.contrib.sitemaps import Sitemap
from .models import BlogPost


class BlogPostSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.6
    protocol = 'https'

    def items(self):
        return BlogPost.objects.filter(published=True).order_by('-created_at')

    def lastmod(self, obj):
        return obj.created_at
