import graphene
from django.utils.timezone import get_default_timezone
from graphql.error import GraphQLError
from datetime import datetime, date


class ISOTimestamp(graphene.DateTime):

    @staticmethod
    def serialize(dt):
        if dt:
            if not isinstance(dt, (datetime, date)):
                raise GraphQLError(f"DateTime cannot represent value: {repr(dt)}")
            to_tz = get_default_timezone()
            return dt.astimezone(to_tz).isoformat()


__all__ = [
    'ISOTimestamp'
]
