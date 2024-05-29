# Generated by Django 5.0.2 on 2024-05-28 23:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("invoice", "0023_alter_invoice_issue_date"),
    ]

    operations = [
        migrations.AlterField(
            model_name="invoice",
            name="template",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="invoice.invoicetemplate",
            ),
        ),
    ]