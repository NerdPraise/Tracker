from django.db.models import Q, Sum
from rest_framework import generics, permissions, views
from rest_framework.response import Response

from api.serializer.invoice import ClientSerializer, InvoiceSerializer, InvoiceTemplateSerializer, TransactionSerializer

from .models import Client, Invoice, InvoiceTemplate, Transaction


class InvoiceListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user)


class InvoiceRetrieveAPIView(generics.RetrieveAPIView, generics.UpdateAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "uuid"
    lookup_url_kwarg = "uuid"

    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user)


class ClientAPIView(generics.ListCreateAPIView):
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Client.objects.filter(user=self.request.user)


class InvoiceTemplateListCreateAPIView(generics.ListCreateAPIView):
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
