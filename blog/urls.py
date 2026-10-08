from django.urls import path
from .feeds import LatestPostsFeed
from core.views import blog_detail_app, blog_index_app

urlpatterns = [
    path('rss/', LatestPostsFeed(), name='blog_rss'),
    path('', blog_index_app, name='blog'),
    # Resolves the post server-side so an unknown slug returns a real 404.
    path('<slug:slug>/', blog_detail_app, name='blog_detail'),
]
