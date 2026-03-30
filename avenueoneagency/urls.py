from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from core.sitemaps import StaticViewSitemap
from blog.sitemaps import BlogPostSitemap
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve
from core.views import react_app

sitemaps = {
    'static': StaticViewSitemap,
    'blog': BlogPostSitemap,
}

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='sitemap'),

    # API endpoints
    path('api/', include('core.api_urls')),
    path('api/blog/', include('blog.api_urls')),

    # Core pages and blog (all serve React or RSS)
    path('', include('core.urls')),
    path('blog/', include('blog.urls')),

    # Media files
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),

    # Catch-all: any unmatched route serves the React app
    re_path(r'^.*$', react_app),
]
