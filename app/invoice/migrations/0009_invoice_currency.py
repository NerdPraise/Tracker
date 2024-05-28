# Generated by Django 5.0.2 on 2024-05-13 23:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("invoice", "0008_alter_invoiceitems_amount"),
    ]

    operations = [
        migrations.AddField(
            model_name="invoice",
            name="currency",
            field=models.CharField(
                choices=[
                    ("USD", "Usd"),
                    ("NGN", "Ngn"),
                    ("EUR", "Eur"),
                    ("GBP", "Gbp"),
                ],
                default="USD",
                max_length=20,
            ),
        ),
    ]
