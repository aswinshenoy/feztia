import graphene
from chowkidar.graphql.decorators import login_required

from user.models import AffiliationTitle, AffiliationBody


class AffiliationCreationObject(graphene.ObjectType):
    id = graphene.ID()
    name = graphene.String()


class AddAffiliationTitle(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)

    Output = AffiliationCreationObject

    @login_required
    def mutate(self, info, name=None):
        return AffiliationTitle.objects.create(name=name)


class AddAffiliationBody(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)

    Output = AffiliationCreationObject

    @login_required
    def mutate(self, info, name=None):
        return AffiliationBody.objects.create(name=name)


class AffiliationMutations(graphene.ObjectType):
    addAffiliationTitle = AddAffiliationTitle.Field()
    addAffiliationBody = AddAffiliationBody.Field()


__all__ = [
    'AffiliationMutations'
]
