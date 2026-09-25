import os
import re

# Dataset ildizi shu faylning joylashuvidan hisoblanadi — qattiq yozilgan
# yo'l boshqa kompyuterda ishlamaydi.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(BASE_DIR, "output", "index.ts"), encoding="utf-8") as f:
    text = f.read()

# match all place objects
pattern = r'\{\s*"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",[^}]+"country":\s*"([^"]+)"[^}]+"image":\s*"([^"]+)"'
matches = re.findall(pattern, text)

by_country = {}
for pid, name, country, img in matches:
    if country not in by_country:
        by_country[country] = (pid, name, img)

print(f"Total top places found: {len(by_country)}")
for c in sorted(by_country.keys()):
    pid, name, img = by_country[c]
    print(f"[{c}] {name} -> {img}")
