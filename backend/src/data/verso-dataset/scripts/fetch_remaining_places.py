import os
import re
import json
import urllib.request
import urllib.parse
import sys
import io
import time
from datetime import datetime
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

# Dataset ildizi shu faylning joylashuvidan hisoblanadi — qattiq yozilgan
# yo'l boshqa kompyuterda ishlamaydi.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
index_file = os.path.join(BASE_DIR, "output", "index.ts")
places_dir = os.path.join(BASE_DIR, "C_images", "places")
credits_file = os.path.join(BASE_DIR, "C_images", "credits.csv")
download_list_file = os.path.join(BASE_DIR, "C_images", "download-list.txt")

USER_AGENT = "VersoUniquePlaceFetcher/1.0 (https://verso.travel; contact@verso.travel)"

os.makedirs(places_dir, exist_ok=True)

# 1. Load country titles & all current place image titles to avoid ANY collision
used_titles = set()
if os.path.exists(credits_file):
    with open(credits_file, encoding='utf-8') as f:
        for line in f:
            parts = line.strip().split(',')
            if len(parts) >= 5:
                title = parts[4].split('/')[-1].lower()
                used_titles.add(title)

print(f"Loaded {len(used_titles)} existing titles to avoid collision.")

# 2. Targeted 22 places with curated Wikimedia Commons search queries
TARGET_QUERIES = {
    'az-lahij-coppersmith': [
        'Lahij copper workshop Azerbaijan',
        'Lahij Azerbaijan craft street',
        'Lahic Ismailli Azerbaijan'
    ],
    'br-amazon-tour': [
        'Rio Negro Amazon Manaus Brazil river boat',
        'Meeting of Waters Manaus Brazil',
        'Amazon rainforest Brazil river landscape'
    ],
    'ge-pheasant-tears': [
        'Sighnaghi Kakheti Georgia town panorama',
        'Sighnaghi vineyard Georgia Caucasus',
        'Sighnaghi street Georgia'
    ],
    'hr-motovun-truffle': [
        'Motovun Istria Croatia hill town panorama',
        'Motovun town walls Istria',
        'Motovun Croatia architecture'
    ],
    'in-indian-accent': [
        'Indian fine dining cuisine gourmet plate',
        'Modern Indian gastronomy thali Delhi',
        'Indian restaurant food kebabs curry'
    ],
    'in-pushkar-fair': [
        'Pushkar Lake ghats Rajasthan India temple',
        'Pushkar camel fair desert livestock',
        'Pushkar Brahma temple Rajasthan'
    ],
    'kg-tash-rabat': [
        'Tash Rabat caravanserai Naryn Kyrgyzstan',
        'Tash Rabat stone caravanserai Kyrgyzstan',
        'Tash Rabat interior Kyrgyzstan'
    ],
    'th-damnoen-saduak': [
        'Damnoen Saduak floating market boat fruit Thailand',
        'Damnoen Saduak canals Thailand',
        'Floating market Ratchaburi Thailand'
    ],
    'th-ko-lanta-beach': [
        'Ko Lanta beach sunset Krabi Thailand',
        'Koh Lanta Andaman Sea beach Thailand',
        'Ko Lanta island Thailand nature'
    ],
    'tr-bodrum': [
        'Bodrum Castle St Peter harbour yachts Aegean',
        'Bodrum Castle Aegean Sea Turkey',
        'Bodrum marina view Turkey'
    ],
    'tr-ephesus': [
        'Library of Celsus Ephesus Turkey ruins ancient',
        'Ephesus theatre ruins Turkey',
        'Ancient city of Ephesus Selcuk Turkey'
    ],
    'vn-ba-dinh-square': [
        'Ho Chi Minh Mausoleum Ba Dinh Square Hanoi',
        'Ba Dinh Square Hanoi Vietnam flag',
        'Ho Chi Minh Mausoleum Hanoi Vietnam'
    ],
    'vn-ben-thanh-market': [
        'Ben Thanh Market clock tower Ho Chi Minh City',
        'Ben Thanh Market Saigon exterior',
        'Ben Thanh Market street Ho Chi Minh'
    ],
    'vn-my-son-sanctuary': [
        'My Son Sanctuary Hindu temple ruins Champa',
        'My Son sanctuary Quang Nam Vietnam',
        'My Son temple ruins Vietnam'
    ],
    'vn-pho-gia-truyen': [
        'Vietnamese pho bo beef noodle soup bowl',
        'Pho soup Hanoi Vietnam street food',
        'Vietnamese beef noodle soup pho'
    ],
    'kz-expo': [
        'Nur Alem sphere Astana EXPO Kazakhstan',
        'Nur Alem future energy Astana Kazakhstan',
        'EXPO 2017 Astana pavilion Kazakhstan'
    ],
    'kz-khan-shatyr': [
        'Khan Shatyr Entertainment Center Astana tent',
        'Khan Shatyr Astana architectural structure',
        'Khan Shatyr tent Astana evening'
    ],
    'kz-medeu': [
        'Medeu high-altitude ice rink Almaty mountains',
        'Medeo skating rink Almaty Kazakhstan',
        'Medeu ice speed skating stadium Kazakhstan'
    ],
    'kz-navat': [
        'Kazakh national beshbarmak traditional food dish',
        'Kazakh chaikhana restaurant interior dastarhan',
        'Central Asian traditional tea table dastarhan'
    ],
    'th-chatuchak-market': [
        'Chatuchak weekend market Bangkok stalls crowds',
        'Chatuchak market Bangkok alleys shopping',
        'Chatuchak market Bangkok clock tower'
    ],
    'tr-grand-bazaar': [
        'Grand Bazaar Kapalicarsi covered streets Istanbul lamps',
        'Grand Bazaar Istanbul lanterns stalls alley',
        'Kapalicarsi Istanbul covered market hallway'
    ],
    'tr-karakoy-gulluoglu': [
        'Turkish pistachio baklava pastry Istanbul plate',
        'Turkish baklava dessert pastry Karakoy',
        'Baklava Turkish sweet traditional plate'
    ]
}

def search_wikimedia(query):
    params = {
        'action': 'query',
        'generator': 'search',
        'gsrsearch': query,
        'gsrnamespace': 6,
        'gsrlimit': 12,
        'prop': 'imageinfo',
        'iiprop': 'url|size|extmetadata',
        'iiurlwidth': 1200,
        'format': 'json'
    }
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        return None

    pages = data.get('query', {}).get('pages', {})
    bad_terms = ['flag', 'map', 'coat', 'locator', 'diagram', 'plan', 'chart', 'symbol', 'icon', 'stamp', 'coin', 'drawing', 'logo']

    for pid, pdata in pages.items():
        title = pdata.get('title', '').lower()
        if any(term in title for term in bad_terms):
            continue
        if 'imageinfo' not in pdata:
            continue
        info = pdata['imageinfo'][0]
        w = info.get('width', 0)
        h = info.get('height', 0)

        # must be horizontal landscape
        if w <= h:
            continue
        if w < 600:
            continue

        title_raw = pdata.get('title', '')
        title_norm = title_raw.split(':')[-1].lower()
        if title_raw.lower() in used_titles or title_norm in used_titles:
            continue

        meta = info.get('extmetadata', {})
        lic = meta.get('LicenseShortName', {}).get('value', 'CC BY-SA').replace(',', ' ')
        raw_artist = meta.get('Artist', {}).get('value', 'Wikimedia Commons')
        artist = re.sub(r'<[^>]+>', '', raw_artist).strip().replace(',', ' ') or 'Wikimedia Commons'
        desc_url = info.get('descriptionurl', '')
        thumb_url = info.get('thumburl') or info.get('url')

        return {
            'title': title_raw,
            'thumb_url': thumb_url,
            'desc_url': desc_url,
            'license': lic,
            'author': artist,
            'width': w,
            'height': h
        }
    return None

def download_and_crop(thumb_url, jpg_path, webp_path):
    req = urllib.request.Request(thumb_url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            content = resp.read()
    except Exception as e:
        return False

    try:
        img = Image.open(io.BytesIO(content))
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        w, h = img.size
        target_ratio = 3.0 / 2.0
        if w / h > target_ratio:
            new_w = int(h * target_ratio)
            left = (w - new_w) // 2
            box = (left, 0, left + new_w, h)
        else:
            new_h = int(w / target_ratio)
            top = (h - new_h) // 2
            box = (0, top, w, top + new_h)

        cropped = img.crop(box)
        resized = cropped.resize((1200, 800), Image.Resampling.LANCZOS)
        resized.save(jpg_path, "JPEG", quality=90, optimize=True)
        resized.save(webp_path, "WEBP", quality=85)
        return True
    except Exception as e:
        return False

today = datetime.now().strftime("%Y-%m-%d")
success = 0
failed = 0
results_map = {}

print(f"Fetching remaining {len(TARGET_QUERIES)} target images...")

for place_id, query_list in TARGET_QUERIES.items():
    img_fn = f"{place_id}.jpg"
    jpg_path = os.path.join(places_dir, img_fn)
    webp_path = os.path.join(places_dir, f"{place_id}.webp")

    cand = None
    for q in query_list:
        time.sleep(0.5)
        cand = search_wikimedia(q)
        if cand:
            break

    if not cand:
        print(f"❌ Could not find image for {place_id} with queries: {query_list}")
        failed += 1
        continue

    ok = download_and_crop(cand['thumb_url'], jpg_path, webp_path)
    if ok:
        used_titles.add(cand['title'].lower())
        used_titles.add(cand['title'].split(':')[-1].lower())
        success += 1
        results_map[img_fn] = cand
        print(f"✅ Saved {img_fn} -> {cand['title'][:50]}")
    else:
        print(f"❌ Failed to download {img_fn}")
        failed += 1

print(f"\nTarget Fetch Done: {success} succeeded, {failed} failed.")

# Now update credits.csv
if results_map:
    # Read existing credits lines
    credits_lines = []
    if os.path.exists(credits_file):
        with open(credits_file, 'r', encoding='utf-8') as f:
            credits_lines = f.readlines()

    header = "file,source,license,author,sourceUrl,date\n"
    # Keep lines that aren't in results_map
    kept_lines = []
    for l in credits_lines:
        if not l.strip() or l.startswith('file,'):
            continue
        parts = l.strip().split(',')
        fn = parts[0]
        if fn not in results_map:
            kept_lines.append(l.strip() + '\n')

    # Add updated lines
    for fn, cand in results_map.items():
        kept_lines.append(f"{fn},Wikimedia Commons,{cand['license']},{cand['author']},{cand['desc_url']},{today}\n")

    with open(credits_file, 'w', encoding='utf-8') as f:
        f.write(header)
        for l in sorted(kept_lines):
            f.write(l)

    print(f"credits.csv updated with {len(kept_lines)} total entries!")

    # Update download-list.txt
    with open(download_list_file, 'w', encoding='utf-8') as f:
        f.write("# Rasm Yuklab Olish Ro'yxati - Auto-fetched Wikimedia Commons\n")
        f.write("# FORMAT: FAYL_NOMI | URL | LITSENZIYA | MUALLIF\n\n")
        for l in sorted(kept_lines):
            p = l.strip().split(',')
            if len(p) >= 5:
                f.write(f"{p[0]} | {p[4]} | {p[2]} | {p[3]}\n")

    print("download-list.txt updated!")
