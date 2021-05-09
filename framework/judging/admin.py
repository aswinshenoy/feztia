from django.contrib import admin
from judging.models import ParticipantJudgement


@admin.register(ParticipantJudgement)
class ParticipantJudgementAdmin(admin.ModelAdmin):
    search_fields = (
        'participant__user__username', 'participant__user__email',
        'judge__username', 'judge__email', 'participant__event__name'
    )
    autocomplete_fields = ['participant', 'judge']
    list_display = ('participant', 'judge', 'points')

