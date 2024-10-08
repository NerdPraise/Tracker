# Generated by Django 5.0.2 on 2024-05-13 22:47

import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("invoice", "0004_alter_invoice_uuid"),
    ]

    operations = [
        migrations.AlterField(
            model_name="invoice",
            name="uuid",
            field=models.UUIDField(
                default=uuid.UUID("0aeece9a-06ea-412a-a2d8-04ef8b24ce36"),
                editable=False,
            ),
        ),
    ]
