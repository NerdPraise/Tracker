from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser


class ModelUser(AbstractUser):
    email = models.EmailField(_('email address'), unique=True, blank=False)
    username = models.CharField(_('username'), max_length=150)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
