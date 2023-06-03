from .models import (
    Category,
    Wallet,
    Budget,
    Transaction, UserCategory
)
from django.contrib import admin
from django.contrib.auth import get_user_model

User = get_user_model()

admin.site.register(Wallet)
admin.site.register(Transaction)
admin.site.register(Budget)
admin.site.register(Category)
admin.site.register(UserCategory)
