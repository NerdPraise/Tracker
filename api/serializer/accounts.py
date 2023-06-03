from django.db import models
from rest_framework import serializers

from django.contrib.auth import get_user_model

from app.money_tracker.models import Wallet

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password',
                  'first_name', 'last_name')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Wallet.objects.create(user=user)
        return user

    # def to_representation(self, instance):
    #     instance['wallet'] = Wallet
    #     return super().to_representation(instance)
