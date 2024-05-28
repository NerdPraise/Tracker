from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from app.accounts.views import MeAPIView, RegisterAPIView
from app.invoice import views as invoice_views
from app.money_tracker.views import CategoryAPIView, MonthlyTrackAPIView, TransactionAPIView, WalletAPIView

urlpatterns = [
    # GET TOKEN
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # USER
    path("accounts/register/", RegisterAPIView.as_view(), name="user-registration"),
    path("me/", MeAPIView.as_view(), name="get_user-details"),
    # WALLET
    path("wallet/", WalletAPIView.as_view(), name="user-registration"),
    path("month-track/", MonthlyTrackAPIView.as_view(), name="monthly-track"),
    path(
        "month-track/all-transactions/",
        TransactionAPIView.as_view(),
        name="all-transactions",
    ),
    path(
        "categories/",
        CategoryAPIView.as_view(),
        name="get-total-by-categories",
    ),
    # Invoices
    path("invoices/", invoice_views.InvoiceListCreateAPIView.as_view(), name="invoice-list-create"),
    path(
        "invoice/templates/",
        invoice_views.InvoiceTemplateListCreateAPIView.as_view(),
        name="invoice-template-list-create",
    ),
    path("clients/", invoice_views.ClientAPIView.as_view(), name="client-list-create"),
    path("invoice/payment/", invoice_views.TransactionAPIView.as_view(), name="invoice-payment-list-create"),
    path("invoice/<str:uuid>/", invoice_views.InvoiceRetrieveAPIView.as_view(), name="invoice-list-create"),
]
