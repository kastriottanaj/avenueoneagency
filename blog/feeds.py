# blog/feeds.py
from django.contrib.syndication.views import Feed
from .models import BlogPost


class LatestPostsFeed(Feed):
    title = "Avenue One Agency – Blog Feed"
    link = "/blog/"
    description = "Latest posts on social media marketing, influencer partnerships and brand development."

    def items(self):
        return BlogPost.objects.filter(published=True).order_by('-created_at')[:10]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.meta_description or item.content[:200]

    def item_link(self, item):
        return f'/blog/{item.slug}/'
