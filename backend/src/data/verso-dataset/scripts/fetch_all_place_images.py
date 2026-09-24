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

BASE_DIR = r"D:\LoneFoundry-projects\verso-dataset"
index_file = os.path.join(BASE_DIR, "output", "index.ts")
places_dir = os.path.join(BASE_DIR, "C_images", "places")
credits_file = os.path.join(BASE_DIR, "C_images", "credits.csv")
download_list_file = os.path.join(BASE_DIR, "C_images", "download-list.txt")

USER_AGENT = "VersoPlaceImageFetcher/1.0 (https://verso.travel; contact@verso.travel)"

os.makedirs(places_dir, exist_ok=True)

with open(index_file, encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.find('] as const') + 1
places = json.loads(text[start:end])

existing_files = set(os.listdir(places_dir))
missing_places = [p for p in places if p.get('image') and p.get('image') not in existing_files]

print(f"Total places in database: {len(places)}")
print(f"Already downloaded: {len(places) - len(missing_places)}")
print(f"To download: {len(missing_places)}")

def clean_title_for_query(name, city):
    # Remove Uzbek decorators
    n = name
    for sep in ['—', '-', '–', ':']:
        if sep in n:
            n = n.split(sep)[0].strip()
    
    # Strip common suffixes
    n = re.sub(r"\b(Milliy Bog'i|Eski Shahri|Tog'i|Muzeyi|Bozori|Qal'asi|Saroyi|Ibodatxonasi|Qishloqlari|Vadiysi|Sharob Vadiysi|Sharsharalari|Ko'chasi|Markazi)\b", "", n, flags=re.IGNORECASE)
    n = n.strip()
    if not n:
        n = name.split()[0]
    return f"{n} {city}".strip()

def search_wikimedia(query):
    params = {
        'action': 'query',
        'generator': 'search',
        'gsrsearch': query,
        'gsrnamespace': 6,
        'gsrlimit': 6,
        'prop': 'imageinfo',
        'iiprop': 'url|size|extmetadata',
        'iiurlwidth': 1200,
        'format': 'json'
    }
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        return None

    pages = data.get('query', {}).get('pages', {})
    bad_terms = ['flag', 'map', 'coat', 'locator', 'diagram', 'plan', 'chart', 'symbol', 'icon', 'stamp', 'coin', 'drawing']

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
        if w < 800:
            continue

        meta = info.get('extmetadata', {})
        lic = meta.get('LicenseShortName', {}).get('value', 'CC BY-SA').replace(',', ' ')
        raw_artist = meta.get('Artist', {}).get('value', 'Wikimedia Commons')
        artist = re.sub(r'<[^>]+>', '', raw_artist).strip().replace(',', ' ') or 'Wikimedia Commons'
        desc_url = info.get('descriptionurl', '')
        thumb_url = info.get('thumburl') or info.get('url')

        return {
            'title': pdata.get('title'),
            'thumb_url': thumb_url,
            'desc_url': desc_url,
            'license': lic,
            'author': artist,
            'width': w,
            'height': h
        }
    return None

def download_and_save(thumb_url, jpg_path, webp_path):
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

for i, p in enumerate(missing_places):
    time.sleep(0.9)
    img_fn = p['image']
    jpg_path = os.path.join(places_dir, img_fn)
    webp_path = os.path.join(places_dir, img_fn.replace('.jpg', '.webp'))

    q1 = clean_title_for_query(p['name'], p['city'])
    cand = search_wikimedia(q1)
    if not cand:
        # Fallback 1: Just name without city
        q2 = p['name'].split('—')[0].split('-')[0].strip()
        cand = search_wikimedia(q2)
    if not cand:
        # Fallback 2: City and country
        q3 = f"{p['city']} landmark"
        cand = search_wikimedia(q3)

    if not cand:
        print(f"[{i+1}/{len(missing_places)}] ❌ Not found: {p['name']} ({p['city']})")
        failed += 1
        continue

    ok = download_and_save(cand['thumb_url'], jpg_path, webp_path)
    if ok:
        print(f"[{i+1}/{len(missing_places)}] ✅ Saved {img_fn} ({cand['title'][:40]})")
        success += 1

        # Append to credits.csv
        with open(credits_file, 'a', encoding='utf-8') as cf:
            cf.write(f"{img_fn},Wikimedia Commons,{cand['license']},{cand['author']},{cand['desc_url']},{today}\n")

        # Append to download-list.txt
        with open(download_list_file, 'a', encoding='utf-8') as df:
            df.write(f"{img_fn} | {cand['thumb_url']} | {cand['license']} | {cand['author']}\n")
    else:
        print(f"[{i+1}/{len(missing_places)}] ❌ Download failed: {img_fn}")
        failed += 1

print(f"\n==========================================")
print(f"DOWNLOAD SUMMARY: {success} succeeded, {failed} failed.")
print(f"==========================================")
