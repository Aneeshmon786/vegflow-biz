"""
VegFlow Biz - Root URL configuration.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('vegflow_auth.urls')),
    path('api/parties/', include('vegflow_parties.urls')),
    path('api/products/', include('vegflow_products.urls')),
    path('api/billing/', include('vegflow_billing.urls')),
    path('api/purchases/', include('vegflow_purchases.urls')),
    path('api/expenses/', include('vegflow_expenses.urls')),
    path('api/collections/', include('vegflow_collections.urls')),
    path('api/payments/', include('vegflow_payments.urls')),
    path('api/reports/', include('vegflow_reports.urls')),
]
