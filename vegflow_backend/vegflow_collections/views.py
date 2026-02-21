from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import VegflowCollection
from .serializers import VegflowCollectionSerializer


class VegflowCollectionViewSet(viewsets.ModelViewSet):
    serializer_class = VegflowCollectionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['collection_date', 'customer']

    def get_queryset(self):
        return VegflowCollection.objects.filter(owner=self.request.user).select_related('customer')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
