# Generated by Django 3.1.4 on 2021-01-17 17:03

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import user.fields
import user.media


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0009_team'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('event', '0003_auto_20210115_2053'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='cover',
            field=user.fields.MediaField(blank=True, null=True, storage=user.media.EventStorage(), upload_to=''),
        ),
        migrations.AddField(
            model_name='event',
            name='details',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='event',
            name='isTeamEvent',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='event',
            name='maxTeamSize',
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='minTeamSize',
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='postApprovalFields',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='requireApproval',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='event',
            name='slug',
            field=models.SlugField(default='<fun'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='participant',
            name='postApprovalData',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='participant',
            name='team',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='user.team'),
        ),
        migrations.AlterField(
            model_name='participant',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
