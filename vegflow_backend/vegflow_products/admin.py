from django.contrib import admin
from .models import VegflowProduct

@admin.register(VegflowProduct)
class VegflowProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'unit', 'default_rate', 'owner')
