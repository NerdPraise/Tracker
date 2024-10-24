from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.utils.translation import gettext_lazy as _

from app.pricing.models import UserSubscription


class User(AbstractUser):
    email = models.EmailField(_("email address"), unique=True, blank=False)
    username = models.CharField(_("username"), max_length=150)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def save(self, *args, **kwargs):
        if not self.id:
            self.email = self.email.lower()
        return super().save(*args, **kwargs)

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    @staticmethod
    def create_user_profile(sender, created, instance, **kwargs):
        if created:
            UserProfile.objects.create(user=instance)
            UserSubscription.objects.create(user=instance)
            from app.invoice.models import InvoiceSettings

            InvoiceSettings.objects.create(user=instance)


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.TextField()
    date_format = models.CharField(max_length=120, default="DD/MM/YYYY")
    card_name = models.CharField(max_length=120)
    card_number = models.CharField(max_length=120)
    cvv = models.CharField(max_length=4)
    expiry_date = models.CharField(max_length=6)

    def __str__(self):
        return f"User profile for {self.user.email}"


post_save.connect(User.create_user_profile, User)
