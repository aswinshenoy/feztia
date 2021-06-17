from django.urls import path

from .utils.leads import LeadsView

leads_urlpatterns = [
    path('leads/<str:token>', LeadsView),
]

__all__ = [
    'leads_urlpatterns'
]
