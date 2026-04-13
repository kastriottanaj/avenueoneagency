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
        "Allow: /",
        "Allow: /ueber-uns/",
        "Allow: /services/",
        "Allow: /branchen/",
        "Allow: /testimonials/",
        "Allow: /blog/",
        "Allow: /kontakt/",
        "Allow: /impressum/",
        "Allow: /datenschutz/",
        "",
        "Disallow: /admin/",
        "Disallow: /api/",
        "",
        "Sitemap: https://avenueoneagency.com/sitemap.xml",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")


def llms_txt(request):
    content = """# Avenue One Agency

> NYC-born, creator-led social media & marketing agency founded by Linda Kafexholli. Full-service strategy, content, influencer partnerships, and brand building for hospitality, fashion, beauty, lifestyle, and F&B brands across the U.S. and Europe.

## Pages

- [Home](https://avenueoneagency.com/): Building iconic brands through strategy & influence. Social media & marketing agency overview, key stats, and core offerings.
- [About](https://avenueoneagency.com/ueber-uns/): NYC-born, creator-led story. Founder Linda Kafexholli's background as a global digital creator with a 1M+ audience and cross-continental marketing expertise.
- [Services](https://avenueoneagency.com/services/): Social media strategy, content creation, influencer partnerships, brand identity, campaign production, hospitality marketing, paid media, and AI Engine Optimization (AEO).
- [Industries](https://avenueoneagency.com/branchen/): Hospitality & hotels, restaurants & F&B, fashion & luxury, beauty & wellness, lifestyle & culture, real estate & development.
- [Testimonials](https://avenueoneagency.com/testimonials/): Client results and reviews, including Faralda Crane Hotel and Chatti New York.
- [Blog](https://avenueoneagency.com/blog/): Insights on social media marketing, creator economy, brand strategy, and hospitality/lifestyle marketing.
- [Contact](https://avenueoneagency.com/kontakt/): Get in touch for a free brand audit or discovery call. Replies within 24 hours.
- [Imprint](https://avenueoneagency.com/impressum/): Legal and company information.
- [Privacy Policy](https://avenueoneagency.com/datenschutz/): Data protection and privacy policy.

## Contact

- Email: info@avenueoneagency.com
- Instagram: https://www.instagram.com/avenueone.agency/
- Location: New York City, USA
"""
    return HttpResponse(content, content_type="text/plain; charset=utf-8")


def llms_full_txt(request):
    content = """# Avenue One Agency

> NYC-born, creator-led social media & marketing agency founded by Linda Kafexholli. Full-service strategy, content, influencer partnerships, and brand building for hospitality, fashion, beauty, lifestyle, and F&B brands across the U.S. and Europe.

- Email: info@avenueoneagency.com
- Instagram: https://www.instagram.com/avenueone.agency/
- Location: New York City, USA
- Founded: 2020
- Markets: NYC & EU

---

## Home — https://avenueoneagency.com/

**Tagline:** Building iconic brands through strategy & influence.

Full-service social media & marketing agency helping brands grow with strategy, content & creator partnerships.

**Key stats**
- 1M+ creator audience
- 50+ brands served
- NYC based & global
- 5-star client rating

---

## About — https://avenueoneagency.com/ueber-uns/

**NYC-Born. Creator-Led. Built for Modern Brands.**

Avenue One was founded with one mission: to help brands build iconic identities that resonate with culture and convert in the market. We work with hospitality, fashion, beauty, lifestyle, and F&B brands — crafting moments, elevating identity, and building communities with purpose.

**Founder — Linda Kafexholli**
Global digital creator, marketing strategist, and 1M+ audience builder. Combines creative direction with real-world influence and deep industry expertise across the U.S. and Europe.

---

## Services — https://avenueoneagency.com/services/

1. **Social Media Strategy** — Data-driven strategies that grow audience and deepen engagement.
2. **Content Creation** — Photography, video, and copy tailored for brand voice and platform algorithms.
3. **Influencer Partnerships** — Curated creator collaborations and UGC direction.
4. **Brand Identity & Creative Direction** — Iconic, recognizable brand aesthetics end-to-end.
5. **Campaign Production & Storytelling** — Concept, production, execution, and analysis.
6. **Hospitality & Lifestyle Marketing** — Specialist expertise in hotels, restaurants, F&B, and luxury.
7. **Advertising & Paid Media** — AI-driven targeting across Meta, TikTok, Google, and beyond.
8. **AEO — AI Engine Optimization** — Optimization for ChatGPT, Perplexity, and Google AI Overview.

---

## Industries — https://avenueoneagency.com/branchen/

- **Hospitality & Hotels** — Boutique hotels to luxury chains.
- **Restaurants & F&B** — Dining experiences turned into viral moments.
- **Fashion & Luxury** — Editorial content and influencer strategy.
- **Beauty & Wellness** — Authentic content and creator partnerships.
- **Lifestyle & Culture** — Plugging brands into culture authentically.
- **Real Estate & Development** — Premium visual storytelling for residential and commercial brands.

---

## Testimonials — https://avenueoneagency.com/testimonials/

> "Through Avenue One Agency, we were able to streamline our services, increase local visibility and improve customer engagement — increasing booking rate by 25%."
> — Edwin Kornmann Rudi, Faralda Crane Hotel

> "Social Media Marketing services provided by Avenue One Agency helped us increase our online presence and customer engagement significantly."
> — Fregi Mathew, Chef, Chatti New York

---

## Blog — https://avenueoneagency.com/blog/

Insights on social media marketing, creator economy, brand strategy, and hospitality/lifestyle marketing.

---

## Contact — https://avenueoneagency.com/kontakt/

Tell us about your brand and what you want to achieve. Replies within 24 hours.

- Email: info@avenueoneagency.com
- Instagram: @avenueone.agency
- Location: New York City, USA

---

## Legal

- [Imprint](https://avenueoneagency.com/impressum/) — Legal and company information.
- [Privacy Policy](https://avenueoneagency.com/datenschutz/) — Data protection and privacy policy.
"""
    return HttpResponse(content, content_type="text/plain; charset=utf-8")


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
