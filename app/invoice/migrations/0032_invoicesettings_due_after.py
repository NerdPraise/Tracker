# Generated by Django 5.0.2 on 2024-09-13 16:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("invoice", "0031_alter_client_email_client_unique_user_clients"),
    ]

    operations = [
        migrations.AddField(
            model_name="invoicesettings",
            name="due_after",
            field=models.PositiveSmallIntegerField(default=10),
        ),
    ]