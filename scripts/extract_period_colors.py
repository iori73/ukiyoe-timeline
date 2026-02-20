#!/usr/bin/env python3
"""
各時代の代表作品画像から支配色（dominant colors）を抽出するスクリプト

Wikipedia の 400px サムネイル URL を使用して Rate Limit を回避する。
失敗した場合は代替 URL を試みる。
"""

import urllib.request
import urllib.error
import io
import time
from PIL import Image
from collections import Counter
import json

# Wikipedia サムネイル形式:
# https://upload.wikimedia.org/wikipedia/commons/thumb/{d1}/{d2}/{filename}/{width}px-{filename}

def wiki_thumb(path, width=400):
    """commons path (例: 7/7f/Beauty_looking_back.jpg) → サムネイル URL"""
    parts = path.split("/")
    filename = parts[-1]
    return f"https://upload.wikimedia.org/wikipedia/commons/thumb/{path}/{width}px-{filename}"

# 各時代の代表画像 (1〜3枚)
PERIOD_IMAGES = {
    1670: [
        wiki_thumb("7/7f/Beauty_looking_back.jpg"),
        wiki_thumb("4/4d/Brooklyn_Museum_-_Yoshiwara_no_Tei_-_Hishikawa_Moronobu.jpg"),
        wiki_thumb("c/c8/Hishikawa_Sumidagawa.jpg"),
        wiki_thumb("8/8e/Self-portrait_by_Hishikawa_Moronobu.jpg"),
    ],
    1700: [
        wiki_thumb("f/f2/Kiyonobu_1.jpg"),
        wiki_thumb("8/8c/Kiyonobu_2.jpg"),
        wiki_thumb("0/0f/MET_DP124269.jpg"),
        wiki_thumb("9/92/MET_DP124270.jpg"),
        wiki_thumb("3/3c/MET_DP124278.jpg"),
    ],
    1720: [
        wiki_thumb("9/91/MET_DP124527.jpg"),
        wiki_thumb("e/e9/MET_DP124524.jpg"),
        wiki_thumb("f/fd/MET_DP124525.jpg"),
        wiki_thumb("4/4b/MET_DP124526.jpg"),
        wiki_thumb("3/3f/MET_DP124530.jpg"),
    ],
    1740: [
        # URL エンコードが必要なファイル → 別途 URL 直接指定
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Actors_Nakamura_Shichisabur%C3%B4_II_and_Sanogawa_Ichimatsu%2C_Toyonobu%2C_1740s%2C_signed_Meij%C3%B4d%C3%B4_Ishikawa_Sh%C3%BBha_Toyonobu_zu%2C_MFA.jpg/400px-Actors_Nakamura_Shichisabur%C3%B4_II_and_Sanogawa_Ichimatsu%2C_Toyonobu%2C_1740s%2C_signed_Meij%C3%B4d%C3%B4_Ishikawa_Sh%C3%BBha_Toyonobu_zu%2C_MFA.jpg",
        wiki_thumb("6/6c/Ishikawa_Toyonobu_-_Wakashu_with_a_Flower_Cart.jpg"),
        wiki_thumb("7/7f/Beauty_holding_a_book_LCCN2008680290.jpg"),
        wiki_thumb("7/78/Passing_a_love_letter_LCCN2008680281.jpg"),
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/De_geliefden_Yaoya_Oshichi_en_Kosho_Kichisaburo%2C_RP-P-1956-578.jpg/400px-De_geliefden_Yaoya_Oshichi_en_Kosho_Kichisaburo%2C_RP-P-1956-578.jpg",
    ],
    1750: [
        wiki_thumb("c/cb/MET_DP135501.jpg"),
        wiki_thumb("a/a6/MET_DP135503.jpg"),
        wiki_thumb("4/43/MET_DP135505.jpg"),
        wiki_thumb("c/c6/MET_DP135506.jpg"),
        wiki_thumb("7/71/MET_DP135507.jpg"),
    ],
    1765: [
        wiki_thumb("1/1d/MET_DP114905.jpg"),
        wiki_thumb("3/3d/MET_DP114910.jpg"),
        # ukiyo-e.org 画像は直接 URL を使用
        "https://data.ukiyo-e.org/met/images/DP114913.jpg",
        "https://data.ukiyo-e.org/met/images/DP114914.jpg",
        "https://data.ukiyo-e.org/met/images/DP114915.jpg",
    ],
    1770: [
        wiki_thumb("3/3b/Kiyonaga_bathhouse_women.jpg"),
        wiki_thumb("1/12/Torii_Kiyonaga_-_Boating_Party_on_the_Sumida_River_-_1956.751.a_-_Cleveland_Museum_of_Art.jpg"),
        "https://data.ukiyo-e.org/met/scaled/DP146876.jpg",
        "https://data.ukiyo-e.org/met/scaled/DP135624.jpg",
        "https://data.ukiyo-e.org/met/scaled/DP145700.jpg",
    ],
    1790: [
        "https://data.ukiyo-e.org/met/images/DP130246.jpg",
        wiki_thumb("0/0e/Toshusai_Sharaku-_Otani_Oniji%2C_1794.jpg"),
        "https://data.ukiyo-e.org/met/images/DP130247.jpg",
        "https://data.ukiyo-e.org/met/images/DP130287.jpg",
        "https://data.ukiyo-e.org/met/scaled/DP135756.jpg",
    ],
    1800: [
        wiki_thumb("a/a5/Tsunami_by_hokusai_19th_century.jpg"),
        wiki_thumb("5/57/Red_Fuji_southern_wind_clear_morning.jpg"),
        wiki_thumb("d/d2/Hiroshige16_kanbara.jpg"),
        wiki_thumb("c/cc/Hiroshige_Atake_sous_une_averse_soudaine.jpg"),
        wiki_thumb("d/d2/Hiroshige11_hakone.jpg"),
    ],
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
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
        # 完全な白（紙の地色）はスキップ
        if r > 250 and g > 250 and b > 250:
            continue
        if hex_color not in dominant:
            dominant.append(hex_color)
        if len(dominant) >= n_colors:
            break
    return dominant

def process_period(year, urls):
    print(f"\n=== {year} ===", flush=True)
    all_colors = []
    for url in urls:
        time.sleep(0.8)  # Wikimedia のレート制限対策
        label = url.split("/")[-1][:45]
        try:
            img = fetch_image(url)
            colors = extract_dominant_colors(img, n_colors=5)
            print(f"  {label:45s} → {colors}", flush=True)
            all_colors.extend(colors)
        except Exception as e:
            print(f"  SKIP ({str(e)[:60]}): {label}", flush=True)
    freq = Counter(all_colors)
    # 少なくとも2画像で共通して出た色を優先、それ以下でも上位7色を採用
    top = [c for c, _ in freq.most_common(7)]
    print(f"  ▶ 集計: {top}", flush=True)
    return top

results = {}
for year in sorted(PERIOD_IMAGES.keys()):
    results[year] = process_period(year, PERIOD_IMAGES[year])
    time.sleep(2)  # 時代間インターバル

print("\n\n=== JSON出力 ===\n")
print(json.dumps(results, indent=2, ensure_ascii=False))
