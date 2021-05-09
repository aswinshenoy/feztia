import graphene
from chowkidar.graphql.decorators import resolve_user
from django.db.models import Avg, Count, Max, Min, StdDev, Variance

from event.graphql.types import Participant
from judging.models import ParticipantJudgement


class Judgements(graphene.ObjectType):
    judge = graphene.Field('user.graphql.types.user.UserProfile')
    points = graphene.Int()


class JudgedParticipant(graphene.ObjectType):
    avgPoints = graphene.Float()
    noOfJudges = graphene.Int()
    highScore = graphene.Int()
    lowScore = graphene.Int()
    stdDiv = graphene.Float()
    variance = graphene.Float()
    participant = graphene.Field(Participant)

    def resolve_participant(self, info):
        from event.models import Participant as PM
        try:
            return PM.objects.get(id=self['participant'])
        except PM.DoesNotExist:
            pass


class JudgingQueries(graphene.ObjectType):
    scores = graphene.List(
        JudgedParticipant,
        eventID=graphene.ID(required=True)
    )
    participantScores = graphene.List(
        Judgements,
        participantID=graphene.ID(required=True)
    )
    eventsToJudge = graphene.List(
        'event.graphql.types.Event'
    )

    @resolve_user
    def resolve_scores(self, info, eventID):
        if info.context.user.type == 0:
            return ParticipantJudgement.objects.filter(
                participant__approver__isnull=False, participant__event_id=eventID
            ).values('participant').order_by('participant').annotate(
                avgPoints=Avg('points'),
                highScore=Max('points'),
                lowScore=Min('points'),
                stdDiv=StdDev('points'),
                variance=Variance('points'),
                noOfJudges=Count('id')
            ).order_by('-avgPoints')

    @resolve_user
    def resolve_participantScores(self, info, participantID):
        if info.context.user.type == 0:
            return ParticipantJudgement.objects.filter(
                participant_id=participantID
            ).order_by('-timestamp')

    @resolve_user
    def resolve_eventsToJudge(self, info):
        if info.context.user.type == 4:
            from event.models import Event, EventManager
            eventIDs = EventManager.objects.filter(
                user=info.context.user, canJudgeParticipants=True
            ).values_list('event_id', flat=True)
            return Event.objects.filter(id__in=eventIDs)


__all__ = [
    'JudgingQueries'
]