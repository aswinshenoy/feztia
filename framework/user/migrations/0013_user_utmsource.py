# Generated by Django 3.1.4 on 2021-03-26 14:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0012_auto_20210221_1725'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='UTMSource',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
    ]
