# Generated by Django 5.0.2 on 2024-09-07 20:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("invoice", "0028_alter_invoice_issue_date"),
    ]

    operations = [
        migrations.AlterField(
            model_name="invoice",
            name="issue_date",
            field=models.DateField(blank=True, null=True),
        ),
    ]
