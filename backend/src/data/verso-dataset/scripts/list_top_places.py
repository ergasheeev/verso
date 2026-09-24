import re

with open(r"D:\LoneFoundry-projects\verso-dataset\output\index.ts", encoding="utf-8") as f:
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
