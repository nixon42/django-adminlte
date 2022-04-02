from django.shortcuts import render
from django.core import serializers
from django.http import JsonResponse, HttpRequest
from .models import MonthlyCustomer, MonthlyPlan, MonthlyPlan_BuyLog
from django.db import IntegrityError

import logging
logging = logging.getLogger(__name__)


def getMonthlyPlan(req: HttpRequest):
    data = serializers.serialize(
        'json', MonthlyPlan.objects.all().order_by('pk'))
    return JsonResponse({'return_code': 0, 'data': data})


def addMonthlyPlan(req: HttpRequest):
    # TODO: this
    if req.POST.__len__() < 4 or req.POST.__len__() > 5:
        logging.warn(
            f"Bad request addMonthlyPlan from {req.META.get('REMOTE_ADDR')}")
        return JsonResponse({'return_code': 400, 'msg': 'bad request data'})

    # check if value
    if req.POST.get('pk', False):
        try:
            plan = MonthlyPlan.objects.get(pk=int(req.POST.get('pk')))
        except ValueError:
            logging.warn(
                f"invalid pk on monthly plan")
            return JsonResponse({'return_code': 400, 'msg': 'invalid plan item'})
        except Exception as e:
            logging.error(f'failed to get plan, {e}')
            return JsonResponse({'return_code': 500, 'msg': 'cant get plan item'})
    else:
        plan = MonthlyPlan()
        # get code
        if req.POST.get('code', False):
            plan.code = req.POST.get('code')
        else:
            return JsonResponse({'return_code': 400, 'msg': 'monthly plan code cannot be null!!'})

    # set value
    # get duration
    if req.POST.get('duration', False):
        plan.duration = req.POST.get('duration')
    else:
        return JsonResponse({'return_code': 400, 'msg': 'duration cannot be null!!'})

    plan.name = req.POST.get('name', 'paket tanpa nama')
    plan.limit = req.POST.get('limit', '3M/3M')
    plan.price = req.POST.get('price', 0)
    try:
        plan.save()
        return JsonResponse({'return_code': 0, 'msg': 'ok'})
    except IntegrityError:
        return JsonResponse({'return_code': 400, 'msg': f'plan code already exist!!'})
    except Exception as e:
        return JsonResponse({'return_code': 400, 'msg': f'Cant add plan, LOG: {e}'})


def getMonthlyCustomer(req: HttpRequest):
    data = serializers.serialize(
        'json', MonthlyCustomer.objects.filter(active=True).order_by('pk'))
    return JsonResponse({'return_code': 0, 'data': data})


def subcribe(req: HttpRequest):
    print(req.POST)
    if req.POST.__len__() != 6:
        logging.warn(
            f"Bad request subcribe from {req.META.get('REMOTE_ADDR')}")
        return JsonResponse({'return_code': 400, 'msg': 'bad Request data'})

    try:
        customer: MonthlyCustomer = MonthlyCustomer.objects.get(
            pk=int(req.POST.get('customer')))
    except ValueError:
        return JsonResponse({'return_code': 400, 'msg': 'invalid customer!'})
    except Exception as e:
        logging.error(f"cant get customer at subcribe, {e}")
        return JsonResponse({'return_code': 500, 'msg': 'cant get customer!'})

    try:
        plan = MonthlyPlan.objects.get(
            pk=int(req.POST.get('plan')))
    except ValueError:
        return JsonResponse({'return_code': 400, 'msg': 'invalid plan!'})
    except Exception as e:
        logging.error(f"cant get plan at subcribe, {e}")
        return JsonResponse({'return_code': 500, 'msg': 'cant get plan!'})

    try:
        amount = int(req.POST.get('amount'))
    except Exception as e:
        return JsonResponse({'return_code': 400, 'msg': 'invalid amount!'})

    try:
        cash = int(req.POST.get('cash'))
    except Exception as e:
        return JsonResponse({'return_code': 400, 'msg': 'invalid cash!'})

    try:
        customer.subcribe(plan, amount, cash)
    except Exception as e:
        if e.args[0] == 'error':
            return JsonResponse({'return_code': 400, 'msg': 'transaction error'})
        elif e.args[0] == 'failed':
            return JsonResponse({'return_code': 400, 'msg': 'transaction failed'})
        else:
            logging.error(f'transaction failed, {e}')
            return JsonResponse({'return_code': 500, 'msg': 'transaction failed'})
    return JsonResponse({'return_code': 0, 'msg': 'transaction success'})


def addMonthlyCustomer(req: HttpRequest):
    # TODO: add form to this
    # print(req.POST)
    if req.POST.__len__() > 15 or req.POST.__len__() < 14:
        logging.warn(
            f"Bad request addMonthlyCustomer from {req.META.get('REMOTE_ADDR')}")
        return JsonResponse({'return_code': 400, 'msg': 'bad Request data'})
    try:
        try:
            amount = int(req.POST.get('amount'))
        except Exception as e:
            logging.error('cant get amount!')
            if req.POST.get('pk', True):
                return JsonResponse({'return_code': 400, 'msg': 'invalid amount!'})

        customer = MonthlyCustomer.insert(req.POST)
        customer.subcribe(customer.plan, amount,  customer.plan.price * amount)
        return JsonResponse({'return_code': 0, 'msg': 'ok'})

    except Exception as e:
        if e.args[0] == 'pk':
            return JsonResponse({'return_code': 400, 'msg': 'item not found!'})
        elif e.args[0] == 'plan':
            return JsonResponse({'return_code': 400, 'msg': 'plan not found!'})
        elif e.args[0] == 'sdate':
            return JsonResponse({'return_code': 400, 'msg': 'invalid start date!'})
        elif e.args[0] == 'ddate':
            return JsonResponse({'return_code': 400, 'msg': 'invalid due date!'})
        else:
            logging.error(f'cant addMonthlyCustomer, {e}')
            return JsonResponse({'return_code': 500, 'msg': 'cant add customer, server error!'})

    # Create your views here.
