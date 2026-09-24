import urllib.request
import urllib.parse
import json
import os
import re
import sys
import io
import time
from PIL import Image
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')
USER_AGENT = 'VersoDatasetRefiner/1.0 (https://verso.travel; contact@verso.travel)'
BASE_DIR = r'D:\LoneFoundry-projects\verso-dataset'
COUNTRIES_IMG_DIR = os.path.join(BASE_DIR, 'C_images', 'countries')
CREDITS_PATH = os.path.join(BASE_DIR, 'C_images', 'credits.csv')
DOWNLOAD_LIST_PATH = os.path.join(BASE_DIR, 'C_images', 'download-list.txt')

final_fixes = {
    'br': 'File:Rio skyline and Cristo Redentor from Sugarloaf Mountain, Brazil.jpg',
    'es': 'File:Sagrada Familia, Barcelona (P1170692).jpg',
    'hr': 'File:Dubrovnik in 2014.jpg',
    'co': 'File:Colombia, Cartagena, Plaza de la Aduana.jpg',
    'gr': 'File:Acropolis (48683645092).jpg',
    'am': 'File:Templo de Garni, Armenia, 2016-10-02, DD 03.jpg'
}

today = datetime.now().strftime('%Y-%m-%d')
credits_updates = {}
download_updates = {}

for code, title in sorted(final_fixes.items()):
    time.sleep(1.2)
    print(f"[{code.upper()}] Downloading {title}...")
    params = {
        'action': 'query',
        'titles': title,
        'prop': 'imageinfo',
        'iiprop': 'url|size|extmetadata',
        'iiurlwidth': 1920,
        'format': 'json'
    }
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
        p = list(data.get('query', {}).get('pages', {}).values())[0]
        info = p['imageinfo'][0]
        thumb_url = info.get('thumburl') or info.get('url')
        meta = info.get('extmetadata', {})
        lic = meta.get('LicenseShortName', {}).get('value', 'CC BY-SA').replace(',', ' ')
        raw_artist = meta.get('Artist', {}).get('value', 'Wikimedia Commons')
        artist = re.sub(r'<[^>]+>', '', raw_artist).strip().replace(',', ' ') or 'Wikimedia Commons'
        desc_url = info.get('descriptionurl', '')

        # Download
        req2 = urllib.request.Request(thumb_url, headers={'User-Agent': USER_AGENT})
        with urllib.request.urlopen(req2, timeout=30) as resp2:
            img_bytes = resp2.read()

        img = Image.open(io.BytesIO(img_bytes))
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
        w, h = img.size
        if w > 1920:
            new_h = int(h * (1920 / w))
            img = img.resize((1920, new_h), Image.Resampling.LANCZOS)

        filename = f"{code}.jpg"
        target_path = os.path.join(COUNTRIES_IMG_DIR, filename)
        img.save(target_path, 'JPEG', quality=90, optimize=True)
        print(f"  ✅ Saved {filename}: {img.size[0]}x{img.size[1]} (ratio {round(img.size[0]/img.size[1], 2)})")

        credits_updates[filename] = f"{filename},Wikimedia Commons,{lic},{artist},{desc_url},{today}\n"
        download_updates[filename] = f"{filename} | {thumb_url} | {lic} | {artist}\n"

    except Exception as e:
        print(f"  ❌ Error on {code}: {e}")

# Update credits.csv
lines = []
with open(CREDITS_PATH, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    parts = line.split(',')
    fn = parts[0]
    if fn in credits_updates:
        new_lines.append(credits_updates[fn])
        del credits_updates[fn]
    else:
        new_lines.append(line)

for rem in credits_updates.values():
    new_lines.append(rem)

with open(CREDITS_PATH, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

# Update download-list.txt
d_lines = []
with open(DOWNLOAD_LIST_PATH, 'r', encoding='utf-8') as f:
    d_lines = f.readlines()

new_d_lines = []
for line in d_lines:
    parts = line.split('|')
    fn = parts[0].strip()
    if fn in download_updates:
        new_d_lines.append(download_updates[fn])
        del download_updates[fn]
    else:
        new_d_lines.append(line)

for rem in download_updates.values():
    new_d_lines.append(rem)

with open(DOWNLOAD_LIST_PATH, 'w', encoding='utf-8') as f:
    f.writelines(new_d_lines)

print("Updated 6 images successfully!")
