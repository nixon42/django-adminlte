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


def speed_ping(ip='192.168.8', under=10) -> list:
    import routeros_api
    import os
    import asyncio

    conn = routeros_api.RouterOsApiPool('192.168.0.6', username=os.environ.get(
        'ros_user'), password=os.environ.get('ros_passwd'), plaintext_login=True, port=22)

    _under = []
    api = conn.get_api()

    async def _speed(_ip):
        speed = await api.get_resource('/').call('tool/ping-speed',
                                                 {'address': _ip, 'duration': '2'})
        _speed = int(speed[-1].get("average"))/(1024*1024)

        try:
            print(
                f'[{_ip}] [average] : {_speed:.2f} Mbps')
            if _speed == 0:
                return
            if _speed < under:
                _under.append({'ip': _ip, 'speed': int(f"{_speed:.2f}")})
        except Exception as e:
            print(f'[{_ip}][ERR] {e}')

    iters = [_speed(f"{ip}.{x}") for x in range(1, 254)]

    loop = asyncio.get_event_loop()
    loop.run_until_complete(asyncio.gather(*iters))
    loop.close()

    return _under
