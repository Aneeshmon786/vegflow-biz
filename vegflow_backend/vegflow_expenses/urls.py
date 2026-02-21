from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VegflowExpenseViewSet, VegflowExpenseCategoryViewSet, VegflowStaffViewSet

router = DefaultRouter()
router.register(r'categories', VegflowExpenseCategoryViewSet, basename='vegflow-expense-category')
router.register(r'staff', VegflowStaffViewSet, basename='vegflow-staff')
router.register(r'', VegflowExpenseViewSet, basename='vegflow-expense')

urlpatterns = [
    path('', include(router.urls)),
]
