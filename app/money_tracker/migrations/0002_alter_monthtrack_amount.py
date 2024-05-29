# Generated by Django 5.0.2 on 2024-03-06 01:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("money_tracker", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="monthtrack",
            name="amount",
            field=models.BigIntegerField(
                default=0, help_text="Amount of money held into the month"
            ),
        ),
    ]