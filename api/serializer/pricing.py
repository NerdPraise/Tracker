from rest_framework import serializers

from app.pricing.models import UserSubscription, UserTransaction


class UserSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSubscription
        fields = "__all__"


class UserTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTransaction
        fields = "__all__"
