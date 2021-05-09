from django.db import models

from event.models import Event, Participant
from framework.utils import CERTIFICATE_TYPE_CHOICES
from user.fields import MediaField
from user.media import CertificateTemplateStorage, CertificateStorage
from user.models import User


class EventCertificate(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    type = models.PositiveSmallIntegerField(choices=CERTIFICATE_TYPE_CHOICES, default=0)

    fontURL = models.URLField(null=True, blank=True)
    fontSize = models.PositiveSmallIntegerField(default=16)
    fontColor = models.CharField(max_length=12, default='#000')

    namePositionX = models.PositiveSmallIntegerField(default=0)
    namePositionY = models.PositiveSmallIntegerField(default=0)

    includeAffiliationBody = models.BooleanField(default=False)
    affiliationPositionX = models.PositiveSmallIntegerField(default=0)
    affiliationPositionY = models.PositiveSmallIntegerField(default=0)

    includeEventName = models.BooleanField(default=False)
    eventNamePositionX = models.PositiveSmallIntegerField(default=0)
    eventNamePositionY = models.PositiveSmallIntegerField(default=0)

    includePrizePosition = models.BooleanField(default=False)
    prizePositionX = models.PositiveSmallIntegerField(default=0)
    prizePositionY = models.PositiveSmallIntegerField(default=0)

    isReleased = models.BooleanField(default=True)
    template = MediaField(
        storage=CertificateTemplateStorage(),
        max_size=1024 * 1024 * 8,
        content_types=[
            'image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp',
        ],
        null=True, blank=True
    )

    class Meta:
        unique_together = [
            ['event', 'type']
        ]
        db_table = 'event_certificate'
        verbose_name_plural = "Event Certificates"
        verbose_name = "Event Certificate"

    def __str__(self):
        return self.event.name + ' - ' + str(self.type)


class GeneratedCertificate(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.PositiveSmallIntegerField(choices=CERTIFICATE_TYPE_CHOICES, default=0)

    file = MediaField(
        storage=CertificateStorage(),
        max_size=1024 * 1024 * 8,
        content_types=[
            'image/png', 'image/jpeg', 'file/pdf'
        ],
        null=True, blank=True
    )

    generations = models.PositiveSmallIntegerField(default=1)
    timestampLastGenerated = models.DateTimeField(auto_now=True)
    timestampCreated = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [
            ['event', 'type', 'participant', 'user']
        ]
        db_table = 'generated_certificate'
        verbose_name_plural = "Generated Certificates"
        verbose_name = "Generated Certificate"

    def __str__(self):
        return self.event.name + ' - ' + self.user.name + ' - ' + str(self.type)


__all__ = [
    'EventCertificate',
    'GeneratedCertificate'
]
