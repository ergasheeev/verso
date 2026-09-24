import os
import re
import json
import urllib.request
import urllib.parse
import sys
import io
import time
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"D:\LoneFoundry-projects\verso-dataset"
index_file = os.path.join(BASE_DIR, "output", "index.ts")
places_dir = os.path.join(BASE_DIR, "C_images", "places")

with open(index_file, encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.find('] as const') + 1
places = json.loads(text[start:end])

existing = set(os.listdir(places_dir))
missing = [p for p in places if p.get('image') and p.get('image') not in existing]

print(f"Total places: {len(places)}")
print(f"Already downloaded: {len(places) - len(missing)}")
print(f"Missing to fetch: {len(missing)}")

print("\nSample 10 missing:")
for m in missing[:10]:
    print(f"  [{m['country']}] {m['name']} ({m['city']}) -> {m['image']}")
