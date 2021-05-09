import graphene

from user.graphql.types import AffiliationDataType
from user.models import AffiliationTitle, AffiliationBody


class AffiliationQueries(graphene.ObjectType):
    affiliationTitles = graphene.List(
        AffiliationDataType,
        keyword=graphene.String(required=False)
    )
    affiliationBodies = graphene.List(
        AffiliationDataType,
        keyword=graphene.String(required=False)
    )

    def resolve_affiliationTitles(self, info, keyword=None):
        if keyword:
            return AffiliationTitle.objects.filter(name__istartswith=keyword)
        return AffiliationTitle.objects.all()[:5]

    def resolve_affiliationBodies(self, info, keyword=None):
        if keyword:
            return AffiliationBody.objects.filter(name__istartswith=keyword)
        return AffiliationBody.objects.all()[:5]


__all__ = [
    'AffiliationQueries'
]
