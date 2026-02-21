from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VegflowCustomerViewSet, VegflowSupplierViewSet

router = DefaultRouter()
router.register(r'customers', VegflowCustomerViewSet, basename='vegflow-customer')
router.register(r'suppliers', VegflowSupplierViewSet, basename='vegflow-supplier')

urlpatterns = [
    path('', include(router.urls)),
]
