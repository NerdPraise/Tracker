# Generated by Django 5.0.2 on 2024-09-06 21:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("invoice", "0026_client_created_at_client_updated_at"),
    ]

    operations = [
        migrations.AlterField(
            model_name="client",
            name="email",
            field=models.EmailField(max_length=254, unique=True),
        ),
    ]
