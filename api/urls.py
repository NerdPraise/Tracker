from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.urls import path

from app.accounts.views import MeAPIView, RegisterAPIView
from app.money_tracker.views import (
    CategoryByTotal, MonthlyTrackAPIView, WalletAPIView, TransactionAPIView, UserCategoryView)


urlpatterns = [
    # GET TOKEN
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # USER
    path('accounts/register/', RegisterAPIView.as_view(), name='user-registration'),
    path('me/', MeAPIView.as_view(), name='get_user-details'),

    # WALLET
    path('wallet/', WalletAPIView.as_view(), name='user-registration'),
    path('wallet/track/', MonthlyTrackAPIView.as_view(), name='monthly-track'),
    path('categories/', UserCategoryView.as_view(), name='category'),
    path('wallet/track-transact/', TransactionAPIView.as_view(),
         name='build-transactions'),
    path('wallet/report/categories/', CategoryByTotal.as_view(),
         name="get-total-by-categories")
]
