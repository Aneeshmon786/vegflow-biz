from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VegflowProductViewSet

router = DefaultRouter()
router.register(r'', VegflowProductViewSet, basename='vegflow-product')

urlpatterns = [
    path('', include(router.urls)),
]
