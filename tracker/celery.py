import os

from celery import Celery
from decouple import config
from django.conf import settings

environment = config("ENVIRONMENT")

if environment == "development":
    path_to_settings = "tracker.settings.prod"
else:
    path_to_settings = "tracker.settings.prod"

os.environ.setdefault("DJANGO_SETTINGS_MODULE", path_to_settings)
app = Celery("APP")

# read config from Django settings, the CELERY namespace would make celery
# config keys has `CELERY` prefix
app.config_from_object("django.conf:settings", namespace="CELERY")

# discover and load tasks.py from from all registered Django apps
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
