from django.contrib import admin
from .models import BlogPost, Category

# Register your models here.
@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "display_author", "updated_at", "published")
    search_fields = ("title",)
    list_filter = ("published", "category", "created_at")
    ordering = ("-created_at",)
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    fields = (
        "title", "slug", "meta_title", "meta_description", "description",
        "content", "category", "featured_image", "author", "byline",
        "published", "tags", "created_at", "updated_at",
    )



@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
