import os
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"D:\LoneFoundry-projects\verso-dataset"
errors = []
warnings = []

def err(scope, item, msg):
    errors.append(f"[{scope}] {item}: {msg}")

def warn(scope, item, msg):
    warnings.append(f"[{scope}] {item}: {msg}")

print("=== RUNNING GLOBAL HEALTH CHECK ===")

# 1. MOJIBAKE & ENCODING CHECK
print("1. Checking for Mojibake / encoding corruption...")
mojibake_patterns = [
    re.compile(r'\ufffd'),       # Unicode replacement character 
    re.compile(r'Ã[\xa0-\xbf]'), # UTF-8 decoded as Latin-1
    re.compile(r'â€™'),          # Windows-1252 apostrophe artifact
    re.compile(r'â€"'),          # Windows-1252 dash artifact
]

for check_dir in ["A_countries", "B_places", "D_translations", "output"]:
    target = os.path.join(BASE_DIR, check_dir)
    for root, _, files in os.walk(target):
        for fn in files:
            if fn.endswith('.ts') or fn.endswith('.txt') or fn.endswith('.csv'):
                fp = os.path.join(root, fn)
                with open(fp, 'r', encoding='utf-8', errors='replace') as f:
                    content = f.read()
                rel = os.path.relpath(fp, BASE_DIR)
                for pat in mojibake_patterns:
                    m = pat.search(content)
                    if m:
                        err("Encoding", rel, f"Found corrupted character sequence: {m.group(0)!r}")

# 2. OUTPUT COUNTRIES INTEGRITY
print("2. Checking output/countries.ts integrity...")
with open(os.path.join(BASE_DIR, "output", "countries.ts"), encoding="utf-8") as f:
    txt = f.read()

start = txt.find('[')
end = txt.find('] as const') + 1
countries = json.loads(txt[start:end])

all_codes = set()
for c in countries:
    code = c.get('code')
    all_codes.add(code)
    
    # Coordinates check
    lat = c.get('lat')
    lng = c.get('lng')
    if not (-90 <= lat <= 90): err("CountryCoords", code, f"Invalid latitude: {lat}")
    if not (-180 <= lng <= 180): err("CountryCoords", code, f"Invalid longitude: {lng}")
    
    # Driving side
    if c.get('drivingSide') not in ['right', 'left']:
        err("DrivingSide", code, f"Invalid drivingSide: {c.get('drivingSide')}")
        
    # Emergency numbers
    em = c.get('emergency', {})
    for ef in ['police', 'ambulance', 'fire', 'general']:
        if not em.get(ef):
            err("Emergency", code, f"Missing emergency.{ef}")

# 3. OUTPUT PLACES INTEGRITY
print("3. Checking output/index.ts integrity...")
with open(os.path.join(BASE_DIR, "output", "index.ts"), encoding="utf-8") as f:
    txt = f.read()

start = txt.find('[')
end = txt.find('] as const') + 1
places = json.loads(txt[start:end])

places_by_country = {code: 0 for code in all_codes}
for p in places:
    pid = p.get('id')
    c = p.get('country')
    if c not in all_codes:
        err("PlaceCountry", pid, f"Country {c} not in valid countries list")
    else:
        places_by_country[c] += 1
        
    lat = p.get('lat', 0)
    lng = p.get('lng', 0)
    if not (-90 <= lat <= 90) or lat == 0:
        warn("PlaceCoords", pid, f"Suspicious latitude: {lat}")
    if not (-180 <= lng <= 180) or lng == 0:
        warn("PlaceCoords", pid, f"Suspicious longitude: {lng}")
        
    if p.get('priceUSD') < 0:
        err("PlacePrice", pid, f"Negative priceUSD: {p.get('priceUSD')}")

# Verify every country has places
for c, cnt in places_by_country.items():
    if cnt < 5:
        warn("PlacesCoverage", c, f"Has only {cnt} places (min recommended 5)")

# 4. KNOWLEDGE BASE INTEGRITY
print("4. Checking output/knowledge-base.ts integrity...")
with open(os.path.join(BASE_DIR, "output", "knowledge-base.ts"), encoding="utf-8") as f:
    kb_txt = f.read()

kb_start = kb_txt.find('[')
kb_end = kb_txt.find('];') + 1
kb = json.loads(kb_txt[kb_start:kb_end])

if len(kb) != len(places):
    err("KB_Length", "knowledgeBase", f"Length mismatch: KB has {len(kb)}, places has {len(places)}")

# 5. IMAGE INTEGRITY
print("5. Checking images on disk...")
c_dir = os.path.join(BASE_DIR, "C_images", "countries")
p_dir = os.path.join(BASE_DIR, "C_images", "places")

for c in all_codes:
    fn_jpg = f"{c.lower()}.jpg"
    fn_webp = f"{c.lower()}.webp"
    if not os.path.exists(os.path.join(c_dir, fn_jpg)):
        err("CountryImage", fn_jpg, "Missing JPG")
    if not os.path.exists(os.path.join(c_dir, fn_webp)):
        err("CountryImage", fn_webp, "Missing WebP")

# 6. TRANSLATIONS INTEGRITY
print("6. Checking output/countries.i18n.ts integrity...")
with open(os.path.join(BASE_DIR, "output", "countries.i18n.ts"), encoding="utf-8") as f:
    i18n_txt = f.read()

i18n_start = i18n_txt.find('{')
i18n_end = i18n_txt.rfind('}') + 1
i18n = json.loads(i18n_txt[i18n_start:i18n_end])

for lang in ['uz', 'ru', 'zh', 'de', 'fr']:
    if len(i18n[lang]) != 45:
        err("i18n_Coverage", lang, f"Expected 45 countries, found {len(i18n[lang])}")

print("\n" + "=" * 60)
print(f"GLOBAL HEALTH CHECK FINISHED: {len(errors)} ERRORS, {len(warnings)} WARNINGS.")
print("=" * 60)

if warnings:
    print("\nWARNINGS:")
    for w in warnings:
        print("  *", w)

if errors:
    print("\nERRORS:")
    for e in errors:
        print("  !", e)
    sys.exit(1)
else:
    print("\n🎉 GLOBAL CHECK 100% CLEAN: Hech qanday xato yoki kamchilik yo'q!")
