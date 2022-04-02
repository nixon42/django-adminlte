def convert_date():
    from .models import AccessPoint
    import datetime
    for ap in AccessPoint.objects.all():
        date = datetime.datetime.strptime(ap._date, '%d/%m/%Y')
        ap.date = date
        ap.save()
