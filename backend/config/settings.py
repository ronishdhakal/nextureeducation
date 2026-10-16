"""
Django settings for the Nexture Education backend.
"""

import os
from datetime import timedelta
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


def env_bool(name: str, default: bool) -> bool:
    return os.environ.get(name, str(default)).strip().lower() in ("1", "true", "yes", "on")


def env_list(name: str, default: str = "") -> list[str]:
    raw = os.environ.get(name, default)
    return [item.strip() for item in raw.split(",") if item.strip()]


SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "django-insecure-dev-only-change-me")
DEBUG = env_bool("DJANGO_DEBUG", True)

if not DEBUG and SECRET_KEY.startswith("django-insecure"):
    raise ImproperlyConfigured("Set DJANGO_SECRET_KEY to a long random value when DJANGO_DEBUG is off.")
ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1")

CSRF_TRUSTED_ORIGINS = env_list("DJANGO_CSRF_TRUSTED_ORIGINS", "")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_filters",
    "drf_spectacular",
    # local apps
    "core",
    "destinations",
    "catalog",
    "services",
    "leads",
    "content",
    "events",
    "accounts",
    "notifications",
    "crm",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# --- Database -----------------------------------------------------------
# Uses Postgres when DB_* env vars are present (docker-compose / prod),
# falls back to local SQLite for a quick `python manage.py runserver`.

if os.environ.get("DB_NAME"):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.environ["DB_NAME"],
            "USER": os.environ.get("DB_USER", "postgres"),
            "PASSWORD": os.environ.get("DB_PASSWORD", ""),
            "HOST": os.environ.get("DB_HOST", "localhost"),
            "PORT": os.environ.get("DB_PORT", "5432"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- Media storage --------------------------------------------------------
# Cloudflare R2 (S3-compatible) in prod, local filesystem in dev.

USE_R2_STORAGE = env_bool("USE_R2_STORAGE", False)

STATICFILES_STORAGE_BACKEND = "whitenoise.storage.CompressedStaticFilesStorage"

if USE_R2_STORAGE:
    STORAGES = {
        "default": {"BACKEND": "storages.backends.s3.S3Storage"},
        "staticfiles": {"BACKEND": STATICFILES_STORAGE_BACKEND},
    }
    AWS_ACCESS_KEY_ID = os.environ.get("R2_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.environ.get("R2_SECRET_ACCESS_KEY")
    AWS_STORAGE_BUCKET_NAME = os.environ.get("R2_BUCKET_NAME")
    AWS_S3_ENDPOINT_URL = os.environ.get("R2_ENDPOINT_URL")
    AWS_S3_CUSTOM_DOMAIN = os.environ.get("R2_PUBLIC_DOMAIN") or None
    # Cloudflare R2: region is always "auto", path-style addressing is the safest
    # with the account endpoint, and ACLs are not used (access is set on the bucket).
    AWS_S3_REGION_NAME = "auto"
    AWS_S3_SIGNATURE_VERSION = "s3v4"
    AWS_S3_ADDRESSING_STYLE = "path"
    AWS_DEFAULT_ACL = None
    AWS_QUERYSTRING_AUTH = False
    # Never overwrite: two uploads called "photo.jpg" must not replace each other.
    AWS_S3_FILE_OVERWRITE = False
    AWS_S3_OBJECT_PARAMETERS = {"CacheControl": "public, max-age=31536000"}
    MEDIA_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/" if AWS_S3_CUSTOM_DOMAIN else "/media/"
else:
    STORAGES = {
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {"BACKEND": STATICFILES_STORAGE_BACKEND},
    }
    # In production set MEDIA_PUBLIC_URL to the absolute public URL of /media/
    # (e.g. https://api.example.com/media/). Server-side renders reach this API
    # over the docker network, so a relative URL would leak the internal host.
    MEDIA_URL = os.environ.get("MEDIA_PUBLIC_URL", "/media/")
    MEDIA_ROOT = BASE_DIR / "media"

# --- DRF / JWT / CORS / schema --------------------------------------------

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("accounts.permissions.ContentWritePermission",),
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.OrderingFilter",
        "rest_framework.filters.SearchFilter",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_THROTTLE_RATES": {
        "lead_create": "10/hour",
    },
    # Behind nginx every request arrives from the proxy; trust one hop of
    # X-Forwarded-For so the per-IP lead throttle does not lump visitors together.
    "NUM_PROXIES": int(os.environ.get("DRF_NUM_PROXIES", "0" if DEBUG else "1")),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=8),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Nexture Education API",
    "DESCRIPTION": "Public content API and admin CRUD for the Nexture Education platform.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

CORS_ALLOWED_ORIGINS = env_list(
    "CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
)

# --- Email (lead notifications) -------------------------------------------

EMAIL_BACKEND = os.environ.get(
    "EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend"
)
EMAIL_HOST = os.environ.get("EMAIL_HOST", "")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", "587"))
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = env_bool("EMAIL_USE_TLS", True)
LEAD_NOTIFICATION_EMAIL = os.environ.get("LEAD_NOTIFICATION_EMAIL", "")

# --- Production hardening -------------------------------------------------

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    USE_X_FORWARDED_HOST = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_REFERRER_POLICY = "same-origin"
    # nginx terminates TLS and redirects http -> https itself.
    SECURE_SSL_REDIRECT = env_bool("DJANGO_SSL_REDIRECT", False)
    # Leave at 0 until HTTPS is confirmed working, then set e.g. 31536000.
    SECURE_HSTS_SECONDS = int(os.environ.get("DJANGO_HSTS_SECONDS", "0"))
