from django.urls import path
from . import views

urlpatterns = [
    path('login', views.login, name='login'),
    path('register', views.register, name='register'),
    path('getap', views.getAccessPoint, name='getap'),
    path('addap', views.addAccessPoint, name='addap'),
    path('getarea', views.getArea, name='getarea'),
    path('addarea', views.addArea, name='addarea'),
    path('getinvent', views.getInvenType, name='getInvenType'),
    path('addinvent', views.addInvenType, name='addInvenType'),
    path('getinven', views.getInven, name='getInven'),
    path('addinven', views.addInven, name='addInven'),
    path('getapup', views.getApUp, name='getapup'),
    path('', views.dashboard, name='index'),
]
