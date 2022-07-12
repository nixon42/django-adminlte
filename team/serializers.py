from rest_framework import serializers
from django.contrib.auth.models import User, Group, Permission


class PermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ('codename', 'name')


class RoleSerializer(serializers.ModelSerializer):
    member = serializers.SerializerMethodField('get_count')

    class Meta:
        model = Group
        fields = ('id', 'name', 'member')

    def get_count(self, instance: Group):
        return instance.user_set.count()


class UserSerializer(serializers.ModelSerializer):
    # role = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField('get_role')

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'username', 'role')

    def get_role(self, instance: User):
        return RoleSerializer(instance.groups.all()[0]).data
