import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

targets = {
    'au': 'Sydney Opera House and Harbour Bridge sunset',
    'de': 'Neuschwanstein Castle Bavaria landscape',
    'hu': 'Hungarian Parliament Building Danube river Budapest',
    'mx': 'El Castillo Chichen Itza pyramid landscape',
    'nz': 'Milford Sound Mitre Peak Fiordland New Zealand',
    'pe': 'Machu Picchu ancient inca city landscape',
    'az': 'Baku Flame Towers Caspian Sea evening',
    'at': 'Hallstatt village lake Austria landscape',
    'sg': 'Marina Bay Sands Singapore skyline evening',
    'vn': 'Ha Long Bay islands Vietnam landscape',
    'pt': 'Torre de Belem Lisbon Tagus river',
    'ch': 'Matterhorn Zermatt Switzerland landscape',
    'se': 'Stockholm Gamla Stan Riddarholmen waterfront',
    'ar': 'Perito Moreno Glacier Argentina landscape',
    'uz': 'Registan Samarkand 01'
}

for code, q in targets.items():
    params = {
        'action': 'query',
        'generator': 'search',
        'gsrsearch': q,
        'gsrnamespace': 6,
        'gsrlimit': 8,
        'prop': 'imageinfo',
        'iiprop': 'url|size|extmetadata',
        'format': 'json'
    }
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'User-Agent': 'VersoFix/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=12) as r:
            d = json.loads(r.read().decode('utf-8'))
        print(f"=== [{code.upper()}] {q}")
        for p in d.get('query', {}).get('pages', {}).values():
            if 'imageinfo' in p:
                info = p['imageinfo'][0]
                w, h = info.get('width', 0), info.get('height', 0)
                title = p['title']
                bad = ['map', 'flag', 'plan', 'locator', 'diagram', 'banner', 'painting', 'draw']
                if any(b in title.lower() for b in bad):
                    continue
                if w > h and 1.3 <= (w / h) <= 2.2 and w >= 1600:
                    lic = info.get('extmetadata', {}).get('LicenseShortName', {}).get('value', 'CC')
                    print(f"  MATCH: {title} ({w}x{h}, ratio {round(w/h, 2)}) Lic: {lic}")
    except Exception as e:
        print(f"Error {code}: {e}")
