from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import VegflowPurchase
from .serializers import VegflowPurchaseSerializer


class VegflowPurchaseViewSet(viewsets.ModelViewSet):
    serializer_class = VegflowPurchaseSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['purchase_date', 'supplier']

    def get_queryset(self):
        return VegflowPurchase.objects.filter(owner=self.request.user).select_related('supplier').prefetch_related('items', 'items__product')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
