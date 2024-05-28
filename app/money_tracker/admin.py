from django.contrib import admin

from .models import Category, MonthTrack, Transaction, Wallet

admin.site.register(Wallet)
admin.site.register(Transaction)
admin.site.register(MonthTrack)
admin.site.register(Category)
