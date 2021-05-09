from django.contrib import admin

from certificate.models import *


@admin.register(EventCertificate)
class EventCertificateAdmin(admin.ModelAdmin):
    list_display = ['event', 'type']


@admin.register(GeneratedCertificate)
class GeneratedCertificateAdmin(admin.ModelAdmin):
    list_display = ['participant', 'event', 'user', 'timestampCreated']
    list_filter = ['generations', 'event']
