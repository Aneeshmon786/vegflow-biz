from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import VegflowExpense, VegflowExpenseCategory, VegflowStaff
from .serializers import VegflowExpenseSerializer, VegflowExpenseCategorySerializer, VegflowStaffSerializer


class VegflowExpenseCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = VegflowExpenseCategorySerializer

    def get_queryset(self):
        return VegflowExpenseCategory.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class VegflowStaffViewSet(viewsets.ModelViewSet):
    serializer_class = VegflowStaffSerializer

    def get_queryset(self):
        return VegflowStaff.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class VegflowExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = VegflowExpenseSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['expense_date', 'is_monthly', 'category']

    def get_queryset(self):
        return VegflowExpense.objects.filter(owner=self.request.user).select_related('category')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
