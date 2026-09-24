import os
import re
import json

BASE_DIR = r"D:\LoneFoundry-projects\verso-dataset"
d_dir = os.path.join(BASE_DIR, "D_translations")
out_file = os.path.join(BASE_DIR, "output", "countries.i18n.ts")

langs = ["ru", "uz", "zh", "de", "fr"]
result = {l: {} for l in langs}

for lang in langs:
    l_dir = os.path.join(d_dir, lang)
    for root, _, files in os.walk(l_dir):
        for fn in sorted(files):
            if fn.endswith('.ts') and not fn.startswith('_'):
                fp = os.path.join(root, fn)
                code = fn.replace('.ts', '').upper()
                with open(fp, encoding='utf-8') as f:
                    content = f.read()

                # Parse the fields
                data = {}
                for field in ['name', 'summary', 'tagline', 'bestSeason', 'visaNote', 'capital']:
                    m = re.search(r'["\']?' + field + r'["\']?\s*:\s*("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', content)
                    if m:
                        val = m.group(1)[1:-1]
                        val = val.replace('\\"', '"').replace("\\'", "'")
                        data[field] = val
                    else:
                        data[field] = ""

                for arr_field in ['topCities', 'cuisine']:
                    m = re.search(r'["\']?' + arr_field + r'["\']?\s*:\s*\[([^\]]*)\]', content)
                    if m:
                        items = re.findall(r'["\']([^"\']+)["\']', m.group(1))
                        data[arr_field] = items
                    else:
                        data[arr_field] = []

                result[lang][code] = data

output_content = f"""// AUTO-GENERATED: scripts/build_i18n.py
// Oxirgi generatsiya: 2026-09-23
// 5 ta til x 45 ta mamlakat

export const countriesI18n = {json.dumps(result, ensure_ascii=False, indent=2)} as const;
"""

with open(out_file, 'w', encoding='utf-8') as f:
    f.write(output_content)

print(f"Successfully generated {out_file} with:")
for l in langs:
    print(f"  [{l}]: {len(result[l])} countries")
