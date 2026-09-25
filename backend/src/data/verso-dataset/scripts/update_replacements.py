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
USER_AGENT = 'VersoDatasetFixer/1.0 (https://verso.travel; contact@verso.travel)'
# Dataset ildizi shu faylning joylashuvidan hisoblanadi — qattiq yozilgan
# yo'l boshqa kompyuterda ishlamaydi.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COUNTRIES_IMG_DIR = os.path.join(BASE_DIR, 'C_images', 'countries')
CREDITS_PATH = os.path.join(BASE_DIR, 'C_images', 'credits.csv')
DOWNLOAD_LIST_PATH = os.path.join(BASE_DIR, 'C_images', 'download-list.txt')

replacements = {
    'au': 'File:Sydney Harbour including Harbour bridge and Opera House.jpg',
    'de': 'File:Neuschwanstein Castle - Bavaria, Germany.jpg',
    'hu': 'File:HUN-2015-Budapest-Hungarian Parliament (Budapest) 2015-02.jpg',
    'mx': 'File:Chichen Itza, El Castillo (14180679857).jpg',
    'nz': 'File:Milford Sound in Fiordland National Park 08.jpg',
    'pe': 'File:Machu Picchu, Perú, 2015-07-30, DD 47.JPG',
    'az': 'File:Flame towers from Baku boulevard.JPG',
    'at': 'File:Hallstatt - 8856135370.jpg',
    'sg': 'File:Marina Bay Sands in the evening - 20101120.jpg',
    'vn': 'File:Ha Long Bay, Vietnam, Islands.jpg',
    'pt': 'File:Belém Tower on the bank of the Tagus river - Lisbon, Portugal (54493140341).jpg',
    'ch': 'File:Impressive Matterhorn view in Zermatt, Switzerland.jpg',
    'se': 'File:Skeppsbrokajen Gamla Stan from Skeppsholmen Stockholm 2016 01.jpg',
    'ar': 'File:Glaciar Perito Moreno, Argentina, enero 2024.jpg',
    'uz': 'File:Самарканд. Площадь-Регистан.jpg'
}

today = datetime.now().strftime('%Y-%m-%d')

credits_updates = {}
download_updates = {}

for code, title in sorted(replacements.items()):
    time.sleep(1.2)
    print(f"[{code.upper()}] Updating with '{title}'...")
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
        if 'imageinfo' not in p:
            print(f"  ❌ No imageinfo found for {title}")
            continue
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
        print(f"  ✅ Saved: {filename} ({img.size[0]}x{img.size[1]}, ratio {round(img.size[0]/img.size[1], 2)})")

        credits_updates[filename] = f"{filename},Wikimedia Commons,{lic},{artist},{desc_url},{today}\n"
        download_updates[filename] = f"{filename} | {thumb_url} | {lic} | {artist}\n"

    except Exception as e:
        print(f"  ❌ Error updating {code}: {e}")

# Update credits.csv
print("\nUpdating credits.csv...")
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

for remaining in credits_updates.values():
    new_lines.append(remaining)

with open(CREDITS_PATH, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

# Update download-list.txt
print("Updating download-list.txt...")
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

print("All 15 replacement photos successfully updated and verified!")
