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

USER_AGENT = "VersoUniquePlaceFetcher/1.0 (https://verso.travel; contact@verso.travel)"

os.makedirs(places_dir, exist_ok=True)

# 1. Load country titles to NEVER repeat a country image
country_titles = set()
if os.path.exists(credits_file):
    with open(credits_file, encoding='utf-8') as f:
        for line in f:
            parts = line.strip().split(',')
            if len(parts) >= 5 and parts[0].endswith('.jpg') and '-' not in parts[0]:
                title = parts[4].split('/')[-1].lower()
                country_titles.add(title)

print(f"Loaded {len(country_titles)} country titles to exclude from places.")

# 2. Load places from index.ts
with open(index_file, encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.find('] as const') + 1
places = json.loads(text[start:end])

print(f"Total places to process: {len(places)}")

# Curated queries for iconic / non-English places
CUSTOM_QUERIES = {
    # Uzbekistan
    'uz-registan': 'Sher-Dor Madrasah Registan Samarkand courtyard',
    'uz-ark-bukhara': 'Ark of Bukhara fortress wall Uzbekistan',
    'uz-ichan-qala': 'Itchan Kala Khiva minaret Islam Khodja',
    'uz-amir-temur-museum': 'Amir Timur Museum Tashkent cupola',
    'uz-chorsu-bazaar': 'Chorsu Bazaar dome Tashkent market',
    'uz-siyob-bazar': 'Siab Bazaar Samarkand market fruits',
    'uz-plov-center': 'Central Asian pilaf plov cauldron',
    'uz-shohi-zinda': 'Shah-i-Zinda Samarkand blue tile portal',

    # Japan
    'jp-fushimi-inari': 'Fushimi Inari Taisha vermilion torii gates Kyoto',
    'jp-kinkaku-ji': 'Kinkaku-ji Golden Pavilion pond Kyoto reflection',
    'jp-arashiyama-bamboo': 'Arashiyama Bamboo Grove path Kyoto',
    'jp-dotonbori': 'Dotonbori canal Glico sign Osaka night',
    'jp-hiroshima-peace': 'Atomic Bomb Dome Genbaku Hiroshima Peace Memorial',
    'jp-nara-park': 'Nara Park deer Todai-ji Japan',
    'jp-shibuya-crossing': 'Shibuya Crossing Tokyo scramble pedestrian',
    'jp-sukiyabashi-jiro': 'Edomae sushi chef Tokyo restaurant',

    # France
    'fr-eiffel-tower': 'Eiffel Tower from Champ de Mars Paris daytime',
    'fr-louvre': 'Louvre Museum glass pyramid courtyard Paris',
    'fr-mont-saint-michel': 'Mont Saint-Michel abbey island Normandy',
    'fr-versailles': 'Palace of Versailles Hall of Mirrors interior',
    'fr-provence-lavender': 'Provence lavender fields Valensole plateau',
    'fr-le-marais': 'Rue des Rosiers Le Marais Paris street',
    'fr-lyon-bouchon': 'Lyon bouchon restaurant traditional food',

    # Italy
    'it-colosseum': 'Colosseum Rome interior arena perspective',
    'it-vatican-st-peter': 'St. Peter\'s Basilica square Vatican Rome',
    'it-florence-uffizi': 'Piazza della Signoria Uffizi Florence',
    'it-siena-piazza': 'Piazza del Campo Siena Palazzo Pubblico',
    'it-pompeii': 'Pompeii ancient ruins Mount Vesuvius street',
    'it-venice-grand-canal': 'Grand Canal Venice gondola Rialto bridge',
    'it-amalfi-coast': 'Positano cliff village Amalfi coast view',

    # China
    'cn-great-wall-badaling': 'Badaling Great Wall of China watchtower',
    'cn-forbidden-city': 'Forbidden City Hall of Supreme Harmony Beijing',
    'cn-bund-shanghai': 'The Bund waterfront colonial buildings Shanghai',
    'cn-terracotta-army': 'Terracotta Army Pit 1 warriors Xi\'an',
    'cn-chengdu-pandas': 'Giant panda Chengdu Research Base eating bamboo',
    'cn-lijiang-old-town': 'Lijiang Old Town canals Yunnan China',
    'cn-huangshan': 'Yellow Mountain Huangshan granite peaks pines',
    'cn-quanjude-peking-duck': 'Peking roast duck sliced restaurant',

    # USA
    'us-grand-canyon': 'Grand Canyon Mather Point South Rim view',
    'us-yellowstone': 'Grand Prismatic Spring Yellowstone aerial thermals',
    'us-times-square': 'Times Square Manhattan neon billboards New York',
    'us-smithsonian': 'Smithsonian National Air and Space Museum Washington DC',
    'us-french-quarter': 'Bourbon Street French Quarter New Orleans balconies',
    'us-golden-gate': 'Golden Gate Bridge San Francisco vista point',
    'us-chicago-architecture-boat-tour': 'Chicago River architecture boat tour skyline',

    # UAE
    'ae-burj-khalifa': 'Burj Khalifa from Dubai Mall fountain view',
    'ae-dubai-mall': 'The Dubai Mall aquarium indoor waterfall',
    'ae-gold-souk': 'Dubai Gold Souk Deira jewelry shop display',
    'ae-sheikh-zayed-mosque': 'Sheikh Zayed Grand Mosque Abu Dhabi courtyard white marble',
    'ae-desert-safari': 'Dubai desert safari sand dunes 4x4 sunset',
    'ae-palm-jumeirah': 'Palm Jumeirah Atlantis The Palm Dubai aerial',
    'ae-dubai-frame': 'Dubai Frame Zabeel Park golden structure',
    'ae-nobu-dubai': 'Nobu Atlantis Dubai restaurant interior',

    # UK
    'gb-stonehenge': 'Stonehenge megalithic monument Wiltshire England',
    'gb-edinburgh-castle': 'Edinburgh Castle Castle Rock Scotland view',
    'gb-tower-bridge': 'Tower Bridge open river Thames London perspective',
    'gb-big-ben': 'Big Ben clock tower Elizabeth Tower Westminster London',
    'gb-cotswolds': 'Castle Combe Cotswolds village stone cottages',
    'gb-oxford-street': 'Oxford Street London double decker bus shopping',
    'gb-stratford-upon-avon': 'Shakespeare\'s Birthplace Stratford-upon-Avon half-timbered',

    # Germany
    'de-brandenburg-gate': 'Brandenburg Gate Berlin Pariser Platz quadriga',
    'de-neuschwanstein': 'Neuschwanstein Castle Marienbrücke bridge view',
    'de-cologne-cathedral': 'Cologne Cathedral Kölner Dom twin spires Rhine',
    'de-rothenburg': 'Plönlein Rothenburg ob der Tauber medieval corner',
    'de-black-forest': 'Black Forest Schwarzwald dense evergreen trees Baden',
    'de-checkpoint-charlie': 'Checkpoint Charlie Berlin Friedrichstraße guardhouse',
    'de-hofbrauhaus-munich': 'Hofbräuhaus am Platzl Munich beer hall interior',

    # Spain
    'es-sagrada-familia': 'Sagrada Familia Nativity facade interior stained glass',
    'es-alhambra': 'Alhambra Court of the Lions Granada Spain',
    'es-prado-museum': 'Museo del Prado Madrid facade monument Velazquez',
    'es-mezquita-cordoba': 'Mezquita Cordoba red white arches interior',
    'es-park-guell': 'Park Güell mosaic lizard terrace Barcelona',
    'es-la-boqueria': 'Mercat de la Boqueria Barcelona fruit stalls',
    'es-flamenco-seville': 'Flamenco dancer performance Seville Andalusia',

    # India
    'in-taj-mahal': 'Taj Mahal interior marble inlay screen Agra',
    'in-hawa-mahal': 'Hawa Mahal Palace of Winds pink facade Jaipur',
    'in-varanasi-ghats': 'Dashashwamedh Ghat Varanasi Ganges river morning aarti',
    'in-hampi-ruins': 'Vittala Temple stone chariot Hampi Karnataka',
    'in-kerala-backwaters': 'Kerala backwaters traditional houseboat Alleppey',
    'in-pushkar-fair': 'Pushkar camel fair desert Rajasthan livestock',
    'in-qutb-minar': 'Qutb Minar minaret Delhi sandstone balcony',
    'in-karim-delhi': 'Old Delhi Mughlai cuisine kebabs restaurant',

    # Egypt
    'eg-giza-pyramids': 'Great Sphinx of Giza with Khafre pyramid background',
    'eg-cairo-museum': 'Egyptian Museum Tahrir Square Cairo antiquities',
    'eg-karnak-temple': 'Karnak Temple Great Hypostyle Hall columns Luxor',
    'eg-abu-simbel': 'Abu Simbel colossal statues of Ramesses II exterior',
    'eg-nile-cruise': 'Nile cruise felucca sailboat Aswan Luxor',
    'eg-hurghada-reef': 'Red Sea coral reef diving fish Hurghada',
    'eg-khan-el-khalili': 'Khan el-Khalili bazaar lanterns Cairo alleys',

    # Brazil
    'br-cristo-redentor': 'Christ the Redeemer statue head and arms closeup Corcovado',
    'br-iguazu-falls': 'Iguazu Falls Devil\'s Throat walkways foaming water',
    'br-amazon-tour': 'Amazon river meeting of waters Manaus rainforest boat',
    'br-salvador-pelourinho': 'Pelourinho historic center Salvador Bahia colorful houses',
    'br-florianopolis-beach': 'Praia Mole Florianopolis Santa Catarina beach surf',
    'br-chapada-diamantina': 'Morro do Pai Inacio Chapada Diamantina Bahia panorama',
    'br-pantanal-safari': 'Pantanal jaguar wildlife wetland Mato Grosso',

    # Turkey
    'tr-hagia-sophia': 'Hagia Sophia interior dome Byzantine mosaics Istanbul',
    'tr-grand-bazaar': 'Grand Bazaar Kapalıçarşı covered alleys lanterns Istanbul',
    'tr-pamukkale': 'Pamukkale white travertine terraces thermal pools Denizli',
    'tr-ephesus': 'Library of Celsus Ephesus ancient ruins Turkey',
    'tr-cappadocia': 'Cappadocia hot air balloons over fairy chimneys Göreme',
    'tr-galata-tower': 'Galata Tower Beyoğlu Istanbul rooftop view',
    'tr-bodrum': 'Bodrum Castle of St Peter harbor yachts Aegean',
    'tr-nusr-et-istanbul': 'Turkish steakhouse grill meat chef Istanbul',
}

def get_query_for_place(p):
    pid = p['id']
    if pid in CUSTOM_QUERIES:
        return CUSTOM_QUERIES[pid]

    name = p['name']
    city = p['city']
    country = p['country']

    # clean name
    clean = name
    for sep in ['—', '–', '-', ':', '(']:
        if sep in clean:
            clean = clean.split(sep)[0].strip()

    # strip suffixes
    clean = re.sub(r"\b(Milliy Bog'i|Eski Shahri|Tog'i|Muzeyi|Bozori|Qal'asi|Saroyi|Ibodatxonasi|Qishloqlari|Vadiysi|Sharob Vadiysi|Sharsharalari|Ko'chasi|Markazi|Qasri|Ibodotxonasi|Masjidi|Sobori|Hammomi)\b", "", clean, flags=re.IGNORECASE).strip()

    if not clean:
        clean = name.split()[0]

    return f"{clean} {city}".strip()

used_place_titles = set()

def search_wikimedia(query):
    params = {
        'action': 'query',
        'generator': 'search',
        'gsrsearch': query,
        'gsrnamespace': 6,
        'gsrlimit': 8,
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
        if w < 700:
            continue

        # MUST NOT be one of the country cover images
        title_raw = pdata.get('title', '')
        if title_raw.lower() in country_titles or title_raw.split(':')[-1].lower() in country_titles:
            continue

        # MUST NOT be already used by another place
        if title_raw in used_place_titles:
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
new_credits = []
new_downloads = []

print(f"\nSTARTING DOWNLOAD FOR {len(places)} PLACES...")

for i, p in enumerate(places):
    time.sleep(0.85)
    img_fn = p['image']
    jpg_path = os.path.join(places_dir, img_fn)
    webp_path = os.path.join(places_dir, img_fn.replace('.jpg', '.webp'))

    q1 = get_query_for_place(p)
    cand = search_wikimedia(q1)

    if not cand:
        # Fallback 1: Place name and country code/name
        q2 = f"{p['name'].split('—')[0].split('-')[0].strip()} {p['city']}"
        cand = search_wikimedia(q2)

    if not cand:
        # Fallback 2: City and country
        q3 = f"{p['city']} landmark"
        cand = search_wikimedia(q3)

    if not cand:
        print(f"[{i+1}/{len(places)}] ❌ No image found: {p['id']} ({p['name']})")
        failed += 1
        continue

    ok = download_and_crop(cand['thumb_url'], jpg_path, webp_path)
    if ok:
        used_place_titles.add(cand['title'])
        success += 1
        print(f"[{i+1}/{len(places)}] ✅ Saved {img_fn} -> {cand['title'][:45]}")
        new_credits.append(f"{img_fn},Wikimedia Commons,{cand['license']},{cand['author']},{cand['desc_url']},{today}\n")
        new_downloads.append(f"{img_fn} | {cand['thumb_url']} | {cand['license']} | {cand['author']}\n")
    else:
        print(f"[{i+1}/{len(places)}] ❌ Download failed: {img_fn}")
        failed += 1

print(f"\n==========================================")
print(f"PLACES FINISHED: {success} succeeded, {failed} failed.")
print(f"==========================================")

# Update credits.csv: Keep country images intact, replace/add place image credits!
existing_lines = []
if os.path.exists(credits_file):
    with open(credits_file, 'r', encoding='utf-8') as f:
        existing_lines = f.readlines()

header = "file,source,license,author,sourceUrl,date\n"
country_rows = [l for l in existing_lines if l.strip() and not l.startswith('file,') and not '-' in l.split(',')[0]]

with open(credits_file, 'w', encoding='utf-8') as f:
    f.write(header)
    for cr in country_rows:
        f.write(cr if cr.endswith('\n') else cr + '\n')
    for pr in new_credits:
        f.write(pr)

print(f"Updated credits.csv with {len(country_rows)} country images and {len(new_credits)} place images!")

# Update download-list.txt
with open(download_list_file, 'w', encoding='utf-8') as f:
    f.write("# Rasm Yuklab Olish Ro'yxati - Auto-fetched Wikimedia Commons\n")
    f.write("# FORMAT: FAYL_NOMI | URL | LITSENZIYA | MUALLIF\n\n")
    f.write("## MAMLAKAT RASMLARI (countries/)\n")
    for cr in country_rows:
        parts = cr.strip().split(',')
        f.write(f"{parts[0]} | {parts[4]} | {parts[2]} | {parts[3]}\n")
    f.write("\n## JOY RASMLARI (places/)\n")
    for dl in new_downloads:
        f.write(dl)

print("Updated download-list.txt successfully!")
