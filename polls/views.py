from django.contrib.auth.models import User, Group
from django.core import serializers
from .models import AccessPoint, AccessPoint_Report, AccessPoint_EditLog, AccessPoint_UpDownLog, AccessPoint_UpLog, Action_Log, Area, Inventory, InventoryType
from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse, HttpResponseBadRequest

import logging


def index(request: HttpRequest):
    return render(request, 'polls/starter.html')


def login(request: HttpRequest):
    return render(request, 'polls/login.html')


def register(request: HttpRequest):
    return render(request, 'polls/register.html')


def dashboard(request: HttpRequest):
    return render(request, 'polls/dashboard.html')


def getAccessPoint(req: HttpRequest):
    data = serializers.serialize('json', AccessPoint.objects.all())
    return JsonResponse({'return_code': 0, 'msg': 'ok', 'data': data})


def getArea(req: HttpRequest):
    data = serializers.serialize('json', Area.objects.all())
    return JsonResponse({'return_code': 0, 'msg': 'ok', 'data': data})


def getInvenType(req: HttpRequest):
    data = serializers.serialize('json', InventoryType.objects.all())
    return JsonResponse({'return_code': 0, 'msg': 'ok', 'data': data})


def getInven(req: HttpRequest):
    data = serializers.serialize('json', Inventory.objects.all())
    return JsonResponse({'return_code': 0, 'msg': 'ok', 'data': data})


def addInvenType(req: HttpRequest):
    print(req.POST)
    if req.POST.__len__() > 2:
        logging.warn(
            f"Bad requset addArea from {req.META.get('REMOTE_ADDR')}")
        return JsonResponse({'return_code': 400, 'msg': 'bad request data'})

    try:
        if req.POST.get('pk', False):
            # print('update')
            try:
                it = InventoryType.objects.get(pk=int(req.POST.get('pk')))
            except Exception as e:
                logging.error(f'cant get Inventory Type, {e}')
                return JsonResponse({'return_code': 500, 'msg': f'cant get item, LOG: {e}'})
        else:
            # print('baru')
            it = InventoryType()

        if req.POST.get('name', False):
            it.name = req.POST.get('name')
        else:
            return JsonResponse({'retrn_code': 400, 'msg': 'bad inventory type name'})

        it.save()
        return JsonResponse({'return_code': 0, 'msg': 'ok'})
    except Exception as e:
        logging.error(f'faile addInvenType, {e}')
        return JsonResponse({'return_code': 500, 'msg': f'cant add inventory type, LOG: {e}'})


def addArea(req: HttpRequest):
    if req.POST.__len__() != 1:
        logging.warn(
            f"Bad requset addArea from {req.META.get('REMOTE_ADDR')}")
        return JsonResponse({'return_code': 400, 'msg': 'bad request data'})
    try:
        area = Area(name=req.POST.get('name'))
        area.save()
        return JsonResponse({'return_code': 0, 'msg': 'ok'})
    except Exception as e:
        logging.error(f'cant add new area, {e}')
        return JsonResponse({'return_code': 500, 'msg': f'failed to add area, LOG: {e}'})
        # logging


def addAccessPoint(req: HttpRequest):
    print(req.POST)
    if req.POST.__len__() > 20 or req.POST.__len__() < 19:
        logging.warn(
            f"Bad request addAccessPoint from {req.META.get('REMOTE_ADDR')}")
        return JsonResponse({'return_code': 400, 'msg': 'bad request data'})
    try:
        AccessPoint.new(req.POST)
        return JsonResponse({'return_code': 0, 'msg': 'Ok'})
    except Exception as e:
        print(e)
        if e.args[0] == 'rt':
            logging.error('invalid rt or rw')
            return JsonResponse({'return_code': 400, 'msg': 'RT or RW are invalid'})
        elif e.args[0] == 'ip':
            logging.error('invalid ip')
            return JsonResponse({'return_code': 400, 'msg': 'Invalid IP'})
        elif e.args[0] == 'area':
            logging.error('invalid area')
            return JsonResponse({'return_code': 400, 'msg': 'Invalid area'})
        elif e.args[0] == 'router':
            logging.error('invalid router')
            return JsonResponse({'return_code': 400, 'msg': 'Invalid router'})
        elif e.args[0] == 'converter':
            logging.error('invalid converter')
            return JsonResponse({'return_code': 400, 'msg': 'Invalid converter'})
        else:
            logging.error(f'cant add new ap, {e}')
            return JsonResponse({'return_code': 500, 'msg': f'failed to insert data, contact admin, \n LOG : {e}'})


# Create your views here.
