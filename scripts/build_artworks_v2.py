"""
Build src/data/v2/artworks.json from the verified candidate list (docs/specs/artwork-candidates-2026-11-08.json)
and the owner-approved selection (FEATURED below = shown first in each era; all others go in
"この時代の作品をもっと見る").

Images
- The Met / Cleveland: their CC0 image URLs are used directly.
- Art Institute of Chicago: their image server refuses embedding from other sites, so the CC0 files the
  owner saved (~/Downloads/"<accession> - <title>.jpg") are resized to 1200px and served from
  public/images/artworks/aic/<accession>.jpg. Works without a local file are skipped (reported).

Usage: python3 scripts/build_artworks_v2.py [--downloads ~/Downloads]
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'docs/specs/artwork-candidates-2026-11-08.json')
OUT = os.path.join(ROOT, 'src/data/v2/artworks.json')
AIC_DIR = os.path.join(ROOT, 'public/images/artworks/aic')
DOWNLOADS = os.path.expanduser(sys.argv[sys.argv.index('--downloads') + 1] if '--downloads' in sys.argv else '~/Downloads')

# Recommended selection (Claude, 2026-11-09), order = display order; first = the era's entry work.
FEATURED = {
    '01': ['1942.60', '1925.1689', '1925.1702', 'JIB65', 'JIB85a–c'],
    '02': ['1925.1726', 'JP3075', 'JP680', '1925.1740', '1925.1734'],
    '03': ['1925.2285', 'JP1308', '1985.349', '1942.80', '1957.7'],
    '04': ['1925.1937', 'JP848', 'JP847', '1925.1907', '1929.72'],
    '05': ['1985.304', '1957.556', '1985.306', 'JP864', '1925.2118'],
    '06': ['JP2822', 'JP1528', 'JP128', '1939.2141', '1985.333'],
    '07': ['JP1847', '1961.170', '1925.3264', 'JP472', '1942.145', '1985.317'],
}
# Held back until checked (image content, or a Japanese title that disagrees with the museum's).
EXCLUDE = {'1925.1688'}

MUSEUM = {
    'The Met': ('The Metropolitan Museum of Art', 'メトロポリタン美術館'),
    'Art Institute of Chicago': ('Art Institute of Chicago', 'シカゴ美術館'),
    'Cleveland Museum of Art': ('Cleveland Museum of Art', 'クリーブランド美術館'),
}


def local_aic(acc):
    dst = os.path.join(AIC_DIR, f'{acc}.jpg')
    if os.path.exists(dst):
        return dst
    src = next((f for f in sorted(os.listdir(DOWNLOADS)) if f.startswith(acc + ' - ') and f.lower().endswith('.jpg')), None)
    if not src:
        return None
    os.makedirs(AIC_DIR, exist_ok=True)
    subprocess.run(['sips', '-Z', '1200', '-s', 'format', 'jpeg', '-s', 'formatOptions', '78',
                    os.path.join(DOWNLOADS, src), '--out', dst], check=True, capture_output=True)
    return dst


def main():
    data = json.load(open(SRC, encoding='utf-8'))
    works, skipped = [], []
    for era in data['eras']:
        eid = era['id']
        feat = FEATURED.get(eid, [])
        rows = []
        for c in era['candidates']:
            acc = c['accession']
            if acc in EXCLUDE:
                skipped.append((acc, 'held back'))
                continue
            if c['museum'] == 'Art Institute of Chicago':
                if not local_aic(acc):
                    skipped.append((acc, 'no local image yet'))
                    continue
                url = f'/images/artworks/aic/{acc}.jpg'
            else:
                url = c['image_url']
            en, ja = MUSEUM[c['museum']]
            rows.append({
                'id': f'{eid}-{acc}',
                'era': eid,
                'featured': acc in feat,
                'order': feat.index(acc) if acc in feat else 100 + int(c['year_sort']),
                'url': url,
                'title_ja': c.get('title_ja') or c['title_en'],
                'title_ja_source': c.get('title_ja_source', 'museum'),
                'title_en': c['title_en'],
                'artist_ja': c.get('artist_ja') or c['artist_en'],
                'artist_en': c['artist_en'],
                'year': c['date_text'],
                'year_sort': c['year_sort'],
                'format': c.get('format'),
                'collection_en': en,
                'collection_ja': ja,
                'accession': acc,
                'license': 'CC0',
                'source_url': c['object_url'],
            })
        rows.sort(key=lambda r: r['order'])
        missing = [a for a in feat if not any(r['accession'] == a for r in rows)]
        if missing:
            skipped += [(a, 'featured but missing') for a in missing]
        works += rows
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(works, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    by = {}
    for w in works:
        by.setdefault(w['era'], [0, 0])[0 if w['featured'] else 1] += 1
    print(f'{len(works)} works -> {os.path.relpath(OUT, ROOT)}; per era (featured, more): {by}')
    for a, why in skipped:
        print('skipped', a, why)


if __name__ == '__main__':
    main()
