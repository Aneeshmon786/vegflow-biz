"""
VegFlow Purchases - Purchase records (editable).
"""
from django.db import models
from django.conf import settings
from vegflow_parties.models import VegflowSupplier
from vegflow_products.models import VegflowProduct


class VegflowPurchase(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vegflow_purchases')
    supplier = models.ForeignKey(VegflowSupplier, on_delete=models.CASCADE, related_name='vegflow_purchases')
    purchase_date = models.DateField()
    total_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vegflow_purchases_purchase'
        ordering = ['-purchase_date', '-id']


class VegflowPurchaseItem(models.Model):
    purchase = models.ForeignKey(VegflowPurchase, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(VegflowProduct, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=12, decimal_places=3)
    rate = models.DecimalField(max_digits=12, decimal_places=2)
    amount = models.DecimalField(max_digits=14, decimal_places=2)

    class Meta:
        db_table = 'vegflow_purchases_purchase_item'
