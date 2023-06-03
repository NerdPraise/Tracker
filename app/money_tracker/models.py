from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _
from django.db.models.signals import post_save
from django.db.models import Sum
from django.utils.timezone import now

import uuid

from constants.fields import MonthField

User = get_user_model()


class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_income = models.BigIntegerField(default=0)

    def get_total_income(self):
        pass

    def __str__(self):
        return f'{self.user.username} wallet'


class Budget(models.Model):
    wallet = models.ForeignKey(Wallet, on_delete=models.PROTECT)
    month = MonthField(unique=True)
    monthly_budget = models.IntegerField(_('Budget Percentage'), help_text=_(
        'Percentage used to determine monthly budget'), default=40)
    month_income = models.BigIntegerField(default=0)

    def __str__(self):
        return f'{self.month} budget'

    @staticmethod
    def update_wallet(sender, instance, **kwargs):
        wallet = instance.wallet
        new_income = instance.month_income * \
            (1 - (instance.monthly_budget / 100))
        wallet.total_income += new_income
        wallet.save()

    def get_total_transaction_amount(self):
        amount = self.transactions.all().aggregate(sum=Sum('amount'))
        return amount['sum']

    def can_add_more_to_budget(self):
        # This is to safe guard against adding more budget allowances than the current month_income
        pass


post_save.connect(Budget.update_wallet, Budget)


class Category(models.Model):
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class UserCategory(models.Model):
    name = models.CharField(max_length=150)
    max_spend = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    monthly_track = models.ForeignKey(Budget, on_delete=models.PROTECT)

    @property
    def get_current_sepnd(self):
        return self.transaction_set.all().aggregate(sum=Sum('amount'))["sum"]

    def __str__(self):
        return f'{self.user.email} {self.name}'

    class Meta:
        verbose_name_plural = "User Categories"


class Transaction(models.Model):
    class Source(models.TextChoices):
        CREDIT = 'credit'
        DEBIT = 'debit'

    category = models.ForeignKey(
        UserCategory, related_name='transactions', on_delete=models.PROTECT)
    source = models.CharField(max_length=10, choices=Source.choices)
    description = models.CharField(max_length=150)
    amount = models.IntegerField()
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(default=now)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, null=True)

    def save(self, *args, **kwargs):
        if not self.id and self.source == 'credit':
            category, created = Category.objects.get_or_create(name='Income')
            self.category = category
        super().save(*args, **kwargs)

    def __str__(self):
        track = self.monthly_track
        return f'{track.wallet.user.username, track.month}'
