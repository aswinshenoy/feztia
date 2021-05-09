import uuid as uuid
from django.db import models
from django.db.models.functions import Length
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.text import slugify
from multiselectfield import MultiSelectField

from event.tasks import send_event_emails
from framework.utils import (
    USER_TYPE_CHOICES, EVENT_TYPE_CHOICES,
    REG_STATUS_TYPE_CHOICES, WEBINAR_PLATFORM_CHOICES, PARTICIPANT_PRIZE_CHOICES
)
from user.fields import MediaField
from user.media import EventStorage, SubmissionStorage
from user.models import User, Team


class Event(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    type = models.PositiveSmallIntegerField(choices=EVENT_TYPE_CHOICES, default=0, blank=True)

    logo = MediaField(
        storage=EventStorage(),
        max_size=1024 * 1024 * 8,
        content_types=[
            'image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp',
        ],
        null=True, blank=True
    )
    cover = MediaField(
        storage=EventStorage(),
        max_size=1024 * 1024 * 8,
        content_types=[
            'image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp',
        ],
        null=True, blank=True
    )
    poster = MediaField(
        storage=EventStorage(),
        max_size=1024 * 1024 * 8,
        content_types=[
            'image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp',
        ],
        null=True, blank=True
    )
    shortDescription = models.CharField(max_length=100, default='', blank=True)
    details = models.TextField(default='', blank=True)
    customFields = models.JSONField(null=True, blank=True)

    isTeamEvent = models.BooleanField(default=False)
    minTeamSize = models.PositiveSmallIntegerField(null=True, blank=True)
    maxTeamSize = models.PositiveSmallIntegerField(null=True, blank=True)

    requireRegistration = models.BooleanField(default=True)
    acceptRegistrations = models.BooleanField(default=True)
    slotLimits = models.PositiveSmallIntegerField(null=True, blank=True)
    registrationCloseTimestamp = models.DateTimeField(null=True, blank=True)
    allowedUserTypes = MultiSelectField(
        choices=USER_TYPE_CHOICES, max_choices=10, max_length=255, null=True, blank=True
    )

    formFields = models.JSONField(null=True, blank=True)
    requireApproval = models.BooleanField(default=False)
    postApprovalFields = models.JSONField(null=True, blank=True)

    enableGallery = models.BooleanField(default=False)

    startTimestamp = models.DateTimeField(null=True, blank=True)
    endTimestamp = models.DateTimeField(null=True, blank=True)

    webinarPlatform = models.PositiveSmallIntegerField(
        choices=WEBINAR_PLATFORM_CHOICES, null=True, blank=True
    )
    webinarLink = models.URLField(null=True, blank=True)

    def _generate_slug(self):
        self.slug = slugify(self.name, allow_unicode=True)

    def save(self, *args, **kwargs):
        if not self.pk or self.slug == '' or self.slug is None:
            self._generate_slug()
        super().save(*args, **kwargs)

    class Meta:
        unique_together = [
            ['slug', 'parent']
        ]
        db_table = 'event'
        verbose_name_plural = "Events"
        verbose_name = "Event"

    def __str__(self):
        return self.name


class Participant(models.Model):
    uuid = models.UUIDField(unique=True, default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    team = models.ForeignKey(Team, on_delete=models.PROTECT, null=True, blank=True)
    event = models.ForeignKey(Event, on_delete=models.PROTECT)

    formData = models.JSONField(null=True, blank=True)
    postApprovalData = models.JSONField(null=True, blank=True)
    timestampRegistered = models.DateTimeField(auto_now=True)

    prize = models.PositiveSmallIntegerField(
        choices=PARTICIPANT_PRIZE_CHOICES, null=True, blank=True
    )

    eliminator = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='eliminator', null=True, blank=True)
    timestampEliminated = models.DateTimeField(null=True, blank=True)
    feedback = models.CharField(max_length=255, default='', blank=True)

    approver = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='approver', null=True, blank=True)
    timestampApproved = models.DateTimeField(null=True, blank=True)
    remarks = models.CharField(max_length=255, default='', blank=True)

    class Meta:
        unique_together = [
            ('user', 'team', 'event')
        ]
        db_table = 'participant'
        verbose_name_plural = "Event Participants"
        verbose_name = "Event Participant"

    def __str__(self):
        return (self.user.username if self.user else self.team.name if self.team else '') + ' - ' + self.event.name


class Submission(models.Model):
    SUBMISSION_TYPE_CHOICES = (
        (1, 'Image'),
        (2, 'PDF'),
        (3, 'PPT'),
        (4, 'Youtube URL'),
    )
    file = MediaField(
        storage=SubmissionStorage(),
        max_size=1024 * 1024 * 12,
        null=True, blank=True
    )
    url = models.URLField(null=True, blank=True)
    type = models.PositiveSmallIntegerField(choices=SUBMISSION_TYPE_CHOICES, default=1)
    timestamp = models.DateTimeField(auto_now=True)
    isPublic = models.BooleanField()
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    key = models.CharField(max_length=100, default='', blank=True)
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)

    class Meta:
        db_table = 'submission'
        verbose_name_plural = "Event Submissions"
        verbose_name = "Event Submission"

    def __str__(self):
        return str(self.participant) + ' - ' + self.key


class EventManager(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.PROTECT)
    canViewRegistrations = models.BooleanField(default=True)
    canReviewRegistrations = models.BooleanField(default=False)
    canJudgeParticipants = models.BooleanField(default=False)
    canSendEmails = models.BooleanField(default=False)
    canEliminateParticipants = models.BooleanField(default=False)

    class Meta:
        unique_together = [
            ('user', 'event')
        ]
        db_table = 'manager'
        verbose_name_plural = "Event Managers"
        verbose_name = "Event Manager"

    def __str__(self):
        return self.user.username + ' ' + self.event.name


class EventEmail(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    type = models.PositiveSmallIntegerField(choices=USER_TYPE_CHOICES, null=True, blank=True)
    status = models.PositiveSmallIntegerField(choices=REG_STATUS_TYPE_CHOICES, null=True, blank=True)
    subject = models.CharField(max_length=255)
    url = models.URLField(null=True, blank=True)
    image = MediaField(
        storage=EventStorage(),
        max_size=1024 * 1024 * 8,
        content_types=[
            'image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp',
        ]
    )

    class Meta:
        db_table = 'event_email'
        verbose_name_plural = "Event Email"
        verbose_name = "Event Email"

    def __str__(self):
        return self.event.name + ' - ' + self.subject


@receiver(post_save, sender=EventEmail)
def send_emails(sender, instance, created, **kwargs):
    if created:
        if instance.event.isTeamEvent:
            qs = Participant.objects.filter(event=instance.event)
            if instance.status:
                if instance.status == 1:
                    qs = qs.filter(approver__isnull=False)
                if instance.status == 2:
                    qs = qs.annotate(
                        remarks_length=Length('remarks')
                    ).filter(approver__isnull=True, remarks_length__gt=0)
            emails = []
            for p in qs:
                for m in p.team.members.all():
                    emails.append(m.email)
            send_event_emails(
                subject=instance.subject,
                emails=emails,
                url=instance.url,
                imageURL=instance.image.url if instance and instance.image else None
            )
        else:
            qs = Participant.objects.filter(event=instance.event)
            if instance.type:
                qs = qs.filter(user__type=instance.type)
            if instance.status:
                if instance.status == 1:
                    qs = qs.filter(approver__isnull=False)
                if instance.status == 2:
                    qs = qs.annotate(
                        remarks_length=Length('remarks')
                    ).filter(approver__isnull=True, remarks_length__gt=0)
            emails = list(qs.values_list('user__email', flat=True))
            send_event_emails(
                subject=instance.subject,
                emails=emails,
                url=instance.url,
                imageURL=instance.image.url if instance and instance.image else None
            )


__all__ = [
    'Event',
    'Participant',
    'Submission',
    'EventManager',
    'EventEmail'
]
