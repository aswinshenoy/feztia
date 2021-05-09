import graphene
from .account import *
from .affiliation import *
from .team import TeamMutations


class UserMutations(AccountMutations, AffiliationMutations, TeamMutations, graphene.ObjectType):
    pass


__all__ = [
    'UserMutations'
]
