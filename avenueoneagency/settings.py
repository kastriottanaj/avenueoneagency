import os
from pathlib import Path

import dj_database_url
from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent


def env_list(name, default):
    """Read a comma-separated environment variable into a list of strings."""
    raw = os.environ.get(name)
    if not raw:
        return default
    return [item.strip() for item in raw.split(',') if item.strip()]


def env_bool(name, default=False):
    return os.environ.get(name, str(default)).strip().lower() in ('1', 'true', 'yes', 'on')


DEBUG = env_bool('DEBUG', False)

# Secrets come from the environment only. A committed fallback is a published
# secret: anyone who can read the repository can forge sessions and admin
# password-reset tokens.
SECRET_KEY = os.environ.get('SECRET_KEY')
if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = 'django-insecure-local-development-only'
    else:
        raise ImproperlyConfigured(
            'SECRET_KEY is not set. In production it must come from the environment '
            '(see .env.example); for local work run with DEBUG=True.'
        )

ALLOWED_HOSTS = env_list('DJANGO_ALLOWED_HOSTS', [
    'www.avenueoneagency.com',
    'avenueoneagency.com',
    'localhost',
    '127.0.0.1',
])

# Redirect www -> apex so both hostnames do not serve the same pages with a 200.
CANONICAL_HOST = os.environ.get('CANONICAL_HOST', 'avenueoneagency.com')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'core',
    'industries',
    'services',
    'blog',
    'team',
    'testimonials',
    'django.contrib.sitemaps',
    'widget_tweaks',
    'taggit',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',        # must be first
    'core.middleware.CanonicalHostMiddleware',              # www -> apex, before anything renders
    'whitenoise.middleware.WhiteNoiseMiddleware',           # right after Security
    'corsheaders.middleware.CorsMiddleware',                # before CommonMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'avenueoneagency.urls'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'avenueoneagency.wsgi.application'

DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    if DEBUG:
        DATABASE_URL = 'sqlite:///' + str(BASE_DIR / 'db.sqlite3')
    else:
        raise ImproperlyConfigured('DATABASE_URL is not set (see .env.example).')

DATABASES = {
    'default': dj_database_url.parse(DATABASE_URL, conn_max_age=600),
}

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', '587'))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
# Mail must be sent FROM an address this domain is authorised to send for,
# otherwise SPF/DMARC alignment fails and it lands in spam. The visitor's
# address goes in Reply-To instead (see core/api_views.py).
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER)
CONTACT_RECEIVER_EMAIL = os.environ.get('CONTACT_RECEIVER_EMAIL', EMAIL_HOST_USER)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '[{asctime}] {levelname} {name}: {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'standard',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': os.environ.get('DJANGO_LOG_LEVEL', 'INFO'),
    },
    'loggers': {
        'django.request': {
            'handlers': ['console'],
            'level': 'WARNING',
            'propagate': False,
        },
        'django.db.backends': {
            'level': 'WARNING',
        },
    },
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'

_staticfiles_dirs = [os.path.join(BASE_DIR, 'core/static')]
_frontend_dist = os.path.join(BASE_DIR, 'frontend', 'dist')
if os.path.isdir(_frontend_dist):
    _staticfiles_dirs.append(_frontend_dist)
STATICFILES_DIRS = _staticfiles_dirs

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
# CompressedStaticFilesStorage compresses but does NOT rename files with hashes,
# which is required so that Vite's pre-hashed asset filenames are not double-hashed.
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 5,
    # The contact and newsletter endpoints are unauthenticated and write to the
    # database, so they need a rate limit or they are a spam funnel.
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.ScopedRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'contact': os.environ.get('THROTTLE_CONTACT', '5/hour'),
        'newsletter': os.environ.get('THROTTLE_NEWSLETTER', '5/hour'),
        'read': os.environ.get('THROTTLE_READ', '120/hour'),
    },
}

# CORS – allow React dev server and the production domain
CORS_ALLOWED_ORIGINS = env_list('DJANGO_CORS_ALLOWED_ORIGINS', [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://avenueoneagency.com',
    'https://www.avenueoneagency.com',
])

CSRF_TRUSTED_ORIGINS = env_list('DJANGO_CSRF_TRUSTED_ORIGINS', [
    'https://avenueoneagency.com',
    'https://www.avenueoneagency.com',
])

# Behind nginx: trust X-Forwarded-Proto so Django knows the original request
# was HTTPS (nginx terminates TLS and proxies over a unix socket).
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
USE_X_FORWARDED_HOST = True

if not DEBUG:
    SECURE_SSL_REDIRECT = env_bool('SECURE_SSL_REDIRECT', True)
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    CSRF_COOKIE_SAMESITE = 'Lax'

    # HSTS is now ON by default — it was previously configured but left at 0,
    # so the header was never sent. Both apex and www already serve valid HTTPS,
    # so a one-year max-age is safe.
    #
    # includeSubDomains and preload stay OFF by default because they are the
    # parts that are genuinely hard to undo: includeSubDomains breaks any
    # subdomain that is not on HTTPS, and preload is baked into browser
    # binaries for months. Turn them on deliberately once every subdomain is
    # confirmed HTTPS-only.
    SECURE_HSTS_SECONDS = int(os.environ.get('SECURE_HSTS_SECONDS', '31536000'))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = env_bool('SECURE_HSTS_INCLUDE_SUBDOMAINS', False)
    SECURE_HSTS_PRELOAD = env_bool('SECURE_HSTS_PRELOAD', False)

    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'
    X_FRAME_OPTIONS = 'DENY'
