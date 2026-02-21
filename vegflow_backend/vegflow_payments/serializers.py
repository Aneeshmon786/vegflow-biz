from rest_framework import serializers
from .models import VegflowSupplierPayment


class VegflowSupplierPaymentSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)

    class Meta:
        model = VegflowSupplierPayment
        fields = ('id', 'supplier', 'supplier_name', 'payment_date', 'amount', 'notes', 'created_at', 'updated_at')
