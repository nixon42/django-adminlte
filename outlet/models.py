from django.db import models
from django.contrib.auth.models import User
from polls.models import Area
import logging

# Create your models here.


class Outlet(models.Model):
    _create_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=20, default='')
    phone = models.CharField(max_length=15, default='')
    addr = models.CharField(max_length=50, default='')
    rt = models.IntegerField(default=0)
    rw = models.IntegerField(default=0)
    area = models.ForeignKey(
        Area, on_delete=models.PROTECT, null=True, blank=True)
    lastdeposit = models.DateField(null=True, blank=True)
    totalincome = models.IntegerField(default=0)
    note = models.TextField(max_length=250, default='')


class OutletDeposit(models.Model):
    outlet = models.ForeignKey(Outlet, on_delete=models.PROTECT)
    employe = models.ForeignKey(User, on_delete=models.PROTECT)
    date = models.DateField(auto_now_add=True)
    deposit = models.IntegerField(default=0)
    validate = models.BooleanField(default=False)
    note = models.CharField(max_length=150)

    def validated(self):
        if not self.validate:
            self.validate = True
            self.save()
            return self
        return Exception('already validated')
