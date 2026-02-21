"""
VegFlow Products - Inventory items for billing (no repacking).
"""
from django.db import models
from django.conf import settings


class VegflowProduct(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vegflow_products')
    name = models.CharField(max_length=200)
    unit = models.CharField(max_length=50, default='kg')  # kg, box, piece, etc.
    default_rate = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vegflow_products_product'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.unit})"
