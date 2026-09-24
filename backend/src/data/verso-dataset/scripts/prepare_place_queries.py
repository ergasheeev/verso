import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r"D:\LoneFoundry-projects\verso-dataset\output\index.ts", encoding="utf-8") as f:
    text = f.read()

start = text.find('[')
end = text.find('] as const') + 1
places = json.loads(text[start:end])

print(f"Total places to map: {len(places)}")

# Translation / normalization helper for queries
def make_search_query(p):
    pid = p['id']
    name = p['name']
    city = p['city']
    country = p['country']
    
    # Clean up name: remove uzbek phrases and separators
    clean_name = name
    for sep in ['—', '–', '-', ':']:
        if sep in clean_name:
            clean_name = clean_name.split(sep)[0].strip()
            
    # Common landmark translations
    tr_map = {
        'Registon Maydoni': 'Registan Samarkand',
        'Ark Qal\'asi': 'Ark of Bukhara',
        'Ark Qal’asi': 'Ark of Bukhara',
        'Ichan-Qal\'a': 'Itchan Kala Khiva',
        'Ichan-Qal’a': 'Itchan Kala Khiva',
        'Chorsu Bozori': 'Chorsu Bazaar Tashkent',
        'Siyob Bozori': 'Siab Bazaar Samarkand',
        'Shohi Zinda': 'Shah-i-Zinda Samarkand',
        'Toshkent Plov Markazi': 'Central Asian Plov Center Tashkent',
        'Amir Temur Muzeyi': 'Amir Timur Museum Tashkent',
        'Fushimi Inari Taisha': 'Fushimi Inari Taisha torii Kyoto',
        'Kinkaku-ji (Oltin Pavilon)': 'Kinkaku-ji Golden Pavilion Kyoto',
        'Arashiyama Bambu O\'rmoni': 'Arashiyama Bamboo Grove Kyoto',
        'Dotonbori': 'Dotonbori Osaka night',
        'Shibuya Kesishmasi': 'Shibuya Crossing Tokyo',
        'Nara Kiyiklar Bog\'i': 'Nara Park deer Japan',
        'Hiroshima Tinchlik Memorial': 'Atomic Bomb Dome Hiroshima Peace Memorial',
    }
    
    if name in tr_map:
        return tr_map[name]
        
    # Suffixes stripping
    clean_name = re.sub(r"\b(Milliy Bog'i|Eski Shahri|Tog'i|Muzeyi|Bozori|Qal'asi|Saroyi|Ibodatxonasi|Qishloqlari|Vadiysi|Sharob Vadiysi|Sharsharalari|Ko'chasi|Markazi|Qasri|Ibodotxonasi)\b", "", clean_name, flags=re.IGNORECASE).strip()
    
    if not clean_name:
        clean_name = name.split()[0]
        
    return f"{clean_name} {city}".strip()

# Print sample queries for first 25 places
for p in places[:25]:
    q = make_search_query(p)
    print(f"{p['id']:<28} -> {q}")
