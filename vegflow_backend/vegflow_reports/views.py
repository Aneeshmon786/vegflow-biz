"""
VegFlow Reports - Dashboard summary, customer/supplier balances, Profit & Loss.
Balances auto-update from transactions (credit sales - collections; purchases - supplier payments).
"""
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from vegflow_billing.models import VegflowSale
from vegflow_purchases.models import VegflowPurchase
from vegflow_expenses.models import VegflowExpense
from vegflow_collections.models import VegflowCollection
from vegflow_payments.models import VegflowSupplierPayment
from vegflow_parties.models import VegflowCustomer, VegflowSupplier


def _month_range(today):
    from calendar import monthrange
    start = today.replace(day=1)
    _, last_day = monthrange(today.year, today.month)
    end = today.replace(day=last_day)
    return start, end


class VegflowDashboardView(APIView):
    """Dashboard: today's figures, daily/monthly expenses, P&L, customer & supplier pending balances, chart data."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()
        user = request.user
        month_start, month_end = _month_range(today)

        # Today
        sales_today = VegflowSale.objects.filter(owner=user, sale_date=today).aggregate(s=Sum('total_amount'))['s'] or 0
        collections_today = VegflowCollection.objects.filter(owner=user, collection_date=today).aggregate(s=Sum('amount'))['s'] or 0
        supplier_payments_today = VegflowSupplierPayment.objects.filter(owner=user, payment_date=today).aggregate(s=Sum('amount'))['s'] or 0
        expenses_today = VegflowExpense.objects.filter(owner=user, expense_date=today).aggregate(s=Sum('amount'))['s'] or 0
        daily_expense_today = VegflowExpense.objects.filter(owner=user, expense_date=today, is_monthly=False).aggregate(s=Sum('amount'))['s'] or 0
        monthly_expense_today = VegflowExpense.objects.filter(owner=user, expense_date=today, is_monthly=True).aggregate(s=Sum('amount'))['s'] or 0

        # Current month P&L
        sales_cash_m = VegflowSale.objects.filter(owner=user, sale_date__gte=month_start, sale_date__lte=month_end, payment_type='cash').aggregate(s=Sum('total_amount'))['s'] or 0
        sales_credit_m = VegflowSale.objects.filter(owner=user, sale_date__gte=month_start, sale_date__lte=month_end, payment_type='credit').aggregate(s=Sum('total_amount'))['s'] or 0
        total_sales_m = float(sales_cash_m) + float(sales_credit_m)
        purchases_m = VegflowPurchase.objects.filter(owner=user, purchase_date__gte=month_start, purchase_date__lte=month_end).aggregate(s=Sum('total_amount'))['s'] or 0
        expenses_m = VegflowExpense.objects.filter(owner=user, expense_date__gte=month_start, expense_date__lte=month_end).aggregate(s=Sum('amount'))['s'] or 0
        daily_expense_m = VegflowExpense.objects.filter(owner=user, expense_date__gte=month_start, expense_date__lte=month_end, is_monthly=False).aggregate(s=Sum('amount'))['s'] or 0
        monthly_expense_m = VegflowExpense.objects.filter(owner=user, expense_date__gte=month_start, expense_date__lte=month_end, is_monthly=True).aggregate(s=Sum('amount'))['s'] or 0
        net_profit_m = total_sales_m - float(purchases_m) - float(expenses_m)

        # Customer pending balances (credit sales - collections)
        customer_balances = []
        for c in VegflowCustomer.objects.filter(owner=user):
            credit_sales = VegflowSale.objects.filter(owner=user, customer=c, payment_type='credit').aggregate(s=Sum('total_amount'))['s']
            collections = VegflowCollection.objects.filter(owner=user, customer=c).aggregate(s=Sum('amount'))['s']
            credit_val = float(credit_sales) if credit_sales is not None else 0.0
            coll_val = float(collections) if collections is not None else 0.0
            balance = round(credit_val - coll_val, 2)
            if balance != 0:
                customer_balances.append({'customer_id': c.id, 'customer_name': c.name, 'balance': balance})

        # Supplier pending balances (purchases - payments)
        supplier_balances = []
        for s in VegflowSupplier.objects.filter(owner=user):
            purchases_sum = VegflowPurchase.objects.filter(owner=user, supplier=s).aggregate(s=Sum('total_amount'))['s'] or 0
            payments_sum = VegflowSupplierPayment.objects.filter(owner=user, supplier=s).aggregate(s=Sum('amount'))['s'] or 0
            balance = float(purchases_sum) - float(payments_sum)
            if balance != 0:
                supplier_balances.append({'supplier_id': s.id, 'supplier_name': s.name, 'balance': round(balance, 2)})

        # Chart data: last 14 days
        chart_data = []
        for i in range(14):
            d = today - timedelta(days=13 - i)
            sales_d = VegflowSale.objects.filter(owner=user, sale_date=d).aggregate(s=Sum('total_amount'))['s'] or 0
            collections_d = VegflowCollection.objects.filter(owner=user, collection_date=d).aggregate(s=Sum('amount'))['s'] or 0
            payments_d = VegflowSupplierPayment.objects.filter(owner=user, payment_date=d).aggregate(s=Sum('amount'))['s'] or 0
            expenses_d = VegflowExpense.objects.filter(owner=user, expense_date=d).aggregate(s=Sum('amount'))['s'] or 0
            chart_data.append({
                'date': d.isoformat(),
                'sales': round(float(sales_d), 2),
                'collections': round(float(collections_d), 2),
                'supplier_payments': round(float(payments_d), 2),
                'expenses': round(float(expenses_d), 2),
            })

        return Response({
            'sales_today': round(float(sales_today), 2),
            'collections_today': round(float(collections_today), 2),
            'supplier_payments_today': round(float(supplier_payments_today), 2),
            'expenses_today': round(float(expenses_today), 2),
            'daily_expense_today': round(float(daily_expense_today), 2),
            'monthly_expense_today': round(float(monthly_expense_today), 2),
            'net_today': round(float(sales_today) + float(collections_today) - float(supplier_payments_today) - float(expenses_today), 2),
            'profit_loss': {
                'from_date': month_start.isoformat(),
                'to_date': month_end.isoformat(),
                'sales_cash': round(float(sales_cash_m), 2),
                'sales_credit': round(float(sales_credit_m), 2),
                'total_sales': round(total_sales_m, 2),
                'purchases': round(float(purchases_m), 2),
                'expenses': round(float(expenses_m), 2),
                'daily_expense': round(float(daily_expense_m), 2),
                'monthly_expense': round(float(monthly_expense_m), 2),
                'net_profit': round(net_profit_m, 2),
            },
            'customer_balances': customer_balances,
            'supplier_balances': supplier_balances,
            'chart_data': chart_data,
        })


class VegflowCustomerBalancesView(APIView):
    """Remaining balance per customer: total credit sales - total collections (auto from transactions)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        customers = VegflowCustomer.objects.filter(owner=user)
        result = []
        for c in customers:
            credit_sales = VegflowSale.objects.filter(owner=user, customer=c, payment_type='credit').aggregate(s=Sum('total_amount'))['s']
            collections = VegflowCollection.objects.filter(owner=user, customer=c).aggregate(s=Sum('amount'))['s']
            credit_val = float(credit_sales) if credit_sales is not None else 0.0
            coll_val = float(collections) if collections is not None else 0.0
            balance = round(credit_val - coll_val, 2)
            result.append({
                'customer_id': c.id,
                'customer_name': c.name,
                'balance': balance,
            })
        return Response(result)


class VegflowSupplierBalancesView(APIView):
    """Remaining balance per supplier: total purchases - total payments (auto from transactions)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        suppliers = VegflowSupplier.objects.filter(owner=user)
        result = []
        for s in suppliers:
            purchases_sum = VegflowPurchase.objects.filter(owner=user, supplier=s).aggregate(s=Sum('total_amount'))['s'] or 0
            payments_sum = VegflowSupplierPayment.objects.filter(owner=user, supplier=s).aggregate(s=Sum('amount'))['s'] or 0
            balance = float(purchases_sum) - float(payments_sum)
            result.append({
                'supplier_id': s.id,
                'supplier_name': s.name,
                'balance': round(balance, 2),
            })
        return Response(result)


class VegflowProfitLossView(APIView):
    """Profit & Loss for date range. Sales - Purchases - Expenses = Net."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        from_date = request.query_params.get('from_date')
        to_date = request.query_params.get('to_date')
        if not from_date or not to_date:
            return Response({'error': 'from_date and to_date required (YYYY-MM-DD)'}, status=400)

        sales_cash = VegflowSale.objects.filter(owner=user, sale_date__gte=from_date, sale_date__lte=to_date, payment_type='cash').aggregate(s=Sum('total_amount'))['s'] or 0
        sales_credit = VegflowSale.objects.filter(owner=user, sale_date__gte=from_date, sale_date__lte=to_date, payment_type='credit').aggregate(s=Sum('total_amount'))['s'] or 0
        total_sales = float(sales_cash) + float(sales_credit)

        purchases = VegflowPurchase.objects.filter(owner=user, purchase_date__gte=from_date, purchase_date__lte=to_date).aggregate(s=Sum('total_amount'))['s'] or 0
        expenses = VegflowExpense.objects.filter(owner=user, expense_date__gte=from_date, expense_date__lte=to_date).aggregate(s=Sum('amount'))['s'] or 0
        daily_exp = VegflowExpense.objects.filter(owner=user, expense_date__gte=from_date, expense_date__lte=to_date, is_monthly=False).aggregate(s=Sum('amount'))['s'] or 0
        monthly_exp = VegflowExpense.objects.filter(owner=user, expense_date__gte=from_date, expense_date__lte=to_date, is_monthly=True).aggregate(s=Sum('amount'))['s'] or 0

        net_profit = total_sales - float(purchases) - float(expenses)

        return Response({
            'from_date': from_date,
            'to_date': to_date,
            'sales_cash': round(float(sales_cash), 2),
            'sales_credit': round(float(sales_credit), 2),
            'total_sales': round(total_sales, 2),
            'purchases': round(float(purchases), 2),
            'expenses': round(float(expenses), 2),
            'daily_expense': round(float(daily_exp), 2),
            'monthly_expense': round(float(monthly_exp), 2),
            'net_profit': round(net_profit, 2),
        })
