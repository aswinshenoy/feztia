import graphene
from .participant import ParticipantQueries
from .event import EventQueries as EQ
from .submission import SubmissionQueries


class EventQueries(
    EQ,
    ParticipantQueries,
    SubmissionQueries,
    graphene.ObjectType
):
    pass


__all__ = [
    'EventQueries'
]
