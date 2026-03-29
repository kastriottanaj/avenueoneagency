import os
from pathlib import Path
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY', 'mx%l0-=8+&#tu$8j3&xkfnj4ie&3kz5k(9o7&$$cy2r_pm^*#9')

DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = [
    'www.avenueoneagency.com',
    'avenueoneagency.com',
    '*.onrender.com',
    'localhost',
    '127.0.0.1',
]

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
    'contact',
    'team',
    'testimonials',
    'django.contrib.sitemaps',
    'widget_tweaks',
    'taggit',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',        # must be first
    'whitenoise.middleware.WhiteNoiseMiddleware',           # right after Security
    'corsheaders.middleware.CorsMiddleware',                # before CommonMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'polepositionautomation.urls'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'core' / 'templates'],
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

WSGI_APPLICATION = 'polepositionautomation.wsgi.application'

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get(
            'DATABASE_URL',
            'postgresql://granexv2_user:0HqvQTlahpArf99U5ByzVt9LjgRg8Qow@dpg-d0rlecbipnbc73bbse30-a/granexv2'
        )
    )
}

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', 'avenueoneagency@gmail.com')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', 'pezr soea jhvv gpkh')
CONTACT_RECEIVER_EMAIL = os.environ.get('CONTACT_RECEIVER_EMAIL', 'avenueoneagency@gmail.com')

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
}

# CORS – allow React dev server and the production domain
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://avenueoneagency.com',
    'https://www.avenueoneagency.com',
]
