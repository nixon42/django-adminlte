from django.shortcuts import render, redirect
from django.core import serializers
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate, login, logout
from django.http import HttpRequest, JsonResponse
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import RoleSerializer, UserSerializer
import logging
import json

logging = logging.getLogger(__name__)
# Create your views here.


def _login(req: HttpRequest):
    # print(req.POST)
    if req.POST.__len__() != 2:
        logging.warn(
            f"Bad requset team/login from {req.META.get('REMOTE_ADDR')}")
        return JsonResponse({'return_code': 400, 'msg': 'bad request data'})
    user = authenticate(username=req.POST.get('username', ''),
                        password=req.POST.get('password', ''))
    if user is not None:
        login(req, user)
        return JsonResponse({'return_code': 0, 'msg': 'OK'})
    return JsonResponse({'return_code': 401, 'msg': 'invalid username or password'})


@login_required
def _logout(req: HttpRequest):
    logout(req)
    return redirect('/')


@login_required
@api_view(['GET'])
def getAllUser(req: HttpRequest):
    data = User.objects.filter(is_superuser=False).select_related()
    return Response({'return_code': 0, 'msg': 'OK', 'data': UserSerializer(data, many=True).data})


@login_required
@api_view(['GET'])
def getAllRole(req: HttpRequest):
    data = Group.objects.all().order_by('pk').select_related()
    return Response({'return_code': 0, 'msg': 'OK', 'data': RoleSerializer(data, many=True).data})


@login_required
def addPermission(req: HttpRequest):
    pass


@login_required
def addRole(req: HttpRequest):
    if req.POST.__len__() != 1:
        logging.warn(
            f"Bad requset team/addRole from {req.META.get('REMOTE_ADDR')}")
        return JsonResponse({'return_code': 400, 'msg': 'bad request data'})
    if req.POST.get('name', '') == '':
        return JsonResponse({'return_code': 401, 'msg': 'name cant be NULL!'})
    try:
        g = Group.objects.create(name=req.POST.get('name'))
        return JsonResponse({'return_code': 0, 'msg': 'OK'})
    except IntegrityError:
        return JsonResponse({'return_code': 402, 'msg': 'role already exist!'})
    except Exception as e:
        return JsonResponse({'return_code': 500, 'msg': 'server error!'})


@login_required
def addUser(req: HttpRequest):
    if req.POST.__len__() != 7:
        logging.warn(
            f"Bad requset team/adduser from {req.META.get('REMOTE_ADDR')}")
        return JsonResponse({'return_code': 400, 'msg': 'bad request data'})
    if req.POST.get('username', '') == '':
        return JsonResponse({'return_code': 401, 'msg': 'username cant be NULL!'})
    elif req.POST.get('firstname', '') == '':
        return JsonResponse({'return_code': 402, 'msg': 'first name cant be NULL!'})
    elif req.POST.get('role', '') == '':
        return JsonResponse({'return_code': 403, 'msg': 'Invalid Role!'})
    try:
        if req.POST.get('new') == 'true':
            u = User()
        else:
            u = User.objects.get(username=req.POST.get('username'))
        try:
            g = Group.objects.get(pk=int(req.POST.get('role')))
        except Exception as e:
            return JsonResponse({'return_code': 403, 'msg': 'Invalid Role!'})

        u.username = req.POST.get('username')
        u.first_name = req.POST.get('firstname', '')
        u.last_name = req.POST.get('lastname', '')
        u.email = req.POST.get('username') + '@team.rt.net'
        u.save()

        u.groups.clear()
        u.groups.add(g)

        if req.POST.get('password', '') != '':
            u.set_password(req.POST.get('password'))
        return JsonResponse({'return_code': 0, 'msg': 'OK'})
    except IntegrityError:
        logging.error(f'user already exist, {e}')
        return JsonResponse({'return_code': 402, 'msg': 'user already exist'})
    except Exception as e:
        logging.error(f'cant add new user, {e}')
        return JsonResponse({'return_code': 500, 'msg': 'server error!'})


@login_required
def getPermission(req: HttpRequest):
    perm = req.user.get_all_permissions()
    return JsonResponse({'return_code': 0, 'msg': 'OK', 'data': list(perm)})


@login_required
@api_view(['GET'])
def getProfile(r: HttpRequest):
    return Response({'return_code': 0, 'msg': 'OK', 'data': UserSerializer(r.user).data})
