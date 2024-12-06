import hashlib
import uuid
from datetime import datetime
from functools import reduce

from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.utils.functional import cached_property

User = get_user_model()


class CurrencyChoices(models.TextChoices):
    USD = "USD"
    NGN = "NGN"
    EUR = "EUR"
    GBP = "GBP"


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Invoice(TimeStampedModel):
    name = models.CharField(max_length=255, null=True, blank=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    client = models.ForeignKey("Client", on_delete=models.SET_NULL, null=True)
    issue_date = models.DateField(null=True, blank=True)
    due_date = models.DateField()
    user = models.ForeignKey(User, related_name="invoices", on_delete=models.CASCADE)
    description = models.TextField()
    extra_info = models.TextField(null=True, blank=True)
    currency = models.CharField(choices=CurrencyChoices.choices, default=CurrencyChoices.USD, max_length=20)
    template = models.ForeignKey("InvoiceTemplate", on_delete=models.PROTECT, null=True)
    invoice_items = models.JSONField(default=list, null=False, blank=False)
    date_sent = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"INVOICE {self.name} Email={self.user.email}"

    def save(self, *args, **kwargs):
        if not self.id:
            self.name = f"INV-{self.user.invoices.count() + 1}"
        return super().save(*args, **kwargs)

    @cached_property
    def amount(self):
        return reduce(lambda a, b: a + (b["quantity"]) * b["unit_price"], self.invoice_items, 0)

    @staticmethod
    def create_payment_fk(sender, created, instance, **kwargs):
        updated_amount = instance.amount
        if created:
            Payment.objects.create(invoice=instance, total_due=updated_amount)
        else:
            already_paid = instance.payment.transactions.aggregate(sum=models.Sum("amount"))["sum"] or 0
            instance.payment.total_due = updated_amount - already_paid
            instance.payment.save()

    class Meta:
        ordering = ("-created_at",)


post_save.connect(Invoice.create_payment_fk, Invoice)


class InvoiceSettings(models.Model):
    prefix = models.CharField(max_length=150, default="INV")
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    default_currency = models.CharField(choices=CurrencyChoices.choices, default=CurrencyChoices.USD, max_length=20)
    default_bank = models.CharField(max_length=150, default="")
    account_name = models.CharField(max_length=150, default="")
    account_number = models.CharField(max_length=150, default="")
    due_after = models.PositiveSmallIntegerField(default=10)

    def __str__(self) -> str:
        return self.user.email

    class Meta:
        verbose_name_plural = "Invoice Settings"


class InvoiceTemplate(models.Model):
    class CategoryChoices(models.TextChoices):
        SIMPLE = "SIMPLE"
        CUSTOM = "CUSTOM"

    image = models.ImageField(upload_to="invoice_temp", null=True, blank=True, max_length=255)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    settings = models.JSONField(default=dict)
    category = models.CharField(choices=CategoryChoices.choices, default=CategoryChoices.SIMPLE, max_length=20)
    user = models.ForeignKey(User, related_name="templates", null=True, blank=True, on_delete=models.CASCADE)
    custom_image = models.BinaryField(
        help_text="Holds the binary data image url of custom templates", null=True, blank=True, editable=False
    )

    def __str__(self):
        return f"{self.uuid}"


class Client(TimeStampedModel):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    user = models.ForeignKey(User, related_name="clients", on_delete=models.CASCADE)
    address = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        constraints = (models.UniqueConstraint(fields=["user", "email"], name="unique-user-clients"),)


class Payment(TimeStampedModel):
    class StatusChoices(models.TextChoices):
        PENDING = "pending"
        PAID = "paid"
        DRAFT = "draft"
        OVERDUE = "OVERDUE"

    status = models.CharField(choices=StatusChoices.choices, default=StatusChoices.DRAFT, max_length=20)
    invoice = models.OneToOneField(Invoice, on_delete=models.CASCADE)
    total_due = models.PositiveBigIntegerField()

    def save(self, *args, **kwargs):
        if self.id:
            if not self.total_due:
                self.status = Payment.StatusChoices.PAID
            elif self.invoice.date_sent:
                self.status = Payment.StatusChoices.PENDING
            else:
                self.status = Payment.StatusChoices.DRAFT
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"Payment for {self.invoice.uuid}"


class Transaction(TimeStampedModel):
    class ModeChoices(models.TextChoices):
        BANK_TRANFER = "BT"
        CASH = "CS"
        OTHERS = "OT"

    payment = models.ForeignKey(Payment, related_name="transactions", on_delete=models.PROTECT)
    amount = models.PositiveBigIntegerField()
    payment_date = models.DateField()
    mode = models.CharField(choices=ModeChoices.choices, max_length=2)


class InvoiceMessageCode(TimeStampedModel):
    invoice = models.OneToOneField(Invoice, on_delete=models.DO_NOTHING)
    code = models.CharField(max_length=150)

    def save(self, *args, **kwargs):
        if not self.id:
            self.code = self.generate_unique_string(self.invoice.uuid)
        super().save(*args, **kwargs)

    @staticmethod
    def generate_unique_string(invoice_uuid: uuid.UUID) -> str:
        current_datetime = datetime.now().isoformat()
        unique_string = f"{invoice_uuid}-{current_datetime}"
        return hashlib.sha256(unique_string.encode()).hexdigest()


class Widget(TimeStampedModel):
    name = models.CharField(max_length=120)
    description = models.TextField()

    def __str__(self):
        return self.name
