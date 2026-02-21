from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import VegflowUser

@admin.register(VegflowUser)
class VegflowUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'phone', 'business_name')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('phone', 'business_name')}),
    )
