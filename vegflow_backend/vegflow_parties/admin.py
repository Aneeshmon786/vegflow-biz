from django.contrib import admin
from .models import VegflowCustomer, VegflowSupplier

@admin.register(VegflowCustomer)
class VegflowCustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'owner')

@admin.register(VegflowSupplier)
class VegflowSupplierAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'owner')
