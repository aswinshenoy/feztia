from django.core.mail import send_mail
from django.template.loader import get_template
from django.utils.html import strip_tags
from huey.contrib.djhuey import task


@task()
def send_status_to_number(name, number, isApproved=True) -> None:
    # from django.conf import settings
    # from requests import post
    # SMS_API_URL = "http://alertbox.in/pushsms.php"
    # DOMAIN = 'https://amrita.edu/biocrest'
    #
    # template = "Changes requested for completing your registration for {name}. Please make the requested changes from your dashboard. @{domain}"
    # if isApproved:
    #     template = "Your registration for {name} has been approved. More details can be found on the dashboard. Thank you. @{domain}"
    # message = template.format(name=name, domain=DOMAIN)
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

@task()
def send_email_confirming_registration(user, participant) -> None:
    data = {
        "name": user.title + ' ' + user.name,
        "eventName": participant.event.name
    }
    htmly = get_template('./emails/reg-approval.html')
    html_content = htmly.render(data)
    send_mail(
        subject=participant.event.name + ' Registration Approved',
        message=strip_tags(html_content),
        from_email='verify@mails.traboda.com',
        recipient_list=[user.email],
        html_message=html_content,
        fail_silently=False,
    )


@task()
def send_email_requesting_correction(user, participant, editURL=None) -> None:
    data = {
        "remarks": participant.remarks,
        "eventName": participant.event.name,
        "editURL": editURL if editURL else 'https://register.shakticon.com/edit-profile',
    }
    htmly = get_template('./emails/verify-remarks.html')
    html_content = htmly.render(data)
    send_mail(
        subject='Corrections Requested for ' + participant.event.name + ' Registration',
        message=strip_tags(html_content),
        from_email='verify@mails.traboda.com',
        recipient_list=[user.email],
        html_message=html_content,
        fail_silently=False,
    )


@task()
def send_event_email(email, subject, htmlContent) -> None:
    send_mail(
        subject=subject,
        message=strip_tags(htmlContent),
        from_email='shakticon@mails.traboda.com',
        recipient_list=[email],
        html_message=htmlContent,
        fail_silently=False,
    )


@task()
def send_event_emails(emails, subject, url, imageURL) -> None:
    sub = subject if subject else 'ShaktiCon Update'
    data = {
        "subject": sub,
        "imageURL": imageURL.split('?')[0] if imageURL else None,
        "url": url
    }
    htmly = get_template('./emails/event-image-email.html')
    html_content = htmly.render(data)
    for email in emails:
        send_event_email(email=email, subject=sub, htmlContent=html_content)


__all__ = [
    'send_status_to_number',
    'send_email_confirming_registration',
    'send_email_requesting_correction',
    'send_event_emails'
]
