from rest_framework import serializers
from .models import VegflowProduct


class VegflowProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = VegflowProduct
        fields = ('id', 'name', 'unit', 'default_rate', 'created_at', 'updated_at')
