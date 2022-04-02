def convert_date():
    from .models import AccessPoint
    import datetime
    for ap in AccessPoint.objects.all():
        date = datetime.datetime.strptime(ap._date, '%d/%m/%Y')
        ap.date = date
        ap.save()


def convert_date_2(data):
    import json
    import datetime

    for d in data:
        date = datetime.datetime.strptime(d['fields']['date'], '%d/%m/%Y')
        d['fields']['date'] = date.strftime('%Y-%m-%d')

    return data


def cleanJson(file, search):
    import json

    with open(file, 'r') as f:
        data = json.load(f)

    result = {}
    for s in search:
        result[s] = []
        for k, d in enumerate(data):
            if d['model '] == s:
                result[s].append(data.pop(k))
    return result


def loadap(data):
    from polls.models import AccessPoint

    for d in data:
        AccessPoint.new(d['fields'])
