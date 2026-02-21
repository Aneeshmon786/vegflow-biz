"""
VegFlow Auth - Custom user model.
Unique app name to avoid conflicts with auth packages.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models


class VegflowUser(AbstractUser):
    """User for VegFlow Biz client area."""
    phone = models.CharField(max_length=20, blank=True)
    business_name = models.CharField(max_length=200, blank=True)

    class Meta:
        db_table = 'vegflow_auth_user'
        verbose_name = 'VegFlow User'
