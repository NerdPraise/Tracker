from functools import reduce

from rest_framework import serializers

from app.invoice.models import Client, Invoice, InvoiceSettings, InvoiceTemplate, Payment, Transaction


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}

    def create(self, validated_data):
        return super().create({**validated_data, "user": self.context["request"].user})


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
    invoice = serializers.SlugRelatedField(queryset=Invoice.objects, slug_field="uuid", write_only=True)

    class Meta:
        model = InvoiceTemplate
        fields = "__all__"

    def update(self, instance, validated):
        user = self.context["request"].user
        invoice = validated["invoice"]
        template, created = InvoiceTemplate.objects.update_or_create(
            user=user,
            invoice=validated["invoice"],
            defaults={"settings": validated["settings"], "user": user},
        )

        if created:
            invoice.template = template
            invoice.save()

        return template


class InvoiceSerializer(serializers.ModelSerializer):
    payment = PaymentSerializer(read_only=True)
    client = serializers.PrimaryKeyRelatedField(queryset=Client.objects, required=True)
    template = serializers.PrimaryKeyRelatedField(queryset=InvoiceTemplate.objects)
    invoice_items = InvoiceItemsSerializer(many=True, allow_empty=False, required=True)
    user = serializers.CharField(read_only=True)
    amount = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        exclude = ("updated_at",)

    def create(self, validated):
        return Invoice.objects.create(**validated, user=self.context["request"].user)

    def get_amount(self, instance):
        return reduce(lambda a, b: a + (b["quantity"]) * b["unit_price"], instance.invoice_items, 0)

    def to_representation(self, instance):
        invoice = super().to_representation(instance)
        client = invoice.pop("client")
        template = invoice.pop("template")
        client_serializer = ClientSerializer(Client.objects.get(pk=client))
        template_serializer = InvoiceTemplateSerializer(InvoiceTemplate.objects.get(pk=template))
        return {**invoice, "client": client_serializer.data, "template": template_serializer.data}


class InvoiceSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceSettings
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}

    def update(self, instance, validated_data):
        user = self.context["request"].user
        return super().update(instance, {**validated_data, "user": user})
