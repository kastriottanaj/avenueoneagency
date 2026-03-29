from django.urls import path, re_path
from .feeds import LatestPostsFeed
from core.views import react_app

urlpatterns = [
    path('rss/', LatestPostsFeed(), name='blog_rss'),
    path('', react_app, name='blog'),
    path('<slug:slug>/', react_app, name='blog_detail'),
    re_path(r'^.*$', react_app),
]
