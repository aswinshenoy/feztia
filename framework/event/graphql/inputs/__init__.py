import graphene


class ParticipantQueryFilters(graphene.InputObjectType):
    verificationRequired = graphene.Boolean()
    type = graphene.Int()
    status = graphene.String()
    startDate = graphene.Date()
    endDate = graphene.Date()


__all__ = [
    'ParticipantQueryFilters'
]
