"""
VegFlow Billing - Sales (cash and credit separately).
"""
from django.db import models
from django.conf import settings
from vegflow_parties.models import VegflowCustomer
from vegflow_products.models import VegflowProduct


class VegflowSale(models.Model):
    PAYMENT_CASH = 'cash'
    PAYMENT_CREDIT = 'credit'
    PAYMENT_CHOICES = [(PAYMENT_CASH, 'Cash'), (PAYMENT_CREDIT, 'Credit')]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vegflow_sales')
    customer = models.ForeignKey(VegflowCustomer, on_delete=models.CASCADE, related_name='vegflow_sales')
    sale_date = models.DateField()
    payment_type = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default=PAYMENT_CASH)
    total_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vegflow_billing_sale'
        ordering = ['-sale_date', '-id']

    def __str__(self):
        return f"Sale #{self.id} - {self.customer.name} - {self.sale_date}"


class VegflowSaleItem(models.Model):
    sale = models.ForeignKey(VegflowSale, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(VegflowProduct, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=12, decimal_places=3)
    rate = models.DecimalField(max_digits=12, decimal_places=2)
    amount = models.DecimalField(max_digits=14, decimal_places=2)

    class Meta:
        db_table = 'vegflow_billing_sale_item'
