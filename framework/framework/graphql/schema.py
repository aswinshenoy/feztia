import graphene
from graphene_django.debug import DjangoDebug

from chowkidar.graphql import AuthMutations

from certificate.graphql import CertificateMutations
from event.graphql import EventMutations
from event.graphql.queries import EventQueries
from judging.graphql import JudgingMutations, JudgingQueries
from user.graphql import UserMutations, UserQueries


class Mutation(
    AuthMutations,
    EventMutations,
    JudgingMutations,
    UserMutations,
    CertificateMutations
):
    pass


class Query(
    UserQueries,
    EventQueries,
    JudgingQueries,
    graphene.ObjectType
):
    debug = graphene.Field(DjangoDebug, name='_debug')


schema = graphene.Schema(mutation=Mutation, query=Query)

__all__ = [
    'schema'
]
