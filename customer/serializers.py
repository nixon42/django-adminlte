from rest_framework import serializers
from .models import MonthlyPlan_BuyLog, MonthlyCustomer, MonthlyPlan
from polls.models import Area


class AreaSerializers(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ('id', 'code')


class MonthlyPlanSerializers(serializers.ModelSerializer):
    class Meta:
        model = MonthlyPlan
        fields = ('id', 'code')


class MonthlyCustomerSerializers(serializers.ModelSerializer):
    class Meta:
        model = MonthlyCustomer
        fields = ('id', 'name')


class NewCustomerLogSerializer(serializers.ModelSerializer):
    plan = MonthlyPlanSerializers()
    area = AreaSerializers()

    class Meta:
        model = MonthlyCustomer
        fields = ('id', 'name', 'phone', 'addr', 'rt', 'rw', 'area', 'plan')


class TransactionLogSerializers(serializers.ModelSerializer):
    customer = MonthlyCustomerSerializers()
    plan = MonthlyPlanSerializers()

    class Meta:
        model = MonthlyPlan_BuyLog
        fields = "__all__"
