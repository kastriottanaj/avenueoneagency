from django.contrib import admin
from .models import ContactMessage, NewsletterSubscriber

# Register your models here.
admin.site.site_header = "Avenue One Agency"
admin.site.site_title = "Avenue One Agency Admin"
admin.site.index_title = "Welcome to Avenue One Agency Panel"

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display=("name", "email", "created_at")
    search_fields = ("name", "email", "message")
    list_filter = ("created_at",)
    ordering = ("-created_at",)

admin.site.register(NewsletterSubscriber)