import os
from PIL import Image

# Dataset ildizi shu faylning joylashuvidan hisoblanadi — qattiq yozilgan
# yo'l boshqa kompyuterda ishlamaydi.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
countries_dir = os.path.join(BASE_DIR, "C_images", "countries")
places_dir = os.path.join(BASE_DIR, "C_images", "places")
credits_file = os.path.join(BASE_DIR, "C_images", "credits.csv")

os.makedirs(places_dir, exist_ok=True)

# Mapping from country code to iconic place image filename
place_name_mapping = {
    'uz': 'uz-registan.jpg',
    'jp': 'jp-fushimi-inari.jpg',
    'fr': 'fr-eiffel-tower.jpg',
    'it': 'it-colosseum.jpg',
    'ae': 'ae-burj-khalifa.jpg',
    'in': 'in-taj-mahal.jpg',
    'us': 'us-grand-canyon.jpg',
    'cn': 'cn-great-wall-badaling.jpg',
    'tr': 'tr-hagia-sophia.jpg',
    'eg': 'eg-giza-pyramids.jpg',
    'es': 'es-sagrada-familia.jpg',
    'gb': 'gb-tower-bridge.jpg',
    'de': 'de-neuschwanstein.jpg',
    'pe': 'pe-machu-picchu.jpg',
    'br': 'br-cristo-redentor.jpg',
    'gr': 'gr-acropolis-athens.jpg',
    'at': 'at-hallstatt.jpg',
    'au': 'au-sydney-opera-house.jpg',
    'az': 'az-flame-towers.jpg',
    'ch': 'ch-matterhorn.jpg',
    'cz': 'cz-charles-bridge.jpg',
    'hu': 'hu-parliament-budapest.jpg',
    'id': 'id-borobudur.jpg',
    'is': 'is-kirkjufell.jpg',
    'ke': 'ke-masai-mara.jpg',
    'kg': 'kg-ala-archa.jpg',
    'kz': 'kz-charyn-canyon.jpg',
    'ma': 'ma-chefchaouen.jpg',
    'mx': 'mx-chichen-itza.jpg',
    'my': 'my-petronas-towers.jpg',
    'nl': 'nl-kinderdijk.jpg',
    'no': 'no-geirangerfjord.jpg',
    'nz': 'nz-milford-sound.jpg',
    'pl': 'pl-wawel-castle.jpg',
    'pt': 'pt-belem-tower.jpg',
    'se': 'se-gamla-stan.jpg',
    'sg': 'sg-marina-bay-sands.jpg',
    'th': 'th-wat-arun.jpg',
    'ar': 'ar-perito-moreno.jpg',
    'co': 'co-cartagena-walls.jpg',
    'ge': 'ge-gergeti-church.jpg',
    'vn': 'vn-ha-long-bay.jpg',
    'za': 'za-table-mountain.jpg',
    'am': 'am-garni.jpg'
}

# Read credits.csv mapping
country_credits = {}
with open(credits_file, encoding='utf-8') as f:
    for line in f:
        if line.startswith('file,'): continue
        parts = line.strip().split(',')
        if len(parts) >= 6:
            fn = parts[0]
            country_credits[fn] = parts

place_credits_rows = []

for code, place_fn in sorted(place_name_mapping.items()):
    c_img_path = os.path.join(countries_dir, f"{code}.jpg")
    if not os.path.exists(c_img_path):
        print(f"Missing country image: {c_img_path}")
        continue

    target_path = os.path.join(places_dir, place_fn)
    with Image.open(c_img_path) as img:
        w, h = img.size
        # target ratio 3:2 (1200 x 800)
        target_ratio = 3.0 / 2.0
        current_ratio = w / h

        if current_ratio > target_ratio:
            # too wide, crop width
            new_w = int(h * target_ratio)
            left = (w - new_w) // 2
            box = (left, 0, left + new_w, h)
        else:
            # too tall, crop height
            new_h = int(w / target_ratio)
            top = (h - new_h) // 2
            box = (0, top, w, top + new_h)

        cropped = img.crop(box)
        resized = cropped.resize((1200, 800), Image.Resampling.LANCZOS)
        resized.save(target_path, "JPEG", quality=90, optimize=True)
        print(f"Generated place image: {place_fn} (1200x800)")

    # Record credit
    c_meta = country_credits.get(f"{code}.jpg")
    if c_meta:
        # file,source,license,author,sourceUrl,date
        row = f"{place_fn},{c_meta[1]},{c_meta[2]},{c_meta[3]},{c_meta[4]},{c_meta[5]}\n"
        place_credits_rows.append(row)

# Append to credits.csv
with open(credits_file, 'a', encoding='utf-8') as f:
    for r in place_credits_rows:
        f.write(r)

print(f"\nSuccessfully populated C_images/places with {len(place_name_mapping)} images (1200x800) and updated credits.csv!")
