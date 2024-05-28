import uuid

from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save

User = get_user_model()


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Invoice(TimeStampedModel):
    class StatusChoices(models.TextChoices):
        PENDING = "pending"
        PAID = "paid"
        DRAFT = "draft"
        OVERDUE = "OVERDUE"

    class CurrencyChoices(models.TextChoices):
        USD = "USD"
        NGN = "NGN"
        EUR = "EUR"
        GBP = "GBP"

    name = models.CharField(max_length=255)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    client = models.ForeignKey("Client", on_delete=models.SET_NULL, null=True)
    issue_date = models.DateField()
    due_date = models.DateField()
    user = models.ForeignKey(User, related_name="invoices", on_delete=models.CASCADE)
    description = models.TextField()
    status = models.CharField(choices=StatusChoices.choices, default=StatusChoices.DRAFT, max_length=20)
    extra_info = models.TextField(null=True, blank=True)
    currency = models.CharField(choices=CurrencyChoices.choices, default=CurrencyChoices.USD, max_length=20)
    template = models.ForeignKey("InvoiceTemplate", on_delete=models.PROTECT)
    invoice_items = models.JSONField(default=list, null=False)

    def __str__(self):
        return f"ID={self.id} {self.user.email} invoice to Client={self.client_id}"

    def save(self, *args, **kwargs):
        if not self.id:
            self.name = f"INV-{self.user.invoices.count() + 1}"
        return super().save(*args, **kwargs)

    @staticmethod
    def create_payment_fk(sender, created, instance, **kwargs):
        if created:
            Payment.objects.create(invoice=instance, total_due=instance.amount)


post_save.connect(Invoice.create_payment_fk, Invoice)


# class InvoiceItems(TimeStampedModel):
#     description = models.TextField()
#     quantity = models.IntegerField()
#     unit_price = models.PositiveBigIntegerField()
#     amount = models.PositiveBigIntegerField(blank=True, editable=False)
#     invoice = models.ForeignKey(Invoice, related_name="invoice_items", on_delete=models.CASCADE)

#     def save(self, *args, **kwargs):
#         if not self.id:
#             self.amount = self.quantity * self.unit_price
#         return super().save(*args, **kwargs)


class InvoiceTemplate(models.Model):
    class CategoryChoices(models.TextChoices):
        SIMPLE = "SIMPLE"
        CLASSY = "CLASSY"

    image = models.ImageField(upload_to="invoice_temp", null=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    settings = models.JSONField(default=dict)
    category = models.CharField(choices=CategoryChoices.choices, default=CategoryChoices.SIMPLE, max_length=20)
    user = models.ForeignKey(User, related_name="templates", null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.uuid}"


class Client(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    user = models.ForeignKey(User, related_name="clients", on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Payment(TimeStampedModel):
    invoice = models.OneToOneField(Invoice, on_delete=models.CASCADE)
    total_due = models.PositiveBigIntegerField()

    @staticmethod
    def update_invoice(sender, created, instance, **kwargs):
        if not instance.total_due:
            invoice = instance.invoice
            invoice.status = Invoice.StatusChoices.PAID
            invoice.save()


post_save.connect(Payment.update_invoice, Payment)


class Transaction(TimeStampedModel):
    class ModeChoices(models.TextChoices):
        BANK_TRANFER = "BT"
        CASH = "CS"
        OTHERS = "OT"

    payment = models.ForeignKey(Payment, related_name="transactions", on_delete=models.PROTECT)
    amount = models.PositiveBigIntegerField()
    payment_date = models.DateField()
    mode = models.CharField(choices=ModeChoices.choices, max_length=2)
