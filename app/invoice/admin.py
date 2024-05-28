from django.contrib import admin

from .models import Client, Invoice, InvoiceTemplate, Payment, Transaction

admin.site.register(Transaction)


# class InlineInvoiceItemsAdmin(admin.TabularInline):
#     model = InvoiceItems
#     extra = 1


class InvoiceAdmin(admin.ModelAdmin):
    # inlines = (InlineInvoiceItemsAdmin,)
    list_display = ["name", "narration", "issue_date", "due_date", "status"]
    search_fields = ["name"]

    @admin.display
    def narration(self, obj):
        return f"ID={obj.id} {obj.user.email} invoice to client={obj.client_id}"


class ClientAdmin(admin.ModelAdmin):
    list_display = ["name", "email"]


class InvoiceTemplateAdmin(admin.ModelAdmin):
    list_display = ("uuid", "category", "user")


class InlineTransactionsAdmin(admin.TabularInline):
    model = Transaction
    extra = 1


class PaymentAdmin(admin.ModelAdmin):
    inlines = (InlineTransactionsAdmin,)
    search_fields = ["transaction__mode", "transaction__payment_date"]


admin.site.register(Payment, PaymentAdmin)
admin.site.register(Client, ClientAdmin)
admin.site.register(Invoice, InvoiceAdmin)
admin.site.register(InvoiceTemplate, InvoiceTemplateAdmin)
