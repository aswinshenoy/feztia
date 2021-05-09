from django.core.mail import send_mail
from django.template.loader import get_template
from django.utils.html import strip_tags
from huey.contrib.djhuey import task, db_task


@task()
def send_otp_to_number(code, number) -> None:
    # from django.conf import settings
    # from requests import post
    # SMS_API_URL = "http://alertbox.in/pushsms.php"
    # DOMAIN = 'https://amrita.edu/biocrest'
    #
    # template = """<#> {otp} is the OTP for your Amrita Biocrest registration. @{domain} #{otp}"""
    # message = template.format(otp=code, domain=DOMAIN)
    # data = {
    #     "username": settings.ALERTBOX_USERNAME,
    #     "api_password": settings.ALERTBOX_PASSWORD,
    #     "sender": settings.ALERTBOX_SENDER_ID,
    #     "to": number,
    #     "message": message,
    #     "priority": 4
    # }
    # r = post(SMS_API_URL, data=data)
    # print(r.content)
    return None


@db_task()
def send_email_confirmation_email(user, code, eventID=None) -> None:
    data = {
        "name": user.username,
        "code": code,
    }
    eventName = 'Amrita EMS'
    emailHost = 'verify'
    eventLogo = 'https://i.imgur.com/ymsmLdH.png'
    if eventID is not None:
        from event.models import Event
        try:
            event = Event.objects.get(id=eventID)
            if event.name is not None:
                eventName = event.name
            if event.slug is not None:
                emailHost = event.slug
            if event.logo is not None and event.logo.url:
                eventLogo = event.logo.url
        except Event.DoesNotExist:
            pass

    data['eventName'] = eventName
    data['eventLogo'] = eventLogo

    htmly = get_template('./emails/email-verification.html')
    html_content = htmly.render(data)
    send_mail(
        subject=eventName + ': Verify Your Email',
        message=strip_tags(html_content),
        from_email=emailHost+'@mails.traboda.com',
        recipient_list=[user.email],
        html_message=html_content,
        fail_silently=False,
    )


@task()
def send_password_reset_email(user, code, eventID=None) -> None:
    data = {
        "name": user.username,
        "code": code,
    }

    eventName = 'Amrita EMS'
    emailHost = 'verify'
    eventLogo = ''
    if eventID is not None:
        from event.models import Event
        try:
            event = Event.objects.get(event=eventID)
            if event.name is not None:
                eventName = event.name
            if event.slug is not None:
                emailHost = event.slug
            if event.logo is not None and event.logo.url:
                eventLogo = event.logo.url
        except Event.DoesNotExist:
            pass

    data['eventName'] = eventName
    data['eventLogo'] = eventLogo

    htmly = get_template('./emails/reset-password.html')
    html_content = htmly.render(data)
    send_mail(
        subject=eventName + ': Reset Your Password',
        message=strip_tags(html_content),
        from_email=emailHost+'@mails.traboda.com',
        recipient_list=[user.email],
        html_message=html_content,
        fail_silently=False,
    )


__all__ = [
    'send_otp_to_number',
    'send_email_confirmation_email',
    'send_password_reset_email',
]
