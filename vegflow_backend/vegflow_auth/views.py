from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import VegflowUserSerializer, VegflowRegisterSerializer


class VegflowTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]


class VegflowRegisterView(generics.CreateAPIView):
    from django.contrib.auth import get_user_model
    queryset = get_user_model().objects.all()
    serializer_class = VegflowRegisterSerializer
    permission_classes = [AllowAny]


class VegflowCurrentUserView(generics.RetrieveAPIView):
    serializer_class = VegflowUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
