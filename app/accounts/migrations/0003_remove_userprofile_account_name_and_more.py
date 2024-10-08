# Generated by Django 5.0.2 on 2024-09-13 15:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0002_userprofile"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="userprofile",
            name="account_name",
        ),
        migrations.RemoveField(
            model_name="userprofile",
            name="account_number",
        ),
        migrations.AddField(
            model_name="userprofile",
            name="date_format",
            field=models.CharField(default="DD/MM/YYYY", max_length=120),
        ),
    ]
