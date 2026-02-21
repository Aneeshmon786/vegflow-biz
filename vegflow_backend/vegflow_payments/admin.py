from django.contrib import admin
from .models import VegflowSupplierPayment


@admin.register(VegflowSupplierPayment)
class VegflowSupplierPaymentAdmin(admin.ModelAdmin):
    list_display = ('supplier', 'payment_date', 'amount')
