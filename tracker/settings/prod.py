import dj_database_url
from decouple import config

from .base import *  # noqa

DEBUG = config("DEBUG", cast=bool, default=False)

CORS_ALLOW_ALL_ORIGINS = config("CORS_ALLOW_ALL_ORIGINS", cast=bool, default=False)
CORS_ALLOWED_ORIGINS = config("CORS_ALLOWED_ORIGINS").split(",")

DATABASES = {
    "default": dj_database_url.config(
        conn_max_age=600,
        conn_health_checks=True,
    )
}
