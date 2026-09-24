import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r"D:\LoneFoundry-projects\verso-dataset\output\index.ts", encoding="utf-8") as f:
    text = f.read()

start = text.find('[')
end = text.find('] as const') + 1
places = json.loads(text[start:end])

# Map country code to place with image
country_place_map = {}
for p in places:
    c = p['country']
    if c not in country_place_map:
        country_place_map[c] = []
    country_place_map[c].append((p['id'], p['name'], p.get('image')))

print(f"Total countries with places: {len(country_place_map)}")
# print the first 2 places of each country
for c in sorted(country_place_map.keys()):
    p1 = country_place_map[c][0]
    print(f"[{c}] {p1[0]:<30} {p1[1]:<35} img: {p1[2]}")
