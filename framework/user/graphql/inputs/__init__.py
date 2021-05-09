import graphene
from chowkidar.graphql.scalars import Upload


class UserCreationInput(graphene.InputObjectType):
    name = graphene.String()
    email = graphene.String(required=True)
    password = graphene.String(required=True)
    eventID = graphene.ID()
    UTMSource = graphene.String()


class UserUpdationInput(UserCreationInput, graphene.InputObjectType):
    title = graphene.String()
    name = graphene.String()
    email = graphene.String()
    password = graphene.String()
    type = graphene.Int()
    idCard = Upload()
    phone = graphene.String()
    city = graphene.String()
    state = graphene.String()
    country = graphene.String()
    gender = graphene.String()
    affiliationBodyID = graphene.ID()
    affiliationTitleID = graphene.ID()
    UTMSource = graphene.String()


class ProfileQueryFilters(graphene.InputObjectType):
    type = graphene.String()
    startDate = graphene.Date()
    endDate = graphene.Date()


__all__ = [
    'UserCreationInput',
    'UserUpdationInput',
    'ProfileQueryFilters'
]
