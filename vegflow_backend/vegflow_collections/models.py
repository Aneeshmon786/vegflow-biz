"""
VegFlow Collections - Daily collection from customers, remaining balance.
"""
from django.db import models
from django.conf import settings
from vegflow_parties.models import VegflowCustomer


class VegflowCollection(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vegflow_collections')
    customer = models.ForeignKey(VegflowCustomer, on_delete=models.CASCADE, related_name='vegflow_collections')
    collection_date = models.DateField()
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    notes = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vegflow_collections_collection'
        ordering = ['-collection_date', '-id']
