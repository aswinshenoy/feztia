from django.contrib.auth.models import AbstractUser
from django.db import models

from framework.utils import USER_TYPE_CHOICES
from user.fields import MediaField
from user.media import UserIDStorage


class AffiliationTitle(models.Model):
    name = models.CharField(max_length=200)
    isJobTitle = models.BooleanField(default=False)

    class Meta:
        db_table = 'affiliation_title'
        verbose_name_plural = "Affiliation Titles"
        verbose_name = "Affiliation Title"

    def __str__(self):
        return self.name


class AffiliationBody(models.Model):
    name = models.CharField(max_length=200)
    isEducational = models.BooleanField(default=True)

    class Meta:
        db_table = 'affiliation_body'
        verbose_name_plural = "Affiliation Bodies"
        verbose_name = "Affiliation Body"

    def __str__(self):
        return self.name


class User(AbstractUser):
    id = models.BigAutoField(primary_key=True, null=False)
    first_name = None
    last_name = None
    title = models.CharField(max_length=10, default='', blank=True)
    name = models.CharField(max_length=255, default='', blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)

    email = models.EmailField(unique=True, null=False, blank=False)
    isEmailVerified = models.BooleanField(default=False)
    phone = models.CharField(max_length=15, blank=True, null=True)
    isPhoneVerified = models.BooleanField(default=False)
    type = models.PositiveSmallIntegerField(choices=USER_TYPE_CHOICES, blank=True, null=True)

    UTMSource = models.CharField(max_length=255, default='', blank=True)

    IDCard = MediaField(
        storage=UserIDStorage(),
        max_size=1024 * 1024 * 8,
        content_types=[
            'image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp',
        ],
        null=True, blank=True
    )
    isIDVerified = models.BooleanField(default=False)

    city = models.CharField(max_length=50, null=True, blank=True)
    state = models.CharField(max_length=50, null=True, blank=True)
    country = models.CharField(max_length=50, null=True, blank=True)

    affiliationTitle = models.ForeignKey(AffiliationTitle, on_delete=models.PROTECT, null=True, blank=True)
    affiliationBody = models.ForeignKey(AffiliationBody, on_delete=models.PROTECT, null=True, blank=True)


class Team(models.Model):
    name = models.CharField(max_length=100)
    leader = models.ForeignKey(User, related_name='TeamLeader', on_delete=models.PROTECT)
    members = models.ManyToManyField(User, blank=True, related_name='TeamMembers')
    allowEditing = models.BooleanField(default=False)
    inviteCode = models.CharField(max_length=8, unique=True)

    def __str__(self):
        return self.name


class UserVerificationOTP(models.Model):
    code = models.CharField(max_length=8)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now=True)
    isPhoneOTP = models.BooleanField(default=False)

    class Meta:
        unique_together = [
            ('user', 'isPhoneOTP')
        ]
        db_table = 'user_verification_otp'
        verbose_name_plural = "User Verification OTPs"
        verbose_name = "User Verification OTP"


__all__ = [
    'AffiliationTitle',
    'AffiliationBody',
    'User',
    'Team',
    'UserVerificationOTP',
]
