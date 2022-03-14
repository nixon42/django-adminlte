from django.contrib.auth.models import User, Group
from django.core import serializers
from .models import AccessPoint, AccessPoint_Report, AccessPoint_EditLog, AccessPoint_UpDownLog, AccessPoint_UpLog, Action_Log, Area, Inventory, InventoryType
from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse, HttpResponseBadRequest

import logging
logging = logging.getLogger(__name__)


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


def addArea(req: HttpRequest):
    print('cok')
    print(req.POST)
    if req.POST.__len__() > 3:
        logging.warn(
            f"Bad requset addArea from {req.META.get('REMOTE_ADDR')}")
        return JsonResponse({'return_code': 400, 'msg': 'bad request data'})
    try:
        if req.POST.get('pk', False):
            try:
                area = Area.objects.get(pk=int(req.POST.get('pk')))
            except Exception as e:
                logging.error(f'cant get Area ,{e}')
                return JsonResponse({'return_code': 500, 'msg': f'cant get item, LOG:{e}'})
        else:
            area = Area()
        if req.POST.get('name', False):
            area.name = req.POST.get('name')
        else:
            return JsonResponse({'return_code': 400, 'msg': 'Invalid Name'})

        if req.POST.get('code', False):
            area.code = str(req.POST.get('code')).upper()
        else:
            return JsonResponse({'return_code': 400, 'msg': 'Invalid Area Code'})
        area.save()
        return JsonResponse({'return_code': 0, 'msg': 'ok'})
    except Exception as e:
        logging.error(f'cant get Area ,{e}')
        return JsonResponse({'return_code': 500, 'msg': f'cant add item, LOG:{e}'})
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
            f"Bad requset addInvenType from {req.META.get('REMOTE_ADDR')}")
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


def addInven(req: HttpRequest):
    print(req.POST)
    if req.POST.__len__() > 4 or req.POST.__len__() < 3:
        logging.warn(
            f"Bad requset addInven from {req.META.get('REMOTE_ADDR')}")
        return JsonResponse({'return_code': 400, 'msg': 'bad request data'})

    try:
        if req.POST.get('pk', False):
            try:
                inven = Inventory.objects.get(pk=int(req.POST.get('pk')))
            except ValueError:
                logging.error(f'invalid item, {e}')
                return JsonResponse({'return_code': 400, 'msg': 'invalid inventory item'})
            except Exception as e:
                logging.error(f'Cant get inven item, {e}')
                return JsonResponse({'return_code': 400, 'msg': f'cant update item, LOG:{e}'})
        else:
            inven = Inventory()

        invenType = InventoryType.objects.get(pk=int(req.POST.get('type')))
        inven.name = req.POST.get('name', 'Dummy name')
        inven.stock = int(req.POST.get('stock', 0))
        inven.type = invenType
        inven.save()
        return JsonResponse({'return_code': 0, 'msg': 'ok'})
    except ValueError:
        logging.error(f'invalid invenType, {e}')
        return JsonResponse({'return_code': 400, 'msg': 'invalid inventory type'})
    except Exception as e:
        logging.error(f'Failed to add inventory, {e}')
        return JsonResponse({'return_code': 500, 'msg': f'cant add item, LOG: {e}'})


# def addArea(req: HttpRequest):
#     if req.POST.__len__() > 2 or req.POST.__len__() < 1:
#         logging.warn(
#             f"Bad requset addArea from {req.META.get('REMOTE_ADDR')}")
#         return JsonResponse({'return_code': 400, 'msg': 'bad request data'})

#     try:
#         area = Area(name=req.POST.get('name'))
#         area.save()
#         return JsonResponse({'return_code': 0, 'msg': 'ok'})
#     except Exception as e:
#         logging.error(f'cant add new area, {e}')
#         return JsonResponse({'return_code': 500, 'msg': f'failed to add area, LOG: {e}'})
#         # logging


def addAccessPoint(req: HttpRequest):
    print(req.POST)
    if req.POST.__len__() > 20 or req.POST.__len__() < 19:
        logging.warn(
            f"Bad request addAccessPoint from {req.META.get('REMOTE_ADDR')}")
        return JsonResponse({'return_code': 400, 'msg': 'bad request data'})
    try:
        # print(req.POST.get('wifi'))
        AccessPoint.new(req.POST, wifi=req.POST.get('wifi', ''))
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
