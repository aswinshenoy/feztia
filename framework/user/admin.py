from django.contrib import admin
from user.models import *


@admin.register(AffiliationTitle)
class AffiliationTitleAdmin(admin.ModelAdmin):
    pass


@admin.register(AffiliationBody)
class AffiliationBodyAdmin(admin.ModelAdmin):
    pass


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    search_fields = ['username', 'name', 'email', 'phone']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    search_fields = ['name']
    autocomplete_fields = ['leader', 'members']


@admin.register(UserVerificationOTP)
class UserVerificationOTPAdmin(admin.ModelAdmin):
    pass
