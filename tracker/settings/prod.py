from typing import cast
from .base import *
from decouple import config


DEBUG = config('DEBUG', cast=bool, default=False)

ALLOWED_HOSTS = []
CORS_ALLOW_ALL_ORIGINS = config(
    'CORS_ALLOW_ALL_ORIGINS', cast=bool, default=False)
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS').split(',')
