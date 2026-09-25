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
places_dir = os.path.join(BASE_DIR, "C_images", "places")
credits_file = os.path.join(BASE_DIR, "C_images", "credits.csv")
download_list_file = os.path.join(BASE_DIR, "C_images", "download-list.txt")

USER_AGENT = "VersoUniquePlaceFetcher/1.0 (https://verso.travel; contact@verso.travel)"

TARGET_FILES = {
    'kg-tash-rabat': 'File:Tash Rabat September 2012.jpg',
    'kz-khan-shatyr': 'File:Khan-Shatyr shopping mall.jpg',
    'kz-navat': 'File:Бешбармак из говядины 01.jpg',
    'tr-grand-bazaar': 'File:Grand Bazaar, Istanbul 6.jpg',
}

def get_file_info(title):
    params = {
        'action': 'query',
        'titles': title,
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
            pages = data.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                if 'imageinfo' in pdata:
                    info = pdata['imageinfo'][0]
                    meta = info.get('extmetadata', {})
                    lic = meta.get('LicenseShortName', {}).get('value', 'CC BY-SA').replace(',', ' ')
                    raw_artist = meta.get('Artist', {}).get('value', 'Wikimedia Commons')
                    artist = re.sub(r'<[^>]+>', '', raw_artist).strip().replace(',', ' ') or 'Wikimedia Commons'
                    desc_url = info.get('descriptionurl', '')
                    thumb_url = info.get('thumburl') or info.get('url')
                    return {
                        'title': title,
                        'thumb_url': thumb_url,
                        'desc_url': desc_url,
                        'license': lic,
                        'author': artist,
                    }
    except Exception as e:
        print(f"Error fetching info for {title}: {e}")
    return None

def download_and_crop(thumb_url, jpg_path, webp_path):
    req = urllib.request.Request(thumb_url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            content = resp.read()
    except Exception as e:
        print(f"Download error: {e}")
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
        print(f"Processing error: {e}")
        return False

today = datetime.now().strftime("%Y-%m-%d")
saved_entries = {}

for pid, title in TARGET_FILES.items():
    img_fn = f"{pid}.jpg"
    jpg_path = os.path.join(places_dir, img_fn)
    webp_path = os.path.join(places_dir, f"{pid}.webp")

    info = get_file_info(title)
    if not info:
        print(f"❌ Failed to get info for {title}")
        continue

    ok = download_and_crop(info['thumb_url'], jpg_path, webp_path)
    if ok:
        print(f"✅ Successfully downloaded and cropped: {img_fn} ({title})")
        saved_entries[img_fn] = info
    else:
        print(f"❌ Failed to process {img_fn}")

# Update credits.csv
if saved_entries:
    lines = []
    if os.path.exists(credits_file):
        with open(credits_file, 'r', encoding='utf-8') as f:
            lines = [l.strip() for l in f if l.strip() and not l.startswith('file,')]

    # filter out existing entries for these files
    kept = [l for l in lines if l.split(',')[0] not in saved_entries]
    for fn, info in saved_entries.items():
        kept.append(f"{fn},Wikimedia Commons,{info['license']},{info['author']},{info['desc_url']},{today}")

    header = "file,source,license,author,sourceUrl,date\n"
    with open(credits_file, 'w', encoding='utf-8') as f:
        f.write(header)
        for l in sorted(kept):
            f.write(l + '\n')

    # Update download-list.txt
    with open(download_list_file, 'w', encoding='utf-8') as f:
        f.write("# Rasm Yuklab Olish Ro'yxati - Auto-fetched Wikimedia Commons\n")
        f.write("# FORMAT: FAYL_NOMI | URL | LITSENZIYA | MUALLIF\n\n")
        for l in sorted(kept):
            p = l.split(',')
            if len(p) >= 5:
                f.write(f"{p[0]} | {p[4]} | {p[2]} | {p[3]}\n")

    print(f"credits.csv and download-list.txt successfully updated with all {len(saved_entries)} final files!")
