# Generated by Django 5.0.2 on 2024-05-13 23:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("invoice", "0006_alter_invoice_uuid"),
    ]

    operations = [
        migrations.AddField(
            model_name="invoiceitems",
            name="amount",
            field=models.PositiveBigIntegerField(default=200),
            preserve_default=False,
        ),
    ]
