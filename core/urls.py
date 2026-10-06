from django.urls import path
from django.views.generic.base import RedirectView

from . import views
from .seo import COMMERCIAL_PAGES, LEGACY_REDIRECTS, VERTICALS

urlpatterns = [
    path('', views.react_app, name='home'),
    path('about/', views.react_app, name='about'),
    path('services/', views.react_app, name='services'),
    path('industries/', views.react_app, name='industries'),
    path('testimonials/', views.react_app, name='testimonials'),
    path('contact/', views.react_app, name='contact'),
    path('imprint/', views.react_app, name='imprint'),
    path('privacy/', views.react_app, name='privacy'),

    path('robots.txt', views.robots_txt, name='robots'),
    path('llms.txt', views.llms_txt, name='llms'),
    path('llms-full.txt', views.llms_full_txt, name='llms_full'),
]

# Permanent redirects from the old German slugs. query_string=True keeps UTM
# and campaign parameters intact across the hop, so paid traffic landing on an
# old URL still attributes correctly.
urlpatterns += [
    path(
        old,
        RedirectView.as_view(url=new, permanent=True, query_string=True),
        name=f"legacy_{old.strip('/').replace('-', '_')}",
    )
    for old, new in LEGACY_REDIRECTS.items()
]

# Vertical landing pages. Registered explicitly rather than as a catch-all slug
# so that any other unmatched URL still reaches the 404 handler.
urlpatterns += [
    path(f"{v['slug']}/", views.react_app, name=f"vertical_{v['slug'].replace('-', '_')}")
    for v in VERTICALS
]

urlpatterns += [
    path(
        f"{page['slug']}/",
        views.react_app,
        name=f"commercial_{page['slug'].replace('-', '_')}",
    )
    for page in COMMERCIAL_PAGES
]
