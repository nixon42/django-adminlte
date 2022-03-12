from django.db import models
from django.contrib.auth.models import User, Group
import time
import datetime
import socket
import logging


# NOTE: permission
class Permission(models.Model):
    group = models.ForeignKey(
        Group, related_name="permissiongroup", on_delete=models.CASCADE)
    edit = models.BooleanField(default=True)
    delete = models.BooleanField(default=False)
    report = models.BooleanField(default=False)


class Action_Log(models.Model):
    user = models.ForeignKey(
        User, related_name="useractionlog", on_delete=models.PROTECT)
    table = models.CharField(max_length=20)
    action = models.CharField(max_length=10)
    date = models.DateTimeField()


# NOTE :inventory
class InventoryType(models.Model):
    name = models.CharField(max_length=10)

    def __str__(self) -> str:
        return self.name


class Inventory(models.Model):
    name = models.CharField(max_length=20)
    stock = models.IntegerField()
    type = models.ForeignKey(InventoryType, related_name="typeinventory", blank=True,
                             null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.name


# access point
class AccessPoint_UpLog(models.Model):
    ip = models.CharField(max_length=20)
    up = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.ip} - {"up" if self.up else "down"}'


class Area(models.Model):
    name = models.CharField(max_length=15)
    code = models.CharField(max_length=5)

    def __str__(self):
        return f'{self.name} - {self.code}'


class AccessPoint(models.Model):
    _createDate = models.DateTimeField(auto_now_add=True)
    code = models.CharField(max_length=10, unique=True)
    ip = models.CharField(max_length=20)
    _long = models.CharField(max_length=20, blank=True, null=True)
    lat = models.CharField(max_length=20, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    wifi = models.CharField(max_length=10)
    customer = models.CharField(max_length=25)
    outdoor = models.BooleanField()
    # date = models.DateTimeField(auto_now_add=True)
    date = models.TextField(max_length=15, blank=True, null=True)

    area = models.ForeignKey(
        Area, blank=True, null=True, related_name="aparea", on_delete=models.SET_NULL)
    rt = models.IntegerField()
    rw = models.IntegerField()

    fo = models.BooleanField()
    linka = models.CharField(max_length=15, blank=True, null=True)
    linkb = models.CharField(max_length=15, blank=True, null=True)
    linka2 = models.CharField(max_length=15, blank=True, null=True)
    linkb2 = models.CharField(max_length=15, blank=True, null=True)
    router = models.ForeignKey(
        Inventory, blank=True, null=True, related_name='routerap', on_delete=models.SET_NULL)
    converter = models.ForeignKey(
        Inventory, blank=True, null=True, related_name='converterap', on_delete=models.SET_NULL)
    up = models.ForeignKey(AccessPoint_UpLog, blank=True,
                           null=True, on_delete=models.SET_NULL)

    note = models.TextField(max_length=250, blank=True, null=True)

    def __str__(self) -> str:
        return self.code

    def new(data: dict):
        # get ip
        try:
            socket.inet_aton(data.get('ip', ''))
            upLog = AccessPoint_UpLog(ip=data.get("ip", ''))
            upLog.save()
        except socket.error:
            raise Exception('ip')

        # get date
        # date = data.get('dateInstall', '')

        # get router
        logging.info('get router')
        _i = data.get('router', '')
        try:
            _i = int(_i)
            router: Inventory = Inventory.objects.get(pk=_i)
        except Exception as e:
            logging.error(f'router error {e}')
            raise Exception('router')

        # get converter
        logging.info('get converter')
        _i = data.get('converter', '')
        try:
            _i = int(_i)
            converter: Inventory = Inventory.objects.get(pk=_i)
        except Exception as e:
            logging.error(f'converter error {e}')
            raise Exception('converter')

        # add record
        if data.get('pk', False):
            try:
                ap = AccessPoint.objects.get(pk=int(data['pk']))
            except Exception as e:
                logging.error(f'pk error, {e}')
                raise Exception('item')
        else:
            # check rt rw val
            try:
                rt = int(data.get('rt', ''))
                rw = int(data.get('rw', ''))
            except Exception as e:
                logging.error(f'error rt, {e}')
                raise Exception('rt')

            # get area
            logging.info('get area')
            _i = data.get('area', '')
            try:
                _i = int(_i)
                area: Area = Area.objects.get(pk=_i)
            except Exception as e:
                logging.error(f'area error {e}')
                raise Exception('area')

            # get serial
            serial = AccessPoint.objects.filter(
                rt=rt, rw=rw).count()

            ap = AccessPoint()
            ap.code = f"{area.code}{rt:02d}{rw:02d}{serial:02d}"
            ap.area = area
            ap.rt = rt
            ap.rw = rw

        # set
        ap.ip = data.get('ip')
        ap._long = data.get('_long', '')
        ap.lat = data.get('lat', '')
        ap.wifi = data.get('wifi', ''),
        ap.customer = data.get('customer', '')
        ap.phone = data.get('phone', '')
        ap.outdoor = True if data.get('outdoor', 'false') == 'true' else False
        ap.date = data.get('date', '')
        ap.fo = True if data.get('fo', 'false') == 'true' else False
        ap.linka = data.get('linka', '')
        ap.linkb = data.get('linkb', '')
        ap.linka2 = data.get('linka2', '')
        ap.linkb2 = data.get('linkb2', '')
        ap.router = router
        ap.converter = converter
        ap.up = upLog
        ap.note = data.get('note', '')

        ap.save()
        return 0


class AccessPoint_EditLog(models.Model):
    user = models.ForeignKey(User, related_name='usereditlog',
                             on_delete=models.PROTECT)
    ap = models.ForeignKey(AccessPoint, related_name='apeditlog',
                           on_delete=models.PROTECT)
    date = models.DateTimeField(auto_now=True)

    # def __str__(self):
    # return f"{self.ap}{self}"


class AccessPoint_UpDownLog(models.Model):
    ap = models.ForeignKey(AccessPoint, related_name='apdownlog',
                           on_delete=models.PROTECT)
    up = models.BooleanField()
    date = models.DateTimeField(auto_now=True)

    # def __str__(self):
    # return f"{self.ap.code} - {'up' if self.up else 'down'}"


# NOTE: report
class AccessPoint_Report(models.Model):
    up = models.IntegerField()
    down = models.IntegerField()

    def __str__(self):
        return f"up:{self.up}, down:{self.down}"
# Create your models here.
