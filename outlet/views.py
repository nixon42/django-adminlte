from django.shortcuts import render, redirect
from django.core import serializers
from django.http import HttpRequest, JsonResponse
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import OutletSerializers, OutletDepositSerializers
from .models import Outlet, OutletDeposit
from polls.models import Area
import logging
import json
import datetime

logging = logging.getLogger(__name__)
# Create your views here.


@login_required
@api_view(['GET'])
def getOutletList(req: HttpRequest):
    data = Outlet.objects.all()
    return Response({'return_code': 0, 'msg': 'OK', 'data': OutletSerializers(data, many=True).data})


@login_required
@api_view(['GET'])
def getOutletDeposit(req: HttpRequest):
    data = OutletDeposit.objects.filter(
        date__gte=datetime.datetime.now() - datetime.timedelta(days=60)).order_by('-pk')
    return Response({'return_code': 0, 'msg': 'OK', 'data': OutletDepositSerializers(data, many=True).data})


@login_required
def validateDeposit(req: HttpRequest):
    print(req.POST)
    if req.POST.__len__() != 1:
        logging.warn(
            f"Bad request {req.path} from {req.META.get('REMOTE_ADDR')}")
        return JsonResponse({'return_code': 400, 'msg': 'bad request data'})

    if not req.user.has_perm('outlet.can_validate_deposit'):
        return JsonResponse({'return_code': 403, 'msg': 'denied'})

    if req.POST.getlist('item[]').__len__() != 0:
        err = False
        for i in req.POST.getlist('item[]'):
            try:
                deposit: OutletDeposit = OutletDeposit.objects.select_related().get(
                    pk=int(i))
                deposit.validated()
                deposit.outlet.totalincome += deposit.deposit
                deposit.outlet.lastdeposit = datetime.datetime.now()
                deposit.outlet.save()
            except Exception as e:
                err = True
                logging.error(f'{e}, while validate')
                continue
        if err:
            return JsonResponse({'return_code': 401, 'msg': 'invalid item'})
        return JsonResponse({'return_code': 0, 'msg': 'OK'})
    else:
        return JsonResponse({'return_code': 400, 'msg': 'item cant be empty!'})


@login_required
def addDeposit(req: HttpRequest):
    if req.POST.__len__() != 3:
        logging.warn(
            f"Bad request {req.path} from {req.META.get('REMOTE_ADDR')}")
        return JsonResponse({'return_code': 400, 'msg': 'bad request data'})

    # get outlet and user
    try:
        outlet: Outlet = Outlet.objects.get(pk=int(req.POST.get('outlet', '')))
    except Exception as e:
        logging.error(f'cant get outlet, {e}')
        return JsonResponse({'return_code': 401, 'msg': 'invalid outlet!'})

    # get deposit
    try:
        deposit = int(req.POST.get('deposit', ''))
    except Exception as e:
        logging.error(f'invalid deposit value, {e}')
        return JsonResponse({'return_code': 402, 'msg': 'deposit cant be 0!'})

    try:
        # create deposit obj
        deposit = OutletDeposit(
            outlet=outlet,
            employe=req.user,
            deposit=deposit,
            note=req.POST.get('note', '')
        )
        deposit.save()
        return JsonResponse({'return_code': 0, 'msg': 'ok'})

    except Exception as e:
        logging.error(f'invalid deposit value, {e}')
        return JsonResponse({'return_code': 402, 'msg': 'deposit cant be 0!'})


@login_required
def addOutlet(req: HttpRequest):
    if req.POST.__len__() != 11:
        logging.warn(
            f"Bad request {req.path} from {req.META.get('REMOTE_ADDR')}")
        return JsonResponse({'return_code': 400, 'msg': 'bad request data'})

    # get outlet obj
    if req.POST.get('new', 'false') == 'true':
        outlet = Outlet()
    else:
        try:
            outlet = Outlet.objects.get(pk=int(req.POST.get('pk')))
        except Exception as e:
            logging.error(f'got {e} while getting outlet')
            return JsonResponse({'return_code': 401, 'msg': 'Invalid outlet!'})

    # set obj prop
    try:
        outlet.name = req.POST.get('name', '')
        outlet.phone = req.POST.get('phone', '')
        outlet.addr = req.POST.get('addr', '')
        try:
            rt = int(req.POST.get('rt', 0))
        except Exception as e:
            logging.debug('failed to parse rt')
            rt = 0
        try:
            rw = int(req.POST.get('rw', 0))
        except Exception as e:
            logging.debug('failed to parse rw')
            rw = 0
        outlet.rt = rt
        outlet.rw = rw

        try:
            area = Area.objects.get(pk=int(req.POST.get('area', '')))
        except Exception as e:
            logging.debug('failed to get area')
            area = None
        outlet.area = area
        try:
            outlet.lastdeposit = datetime.datetime.strptime(
                req.POST.get('lastdeposit', ''), '%Y-%m-%d')
        except Exception as e:
            logging.debug('failed to parse lastdeposit')
            outlet.lastdeposit = None
        try:
            outlet.totalincome = int(req.POST.get('totalincome'))
        except Exception as e:
            outlet.totalincome = 0
        outlet.note = req.POST.get('note', '')
        outlet.save()

        return JsonResponse({'return_code': 0, 'msg': 'OK'})
    except Exception as e:
        logging.error(
            f'got {e}, on {req.path} from {req.META.get("REMOTE_ADD")}')
        return JsonResponse({'return_code': 500, 'msg': 'Server Error'})
