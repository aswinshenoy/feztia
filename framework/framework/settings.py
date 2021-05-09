import logging
import os
from pathlib import Path
from environs import Env

BASE_DIR = Path(__file__).resolve().parent.parent

env = Env()
env.read_env()

SECRET_KEY = env.str('SECRET_KEY', default='hw2(+p5!vzlygt53f!jqd7oif9=&yyaxz=0$t_i%##v+o16dj%')

DEBUG = env.bool('DEBUG', default=True)

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'graphene_django',
    'huey.contrib.djhuey',

    'chowkidar',
    'user',
    'event',
    'judging',
    'certificate'
    # 'payment',
]


MIDDLEWARE = [
    'framework.utils.auth.CORSMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


AUTH_USER_MODEL = 'user.User'
ROOT_URLCONF = 'framework.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'framework.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': env.str('POSTGRES_DB'),
        'USER': env.str('POSTGRES_USER'),
        'PASSWORD': env.str('POSTGRES_PASSWORD'),
        'HOST': env.str('POSTGRES_HOST'),
        'PORT': '5432',
    }
}

# Static & Media
AWS_ACCESS_KEY_ID = env.str('AWS_ACCESS_KEY_ID', default='')
AWS_SECRET_ACCESS_KEY = env.str('AWS_SECRET_ACCESS_KEY', default='')
AWS_STORAGE_BUCKET_NAME = env.str('S3_STORAGE_BUCKET_NAME', default='')
AWS_DEFAULT_ACL = None
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.ap-south-1.amazonaws.com'
AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}
AWS_S3_REGION_NAME = 'ap-south-1'
AWS_S3_SIGNATURE_VERSION = 's3v4'
AWS_QUERYSTRING_AUTH = True

STATIC_LOCATION = 'static'
STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{STATIC_LOCATION}/'
STATICFILES_STORAGE = 'framework.utils.StaticStorage'

STATICFILES_DIRS = (os.path.join('static'),)     # List of static file directories
FILE_UPLOAD_MAX_MEMORY_SIZE = 1024 * 1024 * 8  # Maximum allowed upload size  for any file


# Authentication
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'framework.utils.auth.AuthEmailBackend'
]

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# GraphQL
GRAPHENE = {
    'SCHEMA': 'framework.graphql.schema',
    'MIDDLEWARE': [
        'chowkidar.auth.ChowkidarAuthMiddleware',
        'graphene_django.debug.DjangoDebugMiddleware',
        'framework.utils.auth.DisableProtectedAPIMiddleware',
    ],
}

# Chowkidar Settings
JWT_COOKIE_SAME_SITE = 'None'
JWT_COOKIE_SECURE = True
JWT_COOKIE_HTTP_ONLY = True
if DEBUG:
    JWT_COOKIE_SAME_SITE = 'Lax'
    JWT_COOKIE_SECURE = False

# Task Queue
taskQueueRedisHost = env.str('TASK_QUEUE_REDIS_HOST', default='')
HUEY = {
    'huey_class': 'huey.PriorityRedisHuey',
    'name': 'platform-task-queue',
    'connection': {
        'host': taskQueueRedisHost,
        'port': 6379
    },
    'consumer': {
        'blocking': True,  # Use blocking list pop instead of polling Redis.
        'loglevel': logging.DEBUG,
        'workers': 4,
        'scheduler_interval': 1,
        'simple_log': True,
    }
}

if DEBUG:
    HUEY['immediate_use_memory'] = False
    HUEY['immediate'] = False

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# AlertBox Integration for SMS
ALERTBOX_USERNAME = env.str('ALERTBOX_USERNAME', default='')
ALERTBOX_PASSWORD = env.str('ALERTBOX_PASSWORD', default='')
ALERTBOX_SENDER_ID = env.str('ALERTBOX_SENDER_ID', default='')


# Email settings
EMAIL_BACKEND = 'django_ses.SESBackend'
AWS_SES_REGION_NAME = 'ap-south-1'
AWS_SES_REGION_ENDPOINT = 'email.ap-south-1.amazonaws.com'

# EMAIL_USE_TLS = True
# EMAIL_HOST = 'smtp-mail.outlook.com'
# EMAIL_HOST_USER = env.str('OUTLOOK_EMAIL', default='')
# EMAIL_HOST_PASSWORD = env.str('OUTLOOK_PASSWORD', default='')
# EMAIL_PORT = 587
