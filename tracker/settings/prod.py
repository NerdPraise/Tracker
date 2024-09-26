import dj_database_url
from decouple import config

from .base import *  # noqa

DEBUG = config("DEBUG", cast=bool, default=False)
CSRF_TRUSTED_ORIGINS = config("CSRF_TRUSTED_ORIGINS").split(",")

CORS_ALLOW_ALL_ORIGINS = config("CORS_ALLOW_ALL_ORIGINS", cast=bool, default=False)
CORS_ALLOWED_ORIGINS = config("CORS_ALLOWED_ORIGINS").split(",")

DATABASES = {
    "default": dj_database_url.config(
        conn_max_age=600,
        conn_health_checks=True,
    )
}

AWS_REGION_NAME = config("AWS_SES_REGION_NAME")
EMAIL_BACKEND = "django_ses.SESBackend"

STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3.S3Storage",
        "OPTIONS": {
            "bucket_name": "useinvoice-sk",
            "region_name": "af-south-1",
            "custom_domain": "useinvoice-sk.s3.af-south-1.amazonaws.com",
            "access_key": config("AWS_ACCESS_KEY_ID"),
            "secret_key": config("AWS_SECRET_ACCESS_KEY"),
            "default_acl": "public-read",
        },
    },
    "staticfiles": {
        "BACKEND": "storages.backends.s3.S3Storage",
        "OPTIONS": {
            "bucket_name": "useinvoice-sk",
            "region_name": "af-south-1",
            "custom_domain": "useinvoice-sk.s3.af-south-1.amazonaws.com",
            "default_acl": "public-read",
        },
    },
}
