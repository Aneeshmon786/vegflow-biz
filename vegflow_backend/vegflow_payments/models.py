"""
VegFlow Payments - Payments to suppliers (reduces supplier balance).
Like collections but for suppliers - auto-updates supplier balance.
"""
from django.db import models
from django.conf import settings
from vegflow_parties.models import VegflowSupplier


class VegflowSupplierPayment(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vegflow_supplier_payments')
    supplier = models.ForeignKey(VegflowSupplier, on_delete=models.CASCADE, related_name='vegflow_supplier_payments')
    payment_date = models.DateField()
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    notes = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vegflow_payments_supplier_payment'
        ordering = ['-payment_date', '-id']
