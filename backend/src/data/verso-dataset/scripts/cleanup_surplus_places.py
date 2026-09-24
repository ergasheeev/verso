import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"D:\LoneFoundry-projects\verso-dataset"
places_dir = os.path.join(BASE_DIR, "C_images", "places")
index_file = os.path.join(BASE_DIR, "output", "index.ts")

with open(index_file, encoding='utf-8') as f:
    t = f.read()
start = t.find('[')
end = t.find('] as const') + 1
places = json.loads(t[start:end])

valid_files = set()
for p in places:
    img = p['image']
    valid_files.add(img)
    valid_files.add(img.replace('.jpg', '.webp'))

removed = 0
for fn in os.listdir(places_dir):
    if fn not in valid_files:
        fp = os.path.join(places_dir, fn)
        if os.path.isfile(fp):
            os.remove(fp)
            print(f"Removed surplus file: {fn}")
            removed += 1

print(f"Cleanup done! Removed {removed} surplus files.")
print(f"Total files remaining in places_dir: {len(os.listdir(places_dir))} (should be exactly 662 = 331 jpg + 331 webp)")
