from django.test import TestCase

# Create your tests here.


def test_add_validate_prem_to_group():
    from django.contrib.auth.models import Group, User
    from outlet import utils

    print('create test grp and user ...')
    g: Group = Group.objects.get_or_create(name='test_bndh')[0]
    u: User = User.objects.get_or_create(first_name="test_user")[0]

    print("add perm to group ...")
    utils.add_validate_perm_to_group(g)

    print("add user to group ...")
    u.groups.add(g)

    perm = u.get_all_permissions()
    # print(g.permissions.all())

    if u.has_perm('outlet.can_validate_deposit'):
        print("[OK] test passed ...")
    else:
        print("[FAIL] test failed :( ...")
    print("cleaning ...")
    u.delete()
    g.delete()
    return perm


def test_serialize_permission_obj():
    from django.contrib.auth.models import Permission

    return Permission.objects.get(codename='can_validate_deposit')
