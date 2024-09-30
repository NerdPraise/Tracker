from datetime import datetime

from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import generics, status, views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.serializer.money_tracker import (
    CategorySerializer,
    MonthTrackSerializer,
    TransactionSerializer,
    WalletSerializer,
)
from app.money_tracker.models import Category, MonthTrack, Transaction
from lib.utils import Month

from .utils import parse_date

User = get_user_model()


def get_monthly_track(user, month=None):
    month = parse_date(month) or Month.from_date(datetime.now())
    if month > Month.from_date(datetime.now()):
        # If month is ahead of today's date
        return (None, None)
    return MonthTrack.objects.get_or_create(month=month, user=user)


class WalletAPIView(views.APIView):
    serializer_class = WalletSerializer
    permission_classes = (IsAuthenticated,)

    def put(self, request):
        user = self.request.user
        data = request.data

        serializer = self.serializer_class(user.wallet, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        serializer = self.serializer_class(request.user.wallet)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MonthlyTrackAPIView(views.APIView):
    serializer_class = MonthTrackSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return super().get_queryset()

    def post(self, request):
        data = request.data
        monthly_track, _ = get_monthly_track(request.user)
        if monthly_track.amount:
            return Response({"errors": ["Amount already set"]})
        try:
            # TODO: Prevent from posting more than once
            monthly_track.amount = int(data.get("amount"))
        except ValueError:
            monthly_track.amount = 0
        monthly_track.save()

        serializer = self.serializer_class(monthly_track)
        return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)


class TransactionAPIView(views.APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TransactionSerializer

    def post(self, request):
        data = request.data
        monthly_track, _ = get_monthly_track(request.user)
        data.update({"month_track": monthly_track.pk})
        serializer = self.serializer_class(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        month = request.GET.get("month")
        monthly_track, _ = get_monthly_track(request.user, month)
        if not monthly_track:
            return Response(
                {"message": "You don't have data for this month"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        transactions = Transaction.objects.filter(month_track=monthly_track, wallet=None)

        transaction_serializer = self.serializer_class(transactions, many=True)
        # "category": transactions.values_list("category__name").annotate(Sum("amount")),
        return Response({"data": transaction_serializer.data}, status=status.HTTP_200_OK)


class CategoryAPIView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CategorySerializer

    def get_queryset(self):
        user = self.request.user
        return Category.objects.filter(Q(user=user) | Q(user=None))

    def post(self, request):
        data = request.data
        data.update({"user": request.user.pk})
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"data": "All good"})
