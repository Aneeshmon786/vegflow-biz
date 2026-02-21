from django.urls import path
from .views import VegflowDashboardView, VegflowCustomerBalancesView, VegflowSupplierBalancesView, VegflowProfitLossView

urlpatterns = [
    path('dashboard/', VegflowDashboardView.as_view(), name='vegflow-dashboard'),
    path('customer-balances/', VegflowCustomerBalancesView.as_view(), name='vegflow-customer-balances'),
    path('supplier-balances/', VegflowSupplierBalancesView.as_view(), name='vegflow-supplier-balances'),
    path('profit-loss/', VegflowProfitLossView.as_view(), name='vegflow-profit-loss'),
]
