# Generated by Django 5.0.2 on 2024-06-02 18:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("invoice", "0024_alter_invoice_template"),
    ]

    operations = [
        migrations.AddField(
            model_name="invoice",
            name="date_sent",
            field=models.DateField(blank=True, null=True),
        ),
    ]
