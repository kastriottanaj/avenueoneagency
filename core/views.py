# core/views.py
import os
from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from django.http import HttpResponse
from .forms import ContactForm
from .models import ContactMessage


def react_app(request, **kwargs):
    """Serves the React frontend for all non-API routes."""
    dist_path = os.path.join(settings.BASE_DIR, 'frontend', 'dist', 'index.html')
    try:
        with open(dist_path, 'rb') as f:
            return HttpResponse(f.read(), content_type='text/html')
    except FileNotFoundError:
        return HttpResponse(
            '<h1>Frontend not built</h1>'
            '<p>Run: <code>cd frontend && npm install && npm run build</code></p>',
            status=503,
            content_type='text/html',
        )


def robots_txt(request):
    lines = [
        "User-agent: *",
        "Disallow:",
        "Sitemap: https://avenueoneagency.com/sitemap.xml",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")


def kontakt(request):
    success = False

    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            ContactMessage.objects.create(
                name=form.cleaned_data['name'],
                email=form.cleaned_data['email'],
                message=form.cleaned_data['message'],
            )
            send_mail(
                subject=f"New contact request from {form.cleaned_data['name']}",
                message=form.cleaned_data['message'],
                from_email=form.cleaned_data['email'],
                recipient_list=[settings.CONTACT_RECEIVER_EMAIL],
                fail_silently=False,
            )
            success = True
            form = ContactForm()
    else:
        form = ContactForm()

    return render(request, 'kontakt.html', {'form': form, 'success': success})
