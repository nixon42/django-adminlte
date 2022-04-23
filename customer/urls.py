from django.urls import path
from . import views
urlpatterns = [
    path('getplan', views.getMonthlyPlan, name='getplan'),
    path('addplan', views.addMonthlyPlan, name='addplan'),
    path('getmonthly', views.getMonthlyCustomer, name='getmonthly'),
    path('addmonthly', views.addMonthlyCustomer, name='addmonthly'),
    path('subcribe', views.subcribe, name='subcribe'),
    path('getinfo', views.getInfo, name='getinfo'),
    path('filter', views.filter, name='filter'),
    path('getlog', views.getTransactionLog, name='getlog'),
    path('getnewcus', views.getNewCustomerLog, name='getnewcustomerlog'),
]
