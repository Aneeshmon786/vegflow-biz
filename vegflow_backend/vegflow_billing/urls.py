from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VegflowSaleViewSet

router = DefaultRouter()
router.register(r'sales', VegflowSaleViewSet, basename='vegflow-sale')

urlpatterns = [
    path('', include(router.urls)),
]
