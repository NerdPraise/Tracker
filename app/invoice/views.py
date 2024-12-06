import datetime
import uuid

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Q
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics, permissions, views, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from api.serializer.accounts import UserProfileSerializer
from api.serializer.invoice import (
    ClientSerializer,
    InvoiceSerializer,
    InvoiceSettingsSerializer,
    InvoiceTemplateSerializer,
    TransactionSerializer,
)
from lib.tasks import send_mail_async
from lib.utils import send_mail_user

from .models import Client, Invoice, InvoiceMessageCode, InvoiceSettings, InvoiceTemplate, Transaction

User = get_user_model()


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "uuid"
    lookup_url_kwarg = "uuid"

    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user)

    @action(detail=False)
    def send_invoice_to_client(self, request):
        host = settings.FE_URL
        uuid = request.query_params.get("invoice")
        invoice = self.get_queryset().filter(uuid=uuid)
        if not invoice.exists():
            return Response(status=404)

        invoice = invoice[0]
        client = invoice.client
        user = invoice.user

        message_code, _ = InvoiceMessageCode.objects.get_or_create(invoice=invoice)

        email_kwargs = {
            "subject": f"Your Invoice from {user.get_full_name()} is ready",
            "template": "email/invoice_to_client.html",
            "message_context": {
                "username": user.get_full_name(),
                "host": host,
                "client_name": client.name,
                "client_email": client.email,
                "invoice_code": message_code.code,
            },
            "to": [client.email],
        }
        send_mail_async.apply_async(kwargs=email_kwargs, queue="high_priority")
        invoice.date_sent = datetime.date.today()
        invoice.save()
        serializer = self.serializer_class(invoice)
        return Response(serializer.data, status=200)

    @action(detail=False, permission_classes=[permissions.AllowAny])
    def get_data_for_invoice(self, request):
        code = request.query_params.get("invoice")
        imc = InvoiceMessageCode.objects.filter(code=code)
        if not imc.exists():
            return Response("Invoice doesn't exist", status=400)
        imc = imc[0]
        user = imc.invoice.user
        settings = InvoiceSettings.objects.filter(user=user)[0]

        return Response(
            {
                "invoice": self.serializer_class(imc.invoice).data,
                "invoice_settings": InvoiceSettingsSerializer(settings).data,
                "user": UserProfileSerializer(user.userprofile).data,
            }
        )

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "id",
                in_=openapi.IN_PATH,
                description="client id",
                type=openapi.TYPE_NUMBER,
                format=openapi.FORMAT_INT32,
            )
        ],
        responses={200: TransactionSerializer(many=True)},
    )
    @action(detail=False, url_path="filter_invoice_by_client/(?P<id>[^/.]+)")
    def filter_invoice_by_client(self, request, id):
        qs = self.get_queryset().filter(client__id=id)

        if not qs.exists():
            return Response("Unavailable data", status=400)

        total = sum(instance.amount for instance in qs)
        pending = qs.filter(payment__status="pending")
        paid = qs.filter(payment__status="paid")

        response_data = {
            "total": total,
            "paid": sum(instance.amount for instance in paid),
            "pending": sum(instance.amount for instance in pending),
            "invoices": self.serializer_class(qs, many=True).data,
        }

        return Response(response_data)


class AS(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user = User.objects.get(email="praiseajayi2@gmail.com")
        host = settings.FE_URL
        client = user.clients.first()

        email_kwargs = {
            "subject": f"Your Invoice from {user.get_full_name()} is ready",
            "template": "email/invoice_to_client.html",
            "message_context": {
                "username": user.get_full_name(),
                "host": host,
                "client_name": client.name,
                "client_email": client.email,
                "invoice_code": "sssssss",
            },
            "to": [client.email],
        }
        send_mail_user(**email_kwargs)
        return Response(200)


class InvoicePreviewView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = InvoiceSerializer
    lookup_field = "uuid"
    lookup_url_kwarg = "uuid"
    queryset = Invoice.objects.all()


class ClientAPIView(generics.ListCreateAPIView, generics.DestroyAPIView, generics.UpdateAPIView):
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Client.objects.filter(user=self.request.user)


class InvoiceTemplateListUpdateAPIView(generics.ListAPIView, generics.UpdateAPIView):
    serializer_class = InvoiceTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return InvoiceTemplate.objects.filter(Q(user=self.request.user) | Q(user__isnull=True))


class TransactionAPIView(views.APIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Transaction.objects.all()

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "invoice",
                in_=openapi.IN_QUERY,
                description="invoice uuid",
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_UUID,
            )
        ],
        responses={200: TransactionSerializer(many=True)},
    )
    def get(self, request):
        uuid = request.GET.get("invoice")
        try:
            invoice = Invoice.objects.get(uuid=uuid)
        except Invoice.DoesNotExist:
            return Response({"message": "Invoice doesn't exist"}, status=400)
        transactions = self.queryset.filter(payment__invoice=invoice)
        serializer = self.serializer_class(transactions, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.POST.copy()
        uuid = data.get("invoice", "")
        dict_data = data.dict()

        try:
            invoice = Invoice.objects.get(uuid=uuid)
            payment = invoice.payment
            dict_data.update({"payment": payment.id})
        except Invoice.DoesNotExist:
            return Response("Invoice doesn't exist", status=400)

        serializer = self.serializer_class(data=dict_data)
        serializer.is_valid(raise_exception=True)
        transaction = serializer.save()
        # Update payment total_due
        payment.total_due -= transaction.amount
        payment.save()
        return Response(serializer.data, status=201)

    def delete(self, request):
        uuid = request.query_params.get("invoice")
        try:
            invoice = Invoice.objects.get(uuid=uuid)
        except Invoice.DoesNotExist:
            return Response("Invoice doesn't exist", status=400)

        payment = invoice.payment
        invoice.date_sent = None
        payment.total_due = invoice.amount
        payment.save()
        payment.transactions.all().delete()
        invoice.save()
        return Response(status=204)


# TODO: CREATE upon user signup
class InvoiceSettingsAPIView(generics.ListAPIView, generics.UpdateAPIView):
    serializer_class = InvoiceSettingsSerializer

    def get_queryset(self):
        return InvoiceSettings.objects.filter(user=self.request.user)


class InvoiceCustomTemplateAPIView(views.APIView):
    serializer_class = InvoiceTemplateSerializer
    queryset = InvoiceTemplate.objects.all()

    def get(self, request):
        user = request.user
        template_uuid = request.query_params.get("template")

        if not template_uuid:
            return Response({"error": "Template UUID is required."}, status=400)

        try:
            to_be_cloned_template = InvoiceTemplate.objects.get(uuid=template_uuid)
        except InvoiceTemplate.DoesNotExist:
            return Response({"error": "Template not found."}, status=400)

        to_be_cloned_template.pk = None
        to_be_cloned_template._state.adding = True
        to_be_cloned_template.user = user
        to_be_cloned_template.uuid = uuid.uuid4()
        to_be_cloned_template.save()

        serializer = self.serializer_class(to_be_cloned_template, context={"request": request})
        return Response(serializer.data, status=200)

    def post(self, request):
        user = request.user

        initial = {
            "settings": {"theme": {"background": "#fff", "bgImg": None}, "widgets": []},
            "user": user,
            "category": InvoiceTemplate.CategoryChoices.CUSTOM,
        }
        template = InvoiceTemplate.objects.create(**initial)
        return Response(self.serializer_class(template).data, status=200)

    def put(self, request):
        template = request.data.get("template")
        try:
            from_db_temp = InvoiceTemplate.objects.filter(uuid=template["uuid"])[0]
        except (AttributeError, IndexError):
            return Response({"template": "Template doesn't exist"})
        from_db_temp.settings = template.get("settings", from_db_temp.settings)
        if template.get("custom_image"):
            from_db_temp.custom_image = template.get("custom_image").encode("utf8")

        from_db_temp.save()

        return Response(self.serializer_class(from_db_temp).data, status=200)
