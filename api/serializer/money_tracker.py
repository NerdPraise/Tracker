from rest_framework import serializers

from django.contrib.auth import get_user_model

from api.serializer.accounts import UserSerializer

from app.money_tracker.models import Budget, Transaction, Wallet, UserCategory
from constants.utils import Month


User = get_user_model()


class BudgetSerializer(serializers.ModelSerializer):
    month = serializers.DateField()

    class Meta:
        model = Budget
        fields = '__all__'

    def create(self, validated_data):
        month = validated_data['month']
        validated_data['month'] = Month.from_date(month)
        return Budget.objects.create(**validated_data)


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class WalletSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Wallet
        fields = '__all__'


class UserCategorySerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=User.objects)
    monthly_track = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Budget.objects)

    class Meta:
        model = UserCategory
        fields = '__all__'
