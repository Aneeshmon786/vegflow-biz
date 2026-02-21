from django.contrib import admin
from .models import VegflowCollection

@admin.register(VegflowCollection)
class VegflowCollectionAdmin(admin.ModelAdmin):
    list_display = ('customer', 'collection_date', 'amount')
