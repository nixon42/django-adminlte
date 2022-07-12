from django.shortcuts import render
from django.http import HttpRequest, JsonResponse
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import InvenIN
from .serializers import InventoryInSerializers
from polls.models import Inventory
import logging
# Create your views here.

logging = logging.getLogger(__name__)


@login_required
def addInvenIn(r: HttpRequest):
    # TODO: test this
    if r.POST.__len__() != 4:
        logging.warn(
            f"Bad requset addArea from {r.META.get('REMOTE_ADDR')}")
        return JsonResponse({'return_code': 400, 'msg': 'bad request data'})
    # if r.user.has_perm('inventory.')
    try:
        item = Inventory.objects.get(pk=int(r.POST.get('item', '')))
    except Exception as e:
        logging.error(f'{r.get_full_path_info()}, got {e} : invalid item!')
        return JsonResponse({'return_code': 451, 'msg': 'invalid item!'})

    try:
        amount = int(r.POST.get('amount', ''))
    except Exception as e:
        logging.error(f'{r.get_full_path_info()}, got {e} : invalid amount')
        return JsonResponse({'return_code': 452, 'msg': 'invalid amount!'})

    try:
        price = int(r.POST.get('price', ''))
    except Exception as e:
        logging.error(f'{r.get_full_path_info()}, got {e} : invalid price')
        return JsonResponse({'return_code': 452, 'msg': 'invalid price!'})
    try:
        obj = InvenIN(
            item=item,
            amount=amount,
            price=price,
            user=r.user,
            note=r.POST.get('note', '')
        )
        obj.save()
        return JsonResponse({'return_code': 0, 'msg': 'OK'})
    except Exception as e:
        logging.error(f'{r.get_full_path_info()} got {e} : server error')
        return JsonResponse({'return_code': 500, 'msg': 'Server Error!'})


@login_required
@api_view(['GET'])
def getInvenIn(r: HttpRequest):
    log = InvenIN.objects.order_by('-pk')[:10].select_related()
    return Response({'return_code': 0, 'msg': 'OK', 'data': InventoryInSerializers(log, many=True).data})


def addInvenOut(r: HttpRequest):
    pass


def getInvenOut(r: HttpRequest):
    pass
