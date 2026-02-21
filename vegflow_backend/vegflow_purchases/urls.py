from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VegflowPurchaseViewSet

router = DefaultRouter()
router.register(r'', VegflowPurchaseViewSet, basename='vegflow-purchase')

urlpatterns = [
    path('', include(router.urls)),
]
