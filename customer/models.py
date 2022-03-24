from django.db import models
from polls.models import Area


class MonthlyPlan(models.Model):
    name = models.CharField(max_length=50)
    price = models.IntegerField()
    duration = models.DurationField()
    sold = models.IntegerField()


class MonthlyCustomer(models.Model):
    name = models.CharField(max_length=20)
    phone = models.CharField(max_length=15)
    addr = models.CharField(max_length=50)
    rt = models.IntegerField()
    rw = models.IntegerField()
    area = models.ForeignKey(Area, on_delete=models.PROTECT)
    plan = models.ForeignKey(MonthlyPlan, on_delete=models.PROTECT)
    username = models.CharField(max_length=12)
    password = models.CharField(max_length=12)
    voucher = models.CharField(max_length=12)
    sdate = models.DateField()
    ddate = models.DateField()
    bill = models.IntegerField()
    note = models.TextField(max_length=250)


class BuyLog(models.Model):
    customer = models.ForeignKey(
        MonthlyCustomer, on_delete=models.PROTECT)
    plan = models.ForeignKey(MonthlyPlan, on_delete=models.PROTECT)
    amount = models.IntegerField()
    date = models.DateField(auto_now_add=True)


# Create your models here.
