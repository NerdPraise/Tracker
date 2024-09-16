from rest_framework import serializers

from app.accounts.models import User, UserProfile
from app.money_tracker.models import Wallet
from lib.utils import mask_card_number


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    class Meta:
        model = User


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


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    subscription = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        exclude = ("id",)
        extra_kwargs = {"cvv": {"write_only": True}}

    def to_representation(self, instance):
        profile = super().to_representation(instance)
        user = profile.pop("user")
        return {
            **profile,
            **user,
            "card_number": mask_card_number(profile["card_number"]),
        }

    def get_subscription(self, instance):
        return instance.user.usersubscription.get_payment_mode_display()

    def update(self, instance, validated_data):
        if "user" in validated_data:
            user = instance.user
            user_details = validated_data.pop("user")
            for attr, value in user_details.items():
                setattr(user, attr, value)
            user.save()
        return super().update(instance, validated_data)
