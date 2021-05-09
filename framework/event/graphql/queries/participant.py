import graphene
from chowkidar.graphql.decorators import login_required
from chowkidar.graphql.exceptions import APIException
from django.db.models import Q

from event.graphql.inputs import ParticipantQueryFilters
from event.graphql.types import Participant as PType
from event.models import Participant, EventManager
from framework.graphql.types import BaseQuery
from framework.utils.cursor_pagination import CursorPaginator


class ParticipantsQuery(BaseQuery, graphene.ObjectType):
    participants = graphene.List(PType)


class ParticipantQueries(graphene.ObjectType):
    myEventProfile = graphene.Field(
        PType,
        eventID=graphene.ID(required=True)
    )
    myEvents = graphene.List(
        PType,
        parentID=graphene.ID()
    )
    participants = graphene.Field(
        ParticipantsQuery,
        eventID=graphene.ID(),
        count=graphene.Int(description='Number of participants to be retrieved'),
        after=graphene.String(),
        search=graphene.String(),
        publicListing=graphene.Boolean(),
        eliminatorListing=graphene.Boolean(),
        judgeListing=graphene.Boolean(),
        filters=graphene.Argument(ParticipantQueryFilters)
    )

    @login_required
    def resolve_myEventProfile(self, info, eventID):
        try:
            return Participant.objects.get(
                Q(Q(user_id=info.context.userID) | Q(team__members=info.context.userID)) &
                Q(event_id=eventID)
            )
        except Participant.MultipleObjectsReturned:
            return Participant.objects.filter(
                Q(Q(user_id=info.context.userID) | Q(team__members=info.context.userID)) &
                Q(event_id=eventID)
            ).first()
        except Participant.DoesNotExist:
            raise APIException('You are not a participant in this event', code='NOT_PARTICIPANT')

    @login_required
    def resolve_myEvents(self, info, parentID=None):
        try:
            return Participant.objects.filter(
                Q(Q(user_id=info.context.userID) | Q(team__members=info.context.userID)) &
                Q(event__parent_id=parentID)
            )
        except Participant.DoesNotExist:
            raise APIException('You are not a participant in this event', code='NOT_PARTICIPANT')

    @login_required
    def resolve_participants(
        self, info,
        eventID,
        count: int = 25,
        after: str = None,
        search: str = None,
        publicListing=False,
        eliminatorListing=False,
        judgeListing=False,
        filters: ParticipantQueryFilters = None
    ):
        if publicListing:
            qs = Participant.objects.filter(event_id=eventID, approver__isnull=False)
        elif eliminatorListing:
            if EventManager.objects.filter(
                user_id=info.context.userID, event_id=eventID, canEliminateParticipants=True
            ).exists():
                qs = Participant.objects.filter(
                    event_id=eventID,
                    approver__isnull=False,
                    eliminator__isnull=True
                )
            else:
                raise APIException('Not allowed', code='FORBIDDEN')
        elif judgeListing:
            if EventManager.objects.filter(
                user_id=info.context.userID, event_id=eventID, canJudgeParticipants=True
            ).exists():
                qs = Participant.objects.filter(
                    event_id=eventID,
                    approver__isnull=False,
                    eliminator__isnull=True
                )
            else:
                raise APIException('Not allowed', code='FORBIDDEN')
        elif EventManager.objects.filter(
            user_id=info.context.userID, event_id=eventID, canReviewRegistrations=True
        ).exists():
            qs = Participant.objects.filter(event_id=eventID)
        else:
            raise APIException('You are not allowed to view registrations from this event', code='FORBIDDEN')
        if filters is not None:
            if filters.type is not None:
                qs = qs.filter(user__type=filters.type)
            if filters.startDate is not None:
                qs = qs.filter(timestampRegistered__gte=filters.startDate)
            if filters.endDate is not None:
                qs = qs.filter(timestampRegistered__lte=filters.endDate)
            if filters.verificationRequired:
                qs = qs.exclude(
                    Q(
                        Q(user__isnull=False) &
                        Q(
                            Q(approver__isnull=False) |
                            Q(user__affiliationTitle__isnull=True) |
                            Q(user__affiliationBody__isnull=True) |
                            Q(user__country__isnull=True) |
                            Q(user__type__isnull=True)
                            # Q(
                            #     Q(user__phone__isnull=True) &
                            #     Q(user__country__exact='India')
                            # )
                            # Q(user__IDCard='') |
                            # Q(user__IDCard__exact=None)
                        )
                    ) |
                    Q(
                        Q(team__isnull=False) & Q(approver__isnull=False)
                    )
                )
            if filters.status:
                if filters.status == 'APPROVED':
                    qs = qs.filter(timestampApproved__isnull=False, approver__isnull=False)
                elif filters.status == 'NO_ID':
                    qs = qs.filter(user__IDCard='')
                elif filters.status == 'EMAIL_UNVERIFIED':
                    qs = qs.filter(user__isEmailVerified=False)
                elif filters.status == 'PHONE_UNVERIFIED':
                    qs = qs.filter(user__isPhoneVerified=False)
        if search is not None:
            qs = qs.filter(
                Q(user__isnull=True) |
                Q(user__username__istartswith=search) |
                Q(user__name__istartswith=search) |
                Q(user__phone__contains=search) |
                Q(user__email__exact=search)
            )
        qs = qs.prefetch_related('user')
        paginator = CursorPaginator(qs, ordering=('-timestampRegistered',))
        page = paginator.page(first=count, after=after)
        return ParticipantsQuery(
            participants=page,
            totalCount=qs.count(),
            hasNext=page.has_next,
            lastCursor=paginator.cursor(page[-1]) if page else None
        )


__all__ = [
    'ParticipantQueries'
]
