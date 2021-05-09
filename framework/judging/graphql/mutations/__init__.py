import graphene
from chowkidar.graphql.decorators import resolve_user
from chowkidar.graphql.exceptions import APIException

from event.models import Participant
from judging.models import ParticipantJudgement


class JudgeParticipant(graphene.Mutation):
    class Arguments:
        participantID = graphene.ID(required=True)
        points = graphene.Int(required=True)

    Output = graphene.Boolean

    @resolve_user
    def mutate(
        self, info, participantID: graphene.ID, points: int,
    ) -> bool:
        if info.context.user and (info.context.user.type == 4 or info.context.user.type == 0):
            try:
                participant = Participant.objects.get(id=participantID)
                try:
                    p = ParticipantJudgement.objects.get(
                        participant=participant,
                        judge=info.context.user
                    )
                    p.points = points
                    p.save()
                    return True
                except ParticipantJudgement.DoesNotExist:
                    ParticipantJudgement.objects.create(
                        participant=participant,
                        judge=info.context.user,
                        points=points
                    )
                    return True
            except Participant.DoesNotExist:
                raise APIException('Invalid ParticipantID', code='INVALID_PARTICIPANT_ID')


class JudgingMutations(graphene.ObjectType):
    judgeParticipant = JudgeParticipant.Field()


__all__ = [
    'JudgingMutations'
]
