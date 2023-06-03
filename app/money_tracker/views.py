from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.db.models import Sum
from django.contrib.auth import get_user_model
from datetime import datetime

from api.serializer.money_tracker import BudgetSerializer, TransactionSerializer, WalletSerializer, UserCategorySerializer
from app.money_tracker.models import Budget, Transaction, Category
from constants.utils import Month
from .utils import parse_date
User = get_user_model()


def get_monthly_track(user, month=None):
    month = parse_date(month) or Month.from_date(datetime.now())
    if month > Month.from_date(datetime.now()):
        return []
    return Budget.objects.get_or_create(month=month, wallet=user.wallet)


class WalletAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = WalletSerializer
    permission_class = (IsAuthenticated, )

    def put(self, request):
        user = self.request.user
        user_wallet = user.wallet
        data = request.data
        data.update({'user': user.pk})

        serializer = self.serializer_class(user_wallet, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        user = self.request.user
        user_wallet = user.wallet
        serializer = self.serializer_class(user_wallet)
        return Response({'data': serializer.data}, status=status.HTTP_200_OK)


class MonthlyTrackAPIView(views.APIView):
    serializer_class = BudgetSerializer
    permission_class = (IsAuthenticated, )

    def post(self, request):
        data = request.data
        wallet = self.request.user.wallet.pk
        data.update({"wallet": wallet})
        serializer = self.serializer_class(data=data)
        amount = data['month_income']

        if serializer.is_valid():
            track = serializer.save()
            Transaction.objects.create(
                source='credit', description="Monthly income", amount=amount, monthly_track=track)

            return Response({'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        user = self.request.user
        print(user.wallet, "sdksdk")
        if month := self.request.GET.get('month'):
            if monthly_track := get_monthly_track(user, month):
                serializer = self.serializer_class(monthly_track)
            else:
                return Response({'message': 'There is no track for that month'}, status=status.HTTP_404_NOT_FOUND)
        else:
            tracks = Budget.objects.filter(wallet=user.wallet)
            serializer = self.serializer_class(tracks, many=True)

        return Response({'data': serializer.data}, status=status.HTTP_200_OK)

    def put(self, request):
        pass


class UserCategoryView(generics.CreateAPIView, generics.RetrieveAPIView):
    serializer_class = UserCategorySerializer
    permission_class = (IsAuthenticated, )

    def post(self, request):
        data = request.data
        user = request.user
        data = {**data, 'user': user.pk,
                "monthly_track": get_monthly_track(user)[0].pk
                }
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)

    def get(self, request):
        user_categories = request.user.usercategory_set.all()
        serializer = self.serializer_class(user_categories, many=True)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)


class TransactionAPIView(views.APIView):
    serializer_class = TransactionSerializer
    permission_class = (IsAuthenticated, )

    def post(self, request):
        data = request.data
        month = get_monthly_track(user=self.request.user)
        if not month.exists():
            return Response({'message': 'Something is wrong, month not created'}, status=status.HTTP_400_BAD_REQUEST)
        data.update({'monthly_track': month[0].pk})
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        month = self.request.GET.get('month')
        monthly_track, _ = get_monthly_track(request.user, month)
        if not monthly_track:
            return Response({'message': 'You don\'t have data for this month'}, status=status.HTTP_400_BAD_REQUEST)
        transactions = Transaction.objects.filter(monthly_track=monthly_track)

        transaction_serializer = self.serializer_class(transactions, many=True)
        data = BudgetSerializer(monthly_track).data
        data.update({
            'total_spent': monthly_track.get_total_transaction_amount(),
            'transactions': transaction_serializer.data,
            'category': transactions.values_list('category__name').annotate(Sum('amount'))
        })

        return Response({'data': data}, status=status.HTTP_200_OK)


class CategoryByTotal(views.APIView):
    permission_class = (IsAuthenticated, )

    def get(self, request):
        month = self.request.GET.get('month', None)
        current_month = get_monthly_track(self.request.user, month)
        if current_month.exists():
            categories = Transaction.objects.filter(
                monthly_track=current_month[0]).values_list('category__name').annotate(Sum('amount'))

            return Response({'data': "transactions"}, status=status.HTTP_200_OK)
        return Response({'errors': "No data"}, status=status.HTTP_400_BAD_REQUEST)
