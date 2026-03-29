from django.urls import path
from .api_views import BlogPostListView, BlogPostDetailView, CategoryListView

urlpatterns = [
    path('', BlogPostListView.as_view(), name='api_blog_list'),
    path('categories/', CategoryListView.as_view(), name='api_categories'),
    path('<slug:slug>/', BlogPostDetailView.as_view(), name='api_blog_detail'),
]
