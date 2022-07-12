from rest_framework import serializers
from . import models
from team.serializers import UserSerializer


class OutletSerializers(serializers.ModelSerializer):
    ftotalincome = serializers.SerializerMethodField()
    pk = serializers.SerializerMethodField()

    class Meta:
        model = models.Outlet
        fields = '__all__'
        extra_fields = ['ftotalincome', 'pk']

    def get_pk(self, obj):
        return obj.pk

    def get_ftotalincome(self, obj: models.Outlet):
        return f'Rp.{obj.totalincome:,d}'


class OutletDepositSerializers(serializers.ModelSerializer):
    fdeposit = serializers.SerializerMethodField()
    pk = serializers.SerializerMethodField()
    employe = UserSerializer()
    outlet = OutletSerializers()

    class Meta:
        model = models.OutletDeposit
        fields = '__all__'
        fields_extra = ('pk', 'fdeposit')

    def get_fdeposit(self, obj: models.OutletDeposit):
        return f'Rp.{obj.deposit:,d}'

    def get_pk(self, obj):
        return obj.pk
