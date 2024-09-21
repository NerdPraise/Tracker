# Generated by Django 5.0.2 on 2024-09-14 22:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_remove_userprofile_account_name_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="userprofile",
            name="card_name",
            field=models.CharField(default="", max_length=120),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="userprofile",
            name="card_number",
            field=models.CharField(default="", max_length=120),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="userprofile",
            name="cvv",
            field=models.CharField(default="", max_length=4),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="userprofile",
            name="expiry_date",
            field=models.CharField(default="", max_length=6),
            preserve_default=False,
        ),
    ]