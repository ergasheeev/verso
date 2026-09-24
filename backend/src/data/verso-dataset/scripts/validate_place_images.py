"""Validate local image coverage for every B_places record, without changing data."""
from pathlib import Path
import csv
import json
import re
import sys
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]


def inventory():
    records = []
    for source in sorted((ROOT / 'B_places').glob('*/*.ts')):
        text = source.read_text(encoding='utf-8')
        # Records are separated by an id field; avoid matching braces in descriptions.
        starts = list(re.finditer(r"\bid\s*:\s*(['\"])([^'\"]+)\1", text))
        for i, match in enumerate(starts):
            block = text[match.end():starts[i + 1].start() if i + 1 < len(starts) else len(text)]
            image = re.search(r"\bimage\s*:\s*(['\"])([^'\"]+)\1", block)
            records.append({'id': match[2], 'image': image[2] if image else None,
                            'source': source.relative_to(ROOT).as_posix()})
    return records


def validate():
    with (ROOT / 'C_images/credits.csv').open(encoding='utf-8-sig', newline='') as handle:
        rows = list(csv.DictReader(handle))
    credits = {}
    for row in rows:
        credits.setdefault(row['file'], []).append(row)
    results = []
    for place in inventory():
        issues = []
        filename = place['image']
        if not filename or Path(filename).name != filename:
            issues.append('missing or unsafe image filename')
        else:
            for name in [filename, str(Path(filename).with_suffix('.webp'))]:
                path = ROOT / 'C_images/places' / name
                if not path.is_file():
                    issues.append(f'missing file: {name}')
                    continue
                try:
                    with Image.open(path) as image:
                        image.load()
                        if image.width < 900 or image.height < 600 or image.width <= image.height:
                            issues.append(f'invalid dimensions: {name} {image.size}')
                except Exception as exc:
                    issues.append(f'unreadable file: {name}: {exc}')
                matches = credits.get(name, [])
                if len(matches) != 1:
                    issues.append(f'expected one credit row: {name}, got {len(matches)}')
                elif any(not matches[0].get(key, '').strip() for key in
                         ['source', 'license', 'author', 'sourceUrl', 'date']):
                    issues.append(f'incomplete credit: {name}')
        results.append({**place, 'issues': issues})
    return {'total': len(results), 'complete': sum(not p['issues'] for p in results),
            'places': results}


if __name__ == '__main__':
    report = validate()
    print(json.dumps(report, ensure_ascii=True, indent=2))
    sys.exit(0 if report['complete'] == report['total'] else 1)
