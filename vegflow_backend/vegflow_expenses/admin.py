from django.contrib import admin
from .models import VegflowExpense, VegflowExpenseCategory, VegflowStaff


@admin.register(VegflowExpenseCategory)
class VegflowExpenseCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category_type', 'owner')


@admin.register(VegflowStaff)
class VegflowStaffAdmin(admin.ModelAdmin):
    list_display = ('name', 'monthly_salary', 'owner')


@admin.register(VegflowExpense)
class VegflowExpenseAdmin(admin.ModelAdmin):
    list_display = ('expense_date', 'amount', 'description', 'is_monthly', 'category')
