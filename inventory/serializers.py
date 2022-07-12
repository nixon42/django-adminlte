from rest_framework import serializers
from team.serializers import UserSerializer
from polls.models import Inventory, InventoryType
from .models import InvenIN


class IventoryItemSerializers(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ('id', 'name')


class InventoryInSerializers(serializers.ModelSerializer):
    item = IventoryItemSerializers()
    user = UserSerializer()
    fprice = serializers.SerializerMethodField()

    class Meta:
        model = InvenIN
        fields = ('id', 'item', 'amount', 'price', 'fprice', 'user', 'note')

    def get_fprice(self, obj: InvenIN):
        return f'Rp.{obj.price:,d}'
