import os
import re
import json
import sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"D:\LoneFoundry-projects\verso-dataset"
issues = []

def flag(cat, item, msg):
    issues.append((cat, item, msg))

print("=== STARTING DEEP AUDIT ===")

# --- 1. AUDIT A_COUNTRIES & output/countries.ts ---
with open(os.path.join(BASE_DIR, "output", "countries.ts"), encoding="utf-8") as f:
    txt = f.read()

start = txt.find('[')
end = txt.find('] as const') + 1
countries = json.loads(txt[start:end])

print(f"Auditing {len(countries)} countries in output/countries.ts...")
for c in countries:
    code = c.get('code')
    # summary
    s = c.get('summary', '')
    if len(s) < 400: flag('A_summary', code, f"Too short ({len(s)} chars, min 400)")
    if len(s) > 600: flag('A_summary', code, f"Too long ({len(s)} chars, max 600)")
    
    # tagline
    t = c.get('tagline', '')
    if len(t) < 30: flag('A_tagline', code, f"Too short ({len(t)} chars, min 30)")
    if len(t) > 60: flag('A_tagline', code, f"Too long ({len(t)} chars, max 60)")
    if not t.endswith('.'): flag('A_tagline', code, "Does not end with a period")
    
    # visaNote
    v = c.get('visaNote', '')
    if len(v) < 50: flag('A_visaNote', code, f"Too short ({len(v)} chars, min 50)")
    if len(v) > 130: flag('A_visaNote', code, f"Too long ({len(v)} chars, max 130)")
    
    # visaCheckedOn
    if not re.match(r'^\d{4}-\d{2}$', c.get('visaCheckedOn', '')):
        flag('A_visaCheckedOn', code, f"Invalid format: {c.get('visaCheckedOn')}")
        
    # name
    if not c.get('name'): flag('A_name', code, "Missing name")
    
    # lat, lng
    if c.get('lat') == 0 and c.get('lng') == 0:
        flag('A_coords', code, "Coords are 0,0")

# --- 2. AUDIT B_PLACES & output/index.ts ---
with open(os.path.join(BASE_DIR, "output", "index.ts"), encoding="utf-8") as f:
    txt = f.read()

start = txt.find('[')
end = txt.find('] as const') + 1
places = json.loads(txt[start:end])

print(f"Auditing {len(places)} places in output/index.ts...")
seen_ids = set()
valid_types = {'attraction', 'restaurant', 'hotel', 'guide'}

for idx, p in enumerate(places):
    pid = p.get('id')
    if not pid:
        flag('B_id', f"Index {idx}", "Missing ID")
    else:
        if pid in seen_ids:
            flag('B_id', pid, "Duplicate ID")
        seen_ids.add(pid)
        if not re.match(r'^[a-z]{2}-[a-z0-9-]+$', pid):
            flag('B_id', pid, f"Invalid ID format: {pid}")

    # type
    if p.get('type') not in valid_types:
        flag('B_type', pid, f"Invalid type: {p.get('type')}")
        
    # priceUSD
    if not isinstance(p.get('priceUSD'), (int, float)):
        flag('B_priceUSD', pid, f"priceUSD is not a number: {p.get('priceUSD')}")
        
    # hours
    if not p.get('hours'):
        flag('B_hours', pid, "Empty hours")
        
    # transport
    if not p.get('transport'):
        flag('B_transport', pid, "Empty transport")
        
    # description
    d = p.get('description', '')
    if len(d) < 140:
        flag('B_desc', pid, f"Description too short ({len(d)} chars)")
    if len(d) > 320:
        flag('B_desc', pid, f"Description too long ({len(d)} chars)")

# --- 3. AUDIT C_IMAGES & credits.csv ---
countries_img_dir = os.path.join(BASE_DIR, "C_images", "countries")
places_img_dir = os.path.join(BASE_DIR, "C_images", "places")
credits_file = os.path.join(BASE_DIR, "C_images", "credits.csv")

with open(credits_file, encoding='utf-8') as f:
    credits_lines = [l.strip() for l in f if l.strip() and not l.startswith('#')]

credited_files = set([l.split(',')[0] for l in credits_lines if not l.startswith('file,')])

print("Auditing country images...")
for c in countries:
    fn = f"{c['code'].lower()}.jpg"
    fp = os.path.join(countries_img_dir, fn)
    if not os.path.exists(fp):
        flag('C_country_img', fn, "File missing on disk")
    if fn not in credited_files:
        flag('C_credits', fn, "Not in credits.csv")

print("Auditing place images...")
p_files = os.listdir(places_img_dir)
print(f"Place images on disk: {len(p_files)} (JPG + WebP)")
for fn in p_files:
    if fn.endswith('.jpg') and fn not in credited_files:
        flag('C_credits', fn, "Place image not in credits.csv")

# --- 4. AUDIT D_TRANSLATIONS & countries.i18n.ts ---
with open(os.path.join(BASE_DIR, "output", "countries.i18n.ts"), encoding="utf-8") as f:
    txt = f.read()

start = txt.find('{')
end = txt.rfind('}') + 1
# Remove ' as const;' at end if any
i18n_str = txt[start:end]
i18n = json.loads(i18n_str)

for lang in ['uz', 'ru', 'zh', 'de', 'fr']:
    if lang not in i18n:
        flag('D_i18n', lang, "Missing language object")
    else:
        for c in countries:
            code = c['code']
            if code not in i18n[lang]:
                flag('D_i18n', f"{lang}/{code}", "Missing country in i18n")
            else:
                entry = i18n[lang][code]
                for req in ['name', 'summary', 'tagline', 'bestSeason', 'visaNote', 'capital']:
                    if not entry.get(req):
                        flag('D_i18n_field', f"{lang}/{code}/{req}", "Empty or missing field")

print("\n" + "=" * 60)
print(f"AUDIT COMPLETED: {len(issues)} issues found.")
print("=" * 60)
for cat, item, msg in issues:
    print(f"[{cat}] {item}: {msg}")
