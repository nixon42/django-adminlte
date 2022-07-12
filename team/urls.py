from django.urls import path
from . import views

urlpatterns = [
    path('login', views._login, name="login"),
    path('logout', views._logout, name="logout"),
    path('getuser', views.getAllUser, name="get all user"),
    path('getrole', views.getAllRole, name="get all role"),
    path('adduser', views.addUser, name="add user"),
    path('getperm', views.getPermission, name="get permission"),
    path('profile', views.getProfile, name="get profile"),
]
