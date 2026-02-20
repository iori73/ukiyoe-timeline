#!/usr/bin/env python3
"""
レート制限で取得できなかった時代（1720, 1740, 1750, 1800）の色彩を
ukiyo-e.org / bunka.nii.ac.jp などの別ソースから抽出する
"""

import urllib.request
import io
import time
from PIL import Image
from collections import Counter
import json

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Referer": "https://ukiyo-e.org/",
}

PERIOD_IMAGES = {
    # 1720: 奥村政信 — 漆絵・紅絵 (ukiyo-e.org / MET DL)
    1720: [
        # MET Open Access (直接ダウンロード可)
        "https://images.metmuseum.org/CRDImages/as/original/DP124527.jpg",
        "https://images.metmuseum.org/CRDImages/as/original/DP124524.jpg",
        "https://images.metmuseum.org/CRDImages/as/original/DP124526.jpg",
        "https://images.metmuseum.org/CRDImages/as/original/DP124530.jpg",
    ],
    # 1740: 石川豊信 — 紅摺絵 2-3色
    1740: [
        "https://images.metmuseum.org/CRDImages/as/original/DP251139.jpg",  # Toyonobu
        "https://images.metmuseum.org/CRDImages/as/original/DP131612.jpg",  # benizuri-e
        "https://images.metmuseum.org/CRDImages/as/original/DP131621.jpg",
        "https://images.metmuseum.org/CRDImages/as/original/DP131626.jpg",
    ],
    # 1750: 豊信/春信初期 — 4-5色 benizuri-e
    1750: [
        "https://images.metmuseum.org/CRDImages/as/original/DP135501.jpg",
        "https://images.metmuseum.org/CRDImages/as/original/DP135503.jpg",
        "https://images.metmuseum.org/CRDImages/as/original/DP135505.jpg",
        "https://images.metmuseum.org/CRDImages/as/original/DP135506.jpg",
        "https://images.metmuseum.org/CRDImages/as/original/DP135507.jpg",
    ],
    # 1800: 北斎・広重 — ベロ藍
    1800: [
        "https://images.metmuseum.org/CRDImages/as/original/DP130155.jpg",  # Great Wave
        "https://images.metmuseum.org/CRDImages/as/original/DP130160.jpg",  # Red Fuji
        "https://images.metmuseum.org/CRDImages/as/original/DP130194.jpg",  # Hiroshige
        "https://images.metmuseum.org/CRDImages/as/original/DP118704.jpg",  # Hiroshige snow
        "https://images.metmuseum.org/CRDImages/as/original/DP130186.jpg",  # Hiroshige rain
    ],
}

def fetch_image(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as resp:
        return Image.open(io.BytesIO(resp.read())).convert("RGB")

def rgb_to_hex(r, g, b):
    return "#{:02x}{:02x}{:02x}".format(r, g, b)

def extract_dominant_colors(img, n_colors=6):
    thumb = img.resize((150, 150), Image.LANCZOS)
    quantized = thumb.quantize(colors=32, method=Image.Quantize.FASTOCTREE)
    palette = quantized.getpalette()
    pixel_data = list(quantized.getdata())
    count = Counter(pixel_data)
    dominant = []
    for idx, _ in count.most_common(n_colors * 4):
        r = palette[idx * 3]
        g = palette[idx * 3 + 1]
        b = palette[idx * 3 + 2]
        hex_color = rgb_to_hex(r, g, b)
        if r > 250 and g > 250 and b > 250:
            continue
        if hex_color not in dominant:
            dominant.append(hex_color)
        if len(dominant) >= n_colors:
            break
    return dominant

for year in sorted(PERIOD_IMAGES.keys()):
    print(f"\n=== {year} ===", flush=True)
    all_colors = []
    for url in PERIOD_IMAGES[year]:
        time.sleep(1.5)
        label = url.split("/")[-1][:40]
        try:
            img = fetch_image(url)
            colors = extract_dominant_colors(img, n_colors=5)
            print(f"  {label:40s} → {colors}", flush=True)
            all_colors.extend(colors)
        except Exception as e:
            print(f"  SKIP ({str(e)[:70]}): {label}", flush=True)
    freq = Counter(all_colors)
    top = [c for c, _ in freq.most_common(7)]
    print(f"  ▶ 集計: {top}", flush=True)
    time.sleep(3)
