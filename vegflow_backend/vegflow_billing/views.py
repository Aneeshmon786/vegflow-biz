from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import VegflowSale
from .serializers import VegflowSaleSerializer


class VegflowSaleViewSet(viewsets.ModelViewSet):
    serializer_class = VegflowSaleSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['sale_date', 'payment_type', 'customer']

    def get_queryset(self):
        return VegflowSale.objects.filter(owner=self.request.user).select_related('customer').prefetch_related('items', 'items__product')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
