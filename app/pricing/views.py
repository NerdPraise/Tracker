from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from api.serializer.pricing import (UserSubscriptionSerializer,
                                    UserTransactionSerializer)

from .models import UserSubscription, UserTransaction


class UserSubscriptionViewSet(viewsets.ModelViewSet):
    queryset = UserSubscription.objects.all()
    serializer_class = UserSubscriptionSerializer


class UserTransactionViewSet(viewsets.ModelViewSet):
    queryset = UserTransaction.objects.all()
    serializer_class = UserTransactionSerializer

    @action(detail=False)
    def get_user_transaction(self, request):
        user = request.user
        txs = UserTransaction.objects.filter(subscription__user=user).order_by("-date")
        serializer = self.serializer_class(txs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def update_user_payment(self, request):
        data = request.data
        tx = UserTransaction.objects.create(
            reference=data["reference"],
            subscription=request.user.usersubscription,
            date=timezone.now(),
            amount=data["amount"],
            status=data["status"],
        )
        if data["status"] == "success":
            # tx.subscription. TODO: Update subscription by price
            serializer = self.serializer_class(tx)
            return Response(serializer.data, status=200)
        return Response(status=404)


# TODO: Restrict actions based on plan
