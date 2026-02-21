from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class VegflowUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone', 'business_name', 'first_name', 'last_name')
        read_only_fields = ('id',)


class VegflowRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'phone', 'business_name', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
