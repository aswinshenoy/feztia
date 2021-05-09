import graphene
from chowkidar.graphql.decorators import login_required, resolve_user
from chowkidar.graphql.exceptions import APIException
from django.db.models import Q

from user.graphql.types import PersonalProfile, UserProfile
from user.models import User


class UserQueries(graphene.ObjectType):
    me = graphene.Field(PersonalProfile)
    profile = graphene.Field(
        UserProfile,
        key=graphene.String(),
        id=graphene.ID(),
        username=graphene.String(),
        email=graphene.String(),
        phone=graphene.String()
    )

    @login_required
    def resolve_me(self, info):
        return User.objects.get(id=info.context.userID)

    @resolve_user
    def resolve_profile(self, info, key=None, id=None, username=None, email=None, phone=None):
        user = info.context.user
        if user.is_staff or user.type == 0:
            try:
                if key is not None:
                    if key.isdigit():
                        return User.objects.get(
                           Q(id=int(key)) | Q(username=key) | Q(email=key) | Q(phone=key)
                        )
                    return User.objects.get(
                       Q(username=key) | Q(email=key) | Q(phone=key)
                    )
                if id is not None:
                    return User.objects.get(id=id)
                if username is not None:
                    return User.objects.get(username=username)
                if email is not None:
                    return User.objects.get(email=email)
                if phone is not None:
                    return User.objects.get(phone=phone)
                raise APIException('Required params missing', code='BAD_REQUEST')
            except User.DoesNotExist:
                raise APIException('User does not exist', code='NOT_FOUND')


__all__ = [
    'UserQueries'
]
