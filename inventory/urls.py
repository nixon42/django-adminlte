from django.urls import path
from . import views

urlpatterns = [
    path('addinvenin', views.addInvenIn, name="add inven in"),
    path('getinvenin', views.getInvenIn, name="get inven in"),
    path('addinvenout', views.addInvenOut, name="add inven out"),
    path('getinvenout', views.getInvenOut, name="get inven out")
]
