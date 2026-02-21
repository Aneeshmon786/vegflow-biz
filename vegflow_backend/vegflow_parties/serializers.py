from rest_framework import serializers
from .models import VegflowCustomer, VegflowSupplier


class VegflowCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = VegflowCustomer
        fields = ('id', 'name', 'phone', 'address', 'created_at', 'updated_at')


class VegflowSupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = VegflowSupplier
        fields = ('id', 'name', 'phone', 'address', 'created_at', 'updated_at')
