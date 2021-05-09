import graphene
from chowkidar.graphql.decorators import resolve_user
from chowkidar.graphql.exceptions import APIException
from django.core.files.base import ContentFile
from django.core.mail import EmailMessage
from django.db.models import Q

from certificate.models import EventCertificate, GeneratedCertificate
from event.models import Participant


class GeneratedCertificateFile(graphene.ObjectType):
    file = graphene.String()


class GenerateParticipationCertificate(graphene.Mutation):
    class Arguments:
        eventID = graphene.ID(required=True)

    Output = GeneratedCertificateFile

    @resolve_user
    def mutate(self, info, eventID: graphene.ID) -> GeneratedCertificateFile:
        userID = info.context.userID
        user = info.context.user
        try:
            participant = Participant.objects.get(
                Q(event_id=eventID) &
                Q(Q(user_id=userID) | Q(team__members=userID))
            )
        except Participant.DoesNotExist:
            raise APIException('Participant does not exist', code='PARTICIPANT_NOT_FOUND')

        certType = 0
        if participant.prize:
            certType = 1

        try:
            eventCert = EventCertificate.objects.get(
                event_id=eventID,
                isReleased=True, type=certType
            )
        except EventCertificate.DoesNotExist:
            raise APIException('Certificate not available', code='NOT_AVAILABLE')

        if eventCert.event.requireApproval and participant.approver_id is None:
            raise APIException('Certificate not issuable', code='FORBIDDEN')

        try:
            generatedCert = GeneratedCertificate.objects.get(
                event_id=eventID, user_id=userID, participant_id=participant.id, type=0
            )
            if generatedCert.generations > 1:
                return GeneratedCertificateFile(
                    file=generatedCert.file.url
                )
        except GeneratedCertificate.DoesNotExist:
            generatedCert = GeneratedCertificate(
                event_id=eventID,
                user_id=userID,
                participant_id=participant.id,
                type=0,
                generations=1
            )

        from PIL import Image, ImageDraw, ImageFont
        from requests import get
        from io import BytesIO

        im = Image.open(eventCert.template)
        d = ImageDraw.Draw(im)

        if eventCert.fontURL is not None and len(eventCert.fontURL) > 5:
            fontURL = eventCert.fontURL
        else:
            fontURL = 'https://github.com/googlefonts/roboto/blob/master/src/hinted/Roboto-Regular.ttf?raw=true'

        req = get(fontURL)

        font = ImageFont.truetype(BytesIO(req.content), size=eventCert.fontSize)

        name = user.title + ' ' + user.name
        d.text(
            (eventCert.namePositionX, eventCert.namePositionY),
            name,
            fill=eventCert.fontColor,
            font=font
        )

        if eventCert.includeAffiliationBody:
            affiliationBody = user.affiliationBody.name if user.affiliationBody else ''
            d.text(
                (eventCert.affiliationPositionX, eventCert.affiliationPositionY),
                affiliationBody,
                fill=eventCert.fontColor,
                font=font
            )

        if eventCert.includeEventName:
            d.text(
                (eventCert.eventNamePositionX, eventCert.eventNamePositionY),
                eventCert.event.name,
                fill=eventCert.fontColor,
                font=font
            )

        if eventCert.includePrizePosition:
            position = ''
            if participant.prize == 1:
                position = 'First'
            elif participant.prize == 2:
                position = 'Second'
            elif participant.prize == 3:
                position = 'Third'
            d.text(
                (eventCert.prizePositionX, eventCert.prizePositionY),
                position,
                fill=eventCert.fontColor,
                font=font
            )

        outputFile = BytesIO()
        im.save(outputFile, format='PDF')
        file = ContentFile(
            outputFile.getvalue(),
            'certificate.pdf'
        )

        generatedCert.file = file
        generatedCert.save()
        return GeneratedCertificateFile(
            file=generatedCert.file.url
        )


class VolunteerInfoInput(graphene.InputObjectType):
    email = graphene.String()
    name = graphene.String()


class SendVolunteerCertificate(graphene.Mutation):
    class Arguments:
        volunteers = graphene.List(VolunteerInfoInput, required=True)
        eventID = graphene.ID(required=True)

    Output = graphene.Boolean

    def mutate(self, info, eventID, volunteers: [VolunteerInfoInput]) -> bool:
        try:
            eventCert = EventCertificate.objects.get(
                event_id=eventID,
                isReleased=True, type=2
            )
        except EventCertificate.DoesNotExist:
            raise APIException('Certificate not available', code='NOT_AVAILABLE')

        from PIL import Image, ImageDraw, ImageFont
        from requests import get
        from io import BytesIO

        if eventCert.fontURL is not None and len(eventCert.fontURL) > 5:
            fontURL = eventCert.fontURL
        else:
            fontURL = 'https://github.com/googlefonts/roboto/blob/master/src/hinted/Roboto-Regular.ttf?raw=true'

        req = get(fontURL)

        font = ImageFont.truetype(BytesIO(req.content), size=eventCert.fontSize)

        for user in volunteers:
            im = Image.open(eventCert.template)
            d = ImageDraw.Draw(im)

            name = user.name
            d.text(
                (eventCert.namePositionX, eventCert.namePositionY),
                name,
                fill=eventCert.fontColor,
                font=font
            )

            outputFile = BytesIO()
            im.save(outputFile, format='PDF')

            mail = EmailMessage(
                "Thank you for helping in organizing " + eventCert.event.name,
                "Hi! Thank you " + user.name + " for helping in organizing " + eventCert.event.name + ". We couldn't pull this event without your valuable contributions. Please find your certificate attached.",
                'certificate@amritauniversity.info',
                [user.email]
            )
            mail.attach(eventCert.event.name.lower()+'_volunteer_certificate.pdf', outputFile.getvalue(), 'application/pdf')
            mail.send(fail_silently=False)
        return True


class CertificateMutations(graphene.ObjectType):
    generateParticipationCertificate = GenerateParticipationCertificate.Field()
    sendVolunteerCertificate = SendVolunteerCertificate.Field()


__all__ = [
    'CertificateMutations'
]
