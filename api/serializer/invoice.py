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
    status = serializers.CharField(read_only=True)
    total_due = serializers.IntegerField(read_only=True)

    class Meta:
        model = Payment
        fields = ("status", "total_due")


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
    payment = PaymentSerializer(read_only=True)
    client = ClientSerializer()
    invoice_items = InvoiceItemsSerializer(many=True, allow_empty=False, required=True)
    user = serializers.CharField(read_only=True)
    amount = serializers.SerializerMethodField()
    template = InvoiceTemplateSerializer(required=False)

    class Meta:
        model = Invoice
        exclude = ("created_at", "updated_at")

    def create(self, validated):
        user = self.context["request"].user
        client = validated.pop("client")
        template_data = validated.pop("template")
        invoice = Invoice.objects.create(**validated, user=user)
        invoice.client = Client.objects.get(**client)
        existing_template, _ = InvoiceTemplate.objects.get_or_create(**template_data, defaults={"user": user})
        invoice.template = existing_template
        invoice.save()
        return invoice

    def update(self, instance, validated):
        user = self.context["request"].user
        client = validated.pop("client")
        if instance.client.id != client.get("id"):
            instance.client = Client.objects.get(**client)

        # Update template if necessary
        template_data = validated.pop("template")
        settings = template_data.get("settings")
        if settings["theme"] != instance.template.settings.get("theme"):
            template, _ = InvoiceTemplate.objects.update_or_create(
                user=user,
                invoice=instance,
                defaults={"settings": settings, "user": user},
            )
            instance.template = template

        instance = super().update(instance, validated)
        instance.save()
        return instance

    def get_amount(self, instance):
        return reduce(lambda a, b: a + (b["quantity"]) * b["unit_price"], instance.invoice_items, 0)
