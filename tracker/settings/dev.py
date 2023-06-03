from typing import cast
from .base import *
from decouple import config


DEBUG = config('DEBUG', cast=bool, default=True)
CORS_ALLOW_ALL_ORIGINS = config(
    'CORS_ALLOW_ALL_ORIGINS', cast=bool, default=True)
