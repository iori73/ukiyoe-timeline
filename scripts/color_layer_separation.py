#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
浮世絵の色版分解スクリプト
画像を色ごとにレイヤーに分解し、伝統的な木版画の各色版のように
個別の画像ファイルとして出力します。
"""

import os
import sys
import numpy as np
from PIL import Image
from collections import Counter
from sklearn.cluster import KMeans
import colorsys

def rgb_to_hex(rgb):
    """RGBタプルを16進数カラーコードに変換"""
    return '{:02X}{:02X}{:02X}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

def get_color_name(rgb):
    """RGB値から色の名前を推定（日本語）"""
    r, g, b = rgb[0]/255, rgb[1]/255, rgb[2]/255
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    h = h * 360
    
    # 明度・彩度による分類
    if v < 0.2:
        return "墨色"
    if s < 0.1:
        if v > 0.9:
            return "白"
        elif v > 0.6:
            return "灰白"
        else:
            return "灰色"
    
    # 色相による分類
    if h < 15 or h >= 345:
        return "紅色"
    elif h < 45:
        return "橙色"
    elif h < 70:
        return "黄色"
    elif h < 150:
        return "緑色"
    elif h < 200:
        return "青緑"
    elif h < 260:
        return "藍色"
    elif h < 290:
        return "紫色"
    else:
        return "桃色"

def extract_dominant_colors(image, n_colors=8, sample_size=10000):
    """
    K-meansクラスタリングを使用して画像から主要な色を抽出
    
    Args:
        image: PIL Image オブジェクト
        n_colors: 抽出する色の数
        sample_size: サンプリングするピクセル数
    
    Returns:
        主要な色のリスト（RGB）とそれぞれの割合
    """
    # 画像をRGB配列に変換
    img_array = np.array(image.convert('RGB'))
    pixels = img_array.reshape(-1, 3)
    
    # ランダムサンプリング（計算効率のため）
    if len(pixels) > sample_size:
        indices = np.random.choice(len(pixels), sample_size, replace=False)
        pixels = pixels[indices]
    
    # K-meansクラスタリング
    kmeans = KMeans(n_clusters=n_colors, random_state=42, n_init=10)
    kmeans.fit(pixels)
    
    # 各クラスタの色と出現頻度を取得
    colors = kmeans.cluster_centers_.astype(int)
    labels = kmeans.labels_
    label_counts = Counter(labels)
    
    # 出現頻度でソート
    total_pixels = len(labels)
    color_info = []
    for i in range(n_colors):
        count = label_counts[i]
        percentage = count / total_pixels * 100
        color_info.append({
            'rgb': tuple(colors[i]),
            'hex': rgb_to_hex(colors[i]),
            'percentage': percentage,
            'name': get_color_name(colors[i])
        })
    
    # 出現頻度の高い順にソート
    color_info.sort(key=lambda x: x['percentage'], reverse=True)
    
    return color_info

def create_color_layer(image, target_color, tolerance=30, preserve_alpha=True):
    """
    特定の色に対応するレイヤーを作成
    
    Args:
        image: PIL Image オブジェクト
        target_color: ターゲット色 (R, G, B)
        tolerance: 色の許容範囲
        preserve_alpha: 元の透明度を保持するか
    
    Returns:
        レイヤー画像（PIL Image）
    """
    img_array = np.array(image.convert('RGBA'))
    
    # RGB距離を計算
    rgb = img_array[:, :, :3].astype(float)
    target = np.array(target_color).astype(float)
    
    # ユークリッド距離
    distance = np.sqrt(np.sum((rgb - target) ** 2, axis=2))
    
    # マスクを作成（許容範囲内のピクセル）
    mask = distance <= tolerance
    
    # 新しいレイヤーを作成
    layer = np.zeros_like(img_array)
    
    # マスクされたピクセルのみコピー
    layer[mask] = img_array[mask]
    
    # マスクされていないピクセルは透明に
    layer[~mask, 3] = 0
    
    return Image.fromarray(layer, 'RGBA')

def create_color_layer_with_softedge(image, target_color, tolerance=30, softness=10):
    """
    ソフトエッジを持つ色レイヤーを作成
    
    Args:
        image: PIL Image オブジェクト
        target_color: ターゲット色 (R, G, B)
        tolerance: 色の許容範囲
        softness: エッジのソフトネス
    
    Returns:
        レイヤー画像（PIL Image）
    """
    img_array = np.array(image.convert('RGBA'))
    
    # RGB距離を計算
    rgb = img_array[:, :, :3].astype(float)
    target = np.array(target_color).astype(float)
    
    # ユークリッド距離
    distance = np.sqrt(np.sum((rgb - target) ** 2, axis=2))
    
    # ソフトマスクを作成
    # 許容範囲内は完全不透明、その外側は徐々に透明に
    alpha = np.clip(1 - (distance - tolerance) / softness, 0, 1)
    alpha = (alpha * 255).astype(np.uint8)
    
    # 完全に透明なピクセルは除外
    mask = alpha > 0
    
    # 新しいレイヤーを作成
    layer = np.zeros_like(img_array)
    layer[:, :, :3] = img_array[:, :, :3]
    layer[:, :, 3] = alpha
    
    # 元の色が一定以上離れている場合は完全透明に
    layer[distance > tolerance + softness, 3] = 0
    
    return Image.fromarray(layer, 'RGBA')

def separate_colors(input_path, output_dir, n_colors=8, tolerance=35, use_softedge=False):
    """
    画像を色ごとにレイヤーに分解
    
    Args:
        input_path: 入力画像のパス
        output_dir: 出力ディレクトリ
        n_colors: 抽出する色の数
        tolerance: 色の許容範囲
        use_softedge: ソフトエッジを使用するか
    """
    print(f"画像を読み込み中: {input_path}")
    image = Image.open(input_path)
    
    # 出力ディレクトリを作成
    os.makedirs(output_dir, exist_ok=True)
    
    # 主要な色を抽出
    print(f"\n{n_colors}色を抽出中...")
    colors = extract_dominant_colors(image, n_colors)
    
    print("\n抽出された色:")
    print("-" * 60)
    for i, color in enumerate(colors):
        print(f"  {i+1}. {color['name']:6s} #{color['hex']} ({color['percentage']:.1f}%)")
    print("-" * 60)
    
    # 各色のレイヤーを作成
    print(f"\nレイヤーを作成中...")
    for i, color in enumerate(colors):
        print(f"  レイヤー {i+1}/{n_colors}: {color['name']} (#{color['hex']})")
        
        if use_softedge:
            layer = create_color_layer_with_softedge(image, color['rgb'], tolerance)
        else:
            layer = create_color_layer(image, color['rgb'], tolerance)
        
        # ファイル名: layer-{番号}-{色コード}.png
        filename = f"layer-{i+1:02d}-{color['hex']}.png"
        output_path = os.path.join(output_dir, filename)
        layer.save(output_path, 'PNG')
        print(f"    → {output_path}")
    
    # 元の画像もコピー
    original_path = os.path.join(output_dir, "original.png")
    image.save(original_path, 'PNG')
    print(f"\n元画像: {original_path}")
    
    # カラーパレット情報をテキストファイルとして保存
    info_path = os.path.join(output_dir, "color_info.txt")
    with open(info_path, 'w', encoding='utf-8') as f:
        f.write("浮世絵 色版分解結果\n")
        f.write("=" * 60 + "\n\n")
        f.write(f"入力画像: {input_path}\n")
        f.write(f"抽出色数: {n_colors}\n")
        f.write(f"許容範囲: {tolerance}\n\n")
        f.write("抽出された色:\n")
        f.write("-" * 60 + "\n")
        for i, color in enumerate(colors):
            f.write(f"  {i+1}. {color['name']:6s} #{color['hex']} RGB({color['rgb'][0]}, {color['rgb'][1]}, {color['rgb'][2]}) - {color['percentage']:.1f}%\n")
    
    print(f"\n色情報: {info_path}")
    print("\n✓ 完了しました！")

def main():
    """メイン関数"""
    # デフォルト値
    input_path = None
    output_dir = None
    n_colors = 8
    tolerance = 35
    use_softedge = False
    
    # コマンドライン引数の処理
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] in ['-n', '--colors']:
            n_colors = int(args[i + 1])
            i += 2
        elif args[i] in ['-t', '--tolerance']:
            tolerance = int(args[i + 1])
            i += 2
        elif args[i] in ['-s', '--softedge']:
            use_softedge = True
            i += 1
        elif args[i] in ['-o', '--output']:
            output_dir = args[i + 1]
            i += 2
        elif args[i] in ['-h', '--help']:
            print_help()
            sys.exit(0)
        else:
            input_path = args[i]
            i += 1
    
    if input_path is None:
        print("エラー: 入力画像を指定してください。")
        print("使用方法: python color_layer_separation.py [オプション] <入力画像>")
        print("詳細は -h オプションで確認できます。")
        sys.exit(1)
    
    # 出力ディレクトリが指定されていない場合、入力ファイル名から生成
    if output_dir is None:
        base_name = os.path.splitext(os.path.basename(input_path))[0]
        output_dir = os.path.join(os.path.dirname(input_path) or '.', f"{base_name}_layers")
    
    separate_colors(input_path, output_dir, n_colors, tolerance, use_softedge)

def print_help():
    """ヘルプメッセージを表示"""
    print("""
浮世絵 色版分解スクリプト
========================

使用方法:
    python color_layer_separation.py [オプション] <入力画像>

オプション:
    -n, --colors <数>      抽出する色の数 (デフォルト: 8)
    -t, --tolerance <数>   色の許容範囲 (デフォルト: 35)
    -s, --softedge         ソフトエッジを使用
    -o, --output <パス>    出力ディレクトリ
    -h, --help             このヘルプを表示

例:
    # 基本的な使用法（8色に分解）
    python color_layer_separation.py image.png

    # 12色に分解、許容範囲を広げる
    python color_layer_separation.py -n 12 -t 50 image.png

    # 出力先を指定
    python color_layer_separation.py -o ./output image.png

    # ソフトエッジで滑らかなレイヤーを作成
    python color_layer_separation.py -s image.png
""")

if __name__ == '__main__':
    main()

