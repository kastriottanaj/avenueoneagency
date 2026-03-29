from django.urls import path
from .api_views import ContactView, NewsletterView

urlpatterns = [
    path('contact/', ContactView.as_view(), name='api_contact'),
    path('newsletter/', NewsletterView.as_view(), name='api_newsletter'),
]
