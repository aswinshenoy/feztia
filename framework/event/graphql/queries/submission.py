import graphene
from chowkidar.graphql.decorators import login_required

from event.graphql.types import GalleryItem, Participant, Event
from framework.graphql.types import BaseQuery
from framework.utils.cursor_pagination import CursorPaginator


class ParticipantGallery(graphene.ObjectType):
    participant = graphene.Field(Participant)
    submissions = graphene.List(GalleryItem)
    event = graphene.Field(Event)

    def resolve_participant(self, info):
        return self

    def resolve_submissions(self, info):
        from event.models import Submission
        return Submission.objects.filter(
           isPublic=True, participant=self
        )

    def resolve_event(self, info):
        return self.event


class GalleryQuery(BaseQuery, graphene.ObjectType):
    posts = graphene.List(ParticipantGallery)


class SubmissionQueries(graphene.ObjectType):
    gallery = graphene.Field(
        GalleryQuery,
        eventID=graphene.ID(required=False),
        count=graphene.Int(description='Number of submissions to be retrieved'),
        after=graphene.String(),
    )

    @login_required
    def resolve_gallery(self, info, eventID=None, count=10, after=None):
        from event.models import Participant, Submission
        PIDs = Submission.objects.filter(
            isPublic=True, participant__approver__isnull=False,
            event__enableGallery=True
        )
        if eventID is not None:
             PIDs = PIDs.filter(event_id=eventID)

        PIDs = PIDs.order_by('-timestamp').values_list('participant_id', flat=True)

        qs = Participant.objects.filter(id__in=PIDs)

        paginator = CursorPaginator(qs, ordering=('-timestampApproved',))
        page = paginator.page(first=count, after=after)
        return GalleryQuery(
            posts=page,
            totalCount=qs.count(),
            hasNext=page.has_next,
            lastCursor=paginator.cursor(page[-1]) if page else None
        )


__all__ = [
    'SubmissionQueries'
]
