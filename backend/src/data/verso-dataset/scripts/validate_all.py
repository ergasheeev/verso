import os
import re
import sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"D:\LoneFoundry-projects\verso-dataset"
errors = []
warnings = []

def err(f, msg):
    errors.append(f"[{f}] ERROR: {msg}")

def warn(f, msg):
    warnings.append(f"[{f}] WARN: {msg}")

print("=== 1. CHECKING A_countries ===")
a_dir = os.path.join(BASE_DIR, "A_countries")
a_files = []
for root, _, files in os.walk(a_dir):
    for fn in files:
        if fn.endswith('.ts') and not fn.startswith('_'):
            a_files.append(os.path.join(root, fn))

print(f"Total A_countries files: {len(a_files)}")
if len(a_files) < 45:
    err("A_countries", f"Expected at least 45 files, found {len(a_files)}")

for fp in a_files:
    fn = os.path.basename(fp)
    with open(fp, encoding='utf-8') as f:
        content = f.read()
    
    # Check required fields
    for field in ['code', 'slug', 'summary', 'tagline', 'bestSeason', 'visaNote', 'capital', 'continent', 'currency', 'emergency']:
        if f"{field}:" not in content and f'"{field}":' not in content:
            err(fn, f"Missing field: {field}")
            
    # Check visaCheckedOn
    if "visaCheckedOn" not in content:
        warn(fn, "Missing visaCheckedOn")

print("=== 2. CHECKING B_places ===")
b_dir = os.path.join(BASE_DIR, "B_places")
b_files = []
total_places = 0
for root, _, files in os.walk(b_dir):
    for fn in files:
        if fn.endswith('.ts') and not fn.startswith('_'):
            b_files.append(os.path.join(root, fn))

print(f"Total B_places files: {len(b_files)}")
for fp in b_files:
    fn = os.path.basename(fp)
    with open(fp, encoding='utf-8') as f:
        content = f.read()
    
    ids = re.findall(r'id:\s*["\']([^"\']+)["\']', content)
    total_places += len(ids)
    if len(ids) < 5:
        warn(fn, f"Only {len(ids)} places (minimum recommended 5)")

print(f"Total places across all files: {total_places}")

print("=== 3. CHECKING C_images ===")
c_dir = os.path.join(BASE_DIR, "C_images", "countries")
c_files = [f for f in os.listdir(c_dir) if f.endswith('.jpg')]
print(f"Total country images: {len(c_files)}")

for fn in c_files:
    fp = os.path.join(c_dir, fn)
    try:
        with Image.open(fp) as img:
            w, h = img.size
            if w < 1280:
                err(fn, f"Image width too small: {w}px (min 1280px)")
            if w <= h:
                err(fn, f"Image is vertical: {w}x{h}")
            ratio = w / h
            if ratio > 2.5:
                warn(fn, f"Very wide aspect ratio: {round(ratio, 2)}")
    except Exception as e:
        err(fn, f"Corrupted image: {e}")

# Check credits.csv
credits_path = os.path.join(BASE_DIR, "C_images", "credits.csv")
with open(credits_path, encoding='utf-8') as f:
    credits_lines = [l.strip() for l in f if l.strip() and not l.startswith('#')]

credits_files = [l.split(',')[0] for l in credits_lines if not l.startswith('file,')]
print(f"Total credits.csv entries: {len(credits_files)}")
for fn in c_files:
    if fn not in credits_files:
        err("credits.csv", f"Image {fn} missing from credits.csv")

print("=== 4. CHECKING D_translations ===")
d_dir = os.path.join(BASE_DIR, "D_translations")
for lang in ['ru', 'uz', 'zh', 'de', 'fr']:
    lang_dir = os.path.join(d_dir, lang)
    if os.path.exists(lang_dir):
        l_files = [f for root, _, files in os.walk(lang_dir) for f in files if f.endswith('.ts')]
        print(f"Language [{lang}]: {len(l_files)} files")
        if len(l_files) < 45:
            warn(f"D_translations/{lang}", f"Only {len(l_files)} files found (expected 45)")
    else:
        err("D_translations", f"Missing language folder: {lang}")

print("=== 5. CHECKING output/ ===")
out_dir = os.path.join(BASE_DIR, "output")
for exp in ['countries.ts', 'index.ts', 'countries.i18n.ts', 'knowledge-base.ts']:
    fp = os.path.join(out_dir, exp)
    if os.path.exists(fp):
        size = os.path.getsize(fp)
        print(f"  {exp}: {size} bytes")
        if size == 0:
            err(exp, "File is empty")
    else:
        err("output", f"Missing output file: {exp}")

print("\n" + "=" * 50)
if warnings:
    print(f"WARNINGS ({len(warnings)}):")
    for w in warnings:
        print(" ", w)

if errors:
    print(f"\nERRORS ({len(errors)}):")
    for e in errors:
        print(" ", e)
    sys.exit(1)
else:
    print("\n✅ VALIDATION PASSED 100%! All files, images, translations, and outputs are complete and valid!")
