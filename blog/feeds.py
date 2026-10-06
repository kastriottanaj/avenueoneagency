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
        return item.meta_description or item.description or item.content[:200]

    def item_pubdate(self, item):
        return item.created_at

    def item_link(self, item):
        # Must be a path, not a full URL — Django's syndication framework makes
        # it absolute against the current request. Returning a bare relative
        # string here produced invalid, unresolvable links in the feed.
        return item.get_absolute_url()
