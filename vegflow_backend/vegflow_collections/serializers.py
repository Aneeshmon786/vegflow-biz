from rest_framework import serializers
from .models import VegflowCollection


class VegflowCollectionSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model = VegflowCollection
        fields = ('id', 'customer', 'customer_name', 'collection_date', 'amount', 'notes', 'created_at', 'updated_at')
