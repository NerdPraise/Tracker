from django.contrib.auth import get_user
from functools import reduce
from rest_framework import serializers

from app.invoice.models import Client, Invoice, InvoiceTemplate, Payment, Transaction


class ClientSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()

    class Meta:
        model = Client
        fields = ("id", "name", "email")


class InvoiceItemsSerializer(serializers.Serializer):
    description = serializers.CharField()
    quantity = serializers.IntegerField()
    unit_price = serializers.IntegerField()
    amount = serializers.SerializerMethodField()

    def get_amount(self, obj):
        return obj["quantity"] * obj["unit_price"]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"


class TransactionSerializer(serializers.ModelSerializer):
    currency = serializers.SerializerMethodField()
    payment = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Payment.objects)

    class Meta:
        model = Transaction
        fields = "__all__"

    def validate(self, data):
        data = super().validate(data)
        total_due = data["payment"].total_due
        amount = data["amount"]

        if not total_due or (total_due - amount) < 0:
            raise serializers.ValidationError("You can't pay more than what is owed")
        return data

    def get_currency(self, obj):
        return obj.payment.invoice.currency


class InvoiceTemplateSerializer(serializers.ModelSerializer):
    settings = serializers.JSONField()
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = InvoiceTemplate
        fields = "__all__"


class InvoiceSerializer(serializers.ModelSerializer):
    payment = serializers.PrimaryKeyRelatedField(read_only=True, source="payment.total_due")
    client = ClientSerializer()
    invoice_items = InvoiceItemsSerializer(many=True, allow_empty=False, required=True)
    status = serializers.CharField(read_only=True)
    user = serializers.CharField(read_only=True)
    amount = serializers.SerializerMethodField()
    template = InvoiceTemplateSerializer(required=False)

    class Meta:
        model = Invoice
        exclude = ("created_at", "updated_at")

    def update(self, instance, validated):
        user = get_user(self.context["request"])
        # client, invoice_items, template

        client = validated.pop("client")
        if instance.client.id != client.get("id"):
            instance.client = Client.objects.get(**client)

        # # # Update template if necessary
        template_data = validated.pop("template")
        # template_html = template_data.get("settings", {}).get("html")

        # if instance.template.id != template_data.get("id"):
        #     instance.template_id = template_data.get("id")
        # # elif instance.template.settings.get("html") != template_html: # TODO: Figure out how to compare html devoid of the extra mustache'd data
        # #     new_template = InvoiceTemplate.objects.create(user=user, **template_data)
        # #     instance.template = new_template
        instance = super().update(instance, validated)
        instance.save()
        return instance

    def get_amount(self, instance):
        return reduce(lambda a, b: a + (b["quantity"]) * b["unit_price"], instance.invoice_items, 0)
