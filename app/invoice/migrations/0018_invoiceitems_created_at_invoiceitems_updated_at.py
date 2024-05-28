# Generated by Django 5.0.2 on 2024-05-20 01:52

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("invoice", "0017_alter_invoicetemplate_image"),
    ]

    operations = [
        migrations.AddField(
            model_name="invoiceitems",
            name="created_at",
            field=models.DateTimeField(
                auto_now_add=True, default=django.utils.timezone.now
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="invoiceitems",
            name="updated_at",
            field=models.DateTimeField(auto_now=True),
        ),
    ]
