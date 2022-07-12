from django.db import models
from polls.models import Inventory
from django.contrib.auth.models import User

# Create your models here.


class InvenIN(models.Model):
    date = models.DateField(auto_created=True)
    item = models.ForeignKey(Inventory, models.PROTECT)
    amount = models.IntegerField()
    price = models.IntegerField()
    note = models.CharField(max_length=450, blank=True)
    user = models.ForeignKey(User, models.PROTECT)
