import os
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Dataset ildizi shu faylning joylashuvidan hisoblanadi — qattiq yozilgan
# yo'l boshqa kompyuterda ishlamaydi.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(BASE_DIR, "output", "index.ts"), encoding="utf-8") as f:
    text = f.read()

# match all items: { "id": "...", "name": "...", "type": "...", "city": "...", "country": "...", ... "image": "..." }
pattern = r'\{\s*"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"type":\s*"([^"]+)",\s*"city":\s*"([^"]+)",\s*"country":\s*"([^"]+)",[^}]+?"image":\s*"([^"]+)"'
matches = re.findall(pattern, text)

# select first attraction per country
top_per_country = {}
for pid, name, ptype, city, country, img in matches:
    if country not in top_per_country and ptype == 'attraction':
        top_per_country[country] = (pid, name, city, img)

print(f"Total top attractions: {len(top_per_country)}")
for c in sorted(top_per_country.keys()):
    pid, name, city, img = top_per_country[c]
    print(f"'{c}': ('{img}', '{name}', '{city}'),")
