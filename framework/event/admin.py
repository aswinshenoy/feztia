from django.contrib import admin
from .models import *


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    search_fields = ['name', 'slug']
    autocomplete_fields = ['parent']


@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    search_fields = [
        'user__username', 'user__email', 'team__name', 'event__name'
    ]
    autocomplete_fields = ['user', 'event', 'team', 'approver']


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ['participant', 'event']
    search_fields = [
        'participant__user__username', 'participant__user__email',
        'participant__team__name', 'event__name'
    ]


@admin.register(EventManager)
class EventManagerAdmin(admin.ModelAdmin):
    list_display = ['user', 'event']
    search_fields = ['user__username', 'event__name']
    autocomplete_fields = ['user', 'event']


@admin.register(EventEmail)
class EventEmailAdmin(admin.ModelAdmin):
    pass

