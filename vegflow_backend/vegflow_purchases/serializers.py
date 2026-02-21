from rest_framework import serializers
from .models import VegflowPurchase, VegflowPurchaseItem


class VegflowPurchaseItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_unit = serializers.CharField(source='product.unit', read_only=True)

    class Meta:
        model = VegflowPurchaseItem
        fields = ('id', 'product', 'product_name', 'product_unit', 'quantity', 'rate', 'amount')


class VegflowPurchaseSerializer(serializers.ModelSerializer):
    items = VegflowPurchaseItemSerializer(many=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)

    class Meta:
        model = VegflowPurchase
        fields = ('id', 'supplier', 'supplier_name', 'purchase_date', 'total_amount', 'notes', 'items', 'created_at', 'updated_at')

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        purchase = VegflowPurchase.objects.create(**validated_data)
        for item in items_data:
            VegflowPurchaseItem.objects.create(purchase=purchase, **item)
        return purchase

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if items_data is not None:
            instance.items.all().delete()
            for item in items_data:
                VegflowPurchaseItem.objects.create(purchase=instance, **item)
        return instance
