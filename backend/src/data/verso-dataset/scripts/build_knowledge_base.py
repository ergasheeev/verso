import os
import json

BASE_DIR = r"D:\LoneFoundry-projects\verso-dataset"
index_file = os.path.join(BASE_DIR, "output", "index.ts")
out_file = os.path.join(BASE_DIR, "output", "knowledge-base.ts")

with open(index_file, encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.find('] as const') + 1
s = text[start:end]
places = json.loads(s)

kb = [
    {
        'id': p['id'],
        'name': p['name'],
        'country': p['country'],
        'city': p['city'],
        'type': p['type'],
        'description': p['description'],
        'price': p['price'],
        'priceUSD': p['priceUSD'],
        'hours': p['hours'],
        'transport': p['transport']
    }
    for p in places
]

out_content = f"""// AUTO-GENERATED: scripts/build_knowledge_base.py
// Oxirgi generatsiya: 2026-09-23
// Bu fayl Groq AI suhbat kontekstiga qo'shiladi.

export const knowledgeBase = {json.dumps(kb, ensure_ascii=False, indent=2)};

export type KnowledgeEntry = typeof knowledgeBase[number];
"""

with open(out_file, 'w', encoding='utf-8') as f:
    f.write(out_content)

print(f"Successfully generated {out_file} with {len(kb)} entries!")
