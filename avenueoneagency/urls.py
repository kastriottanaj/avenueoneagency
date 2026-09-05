from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from core.sitemaps import StaticViewSitemap
from blog.sitemaps import BlogPostSitemap
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve

sitemaps = {
    'static': StaticViewSitemap,
    'blog': BlogPostSitemap,
}

# Unmatched URLs must 404, not fall through to the SPA with a 200. The previous
# catch-all made every mistyped or scraped URL a soft-404 duplicate of the home
# page.
handler404 = 'core.views.page_not_found'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='sitemap'),

    # API endpoints
    path('api/', include('core.api_urls')),
    path('api/blog/', include('blog.api_urls')),

    # Core pages and blog (all serve the React shell or RSS)
    path('', include('core.urls')),
    path('blog/', include('blog.urls')),

    # Media files
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
