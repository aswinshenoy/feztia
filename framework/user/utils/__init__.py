from string import digits
from random import choice
from user.models import User


def generate_unique_username(username: str) -> str:
    try:
        User.objects.get(username=username)
        generatedUsername = username + ''.join([choice(digits) for i in range(3)])
        return generate_unique_username(generatedUsername)
    except User.DoesNotExist:
        return username


def generate_username_from_email(email: str) -> str:
    try:
        emailUsername = email.split('@')[0]
        return generate_unique_username(emailUsername)
    except IndexError:
        raise Exception("Invalid Email")


def generate_otp() -> str:
    from math import floor
    from random import random

    digits = "0123456789"
    OTP = ""

    for i in range(6):
        OTP += digits[floor(random() * 10)]
    return OTP


__all__ = [
    'generate_username_from_email',
    'generate_otp'
]
