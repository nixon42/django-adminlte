from django.urls import path
from . import views

urlpatterns = [
    path('getoutlet', views.getOutletList, name="getoutlet"),
    path('addoutlet', views.addOutlet, name="addoutlet"),
    path('getdeposit', views.getOutletDeposit, name="getdeposit"),
    path('adddeposit', views.addDeposit, name="adddeposit"),
    path('validate', views.validateDeposit, name="validate deposit"),
]
