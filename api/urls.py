from decouple import config
from django.urls import path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from app.accounts.views import ChangePasswordView, GoogleLoginAPIView, MeAPIView, RegisterAPIView
from app.invoice import views as invoice_views
from app.money_tracker.views import CategoryAPIView, MonthlyTrackAPIView, TransactionAPIView, WalletAPIView
from app.pricing.views import UserSubscriptionViewSet, UserTransactionViewSet

router = DefaultRouter()
router.register(r"invoices", invoice_views.InvoiceViewSet, basename="invoice")
router.register(r"subscriptions", UserSubscriptionViewSet)
router.register(r"transactions", UserTransactionViewSet)

schema_view = get_schema_view(
    openapi.Info(
        title="Tracker",
        default_version="v1",
        description="For my use only",
        contact=openapi.Contact(email="noreply@useinvoice.co"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # GET TOKEN
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # USER
    path("accounts/register/", RegisterAPIView.as_view(), name="user-registration"),
    path("me/", MeAPIView.as_view(), name="get_user-details"),
    path("auth/google/", GoogleLoginAPIView.as_view(), name="auth_google"),
    path("me/change_password/", ChangePasswordView.as_view(), name="auth_change_password"),
    # WALLET
    path("wallet/", WalletAPIView.as_view(), name="wallet-registration"),
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
    path(
        "invoice/templates/",
        invoice_views.InvoiceTemplateListUpdateAPIView.as_view(),
        name="invoice-template-list-create",
    ),
    path(
        "invoice/templates/<str:pk>",
        invoice_views.InvoiceTemplateListUpdateAPIView.as_view(),
        name="invoice-template-list-create",
    ),
    path(
        "invoice-settings/",
        invoice_views.InvoiceSettingsAPIView.as_view(),
        name="invoice-settings-list",
    ),
    path(
        "invoice-settings/<int:pk>",
        invoice_views.InvoiceSettingsAPIView.as_view(),
        name="invoice-settings-update",
    ),
    path("clients/", invoice_views.ClientAPIView.as_view(), name="client-list-create"),
    path("clients/<int:pk>", invoice_views.ClientAPIView.as_view(), name="client-delete"),
    path("invoice/payment/", invoice_views.TransactionAPIView.as_view(), name="invoice-payment-list-create"),
    path("invoice/<str:uuid>/", invoice_views.InvoicePreviewView.as_view(), name="invoice-retrieve"),
] + router.urls

if config("ENVIRONMENT") == "dev":
    urlpatterns += [
        # SWAGGER
        path(
            "swagger<format>/",
            schema_view.without_ui(cache_timeout=0),
            name="schema-json",
        ),
        path(
            "swagger/",
            schema_view.with_ui("swagger", cache_timeout=0),
            name="schema-swagger-ui",
        ),
        path("in", invoice_views.AS.as_view()),
    ]
