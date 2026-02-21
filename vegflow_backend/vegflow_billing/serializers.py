from rest_framework import serializers
from vegflow_parties.serializers import VegflowCustomerSerializer
from vegflow_products.serializers import VegflowProductSerializer
from .models import VegflowSale, VegflowSaleItem


class VegflowSaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_unit = serializers.CharField(source='product.unit', read_only=True)

    class Meta:
        model = VegflowSaleItem
        fields = ('id', 'product', 'product_name', 'product_unit', 'quantity', 'rate', 'amount')


class VegflowSaleSerializer(serializers.ModelSerializer):
    items = VegflowSaleItemSerializer(many=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model = VegflowSale
        fields = ('id', 'customer', 'customer_name', 'sale_date', 'payment_type', 'total_amount', 'notes', 'items', 'created_at', 'updated_at')

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        sale = VegflowSale.objects.create(**validated_data)
        for item in items_data:
            VegflowSaleItem.objects.create(sale=sale, **item)
        return sale

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if items_data is not None:
            instance.items.all().delete()
            for item in items_data:
                VegflowSaleItem.objects.create(sale=instance, **item)
        return instance
