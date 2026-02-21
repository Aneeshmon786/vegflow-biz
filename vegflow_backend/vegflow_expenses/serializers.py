from rest_framework import serializers
from .models import VegflowExpense, VegflowExpenseCategory, VegflowStaff


class VegflowExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VegflowExpenseCategory
        fields = ('id', 'name', 'category_type')


class VegflowStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = VegflowStaff
        fields = ('id', 'name', 'monthly_salary', 'notes', 'created_at', 'updated_at')


class VegflowExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = VegflowExpense
        fields = ('id', 'expense_date', 'amount', 'category', 'category_name', 'description', 'is_monthly', 'created_at', 'updated_at')
