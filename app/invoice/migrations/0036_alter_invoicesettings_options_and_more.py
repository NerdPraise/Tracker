# Generated by Django 5.0.2 on 2024-11-25 22:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("invoice", "0035_alter_invoicesettings_account_name_and_more"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="invoicesettings",
            options={"verbose_name_plural": "Invoice Settings"},
        ),
        migrations.AlterField(
            model_name="invoicetemplate",
            name="category",
            field=models.CharField(
                choices=[("SIMPLE", "Simple"), ("CUSTOM", "Custom")],
                default="SIMPLE",
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name="invoicetemplate",
            name="image",
            field=models.ImageField(
                blank=True, max_length=255, null=True, upload_to="invoice_temp"
            ),
        ),
    ]
