import graphene
from chowkidar.graphql.decorators import login_required, resolve_user
from chowkidar.graphql.exceptions import APIException
from chowkidar.graphql.scalars import Upload
from django.utils import timezone

from event.models import Participant, Event, EventEmail, EventManager
from event.tasks import (
    send_email_requesting_correction,
    send_email_confirming_registration,
    send_status_to_number
)
from user.graphql.inputs import UserUpdationInput
from user.utils import generate_username_from_email


class AddJudgeResponse(graphene.ObjectType):
    newAccount = graphene.Boolean()
    password = graphene.String()


class AddJudge(graphene.Mutation):
    class Arguments:
        eventID = graphene.ID(required=True)
        email = graphene.String()
        defaultPassword = graphene.String()
        autoCreate = graphene.Boolean()

    Output = AddJudgeResponse

    @resolve_user
    def mutate(
        self, info,
        eventID,
        email: str = None,
        defaultPassword: str = None,
        autoCreate: bool = True
    ) -> AddJudgeResponse:
        password = 'B!0crest'

        from user.models import User
        if (
            info.context.user.type == 0 or
            info.context.user.is_staff or
            info.context.user.is_superuser or
            EventManager.objects.filter(
                user=info.context.user, canReviewRegistrations=True
            ).exists()
        ):
            try:
                user = User.objects.get(email=email)
                user.type = 4
                user.save()
                newAccount = False
            except User.DoesNotExist:
                if not autoCreate:
                    raise APIException('The judge does not have an account', code='INVALID_EMAIL')
                user = User.objects.create(
                    username=generate_username_from_email(email),
                    type=4,
                    email=email
                )
                if defaultPassword is not None:
                    password = defaultPassword
                user.set_password(password)
                user.save()
                newAccount = True
            try:
                eventManager = EventManager.objects.get(
                    event_id=eventID,
                    user=user
                )
                eventManager.canJudgeParticipants = True
                eventManager.save()
            except EventManager.DoesNotExist:
                EventManager.objects.create(
                    event_id=eventID,
                    user=user,
                    canViewRegistrations=False,
                    canJudgeParticipants=True
                )
            return AddJudgeResponse(
                newAccount=newAccount,
                password=password if newAccount else None
            )
        raise APIException('You dont have permission to perform this action', code='FORBIDDEN')


class ReviewParticipant(graphene.Mutation):
    class Arguments:
        participantID = graphene.ID(required=True)
        approve = graphene.Boolean(
            required=True
        )
        remarks = graphene.String()
        formUpdate = graphene.JSONString()
        profileUpdate = graphene.Argument(UserUpdationInput)

    Output = graphene.Boolean

    @login_required
    def mutate(
        self, info,
        participantID: graphene.ID, approve: bool,
        remarks=None,
        formUpdate=None, profileUpdate: UserUpdationInput = None
    ) -> bool:
        try:
            reg = Participant.objects.get(id=participantID)
            if reg.event.eventmanager_set.filter(user_id=info.context.userID, canReviewRegistrations=True).exists():
                user = reg.user
                team = reg.team
                if approve:
                    if profileUpdate and user:
                        if hasattr(profileUpdate, "name") and profileUpdate.name is not None:
                            user.name = profileUpdate.name
                        if hasattr(profileUpdate, "type") and profileUpdate.type is not None:
                            if profileUpdate.type == 0:
                                raise APIException("Not allowed", code="NOT_ALLOWED")
                            user.type = profileUpdate.type
                        if hasattr(profileUpdate, "email") and profileUpdate.email is not None:
                            if user.email != profileUpdate.email:
                                user.isEmailVerified = False
                            user.email = profileUpdate.email
                        if hasattr(profileUpdate, "phone") and profileUpdate.phone is not None:
                            if profileUpdate.phone != profileUpdate.phone:
                                user.isPhoneVerified = False
                            user.phone = profileUpdate.phone
                        user.save()
                    if formUpdate:
                        reg.formData = formUpdate
                    reg.approver_id = info.context.userID
                    reg.timestampApproved = timezone.now()
                    reg.save()
                    if user:
                        if user.phone and user.isPhoneVerified:
                            send_status_to_number(number=user.phone, isApproved=True, name=reg.event.name)
                        send_email_confirming_registration(user=user, participant=reg)
                    elif team:
                        if team.leader and team.leader.phone and team.leader.isPhoneVerified:
                            send_status_to_number(number=team.leader.phone, isApproved=True, name=reg.event.name)
                        for m in team.members.all():
                            send_email_confirming_registration(user=m, participant=reg)
                    return True
                else:
                    reg.remarks = remarks
                    reg.approver = None
                    reg.timestampApproved = None
                    reg.save()
                    editURL = 'https://register.shakticon.com/edit-profile'
                    if reg.event.parent is not None:
                        editURL = 'https://register.shakticon.com/register/' + reg.event.slug
                    if user:
                        if user.phone and user.isPhoneVerified:
                            send_status_to_number(number=user.phone, isApproved=False, name=reg.event.name)
                        send_email_requesting_correction(user=user, participant=reg, editURL=editURL)
                    elif team:
                        if team.leader and team.leader.phone and team.leader.isPhoneVerified:
                            send_status_to_number(number=team.leader.phone, isApproved=False, name=reg.event.name)
                        for m in team.members.all():
                            send_email_requesting_correction(user=m, participant=reg, editURL=editURL)
                    return True
            else:
                raise APIException('You are not allowed to review registrations', code='FORBIDDEN')
        except Participant.DoesNotExist:
            raise APIException('Participant not found', code='REG_NOT_FOUND')


class EliminateParticipant(graphene.Mutation):
    class Arguments:
        participantID = graphene.ID(required=True)
        feedback = graphene.String()

    Output = graphene.Boolean

    @login_required
    def mutate(
        self, info,
        participantID: graphene.ID, feedback=None,
    ) -> bool:
        try:
            reg = Participant.objects.get(id=participantID)
            if reg.event.eventmanager_set.filter(user_id=info.context.userID, canEliminateParticipants=True).exists():
                # user = reg.user
                # team = reg.team
                reg.eliminator_id = info.context.userID
                reg.timestampEliminated = timezone.now()
                reg.feedback = feedback if feedback else ''
                reg.save()
                # if user:
                #     if user.phone and user.isPhoneVerified:
                #         send_status_to_number(number=user.phone, isApproved=True, name=reg.event.name)
                #     send_email_confirming_registration(user=user, participant=reg)
                # elif team:
                #     if team.leader and team.leader.phone and team.leader.isPhoneVerified:
                #         send_status_to_number(number=team.leader.phone, isApproved=True, name=reg.event.name)
                #     for m in team.members.all():
                #         send_email_confirming_registration(user=m, participant=reg)
                return True
            else:
                raise APIException('You are not allowed to eliminate registrations', code='FORBIDDEN')
        except Participant.DoesNotExist:
            raise APIException('Participant not found', code='REG_NOT_FOUND')


class DeclareWinner(graphene.Mutation):
    class Arguments:
        participantID = graphene.ID(required=True)
        prizeID = graphene.Int(required=True)

    Output = graphene.Boolean

    @login_required
    def mutate(
        self, info,
        participantID: graphene.ID, prizeID: int,
    ) -> bool:
        try:
            reg = Participant.objects.get(id=participantID)
            if reg.event.eventmanager_set.filter(user_id=info.context.userID, canReviewRegistrations=True).exists():
                reg.prize = prizeID
                reg.save()
                return True
            else:
                raise APIException('You are not allowed to declare winners', code='FORBIDDEN')
        except Participant.DoesNotExist:
            raise APIException('Participant not found', code='REG_NOT_FOUND')


class SendBulkEmails(graphene.Mutation):
    class Arguments:
        eventID = graphene.ID(required=True)
        type = graphene.Int()
        status = graphene.Int()
        subject = graphene.String()
        url = graphene.String()
        image = Upload()

    Output = graphene.Boolean

    @login_required
    def mutate(
        self, info,
        eventID: graphene.ID, subject, url, image,
        type=None, status=0,
    ) -> bool:
        try:
            event = Event.objects.get(id=eventID)
            if event.eventmanager_set.filter(user_id=info.context.userID, canSendEmails=True).exists():
                EventEmail.objects.create(
                    event=event,
                    subject=subject,
                    url=url,
                    image=image,
                    type=type,
                    status=status,
                )
                return True
            else:
                raise APIException('You are not allowed to send bulk emails', code='FORBIDDEN')
        except Event.DoesNotExist:
            raise APIException('Invalid Event', code='INVALID_EVENT')


class ManagerMutations(graphene.ObjectType):
    reviewParticipant = ReviewParticipant.Field()
    eliminateParticipant = EliminateParticipant.Field()
    declareWinner = DeclareWinner.Field()
    sendBulkEmails = SendBulkEmails.Field()
    addJudge = AddJudge.Field()


__all__ = [
    'ManagerMutations'
]

