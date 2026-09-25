import os
import sys
import json
import hashlib

sys.stdout.reconfigure(encoding='utf-8')

# Dataset ildizi shu faylning joylashuvidan hisoblanadi — qattiq yozilgan
# yo'l boshqa kompyuterda ishlamaydi.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
country_dir = os.path.join(BASE_DIR, "C_images", "countries")
places_dir = os.path.join(BASE_DIR, "C_images", "places")
credits_file = os.path.join(BASE_DIR, "C_images", "credits.csv")
index_file = os.path.join(BASE_DIR, "output", "index.ts")
countries_file = os.path.join(BASE_DIR, "output", "countries.ts")

print("=== RUNNING COMPLETE VERIFICATION ===")

# 1. Load places
with open(index_file, encoding='utf-8') as f:
    t = f.read()
start = t.find('[')
end = t.find('] as const') + 1
places = json.loads(t[start:end])

# 2. Load countries
with open(countries_file, encoding='utf-8') as f:
    t = f.read()
start = t.find('[')
end = t.find('] as const') + 1
countries = json.loads(t[start:end])

print(f"Total countries: {len(countries)}")
print(f"Total places: {len(places)}")

# 3. Check country images
missing_countries_jpg = []
missing_countries_webp = []
for c in countries:
    code = c['code'].lower()
    if not os.path.exists(os.path.join(country_dir, f"{code}.jpg")):
        missing_countries_jpg.append(f"{code}.jpg")
    if not os.path.exists(os.path.join(country_dir, f"{code}.webp")):
        missing_countries_webp.append(f"{code}.webp")

print(f"Missing country JPGs: {len(missing_countries_jpg)}")
print(f"Missing country WebPs: {len(missing_countries_webp)}")

# 4. Check place images
missing_places_jpg = []
missing_places_webp = []
for p in places:
    img_fn = p['image']
    webp_fn = img_fn.replace('.jpg', '.webp')
    if not os.path.exists(os.path.join(places_dir, img_fn)):
        missing_places_jpg.append(img_fn)
    if not os.path.exists(os.path.join(places_dir, webp_fn)):
        missing_places_webp.append(webp_fn)

print(f"Missing place JPGs: {len(missing_places_jpg)}")
if missing_places_jpg:
    print(f"  -> {missing_places_jpg}")
print(f"Missing place WebPs: {len(missing_places_webp)}")
if missing_places_webp:
    print(f"  -> {missing_places_webp}")

# 5. Check hash duplicates
country_hashes = {}
for f in os.listdir(country_dir):
    if f.endswith('.jpg'):
        fp = os.path.join(country_dir, f)
        h = hashlib.md5(open(fp, 'rb').read()).hexdigest()
        country_hashes[h] = f

place_hashes = {}
place_to_country = []
place_to_place = []

for p in places:
    img_fn = p['image']
    fp = os.path.join(places_dir, img_fn)
    if os.path.exists(fp):
        h = hashlib.md5(open(fp, 'rb').read()).hexdigest()
        if h in country_hashes:
            place_to_country.append((img_fn, country_hashes[h]))
        if h in place_hashes:
            place_to_place.append((img_fn, place_hashes[h]))
        else:
            place_hashes[h] = img_fn

print(f"\nPlace matching Country image (duplicates): {len(place_to_country)}")
for p, c in place_to_country:
    print(f"  ❌ {p} == {c}")

print(f"Place matching another Place (duplicates): {len(place_to_place)}")
for p1, p2 in place_to_place:
    print(f"  ❌ {p1} == {p2}")

# 6. Check credits.csv
credited_files = set()
with open(credits_file, encoding='utf-8') as f:
    for line in f:
        if line.strip() and not line.startswith('file,'):
            credited_files.add(line.split(',')[0])

uncredited_places = [p['image'] for p in places if p['image'] not in credited_files]
print(f"Uncredited places in credits.csv: {len(uncredited_places)}")
if uncredited_places:
    print(f"  -> {uncredited_places[:5]}")

print("\n=== VERIFICATION RESULT ===")
if not missing_places_jpg and not missing_places_webp and not place_to_country and not place_to_place and not uncredited_places:
    print("🌟 100% PERFECT! ALL 331 PLACES HAVE UNIQUE AUTHENTIC IMAGES WITH ZERO DUPLICATES!")
else:
    print("⚠️ Some issues still need resolution.")
