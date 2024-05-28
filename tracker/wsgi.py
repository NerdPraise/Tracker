"""
WSGI config for tracker project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/wsgi/
"""

import os

from decouple import config
from django.core.wsgi import get_wsgi_application

if config("ENVIRONMENT") == "prod":
    path_to_settings = "tracker.settings.prod"
else:
    path_to_settings = "tracker.settings.dev"

os.environ.setdefault("DJANGO_SETTINGS_MODULE", path_to_settings)

application = get_wsgi_application()
