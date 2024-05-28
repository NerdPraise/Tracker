from django.contrib.auth import get_user_model
from rest_framework import serializers

from app.money_tracker.models import Wallet

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "first_name", "last_name", "full_name")
        extra_kwargs = {"password": {"write_only": True}}

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Wallet.objects.create(user=user)
        return user
