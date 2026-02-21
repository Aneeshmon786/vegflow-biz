from rest_framework import viewsets
from .models import VegflowCustomer, VegflowSupplier
from .serializers import VegflowCustomerSerializer, VegflowSupplierSerializer


class VegflowCustomerViewSet(viewsets.ModelViewSet):
    serializer_class = VegflowCustomerSerializer

    def get_queryset(self):
        return VegflowCustomer.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class VegflowSupplierViewSet(viewsets.ModelViewSet):
    serializer_class = VegflowSupplierSerializer

    def get_queryset(self):
        return VegflowSupplier.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
