import urllib.request
import urllib.parse
import json
import re
import os
import sys
from datetime import datetime
from PIL import Image
import io

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

COUNTRY_QUERIES = {
    # Asia
    "uz": "Registan Samarkand panorama",
    "jp": "Mount Fuji Chureito Pagoda landscape",
    "cn": "Great Wall of China Mutianyu landscape",
    "th": "Wat Arun Bangkok sunset Chao Phraya",
    "ae": "Burj Khalifa Dubai skyline sunset",
    "tr": "Hagia Sophia Istanbul sunset landscape",
    "in": "Taj Mahal Agra landscape reflecting pool",
    "sg": "Marina Bay Sands Singapore skyline sunset",
    "vn": "Ha Long Bay Vietnam landscape karst",
    "id": "Borobudur temple stupa sunrise landscape",
    "my": "Petronas Twin Towers Kuala Lumpur twilight",
    "kz": "Charyn Canyon Kazakhstan landscape",
    "ge": "Gergeti Trinity Church Kazbegi Caucasus landscape",
    "am": "Garni Temple Armenia landscape mountains",
    "az": "Flame Towers Baku Caspian Sea promenade",
    "kg": "Ala Archa National Park mountains landscape",

    # Europe
    "fr": "Eiffel Tower Paris landscape Champ de Mars",
    "it": "Colosseum Rome landscape dusk sunset",
    "de": "Neuschwanstein Castle landscape autumn",
    "es": "Sagrada Familia Barcelona facade landscape",
    "gb": "Tower Bridge London sunset landscape",
    "nl": "Kinderdijk windmills Netherlands landscape summer",
    "ch": "Matterhorn Zermatt Switzerland mountain landscape",
    "at": "Hallstatt village lake Austria landscape",
    "pt": "Belem Tower Lisbon Portugal sunset landscape",
    "gr": "Parthenon Acropolis Athens evening landscape",
    "cz": "Charles Bridge Prague Castle morning Vltava",
    "hu": "Hungarian Parliament Building Budapest Danube landscape",
    "pl": "Wawel Castle Krakow Vistula river landscape",
    "hr": "Dubrovnik Old Town city walls Adriatic landscape",
    "no": "Geirangerfjord Norway landscape panorama",
    "se": "Gamla Stan Stockholm waterfront sunset landscape",
    "is": "Kirkjufell mountain waterfall Iceland landscape",

    # Americas
    "us": "Grand Canyon South Rim sunset panorama",
    "mx": "Chichen Itza El Castillo pyramid Yucatan landscape",
    "br": "Christ the Redeemer Rio de Janeiro Corcovado panorama",
    "ar": "Iguazu Falls Argentina landscape Garganta",
    "pe": "Machu Picchu ancient inca city sunrise landscape",
    "co": "Cartagena Colombia old city walls Caribbean sunset",

    # Africa / Oceania
    "eg": "Pyramids of Giza Cairo Egypt panorama sunset",
    "ma": "Chefchaouen blue city Morocco panorama landscape",
    "za": "Table Mountain Cape Town panorama sunset landscape",
    "ke": "Masai Mara Kenya savannah landscape acacia",
    "au": "Sydney Opera House Harbour Bridge sunset panorama",
    "nz": "Milford Sound Mitre Peak New Zealand landscape",
}

BASE_DIR = r"D:\LoneFoundry-projects\verso-dataset"
COUNTRIES_IMG_DIR = os.path.join(BASE_DIR, "C_images", "countries")
CREDITS_PATH = os.path.join(BASE_DIR, "C_images", "credits.csv")
DOWNLOAD_LIST_PATH = os.path.join(BASE_DIR, "C_images", "download-list.txt")

os.makedirs(COUNTRIES_IMG_DIR, exist_ok=True)

USER_AGENT = "VersoDatasetFetcher/1.0 (https://verso.travel; contact@verso.travel)"

def clean_text(text):
    if not text:
        return ""
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def search_wikimedia(query):
    params = {
        'action': 'query',
        'generator': 'search',
        'gsrsearch': query,
        'gsrnamespace': 6,
        'gsrlimit': 10,
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
    except Exception as e:
        print(f"  [API Error] {e}")
        return None

    pages = data.get('query', {}).get('pages', {})
    bad_terms = ['flag', 'map', 'coat', 'locator', 'diagram', 'plan', 'chart', 'symbol', 'icon', 'stamp', 'coin']

    best_candidate = None

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
        # ratio at least 1.25 (landscape)
        if (w / h) < 1.2:
            continue
        if w < 1000:
            continue

        meta = info.get('extmetadata', {})
        lic = meta.get('LicenseShortName', {}).get('value', 'CC BY-SA')
        artist = clean_text(meta.get('Artist', {}).get('value', 'Wikimedia Commons')) or 'Wikimedia Commons'
        desc_url = info.get('descriptionurl', '')
        thumb_url = info.get('thumburl') or info.get('url')

        best_candidate = {
            'title': pdata.get('title'),
            'thumb_url': thumb_url,
            'desc_url': desc_url,
            'license': lic,
            'author': artist,
            'width': w,
            'height': h
        }
        break

    return best_candidate

def download_and_process_image(url, target_path):
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read()
    except Exception as e:
        print(f"  [Download Error] {e}")
        return False

    try:
        img = Image.open(io.BytesIO(content))
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        
        # Ensure dimensions
        w, h = img.size
        # Resize if overly large
        if w > 1920:
            new_h = int(h * (1920 / w))
            img = img.resize((1920, new_h), Image.Resampling.LANCZOS)
        
        img.save(target_path, "JPEG", quality=90, optimize=True)
        return True
    except Exception as e:
        print(f"  [Image Process Error] {e}")
        return False

def main():
    print(f"Starting fetch for {len(COUNTRY_QUERIES)} country images...")
    credits_records = []
    download_records = []
    today = datetime.now().strftime("%Y-%m-%d")

    success_count = 0
    for code, query in sorted(COUNTRY_QUERIES.items()):
        filename = f"{code}.jpg"
        target_path = os.path.join(COUNTRIES_IMG_DIR, filename)

        print(f"[{code.upper()}] Searching: '{query}'...")
        cand = search_wikimedia(query)
        if not cand:
            # Fallback search with shorter term
            fallback_query = query.split()[0] + " " + query.split()[1]
            print(f"  Fallback search: '{fallback_query}'...")
            cand = search_wikimedia(fallback_query)

        if not cand:
            print(f"  ❌ No suitable image found for {code.upper()}")
            continue

        print(f"  Found: {cand['title']} ({cand['width']}x{cand['height']}) - Lic: {cand['license']}")
        ok = download_and_process_image(cand['thumb_url'], target_path)
        if ok:
            print(f"  [OK] Saved: {filename}")
            success_count += 1
            # Clean author for CSV (no commas)
            author = cand['author'].replace(',', ' ')
            lic = cand['license'].replace(',', ' ')
            credits_records.append(f"{filename},Wikimedia Commons,{lic},{author},{cand['desc_url']},{today}")
            download_records.append(f"{filename} | {cand['thumb_url']} | {lic} | {author}")
        else:
            print(f"  [FAIL] Failed downloading {filename}")

    # Write credits.csv
    print(f"\nWriting credits.csv ({len(credits_records)} records)...")
    with open(CREDITS_PATH, 'w', encoding='utf-8') as f:
        f.write("file,source,license,author,sourceUrl,date\n")
        for rec in credits_records:
            f.write(rec + "\n")

    # Write download-list.txt
    print(f"Writing download-list.txt...")
    with open(DOWNLOAD_LIST_PATH, 'w', encoding='utf-8') as f:
        f.write("# Rasm Yuklab Olish Ro'yxati - Auto-fetched Wikimedia Commons\n")
        f.write("# FORMAT: FAYL_NOMI | URL | LITSENZIYA | MUALLIF\n")
        f.write("# ---------------------------------------------------------\n\n")
        f.write("## MAMLAKAT RASMLARI (countries/)\n\n")
        for rec in download_records:
            f.write(rec + "\n")

    print(f"\nFINISHED: {success_count}/{len(COUNTRY_QUERIES)} country images processed successfully!")

if __name__ == "__main__":
    main()
