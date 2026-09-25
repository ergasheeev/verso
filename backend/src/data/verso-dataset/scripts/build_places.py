import os
import re
import json

# Dataset ildizi shu faylning joylashuvidan hisoblanadi — qattiq yozilgan
# yo'l boshqa kompyuterda ishlamaydi.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
b_dir = os.path.join(BASE_DIR, "B_places")
out_file = os.path.join(BASE_DIR, "output", "index.ts")

valid_codes = {'AE','AM','AR','AT','AU','AZ','BR','CH','CN','CO','CZ','DE','EG','ES','FR','GB','GE','GR','HR','HU','ID','IN','IS','IT','JP','KE','KG','KZ','MA','MX','MY','NL','NO','NZ','PE','PL','PT','SE','SG','TH','TR','US','UZ','VN','ZA'}

all_places = []
invalid_places = []

for root, _, files in os.walk(b_dir):
    for fn in sorted(files):
        if fn.endswith('.ts') and not fn.startswith('_'):
            fp = os.path.join(root, fn)
            with open(fp, encoding='utf-8') as f:
                content = f.read()

            # Find each object block in the array
            # matches objects with { id: "...", ... }
            blocks = re.findall(r'\{([^{}]+(?:\{[^{}]*\}[^{}]*)*)\}', content)
            for block in blocks:
                if 'id:' not in block and '"id":' not in block:
                    continue

                place = {}
                # extract id, name, type, city, country, description, price, hours, transport, image
                for s_field in ['id', 'name', 'type', 'city', 'country', 'description', 'price', 'hours', 'transport', 'image']:
                    m = re.search(r'["\']?' + s_field + r'["\']?\s*:\s*("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|null)', block)
                    if m:
                        val = m.group(1).strip()
                        if val == 'null':
                            place[s_field] = None
                        else:
                            place[s_field] = val[1:-1].replace('\\"', '"').replace("\\'", "'")
                    else:
                        place[s_field] = None

                # priceUSD
                m_usd = re.search(r'["\']?priceUSD["\']?\s*:\s*([0-9.-]+)', block)
                place['priceUSD'] = float(m_usd.group(1)) if m_usd and '.' in m_usd.group(1) else (int(m_usd.group(1)) if m_usd else 0)

                # lat, lng
                for c_field in ['lat', 'lng']:
                    m_c = re.search(r'["\']?' + c_field + r'["\']?\s*:\s*([0-9.-]+)', block)
                    place[c_field] = float(m_c.group(1)) if m_c else 0.0

                # tags
                m_tags = re.search(r'["\']?tags["\']?\s*:\s*\[([^\]]*)\]', block)
                if m_tags:
                    place['tags'] = re.findall(r'["\']([^"\']+)["\']', m_tags.group(1))
                else:
                    place['tags'] = []

                if place.get('country') not in valid_codes:
                    invalid_places.append((fn, place.get('id'), place.get('country')))

                all_places.append(place)

print(f"Total places extracted: {len(all_places)}")
if invalid_places:
    print(f"Invalid country codes found: {invalid_places}")

all_places.sort(key=lambda x: (x.get('country') or '', x.get('id') or ''))

output_content = f"""// AUTO-GENERATED: scripts/build_places.py
// O'zgartirmang — B_places/ papkasidan generatsiya qilinadi.
// Oxirgi generatsiya: 2026-09-23

export const locations = {json.dumps(all_places, ensure_ascii=False, indent=2)} as const;

export type Location = typeof locations[number];
export type LocationType = Location["type"];
"""

with open(out_file, 'w', encoding='utf-8') as f:
    f.write(output_content)

print(f"Successfully generated {out_file} with {len(all_places)} places!")
