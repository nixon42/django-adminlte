def add_validate_perm_to_group(groupobj):
    from django.contrib.auth.models import Group, Permission
    from django.contrib.contenttypes.models import ContentType

    ct = ContentType.objects.get(app_label='outlet', model='outletdeposit')
    perm = Permission.objects.get_or_create(
        codename='can_validate_deposit', name="Can Validate Deposit", content_type=ct)[0]

    groupobj.permissions.add(perm)
