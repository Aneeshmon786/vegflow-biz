from django.contrib import admin
from .models import VegflowPurchase, VegflowPurchaseItem

class VegflowPurchaseItemInline(admin.TabularInline):
    model = VegflowPurchaseItem
    extra = 0

@admin.register(VegflowPurchase)
class VegflowPurchaseAdmin(admin.ModelAdmin):
    list_display = ('id', 'supplier', 'purchase_date', 'total_amount')
    inlines = [VegflowPurchaseItemInline]
