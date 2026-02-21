"""
VegFlow Expenses - Daily and monthly expenses (salary, rent, bills). Editable.
"""
from django.db import models
from django.conf import settings


class VegflowExpenseCategory(models.Model):
    DAILY = 'daily'
    MONTHLY = 'monthly'
    CATEGORY_TYPE_CHOICES = [(DAILY, 'Daily'), (MONTHLY, 'Monthly')]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vegflow_expense_categories')
    name = models.CharField(max_length=100)
    category_type = models.CharField(max_length=20, choices=CATEGORY_TYPE_CHOICES, default=DAILY)

    class Meta:
        db_table = 'vegflow_expenses_category'
        unique_together = ('owner', 'name', 'category_type')

    def __str__(self):
        return f"{self.name} ({self.get_category_type_display()})"


class VegflowStaff(models.Model):
    """Staff member with monthly salary (for salary expense category)."""
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vegflow_staff')
    name = models.CharField(max_length=200)
    monthly_salary = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    notes = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vegflow_expenses_staff'
        ordering = ['name']

    def __str__(self):
        return self.name


class VegflowExpense(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vegflow_expenses')
    expense_date = models.DateField()
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    category = models.ForeignKey(VegflowExpenseCategory, on_delete=models.CASCADE, related_name='expenses', null=True, blank=True)
    description = models.CharField(max_length=300)
    is_monthly = models.BooleanField(default=False)  # salary, rent, monthly bill
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vegflow_expenses_expense'
        ordering = ['-expense_date', '-id']
