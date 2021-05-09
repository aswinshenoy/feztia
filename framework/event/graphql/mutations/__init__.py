import graphene
from .manager import *
from .participant import *


class EventMutations(ManagerMutations, ParticipantMutations, graphene.ObjectType):
    pass


__all__ = [
    'EventMutations'
]
