import graphene


class BaseQuery(graphene.ObjectType):
    hasNext = graphene.Boolean()
    totalCount = graphene.Int()
    lastCursor = graphene.String()


__all__ = [
    'BaseQuery'
]
