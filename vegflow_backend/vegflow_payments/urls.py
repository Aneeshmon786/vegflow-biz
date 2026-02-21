from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VegflowSupplierPaymentViewSet

router = DefaultRouter()
router.register(r'', VegflowSupplierPaymentViewSet, basename='vegflow-supplier-payment')

urlpatterns = [
    path('', include(router.urls)),
]
