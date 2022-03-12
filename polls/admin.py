from django.contrib.auth.models import User, Group
from .models import AccessPoint, AccessPoint_Report, InventoryType, Inventory, Permission, Area, AccessPoint_UpLog
from django.contrib import admin

# Register your models here.
# admin.site.register(User)
# admin.register(Group)
admin.site.register(Permission)

admin.site.register(Area)
admin.site.register(AccessPoint)
admin.site.register(AccessPoint_Report)

admin.site.register(Inventory)
admin.site.register(InventoryType)
admin.site.register(AccessPoint_UpLog)
