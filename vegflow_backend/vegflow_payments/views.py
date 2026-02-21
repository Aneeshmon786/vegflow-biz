from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import VegflowSupplierPayment
from .serializers import VegflowSupplierPaymentSerializer


class VegflowSupplierPaymentViewSet(viewsets.ModelViewSet):
    serializer_class = VegflowSupplierPaymentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['payment_date', 'supplier']

    def get_queryset(self):
        return VegflowSupplierPayment.objects.filter(owner=self.request.user).select_related('supplier')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
