from django.http import HttpRequest, JsonResponse, HttpResponse
from chowkidar.models import RefreshToken
from django.utils.timezone import get_default_timezone

from event.models import Participant
from user.models import User


def LeadsView(request: HttpRequest, token=None):
    if token is not None and RefreshToken.objects.filter(
        user__is_superuser=True, token=token, revoked__isnull=True
    ).exists():
        users = User.objects.filter(
            UTMSource__in=['Facebook', 'Instagram']
        ).values(
            'id', 'name', 'email', 'phone', 'date_joined', 'UTMSource', 'isEmailVerified', 'country', 'type', 'gender',
            'affiliationBody__name', 'affiliationTitle__name'
        ).order_by('date_joined')
        leads = []
        for u in users:
            hasFilledEventsForm = False
            if Participant.objects.filter(user_id=u['id']).exists():
                hasFilledEventsForm = True
            type = ''
            if u['type']:
                if u['type'] == 1:
                    type = 'Student'
                if u['type'] == 2:
                    type = 'Academician'
                if u['type'] == 3:
                    type = 'Industry'
            to_tz = get_default_timezone()
            leads.append({
                "Name": u['name'],
                "Email": u['email'],
                "Phone": u['phone'],
                "Gender": u['gender'],
                "Type": type,
                "Source": u['UTMSource'],
                "Registration Time": u['date_joined'].astimezone(to_tz).strftime("%I:%M%p %d/%m/%y"),
                "Affiliation":  u['affiliationTitle__name'] if u['affiliationTitle__name'] else '',
                "Affiliation Body": u['affiliationBody__name'] if u['affiliationBody__name'] else '',
                "Country": u['country'] if u['country'] else '',
                "Stage 1 - Basic Details": "YES" if (u['gender'] and len(u['gender']) > 0) and (u['country'] and len(u['country']) > 0) else "NO",
                "Stage 2 - Profile Type": "YES" if (type and len(type) > 0) else "NO",
                "Stage 3 - Affiliation": "YES" if (u['affiliationBody__name'] and len(u['affiliationBody__name']) > 0) else "NO",
                "Stage 4 - Event Form": "YES" if hasFilledEventsForm else "NO",
                "Stage 5 - Email Verification": "YES" if u['isEmailVerified'] else "NO",
            })
        return JsonResponse(leads, safe=False)
    return HttpResponse('Bad Request', status=400)
