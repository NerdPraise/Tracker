import uuid

from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Sum
from django.db.models.signals import post_save
from django.utils.timezone import now
from django.utils.translation import gettext as _

from lib.fields import MonthField

User = get_user_model()


class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_income = models.BigIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} wallet"


class MonthTrack(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    month = MonthField()
    amount = models.BigIntegerField(default=0, help_text=_("Amount of money held into the month"))

    def __str__(self):
        return f"{self.month} track for user {self.user.email}"

    def get_balance(self):
        amount = self.transactions.all().aggregate(sum=Sum("amount"))
        return amount["sum"]

    class Meta:
        constraints = [models.UniqueConstraint(fields=["month", "user"], name="unique_month_user")]


class Category(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=150)
    # TODO: Unique validator for each user and their categories

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class Transaction(models.Model):
    class Source(models.TextChoices):
        CREDIT = "credit"
        DEBIT = "debit"

    category = models.ForeignKey(Category, on_delete=models.PROTECT, null=True, blank=True)
    source = models.CharField(max_length=10, choices=Source.choices)
    description = models.CharField(max_length=150)
    amount = models.IntegerField()
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(default=now)
    month_track = models.ForeignKey(MonthTrack, related_name="transactions", on_delete=models.PROTECT)
    wallet = models.ForeignKey(
        Wallet, related_name="wallet_transactions", on_delete=models.PROTECT, null=True, blank=True
    )

    def save(self, *args, **kwargs):
        if not self.id and self.source == "credit":
            category, _ = Category.objects.get_or_create(name="Income")
            self.category = category
        super().save(*args, **kwargs)

    def __str__(self):
        track = self.month_track
        return f"{track.user.username, track.month, self.source}"


def set_income(sender, instance, created, **kwargs):
    if instance and instance.source == "credit":
        category, _ = Category.objects.get_or_create(name="Income")
        instance.category = category


post_save.connect(set_income, Transaction)


# class Category (models.Model):
#     name = models.CharField(max_length=150)
#     max_spend = models.IntegerField()
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     monthly_track = models.ForeignKey(Budget, on_delete=models.PROTECT)

#     @property
#     def get_current_sepnd(self):
#         return self.transaction_set.all().aggregate(sum=Sum("amount"))["sum"]

#     def __str__(self):
#         return f"{self.user.email} {self.name}"

#     class Meta:
#         verbose_name_plural = "User Categories"
