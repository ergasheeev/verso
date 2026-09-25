import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Dataset ildizi shu faylning joylashuvidan hisoblanadi — qattiq yozilgan
# yo'l boshqa kompyuterda ishlamaydi.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
country_dir = os.path.join(BASE_DIR, "C_images", "countries")
places_dir = os.path.join(BASE_DIR, "C_images", "places")
credits_file = os.path.join(BASE_DIR, "C_images", "credits.csv")
download_list_file = os.path.join(BASE_DIR, "C_images", "download-list.txt")

valid_jpgs = set()
for f in os.listdir(country_dir):
    if f.endswith('.jpg'):
        valid_jpgs.add(f)
for f in os.listdir(places_dir):
    if f.endswith('.jpg'):
        valid_jpgs.add(f)

print(f"Total valid JPG files on disk: {len(valid_jpgs)} (45 country + 331 place = 376)")

# Clean credits.csv
lines = []
with open(credits_file, 'r', encoding='utf-8') as f:
    for line in f:
        if line.strip() and not line.startswith('file,'):
            lines.append(line.strip())

seen = set()
kept = []
for l in lines:
    parts = l.split(',')
    fn = parts[0]
    if fn in valid_jpgs and fn not in seen:
        seen.add(fn)
        kept.append(l)

kept.sort()
header = "file,source,license,author,sourceUrl,date\n"
with open(credits_file, 'w', encoding='utf-8') as f:
    f.write(header)
    for l in kept:
        f.write(l + '\n')

print(f"credits.csv cleaned: {len(kept)} entries (matches {len(seen)} files)")

# Clean download-list.txt
with open(download_list_file, 'w', encoding='utf-8') as f:
    f.write("# Rasm Yuklab Olish Ro'yxati - Auto-fetched Wikimedia Commons\n")
    f.write("# FORMAT: FAYL_NOMI | URL | LITSENZIYA | MUALLIF\n\n")
    for l in kept:
        parts = l.split(',')
        if len(parts) >= 5:
            f.write(f"{parts[0]} | {parts[4]} | {parts[2]} | {parts[3]}\n")

print("download-list.txt cleaned and synchronized!")
