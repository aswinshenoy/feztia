import graphene
import json

from django.db.models import Avg, Q

from framework.graphql.scalars import ISOTimestamp
from user.graphql.types import UserProfile, TeamProfile
from user.models import User


class EventWinner(graphene.ObjectType):
    name = graphene.String()
    prize = graphene.Int()
    submissions = graphene.List('event.graphql.types.EventSubmission')

    def resolve_name(self, info):
        if self.user:
            return self.user.title + ' ' + self.user.name

    def resolve_submissions(self, info):
        from event.models import Submission
        return Submission.objects.filter(
            participant=self, isPublic=True
        )


class EventFormData(graphene.ObjectType):
    key = graphene.String()
    value = graphene.String()


class SelectOption(graphene.ObjectType):
    value = graphene.String()
    label = graphene.String()
    allowedUserTypes = graphene.List(graphene.Int)


class EventFieldData(graphene.ObjectType):
    type = graphene.String()
    label = graphene.String()
    key = graphene.String()
    options = graphene.List(SelectOption)
    maxSelections = graphene.Int()
    charLimit = graphene.Int()
    isPublic = graphene.Boolean()
    isURL = graphene.Boolean()
    formats = graphene.String()


class Event(graphene.ObjectType):
    id = graphene.ID()
    name = graphene.String()
    slug = graphene.String()
    type = graphene.Int()
    shortDescription = graphene.String()
    details = graphene.String()
    coverURL = graphene.String()
    posterURL = graphene.String()
    isTeamEvent = graphene.Boolean()
    minTeamSize = graphene.Boolean()
    maxTeamSize = graphene.Boolean()
    requireApproval = graphene.Boolean()
    acceptRegistrations = graphene.Boolean()
    isUserAllowedToRegister = graphene.Boolean()
    requireRegistration = graphene.Boolean()
    registrationCloseTimestamp = ISOTimestamp()
    formFields = graphene.List(EventFieldData)
    postApprovalFields = graphene.List(EventFieldData)
    parentEvent = graphene.Field('event.graphql.types.Event')
    hasGallery = graphene.Boolean()
    webinarLink = graphene.String()
    webinarPlatform = graphene.String()
    startTimestamp = ISOTimestamp()
    endTimestamp = ISOTimestamp()
    hasWinners = graphene.Boolean()
    winners = graphene.List(
        'event.graphql.types.EventWinner'
    )
    isRegistered = graphene.Boolean()
    isApprovedParticipant = graphene.Boolean()

    def resolve_isApprovedParticipant(self, info):
        from event.models import Participant
        if info.context.userID:
            return Participant.objects.filter(
                user_id=info.context.userID,
                approver__isnull=False
            ).exists()

    def resolve_isRegistered(self, info):
        from event.models import Participant
        if info.context.userID:
            return Participant.objects.filter(
                user_id=info.context.userID
            ).exists()

    def resolve_hasWinners(self, info):
        from event.models import Participant
        return Participant.objects.filter(
            event=self, prize__isnull=False
        ).exists()

    def resolve_winners(self, info):
        from event.models import Participant
        return Participant.objects.filter(
            event=self, prize__isnull=False
        ).order_by('prize')

    def resolve_webinarLink(self, info):
        if self.requireRegistration:
            if info.context.userID:
                from event.models import Participant
                if self.requireApproval:
                    if Participant.objects.filter(
                        Q(
                            Q(team__members=info.context.userID) |
                            Q(user_id=info.context.userID)
                        ) &
                        Q(event_id=self.id) &
                        Q(approver__isnull=False)
                    ).exists():
                        return self.webinarLink
                else:
                    if Participant.objects.filter(
                        Q(
                            Q(team__members=info.context.userID) |
                            Q(user_id=info.context.userID)
                        ) &
                        Q(event_id=self.id)
                    ).exists():
                        return self.webinarLink
        else:
            return self.webinarLink

    def resolve_coverURL(self, info):
        if self and self.cover and hasattr(self.cover, 'url') and self.cover.url:
            return self.cover.url.split('?')[0]

    def resolve_posterURL(self, info):
        if self and self.poster and hasattr(self.poster, 'url') and self.poster.url:
            return self.poster.url.split('?')[0]

    def resolve_formData(self, info):
        if self.formFields:
            try:
                return json.loads(self.formFields)
            except ValueError as e:
                pass
        return []

    def resolve_isUserAllowedToRegister(self, info):
        if self.allowedUserTypes and info.context.userID:
            type = User.objects.get(id=info.context.userID).type
            for t in self.allowedUserTypes:
                if t == str(type):
                    return True
            return False

    def resolve_hasGallery(self, info):
        from event.models import Submission
        return (
            self.enableGallery and
            Submission.objects.filter(
                event_id=self.id, isPublic=True
            ).count() > 0
        )


class EventSubmission(graphene.ObjectType):
    id = graphene.ID()
    url = graphene.String()
    fileURL = graphene.String()
    key = graphene.String()
    timestamp = ISOTimestamp()

    def resolve_fileURL(self, info):
        if self and self.file and hasattr(self.file, 'url') and self.file.url:
            return self.file.url


class Participant(graphene.ObjectType):
    uuid = graphene.String()
    id = graphene.String()
    profile = graphene.Field(UserProfile)
    team = graphene.Field(TeamProfile)
    formData = graphene.List(EventFormData)
    postApprovalData = graphene.List(EventFormData)
    timestampRegistered = ISOTimestamp()
    remarks = graphene.String()
    event = graphene.Field(Event)
    isApproved = graphene.Boolean()
    isEliminated = graphene.Boolean()
    isCertificateAvailable = graphene.Boolean()
    remarks = graphene.String()
    submissions = graphene.List(EventSubmission)
    avgPoints = graphene.Int()
    myPoints = graphene.Int()
    prize = graphene.Int()
    timestampApproved = ISOTimestamp()

    def resolve_avgPoints(self, info):
        if info.context.userID:
            from judging.models import ParticipantJudgement
            return ParticipantJudgement.objects.filter(participant=self).aggregate(Avg('points'))['points__avg']

    def resolve_myPoints(self, info):
        if info.context.userID:
            from judging.models import ParticipantJudgement
            try:
                return ParticipantJudgement.objects.get(judge_id=info.context.userID, participant=self).points
            except ParticipantJudgement.DoesNotExist:
                pass

    def resolve_profile(self, info):
        if self.user:
            return self.user

    def resolve_team(self, info):
        if self.team:
            return self.team

    def resolve_formData(self, info):
        if self.formData:
            try:
                d = dict(json.loads(self.formData))
                data = []
                for key, value in d.items():
                    data.append({
                        "key": key,
                        "value": value
                    })
                return data
            except Exception:
                pass
        return []

    def resolve_postApprovalData(self, info):
        if self.postApprovalData:
            try:
                d = dict(json.loads(self.postApprovalData))
                data = []
                for key, value in d.items():
                    data.append({
                        "key": key,
                        "value": value
                    })
                return data
            except Exception:
                pass
        return []

    def resolve_event(self, info):
        return self.event

    def resolve_isApproved(self, info):
        return self.approver_id is not None

    def resolve_isEliminated(self, info):
        return self.eliminator_id is not None

    def resolve_submissions(self, info):
        return self.submission_set.all()

    def resolve_isCertificateAvailable(self, info):
        from certificate.models import EventCertificate
        certType = 0
        if self.prize:
            certType = 1
        return self.approver_id is not None and EventCertificate.objects.filter(
            event=self.event, isReleased=True, type=certType
        ).exists()


class GalleryItem(EventSubmission, graphene.ObjectType):
    pass


__all__ = [
    'EventFormData',
    'Event',
    'Participant',
    'GalleryItem'
]
