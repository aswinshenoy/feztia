from storages.backends.s3boto3 import S3Boto3Storage


class StaticStorage(S3Boto3Storage):
    location = 'static'
    default_acl = 'public-read'


EVENT_TYPE_CHOICES = (
    (0, 'Fest'),
    (1, 'Competition'),
    (2, 'Workshop'),
    (3, 'Webinar')
)

WEBINAR_PLATFORM_CHOICES = (
    (0, 'Other'),
    (1, 'Zoom'),
    (2, 'Microsoft Teams'),
    (3, 'Jitsi'),
)

USER_TYPE_CHOICES = (
    (0, 'Admin'),
    (1, 'Student'),
    (2, 'Academician'),
    (3, 'Industry'),
    (4, 'Judge'),
    (5, 'Press')
)


REG_STATUS_TYPE_CHOICES = (
    (0, 'All'),
    (1, 'Approved'),
    (2, 'Changes Requested')
)

CERTIFICATE_TYPE_CHOICES = (
    (0, 'Participation'),
    (1, 'Merit/Prize'),
    (2, 'Volunteer')
)

PARTICIPANT_PRIZE_CHOICES = (
    (1, 'First Place'),
    (2, 'Second Place'),
    (3, 'Third Place')
)

__all__ = [
    'USER_TYPE_CHOICES',
    'CERTIFICATE_TYPE_CHOICES',
    'EVENT_TYPE_CHOICES',
    'WEBINAR_PLATFORM_CHOICES',
    'REG_STATUS_TYPE_CHOICES',
    'StaticStorage'
]
