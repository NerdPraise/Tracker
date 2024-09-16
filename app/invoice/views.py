import datetime

from django.conf import settings
from django.db.models import Q
from rest_framework import generics, permissions, views, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from api.serializer.invoice import (
    ClientSerializer,
    InvoiceSerializer,
    InvoiceSettingsSerializer,
    InvoiceTemplateSerializer,
    TransactionSerializer,
)
from lib.tasks import send_mail_async

from .models import Client, Invoice, InvoiceSettings, InvoiceTemplate, Transaction


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
        client = invoice.client.email
        user = invoice.user

        email_kwargs = {
            "subject": f"{user.get_full_name()} sent an invoice",
            "template": "email/invoice_to_client.html",
            "message_context": {
                "username": user.username,
                "host": host,
                "client_email": client,
                "uuid": uuid,
            },
            "to": [client],
        }
        send_mail_async.apply_async(kwargs=email_kwargs, queue="high_priority")
        invoice.date_sent = datetime.date.today()
        invoice.save()
        serializer = self.serializer_class(invoice)
        return Response(serializer.data, status=200)


class InvoicePreviewView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = InvoiceSerializer
    lookup_field = "uuid"
    lookup_url_kwarg = "uuid"
    queryset = Invoice.objects.all()


class ClientAPIView(generics.ListCreateAPIView, generics.DestroyAPIView):
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

    def get(self, request):
        uuid = request.GET.get("invoice")
        try:
            invoice = Invoice.objects.get(uuid=uuid)
        except Invoice.DoesNotExist:
            return Response("Invoice doesn't exist", status=400)
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
        payment.total_due = invoice.get_amount()
        payment.save()
        payment.transactions.all().delete()
        return Response(status=204)


# TODO: CREATE upon user signup
class InvoiceSettingsAPIView(generics.ListAPIView, generics.UpdateAPIView):
    serializer_class = InvoiceSettingsSerializer

    def get_queryset(self):
        return InvoiceSettings.objects.filter(user=self.request.user)
