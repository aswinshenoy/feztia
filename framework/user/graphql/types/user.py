import graphene
from django.utils import timezone


class AffiliationDataType(graphene.ObjectType):
    id = graphene.ID()
    name = graphene.String()


class UserProfile(graphene.ObjectType):
    id = graphene.ID()
    username = graphene.String()
    title = graphene.String()
    name = graphene.String()
    email = graphene.String()
    phone = graphene.String()
    city = graphene.String()
    state = graphene.String()
    country = graphene.String()
    gender = graphene.String()
    type = graphene.Int()
    affiliationBody = graphene.Field(AffiliationDataType)
    affiliationTitle = graphene.Field(AffiliationDataType)
    dateJoined = graphene.String()
    isPhoneVerified = graphene.Boolean()
    isEmailVerified = graphene.Boolean()
    IDCardURL = graphene.String()
    isIDVerified = graphene.Boolean()
    isProfileComplete = graphene.Boolean()
    registrations = graphene.List('event.graphql.types.Participant')
    UTMSource = graphene.String()

    def resolve_dateJoined(self, info):
        to_tz = timezone.get_default_timezone()
        return self.date_joined.astimezone(to_tz).isoformat()

    def resolve_IDCardURL(self, info):
        if self and self.IDCard and hasattr(self.IDCard, 'url') and self.IDCard.url:
            return self.IDCard.url

    def resolve_isProfileComplete(self, info):
        if (
            self.isEmailVerified and
            (
                (self.isPhoneVerified and self.phone)
                or
                self.country != 'India'
            ) and
            self.name is not None and
            self.name != '' and
            self.affiliationBody is not None and
            self.affiliationTitle is not None and
            self.country is not None and
            self.type is not None
            # self.IDCard is not None
        ):
            return True
        return False

    def resolve_registrations(self, info):
        return self.participant_set.all()


class PersonalProfile(UserProfile, graphene.ObjectType):
    pass


__all__ = [
    'AffiliationDataType',
    'UserProfile',
    'PersonalProfile',
]
