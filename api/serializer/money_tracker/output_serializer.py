from django.contrib.auth import get_user_model
from rest_framework import serializers

from api.serializer.accounts import UserSerializer
from app.money_tracker.models import Category, MonthTrack, Transaction, Wallet
from lib.utils import Month

User = get_user_model()


class MonthTrackSerializer(serializers.ModelSerializer):
    month = serializers.DateField()

    class Meta:
        model = MonthTrack
        fields = "__all__"

    def create(self, validated_data):
        month = validated_data["month"]
        validated_data["month"] = Month.from_date(month)
        return MonthTrack.objects.create(**validated_data)


class WalletSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Wallet
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    is_owner = serializers.SerializerMethodField()
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects, write_only=True)

    class Meta:
        model = Category
        fields = "__all__"

    def get_is_owner(self, data):
        return bool(data.user)


class TransactionSerializer(serializers.ModelSerializer):
    is_wallet = serializers.SerializerMethodField()
    category = CategorySerializer(required=False)

    class Meta:
        model = Transaction
        fields = "__all__"

    def get_is_wallet(self, data):
        return bool(data.wallet)
