from rest_framework import serializers
from .models import BlogPost, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class BlogPostListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    tags = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    featured_image_url = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'category', 'description',
            'featured_image_url', 'image_width', 'image_height',
            'created_at', 'meta_title', 'meta_description', 'author_name', 'tags',
        ]

    def get_tags(self, obj):
        return [{'name': tag.name, 'slug': tag.slug} for tag in obj.tags.all()]

    def get_author_name(self, obj):
        if obj.author:
            return obj.author.get_full_name() or obj.author.username
        return None

    def get_featured_image_url(self, obj):
        request = self.context.get('request')
        if obj.featured_image and request:
            return request.build_absolute_uri(obj.featured_image.url)
        if obj.featured_image:
            return obj.featured_image.url
        return None


class BlogPostDetailSerializer(BlogPostListSerializer):
    class Meta(BlogPostListSerializer.Meta):
        fields = BlogPostListSerializer.Meta.fields + ['content']
