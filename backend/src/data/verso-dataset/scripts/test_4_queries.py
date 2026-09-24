import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

USER_AGENT = "VersoUniquePlaceFetcher/1.0 (https://verso.travel; contact@verso.travel)"

def test_query(q):
    params = {
        'action': 'query',
        'generator': 'search',
        'gsrsearch': q,
        'gsrnamespace': 6,
        'gsrlimit': 5,
        'prop': 'imageinfo',
        'iiprop': 'url|size|extmetadata',
        'format': 'json'
    }
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            d = json.loads(r.read().decode('utf-8'))
            pages = d.get('query', {}).get('pages', {})
            print(f"Query '{q}': found {len(pages)} pages")
            for pid, pdata in pages.items():
                title = pdata.get('title', '')
                info = pdata.get('imageinfo', [{}])[0]
                w = info.get('width', 0)
                h = info.get('height', 0)
                print(f"   -> {title} ({w}x{h})")
    except Exception as e:
        print(f"Error {q}: {e}")

# Test Tash Rabat
test_query("Tash Rabat")
test_query("Tash-Rabat")

# Test Khan Shatyr
test_query("Khan Shatyr")
test_query("Khan Shatyry")

# Test Navat / Beshbarmak
test_query("Beshbarmak")
test_query("Kazakh cuisine")

# Test Grand Bazaar
test_query("Kapalicarsi")
test_query("Grand Bazaar Istanbul")
