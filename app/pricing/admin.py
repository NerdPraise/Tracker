from django.contrib import admin

from .models import UserSubscription, UserTransaction

admin.site.register(UserSubscription)
admin.site.register(UserTransaction)
