from django.contrib import admin
from .models import MonthlyCustomer, MonthlyPlan, MonthlyPlan_BuyLog

admin.site.register(MonthlyCustomer)
admin.site.register(MonthlyPlan)
admin.site.register(MonthlyPlan_BuyLog)


# Register your models here.
