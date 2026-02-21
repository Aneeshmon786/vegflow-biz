from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VegflowCollectionViewSet

router = DefaultRouter()
router.register(r'', VegflowCollectionViewSet, basename='vegflow-collection')

urlpatterns = [
    path('', include(router.urls)),
]
