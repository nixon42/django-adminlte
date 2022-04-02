from django.urls import path
from . import views
urlpatterns = [
    path('getplan', views.getMonthlyPlan, name='getplan'),
    path('addplan', views.addMonthlyPlan, name='addplan'),
    path('getmonthly', views.getMonthlyCustomer, name='getmonthly'),
    path('addmonthly', views.addMonthlyCustomer, name='addmonthly'),
    path('subcribe', views.subcribe, name='subcribe')
]
