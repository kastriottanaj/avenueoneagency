from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from .models import BlogPost, Category
from .serializers import BlogPostListSerializer, BlogPostDetailSerializer, CategorySerializer


class BlogPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 20


class BlogPostListView(APIView):
    def get(self, request):
        posts = BlogPost.objects.filter(published=True).order_by('-created_at')

        category = request.GET.get('category')
        tag = request.GET.get('tag')
        q = request.GET.get('q')

        if category:
            posts = posts.filter(category__slug=category)
        if tag:
            posts = posts.filter(tags__slug=tag)
        if q:
            posts = posts.filter(
                Q(title__icontains=q) |
                Q(content__icontains=q) |
                Q(meta_description__icontains=q)
            )

        paginator = BlogPagination()
        page = paginator.paginate_queryset(posts, request)
        serializer = BlogPostListSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class BlogPostDetailView(APIView):
    def get(self, request, slug):
        try:
            post = BlogPost.objects.get(slug=slug, published=True)
        except BlogPost.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        serializer = BlogPostDetailSerializer(post, context={'request': request})

        related = BlogPost.objects.filter(
            published=True, category=post.category
        ).exclude(id=post.id).order_by('-created_at')[:3]

        if related.count() < 3:
            related = BlogPost.objects.filter(
                published=True
            ).exclude(id=post.id).order_by('-created_at')[:3]

        related_serializer = BlogPostListSerializer(related, many=True, context={'request': request})
        data = serializer.data
        data['related_posts'] = related_serializer.data
        return Response(data)


class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
