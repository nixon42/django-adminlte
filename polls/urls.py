from django.urls import path
from . import views

urlpatterns = [
    path('login', views.login, name='login'),
    path('register', views.register, name='register'),
    path('getap', views.getAccessPoint, name='getap'),
    path('addap', views.addAccessPoint, name='addap'),
    path('getarea', views.getArea, name='getarea'),
    path('getinvent', views.getInvenType, name='getInvenType'),
    path('addinvent', views.addInvenType, name='addInvenType'),
    path('getinven', views.getInven, name='getInven'),
    path('', views.dashboard, name='index'),
]
