# Generated by Django 3.1.4 on 2021-01-26 11:31

from django.db import migrations, models
import django.db.models.deletion
import user.fields
import user.media


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0010_auto_20210123_1324'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventEmail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.PositiveSmallIntegerField(blank=True, choices=[(0, 'Admin'), (1, 'Student'), (2, 'Academician'), (3, 'Industry'), (4, 'Judge')], null=True)),
                ('status', models.PositiveSmallIntegerField(blank=True, choices=[(0, 'All'), (1, 'Approved'), (2, 'Changes Requested')], null=True)),
                ('subject', models.CharField(max_length=255)),
                ('url', models.URLField(blank=True, null=True)),
                ('image', user.fields.MediaField(storage=user.media.EventStorage(), upload_to='')),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='event.event')),
            ],
            options={
                'verbose_name': 'Event Email',
                'verbose_name_plural': 'Event Email',
                'db_table': 'event_email',
            },
        ),
    ]
