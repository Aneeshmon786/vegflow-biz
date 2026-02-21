from rest_framework import viewsets
from .models import VegflowProduct
from .serializers import VegflowProductSerializer


class VegflowProductViewSet(viewsets.ModelViewSet):
    serializer_class = VegflowProductSerializer

    def get_queryset(self):
        return VegflowProduct.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
