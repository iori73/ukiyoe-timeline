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


# Short description for the detail sheet (owner, 2026-11-09: "概要文みたいな簡単な説明文").
# Built only from fields checked against the museum records — the medium line (format, technique,
# mica, embossing), the subject, and the era's technique. It says nothing about the scene itself,
# so it cannot invent anything; the title carries what the picture shows.
FORMATS = [  # (keyword in the museum's medium line, ja, en) — first match wins
    ('uncut hosoban triptych', '切り離していない細判の三枚続', 'an uncut hosoban triptych (three narrow sheets in one)'),
    ('left sheet of hosoban triptych', '細判三枚続の左の一枚', 'the left sheet of a hosoban triptych'),
    ('triptych', '三枚続（3枚で1つの絵）', 'a triptych (one picture across three sheets)'),
    ('diptych', '二枚続（2枚で1つの絵）', 'a diptych (one picture across two sheets)'),
    ('double-page illustration', '版本（絵入りの本）の見開きの挿絵', 'a double-page illustration from a picture book'),
    ('single-page illustration', '版本（絵入りの本）の挿絵', 'an illustration from a picture book'),
    ('printed book', '版本（絵入りの本）', 'a woodblock-printed picture book'),
    ('surimono', '摺物（個人が注文して配った刷り物）', 'a surimono, a privately commissioned print'),
    ('hashira-e', '柱絵（柱に掛ける細長い判）', 'a hashira-e, a tall narrow print made to hang on a pillar'),
    ('kakemono', '掛物絵（掛軸のように縦長の大きな判）', 'a kakemono-e, a tall print hung like a scroll'),
    ('o-hosoban', '大細判（縦長の判）', 'an ō-hosoban, a tall narrow sheet'),
    ('hosoban', '細判（縦長の小さな判）', 'a hosoban, a small narrow sheet'),
    ('o-oban', '大大判（大きな判）', 'an ō-ōban, an extra-large sheet'),
    ('chuban', '中判', 'a chūban, a medium-size sheet'),
    ('ōban', '大判', 'an ōban, a full-size sheet'),
    ('oban', '大判', 'an ōban, a full-size sheet'),
]
TECH = {  # era -> (ja, en): how the colour got onto the paper in that era
    '01': ('墨だけで刷っている。', 'Printed in black ink only.'),
    '02': ('墨で刷ったあと、橙の丹を筆で塗っている。', 'Printed in ink, then brushed by hand with orange red lead (tan).'),
    '03': ('墨で刷ったあと、色を筆で塗っている。', 'Printed in ink, with the colour brushed on by hand.'),
    '04': ('紅や緑の色を、色ごとの版で刷り重ねている。', 'Pink, green and other colours are printed from separate blocks.'),
    '05': ('たくさんの色版を重ねて刷る多色摺（錦絵）。', 'A full-colour print (nishiki-e) from many blocks.'),
    '06': ('たくさんの色版を重ねて刷る多色摺（錦絵）。', 'A full-colour print (nishiki-e) from many blocks.'),
    '07': ('たくさんの色版を重ねて刷る多色摺（錦絵）。', 'A full-colour print (nishiki-e) from many blocks.'),
}
SUBJECT = {
    'beauty': ('美人を描く。', 'The subject is a beauty.'),
    'actor': ('歌舞伎の役者を描く。', 'The subject is a kabuki actor.'),
    'place': ('名所を描く。', 'The subject is a famous place.'),
    'landscape': ('風景を描く。', 'The subject is a landscape.'),
    'daily': ('町の人の暮らしを描く。', 'The subject is everyday life in the city.'),
}


def summary(c, era):
    m = (c.get('medium') or '').lower()
    ja, en = [], []
    fmt = next(((j, e) for k, j, e in FORMATS if k in m), None)
    if c.get('format') == 'book' and not fmt:
        fmt = ('版本（絵入りの本）', 'a woodblock-printed picture book')
    if fmt:
        ja.append(f'{fmt[0]}。'); en.append(f'{fmt[1][0].upper()}{fmt[1][1:]}.')
    tj, te = TECH[era]
    if 'sumizuri' in m:  # the record says ink only, whatever the era
        tj, te = TECH['01']
    elif 'urushi-e' in m:
        tj, te = '墨に膠を混ぜて黒を漆のように光らせ（漆絵）、色は筆で塗っている。', 'The black is mixed with glue to shine like lacquer (urushi-e); the colour is brushed on.'
    elif 'beni-e' in m and 'benizuri' not in m:
        tj, te = '紅花からとる紅を、筆で塗っている（紅絵）。', 'Brushed by hand with beni, a red from safflower (beni-e).'
    ja.append(tj); en.append(te)
    if 'mica' in m:
        ja.append('雲母（きら）の粉を刷って光らせている。'); en.append('Mica dust is printed on to make it shimmer.')
    if 'emboss' in m:
        ja.append('色を付けずに凹凸だけを出す空摺も使っている。'); en.append('Blind embossing (karazuri) raises parts of the paper without ink.')
    if c.get('subject') in SUBJECT:
        j, e = SUBJECT[c['subject']]; ja.append(j); en.append(e)
    return ''.join(ja), ' '.join(en)


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
            sum_ja, sum_en = summary(c, eid)
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
                'summary_ja': sum_ja,
                'summary_en': sum_en,
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
