from django.contrib import admin
from .models import VegflowSale, VegflowSaleItem

class VegflowSaleItemInline(admin.TabularInline):
    model = VegflowSaleItem
    extra = 0

@admin.register(VegflowSale)
class VegflowSaleAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'sale_date', 'payment_type', 'total_amount')
    inlines = [VegflowSaleItemInline]
