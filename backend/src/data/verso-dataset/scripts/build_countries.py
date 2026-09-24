import os
import re
import json

BASE_DIR = r"D:\LoneFoundry-projects\verso-dataset"
a_dir = os.path.join(BASE_DIR, "A_countries")
out_file = os.path.join(BASE_DIR, "output", "countries.ts")

all_countries = []

for root, _, files in os.walk(a_dir):
    for fn in sorted(files):
        if fn.endswith('.ts') and not fn.startswith('_'):
            fp = os.path.join(root, fn)
            with open(fp, encoding='utf-8') as f:
                content = f.read()

            c_data = {}
            # extract string fields
            for s_field in ['code', 'name', 'slug', 'summary', 'tagline', 'bestSeason', 'visaNote', 'visaCheckedOn', 'capital', 'continent', 'population', 'area', 'timezone', 'callingCode', 'currency', 'currencyName', 'plugType', 'drivingSide', 'flag']:
                m = re.search(r'["\']?' + s_field + r'["\']?\s*:\s*("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', content)
                if m:
                    val = m.group(1)[1:-1].replace('\\"', '"').replace("\\'", "'")
                    c_data[s_field] = val
                else:
                    if s_field == 'flag':
                        c_data[s_field] = "🏳️"
                    elif s_field in ['code', 'name', 'slug']:
                        c_data[s_field] = fn.replace('.ts', '').upper()

            # extract number fields
            for n_field in ['lat', 'lng', 'priceLevel', 'safetyRating', 'unesco']:
                m = re.search(r'["\']?' + n_field + r'["\']?\s*:\s*([0-9.-]+)', content)
                if m:
                    c_data[n_field] = float(m.group(1)) if '.' in m.group(1) else int(m.group(1))
                else:
                    c_data[n_field] = 0

            # extract boolean fields
            m_feat = re.search(r'["\']?featured["\']?\s*:\s*(true|false)', content)
            c_data['featured'] = (m_feat.group(1) == 'true') if m_feat else False

            # extract array fields
            for arr_field in ['languages', 'topCities', 'cuisine']:
                m = re.search(r'["\']?' + arr_field + r'["\']?\s*:\s*\[([^\]]*)\]', content)
                if m:
                    items = re.findall(r'["\']([^"\']+)["\']', m.group(1))
                    c_data[arr_field] = items
                else:
                    c_data[arr_field] = []

            # extract emergency
            em_match = re.search(r'emergency\s*:\s*\{([^}]+)\}', content)
            em_dict = {'police': '112', 'ambulance': '112', 'fire': '112', 'general': '112'}
            if em_match:
                em_body = em_match.group(1)
                for ef in ['police', 'ambulance', 'fire', 'general']:
                    mf = re.search(r'["\']?' + ef + r'["\']?\s*:\s*["\']([^"\']+)["\']', em_body)
                    if mf:
                        em_dict[ef] = mf.group(1)
            c_data['emergency'] = em_dict

            all_countries.append(c_data)

all_countries.sort(key=lambda x: x['code'])

out_content = f"""// AUTO-GENERATED: scripts/build_countries.py
// O'zgartirmang — A_countries/ papkasidan generatsiya qilinadi.
// Oxirgi generatsiya: 2026-09-23

export const countries = {json.dumps(all_countries, ensure_ascii=False, indent=2)} as const;

export type Country = typeof countries[number];
export type CountryCode = Country["code"];
"""

with open(out_file, 'w', encoding='utf-8') as f:
    f.write(out_content)

print(f"Successfully generated {out_file} with {len(all_countries)} countries, all with 'name' property!")
