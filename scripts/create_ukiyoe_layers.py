#!/usr/bin/env python3
"""
浮世絵レイヤー生成スクリプト
Ukiyo-e Layer Generation Script

墨摺絵（モノクロSVG）から紅摺絵・錦絵の色レイヤーを生成
Creates color layers for benizuri-e and nishiki-e from sumizuri-e

Usage:
    python create_ukiyoe_layers.py
"""

import subprocess
import os
import sys
from pathlib import Path

# プロジェクトルート
PROJECT_ROOT = Path(__file__).parent.parent
PUBLIC_DIR = PROJECT_ROOT / "public"
OUTPUT_DIR_BENIZURI = PUBLIC_DIR / "images" / "dawn" / "sumizuri-e" / "layers" / "benizuri"
OUTPUT_DIR_NISHIKI = PUBLIC_DIR / "images" / "dawn" / "sumizuri-e" / "layers" / "nishiki"

# 入力ファイル
SOURCE_PNG = PUBLIC_DIR / "sumizuri-e.png"
SOURCE_SVG = PUBLIC_DIR / "sumizuri-e-best.svg"

# ========================================
# 伝統色パレット（より本格的・落ち着いた色）
# ========================================

# 紅摺絵の色（2-3色）
BENIZURI_COLORS = {
    "sumi": "#1C1C1C",      # 墨 - 輪郭線
    "beni": "#B85B5B",      # 紅 - 桜、アクセント（落ち着いた赤）
    "kusa": "#7A8B5A",      # 草 - 風景（落ち着いた緑）
}

# 錦絵の色（多色）
NISHIKI_COLORS = {
    "sumi": "#1C1C1C",      # 墨 - 輪郭線
    "ai": "#3D5A73",        # 藍 - 空、富士山（落ち着いた青）
    "beni": "#B85B5B",      # 紅 - 桜
    "kusa": "#7A8B5A",      # 草 - 風景
    "cha": "#8B6B4A",       # 茶 - 木の幹
    "ki": "#D4B87A",        # 黄 - 着物アクセント（落ち着いた黄）
    "usuzumi": "#9A9A9A",   # 薄墨 - 富士山、雲
    "washi": "#F5F0E6",     # 和紙 - 背景
}


def run_command(cmd, description=""):
    """コマンドを実行"""
    print(f"  {description}..." if description else f"  Running: {' '.join(cmd[:3])}...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"    Warning: {result.stderr[:200] if result.stderr else 'Unknown error'}")
    return result.returncode == 0


def create_region_mask(source_png, output_png, region_params, description):
    """
    特定の領域のマスク画像を作成
    region_params: ImageMagickのパラメータリスト
    """
    cmd = ["magick", str(source_png)] + region_params + [str(output_png)]
    return run_command(cmd, description)


def create_svg_from_mask(mask_png, output_svg, fill_color, description):
    """マスク画像からSVGを生成"""
    # PBMに変換
    pbm_path = mask_png.with_suffix(".pbm")
    cmd_convert = ["magick", str(mask_png), "-compress", "none", str(pbm_path)]
    if not run_command(cmd_convert, f"Converting to PBM"):
        return False
    
    # Potraceでベクター化
    cmd_potrace = [
        "potrace", str(pbm_path),
        "-s",                    # SVG出力
        "-t", "3",               # turdsize
        "-a", "1.2",             # alphamax
        "-O", "0.1",             # optimization
        "-u", "10",              # unit
        "--turnpolicy", "minority",
        "-o", str(output_svg)
    ]
    success = run_command(cmd_potrace, description)
    
    # PBMファイルを削除
    if pbm_path.exists():
        pbm_path.unlink()
    
    # SVGに色を追加
    if success and output_svg.exists():
        add_color_to_svg(output_svg, fill_color)
    
    return success


def add_color_to_svg(svg_path, fill_color):
    """SVGに塗りつぶし色を追加"""
    with open(svg_path, 'r') as f:
        content = f.read()
    
    # pathタグにfill属性を追加
    content = content.replace('<path', f'<path fill="{fill_color}"')
    
    # viewBoxを修正（元画像サイズに合わせる）
    content = content.replace('width="2234.6667" height="3332"', 'width="1676" height="2499"')
    
    with open(svg_path, 'w') as f:
        f.write(content)


def create_benizuri_layers():
    """紅摺絵のレイヤーを生成（3色）"""
    print("\n" + "=" * 60)
    print("紅摺絵 (Benizuri-e) レイヤー生成")
    print("=" * 60)
    
    # 出力ディレクトリ作成
    OUTPUT_DIR_BENIZURI.mkdir(parents=True, exist_ok=True)
    
    # 一時ディレクトリ
    tmp_dir = Path("/tmp/ukiyoe-layers")
    tmp_dir.mkdir(exist_ok=True)
    
    # Layer 1: 墨（輪郭線）- 既存のSVGをコピー
    print("\n[Layer 1] 墨版（輪郭線）")
    sumi_svg = OUTPUT_DIR_BENIZURI / "layer-01-sumi.svg"
    if SOURCE_SVG.exists():
        import shutil
        shutil.copy(SOURCE_SVG, sumi_svg)
        print(f"  ✓ Copied: {sumi_svg.name}")
    else:
        print(f"  ✗ Source SVG not found: {SOURCE_SVG}")
    
    # Layer 2: 紅（桜の花）
    # 画像上部の花の領域を抽出
    print("\n[Layer 2] 紅版（桜の花）")
    beni_mask = tmp_dir / "beni-mask.png"
    
    # 桜の花は画像上部に集中している
    # 上部40%の領域から明るいピクセル（花の部分）を抽出
    create_region_mask(
        SOURCE_PNG, beni_mask,
        [
            "-colorspace", "Gray",
            # 上部の花の領域にフォーカス
            "-region", "1676x1000+0+0",  # 上部領域
            "-negate",
            "-threshold", "70%",
            "-morphology", "Close", "Disk:2",
            "-morphology", "Open", "Disk:1",
            # 花びらの形状を強調
            "+region",
            "-fill", "black", "-draw", "rectangle 0,1200 1676,2499",  # 下部を除去
        ],
        "Extracting cherry blossom regions"
    )
    
    beni_svg = OUTPUT_DIR_BENIZURI / "layer-02-beni.svg"
    if beni_mask.exists():
        create_svg_from_mask(beni_mask, beni_svg, BENIZURI_COLORS["beni"], "Creating beni layer SVG")
        print(f"  ✓ Created: {beni_svg.name}")
    
    # Layer 3: 草（風景）
    print("\n[Layer 3] 草版（風景・葉）")
    kusa_mask = tmp_dir / "kusa-mask.png"
    
    # 風景は画像下部と中央部に分布
    create_region_mask(
        SOURCE_PNG, kusa_mask,
        [
            "-colorspace", "Gray",
            # 下部の風景領域
            "-region", "1676x1200+0+1300",
            "-negate", 
            "-threshold", "65%",
            "-morphology", "Close", "Disk:3",
            "+region",
            "-fill", "black", "-draw", "rectangle 0,0 1676,1300",  # 上部を除去
            # 中央部の一部も含める
            "-fill", "black", "-draw", "rectangle 500,0 1200,2499",  # 人物部分を除去
        ],
        "Extracting landscape regions"
    )
    
    kusa_svg = OUTPUT_DIR_BENIZURI / "layer-03-kusa.svg"
    if kusa_mask.exists():
        create_svg_from_mask(kusa_mask, kusa_svg, BENIZURI_COLORS["kusa"], "Creating kusa layer SVG")
        print(f"  ✓ Created: {kusa_svg.name}")
    
    print("\n紅摺絵レイヤー生成完了！")
    print(f"出力先: {OUTPUT_DIR_BENIZURI}")


def create_nishiki_layers():
    """錦絵のレイヤーを生成（多色）"""
    print("\n" + "=" * 60)
    print("錦絵 (Nishiki-e) レイヤー生成")
    print("=" * 60)
    
    # 出力ディレクトリ作成
    OUTPUT_DIR_NISHIKI.mkdir(parents=True, exist_ok=True)
    
    tmp_dir = Path("/tmp/ukiyoe-layers")
    tmp_dir.mkdir(exist_ok=True)
    
    # Layer 1: 墨（輪郭線）
    print("\n[Layer 1] 墨版（輪郭線）")
    sumi_svg = OUTPUT_DIR_NISHIKI / "layer-01-sumi.svg"
    if SOURCE_SVG.exists():
        import shutil
        shutil.copy(SOURCE_SVG, sumi_svg)
        print(f"  ✓ Copied: {sumi_svg.name}")
    
    # Layer 2: 藍（空・富士山）
    print("\n[Layer 2] 藍版（空・富士山）")
    ai_mask = tmp_dir / "ai-mask.png"
    
    # 富士山は画像中央上部、空は上部全体
    create_region_mask(
        SOURCE_PNG, ai_mask,
        [
            "-colorspace", "Gray",
            # 上部中央の富士山領域
            "-region", "800x600+450+400",
            "-negate",
            "-threshold", "80%",  # 明るい部分（空、富士山の雪）
            "+region",
            # 周囲をクリア
            "-fill", "black", "-draw", "rectangle 0,1000 1676,2499",
        ],
        "Extracting sky and Fuji regions"
    )
    
    ai_svg = OUTPUT_DIR_NISHIKI / "layer-02-ai.svg"
    if ai_mask.exists():
        create_svg_from_mask(ai_mask, ai_svg, NISHIKI_COLORS["ai"], "Creating ai layer SVG")
        print(f"  ✓ Created: {ai_svg.name}")
    
    # Layer 3: 紅（桜）
    print("\n[Layer 3] 紅版（桜の花）")
    beni_mask = tmp_dir / "nishiki-beni-mask.png"
    
    create_region_mask(
        SOURCE_PNG, beni_mask,
        [
            "-colorspace", "Gray",
            "-region", "1200x900+200+50",
            "-negate",
            "-threshold", "70%",
            "-morphology", "Close", "Disk:2",
            "+region",
            "-fill", "black", "-draw", "rectangle 0,950 1676,2499",
        ],
        "Extracting cherry blossom regions"
    )
    
    beni_svg = OUTPUT_DIR_NISHIKI / "layer-03-beni.svg"
    if beni_mask.exists():
        create_svg_from_mask(beni_mask, beni_svg, NISHIKI_COLORS["beni"], "Creating beni layer SVG")
        print(f"  ✓ Created: {beni_svg.name}")
    
    # Layer 4: 草（風景）
    print("\n[Layer 4] 草版（風景・葉）")
    kusa_mask = tmp_dir / "nishiki-kusa-mask.png"
    
    create_region_mask(
        SOURCE_PNG, kusa_mask,
        [
            "-colorspace", "Gray",
            "-region", "1676x1000+0+1500",
            "-negate",
            "-threshold", "60%",
            "-morphology", "Close", "Disk:2",
            "+region",
            "-fill", "black", "-draw", "rectangle 0,0 1676,1500",
            "-fill", "black", "-draw", "rectangle 400,0 1300,2499",  # 人物除去
        ],
        "Extracting landscape regions"
    )
    
    kusa_svg = OUTPUT_DIR_NISHIKI / "layer-04-kusa.svg"
    if kusa_mask.exists():
        create_svg_from_mask(kusa_mask, kusa_svg, NISHIKI_COLORS["kusa"], "Creating kusa layer SVG")
        print(f"  ✓ Created: {kusa_svg.name}")
    
    # Layer 5: 茶（木の幹）
    print("\n[Layer 5] 茶版（木の幹）")
    cha_mask = tmp_dir / "cha-mask.png"
    
    # 木の幹は画像左側
    create_region_mask(
        SOURCE_PNG, cha_mask,
        [
            "-colorspace", "Gray",
            "-region", "400x1800+0+200",  # 左側の木の幹
            "-negate",
            "-threshold", "50%",
            "-morphology", "Close", "Disk:3",
            "+region",
            "-fill", "black", "-draw", "rectangle 400,0 1676,2499",
        ],
        "Extracting tree trunk regions"
    )
    
    cha_svg = OUTPUT_DIR_NISHIKI / "layer-05-cha.svg"
    if cha_mask.exists():
        create_svg_from_mask(cha_mask, cha_svg, NISHIKI_COLORS["cha"], "Creating cha layer SVG")
        print(f"  ✓ Created: {cha_svg.name}")
    
    # Layer 6: 黄（着物アクセント）
    print("\n[Layer 6] 黄版（着物アクセント）")
    ki_mask = tmp_dir / "ki-mask.png"
    
    # 着物は画像中央下部
    create_region_mask(
        SOURCE_PNG, ki_mask,
        [
            "-colorspace", "Gray",
            "-region", "700x1000+450+1200",  # 人物の着物領域
            "-negate",
            "-threshold", "75%",
            "-morphology", "Close", "Disk:1",
            "+region",
            "-fill", "black", "-draw", "rectangle 0,0 450,2499",
            "-fill", "black", "-draw", "rectangle 1150,0 1676,2499",
            "-fill", "black", "-draw", "rectangle 0,0 1676,1200",
        ],
        "Extracting kimono accent regions"
    )
    
    ki_svg = OUTPUT_DIR_NISHIKI / "layer-06-ki.svg"
    if ki_mask.exists():
        create_svg_from_mask(ki_mask, ki_svg, NISHIKI_COLORS["ki"], "Creating ki layer SVG")
        print(f"  ✓ Created: {ki_svg.name}")
    
    # Layer 7: 薄墨（富士山・雲）
    print("\n[Layer 7] 薄墨版（富士山・雲）")
    usuzumi_mask = tmp_dir / "usuzumi-mask.png"
    
    create_region_mask(
        SOURCE_PNG, usuzumi_mask,
        [
            "-colorspace", "Gray",
            "-region", "600x400+550+500",  # 富士山周辺
            "-negate",
            "-threshold", "85%",  # 非常に明るい部分のみ
            "+region",
            "-fill", "black", "-draw", "rectangle 0,900 1676,2499",
        ],
        "Extracting Fuji/cloud regions"
    )
    
    usuzumi_svg = OUTPUT_DIR_NISHIKI / "layer-07-usuzumi.svg"
    if usuzumi_mask.exists():
        create_svg_from_mask(usuzumi_mask, usuzumi_svg, NISHIKI_COLORS["usuzumi"], "Creating usuzumi layer SVG")
        print(f"  ✓ Created: {usuzumi_svg.name}")
    
    print("\n錦絵レイヤー生成完了！")
    print(f"出力先: {OUTPUT_DIR_NISHIKI}")


def create_color_palette_info():
    """色情報ファイルを生成"""
    
    # 紅摺絵の色情報
    benizuri_info = OUTPUT_DIR_BENIZURI / "color_info.txt"
    with open(benizuri_info, 'w', encoding='utf-8') as f:
        f.write("紅摺絵 (Benizuri-e) カラーパレット\n")
        f.write("=" * 50 + "\n\n")
        f.write("伝統的な浮世絵の色を採用（より落ち着いた色調）\n\n")
        for name, color in BENIZURI_COLORS.items():
            ja_name = {"sumi": "墨", "beni": "紅", "kusa": "草"}.get(name, name)
            f.write(f"{ja_name} ({name}): {color}\n")
    
    # 錦絵の色情報
    nishiki_info = OUTPUT_DIR_NISHIKI / "color_info.txt"
    with open(nishiki_info, 'w', encoding='utf-8') as f:
        f.write("錦絵 (Nishiki-e) カラーパレット\n")
        f.write("=" * 50 + "\n\n")
        f.write("伝統的な浮世絵の色を採用（より落ち着いた色調）\n\n")
        ja_names = {
            "sumi": "墨", "ai": "藍", "beni": "紅", "kusa": "草",
            "cha": "茶", "ki": "黄", "usuzumi": "薄墨", "washi": "和紙"
        }
        for name, color in NISHIKI_COLORS.items():
            ja_name = ja_names.get(name, name)
            f.write(f"{ja_name} ({name}): {color}\n")
    
    print(f"\n色情報ファイル生成完了:")
    print(f"  - {benizuri_info}")
    print(f"  - {nishiki_info}")


def main():
    print("=" * 60)
    print("浮世絵レイヤー生成スクリプト")
    print("Ukiyo-e Layer Generation Script")
    print("=" * 60)
    
    # 入力ファイル確認
    if not SOURCE_PNG.exists():
        print(f"Error: Source PNG not found: {SOURCE_PNG}")
        sys.exit(1)
    
    if not SOURCE_SVG.exists():
        print(f"Warning: Source SVG not found: {SOURCE_SVG}")
        print("  墨版（輪郭線）は生成されません")
    
    print(f"\n入力: {SOURCE_PNG}")
    print(f"SVG: {SOURCE_SVG}")
    
    # レイヤー生成
    create_benizuri_layers()
    create_nishiki_layers()
    create_color_palette_info()
    
    print("\n" + "=" * 60)
    print("全レイヤー生成完了！")
    print("=" * 60)


if __name__ == "__main__":
    main()
