from django.db import models
from polls.models import Area
from django.conf import global_settings
import logging
import datetime

logging = logging.getLogger(__name__)


class MonthlyPlan(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=10, unique=True)
    price = models.IntegerField()
    duration = models.IntegerField()
    limit = models.CharField(max_length=10, null=True)
    sold = models.IntegerField(default=0)


class MonthlyCustomer(models.Model):
    _create_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=20, default='No Name')
    phone = models.CharField(max_length=15, default='')
    addr = models.CharField(max_length=50, default='')
    rt = models.IntegerField(default=0)
    rw = models.IntegerField(default=0)
    area = models.ForeignKey(
        Area, on_delete=models.PROTECT, null=True, blank=True)
    ap = models.CharField(max_length=20, default='')
    plan: MonthlyPlan = models.ForeignKey(
        MonthlyPlan, on_delete=models.PROTECT, null=True, blank=True)
    username = models.CharField(max_length=12, default='')
    password = models.CharField(max_length=12, default='')
    voucher = models.CharField(max_length=12, default='')
    sdate = models.DateField()
    ddate = models.DateField()
    bill = models.IntegerField(default=0)
    paid = models.BooleanField(default=False)
    note = models.TextField(max_length=250, default='')

    def __str__(self) -> str:
        return f'{self.name}  RT{self.rt} RW{self.rw}'

    def subcribe(self, plan: MonthlyPlan, amount: int, cash: int):
        try:
            total = plan.price * amount
            ret = 0
            bill = 0
            if amount == 0 or cash == 0:
                raise Exception('error')

            if total > cash:
                bill = total - cash

            if plan != self.plan:
                self.plan = plan
                serial = MonthlyCustomer.objects.filter(
                    plan=plan).order_by('-pk').first()
                serial = int(serial.code[-3:]) + 1 if serial != None else 0
                exist = True
                while exist:
                    code = f'{plan.code}-{serial:03d}'
                    try:
                        MonthlyCustomer.objects.get(code=code)
                        # print(f'{code} exist')
                        serial += 1
                        # continue
                    except Exception as e:
                        logging.error(f'got {e} while check {code}')
                        # print(f'{code} avaible')
                        self.code = code
                        exist = False
            # self.plan = plan
            # self.sdate = datetime.datetime.now()
            self.ddate = self.ddate + \
                datetime.timedelta(days=self.plan.duration * amount)
            self.bill = bill
            self.paid = True if self.bill == 0 else False
            self.save()
            log = MonthlyPlan_BuyLog(
                customer=self,
                plan=plan,
                amount=amount,
                total=total,
                cash=cash,
                ret=ret,
                ddate=self.ddate,
            )
            log.save()
            self.plan.sold += 1
            self.plan.save()
        except Exception as e:
            logging.error(f'cant process subcribtion, {e}')
            raise Exception('failed')

    def insert(data: dict):
        if (data.get('pk', '')):
            try:
                monthlyCustomer = MonthlyCustomer.objects.get(
                    pk=int(data.get('pk')))
            except Exception as e:
                logging.error('cant get monthly customer')
                raise Exception('pk')

            # get plan
            try:
                plan = MonthlyPlan.objects.get(
                    pk=int(data.get('plan', '')))
            except ValueError:
                logging.warn(f'invalid plan')
                raise Exception('plan')
            except Exception as e:
                logging.error(f'cant get plan, {e}')
                raise Exception('plan')

            if plan != monthlyCustomer.plan:
                monthlyCustomer.plan = plan
                serial = MonthlyCustomer.objects.filter(
                    plan=plan).order_by('-pk').first()
                serial = int(serial.code[-3:]) + 1 if serial != None else 0
                exist = True
                while exist:
                    code = f'{plan.code}-{serial:03d}'
                    try:
                        MonthlyCustomer.objects.get(code=code)
                        # print(f'{code} exist')
                        serial += 1
                        # continue
                    except Exception as e:
                        logging.error(f'got {e} while check {code}')
                        # print(f'{code} avaible')
                        monthlyCustomer.code = code
                        exist = False

        else:
            monthlyCustomer = MonthlyCustomer()
            # get plan
            try:
                plan = MonthlyPlan.objects.get(
                    pk=int(data.get('plan', '')))
            except ValueError:
                logging.warn(f'invalid plan')
                raise Exception('plan')
            except Exception as e:
                logging.error(f'cant get plan, {e}')
                raise Exception('plan')
            monthlyCustomer.plan = plan
            serial = MonthlyCustomer.objects.filter(
                plan=plan).order_by('-pk').first()
            serial = int(serial.code[-3:]) + 1 if serial != None else 0
            exist = True
            while exist:
                code = f'{plan.code}-{serial:03d}'
                try:
                    MonthlyCustomer.objects.get(code=code)
                    print(f'{code} exist')
                    serial += 1
                    # continue
                except Exception as e:
                    logging.error(f'got {e} while check {code}')
                    print(f'{code} avaible')
                    monthlyCustomer.code = code
                    exist = False

        monthlyCustomer.name = data.get('name', 'No Name')
        monthlyCustomer.phone = data.get('phone', '')
        monthlyCustomer.addr = data.get('addr', '')

        # check rt or rw
        try:
            monthlyCustomer.rt = int(data.get('rt', 0))
            monthlyCustomer.rw = int(data.get('rw', 0))
        except Exception as e:
            logging.warn(f'cant parse rt, {e}')

        # get area
        try:
            monthlyCustomer.area = Area.objects.get(
                pk=int(data.get('area', '')))
        except Exception as e:
            logging.error(f'cant get area, {e}')
            monthlyCustomer.area = None

        monthlyCustomer.username = data.get('username', '')
        monthlyCustomer.password = data.get('password', '')
        monthlyCustomer.voucher = data.get('voucher', '')

        # get sdate
        try:
            if data.get('sdate', False):
                monthlyCustomer.sdate = datetime.datetime.strptime(
                    data.get('sdate', ''), '%Y-%m-%d')
            else:
                monthlyCustomer.sdate = datetime.datetime.now()
                # raise Exception('sdate')
        except Exception as e:
            logging.error(f'cant parse sdate, {e}')
            monthlyCustomer.sdate = datetime.datetime.now()

            # raise Exception('sdate')

        # get ddate
        try:
            if data.get('ddate', False):
                monthlyCustomer.ddate = datetime.datetime.strptime(
                    data.get('ddate', ''), '%Y-%m-%d')
            else:
                monthlyCustomer.ddate = monthlyCustomer.sdate
                # raise Exception('ddate')
        except Exception as e:
            logging.error(f'cant parse ddate, {e}')
            monthlyCustomer.ddate = monthlyCustomer.sdate
            # raise Exception('ddate')

        # get bill
        try:
            monthlyCustomer.bill = int(data.get('bill', 0))
        except Exception as e:
            logging.warn(f'cant parse bill, {e}')

        monthlyCustomer.paid = True if monthlyCustomer.bill == 0 else False
        monthlyCustomer.note = data.get('note', '')
        try:
            monthlyCustomer.save()
            return monthlyCustomer
        # except
        except Exception as e:
            logging.error(f'cant add monthly customer, {e}')
            raise Exception('failed')


class MonthlyPlan_BuyLog(models.Model):
    customer = models.ForeignKey(
        MonthlyCustomer, on_delete=models.PROTECT)
    plan = models.ForeignKey(MonthlyPlan, on_delete=models.PROTECT)
    amount = models.IntegerField()
    total = models.IntegerField(default=0)
    cash = models.IntegerField(default=0)
    ret = models.IntegerField(default=0)
    ddate = models.DateField(null=True)
    date = models.DateField(auto_now_add=True)

# Create your models here.
