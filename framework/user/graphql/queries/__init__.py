import graphene
from .affilation import AffiliationQueries
from .team import TeamQueries
from .user import UserQueries as UQ


class UserQueries(AffiliationQueries, TeamQueries, UQ, graphene.ObjectType):
    pass


__all__ = [
    'UserQueries'
]
