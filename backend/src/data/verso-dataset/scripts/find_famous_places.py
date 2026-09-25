import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Dataset ildizi shu faylning joylashuvidan hisoblanadi — qattiq yozilgan
# yo'l boshqa kompyuterda ishlamaydi.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(BASE_DIR, "output", "index.ts"), encoding="utf-8") as f:
    text = f.read()

# match all { "id": "...", "name": "...", ..., "image": "..." }
pattern = r'\{\s*"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",[^}]+?"image":\s*"([^"]+)"'
matches = re.findall(pattern, text)

print(f"Total places with images: {len(matches)}")
# Let's print the famous ones
famous = ['registan', 'fushimi', 'eiffel', 'colosseum', 'burj-khalifa', 'taj-mahal', 'grand-canyon', 'great-wall', 'bund', 'sagrada', 'tower-bridge', 'neuschwanstein', 'machu-picchu', 'pyramid', 'parthenon', 'hagia-sophia']

for pid, name, img in matches:
    if any(k in pid for k in famous):
        print(f"{pid:<30} {name:<40} {img}")
