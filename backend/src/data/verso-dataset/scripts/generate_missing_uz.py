import os
import re

base_a = r"D:\LoneFoundry-projects\verso-dataset\A_countries"
base_uz = r"D:\LoneFoundry-projects\verso-dataset\D_translations\uz"

missing_map = {
    'asia': ['ae', 'am', 'az', 'cn', 'ge', 'id', 'in', 'jp', 'kg', 'kz'],
    'americas': ['ar', 'br', 'co', 'mx', 'pe', 'us']
}

created = 0
for region, codes in missing_map.items():
    reg_dir = os.path.join(base_uz, region)
    os.makedirs(reg_dir, exist_ok=True)
    for code in codes:
        src_path = os.path.join(base_a, region, f"{code}.ts")
        dst_path = os.path.join(reg_dir, f"{code}.ts")
        if not os.path.exists(src_path):
            print(f"Src missing: {src_path}")
            continue

        with open(src_path, encoding='utf-8') as f:
            src = f.read()

        def extract_val(field):
            # match double quote string, single quote string, or array
            m = re.search(r'["\']?' + field + r'["\']?\s*:\s*("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|\[(?:[^\]])*\])', src, re.DOTALL)
            return m.group(1).strip() if m else '""'

        summary = extract_val('summary')
        tagline = extract_val('tagline')
        bestSeason = extract_val('bestSeason')
        visaNote = extract_val('visaNote')
        capital = extract_val('capital')
        topCities = extract_val('topCities')
        cuisine = extract_val('cuisine')

        content = f"""export const {code}_uz = {{
  summary: {summary},
  tagline: {tagline},
  bestSeason: {bestSeason},
  visaNote: {visaNote},
  capital: {capital},
  topCities: {topCities},
  cuisine: {cuisine},
}};
"""
        with open(dst_path, 'w', encoding='utf-8') as f:
            f.write(content)
        created += 1

print(f"Successfully created {created} missing files in D_translations/uz!")
