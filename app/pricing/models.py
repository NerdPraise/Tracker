from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class UserSubscription(models.Model):
    FREE = "FR"
    SUBSCRIPTION = "SU"
    ONE_TIME = "OT"
    PAYMENT_CHOICES = [
        (FREE, "Free"),
        (SUBSCRIPTION, "Subscription"),
        (ONE_TIME, "One Time"),
    ]

    user = models.OneToOneField("accounts.User", on_delete=models.CASCADE)
    payment_mode = models.CharField(max_length=2, choices=PAYMENT_CHOICES, default=FREE)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.get_payment_mode_display()}"


class UserTransaction(models.Model):
    subscription = models.ForeignKey(UserSubscription, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20)
    reference = models.CharField(max_length=120)

    def __str__(self):
        return f"Transaction {self.id} for {self.subscription.user.username} - {self.status}"
