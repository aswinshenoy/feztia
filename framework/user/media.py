import uuid

from storages.backends.s3boto3 import S3Boto3Storage


class EventStorage(S3Boto3Storage):
    location = 'events'
    default_acl = 'public-read'
    file_overwrite = False
    custom_domain = False

    def get_available_name(self, name, max_length=None):
        ext = name.split('.')[-1]
        filename = "md_%s.%s" % (uuid.uuid4(), ext)
        return super().get_available_name(filename, max_length)


class SubmissionStorage(S3Boto3Storage):
    location = 'submissions'
    default_acl = 'private'
    file_overwrite = False
    custom_domain = False

    def get_available_name(self, name, max_length=None):
        ext = name.split('.')[-1]
        filename = "md_%s.%s" % (uuid.uuid4(), ext)
        return super().get_available_name(filename, max_length)


class UserIDStorage(S3Boto3Storage):
    location = 'user/id_card'
    default_acl = 'private'
    file_overwrite = False
    custom_domain = False

    def get_available_name(self, name, max_length=None):
        ext = name.split('.')[-1]
        filename = "md_%s.%s" % (uuid.uuid4(), ext)
        return super().get_available_name(filename, max_length)


class CertificateTemplateStorage(S3Boto3Storage):
    location = 'certificate/template'
    default_acl = 'private'
    file_overwrite = False
    custom_domain = False

    def get_available_name(self, name, max_length=None):
        ext = name.split('.')[-1]
        filename = "ct_%s.%s" % (uuid.uuid4(), ext)
        return super().get_available_name(filename, max_length)


class CertificateStorage(S3Boto3Storage):
    location = 'certificate/generated'
    default_acl = 'private'
    file_overwrite = False
    custom_domain = False

    def get_available_name(self, name, max_length=None):
        ext = name.split('.')[-1]
        filename = "uc_%s.%s" % (uuid.uuid4(), ext)
        return super().get_available_name(filename, max_length)


__all__ = [
    'EventStorage',
    'SubmissionStorage',
    'UserIDStorage',
    'CertificateTemplateStorage',
    'CertificateStorage'
]

