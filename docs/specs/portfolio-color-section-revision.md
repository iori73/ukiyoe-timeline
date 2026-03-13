# Portfolio: Color Extraction & Analysis セクション改訂

> 作成日: 2026-03-09
> ステータス: Draft
> Figma: https://www.figma.com/design/7MnH47lP4yJOQK5xgpKixk/portfolio_v3?node-id=821-2

---

## 概要

ポートフォリオの「Color Extraction & Analysis」セクション（node 821:91）のテキストとビジュアルを、実際のプロジェクト実装と照合して修正する。正確性の向上、欠落している設計判断の追加、隣接セクションとの重複解消を行う。

---

## 現状の問題点

### 1. テキストの不正確さ

**現在の文章:**
> Using Python scripts, I extracted dominant color palettes from actual ukiyoe prints across different eras. This analysis revealed how the available pigment range expanded over time — from pure black ink in sumizuri-e to the rich, multi-layered palette of nishiki-e. These extracted colors became the foundation of the site's design system, with CSS variables mapped to historically accurate pigments.

**問題:**
- 「CSS variables mapped to historically accurate pigments」は不正確
  - サイトの CSS 変数（`--beni-iro`, `--ai-iro` 等）は Python 抽出結果からではなく、アダチ版画研究所等の文献から手動選定（`docs/COLOR_GUIDELINES.md` 参照）
  - Python 抽出が反映されたのは `src/data/periodColors.js`（タイムラインの時代別色彩可視化）
- 「became the foundation of the site's design system」と言い切るのは過大
- em dash（—）の使用（lessons.md の「AI っぽい文体」回避ルールとの兼ね合い）

### 2. テキストとビジュアルの不一致

- **テキスト** → dominant color extraction（PIL 量子化 + 頻度集計）を説明
- **下段ビジュアル** → color layer separation（K-means で1枚の絵を色版に分解）を表示
- これらは目的が異なる2つのプロセス:
  - extraction (`extract_period_colors.py`): 各時代にどんな色が使われていたか → 色彩可視化データ
  - separation (`color_layer_separation.py`): 1枚の絵がどんな色版で構成されているか → 印刷プロセスアニメーション素材

### 3. 最も語るべき設計判断の欠落

「正規スロット方式」（`src/data/periodColors.js`）:
- 9つの固定色カテゴリ（墨→紅→金→緑→青灰→藍→ベロ藍→銀灰→肌）
- 各時代が activeSlots でどのスロットを使うかを宣言
- 未使用スロットはゴースト表示で位置を保持
- 「時代が進むにつれ色が右に増えていく」流れが視覚化される

これは「生データをどう可視化の構造に翻訳したか」というデザイン判断であり、ポートフォリオとして最も説得力のあるポイント。

### 4. 「Printing Process Study」セクションとの重複

Color Extraction の下段ビジュアル（色版分離画像）は、次セクション「Printing Process Study」の内容と重複する。

---

## 改訂案

### テキスト: Option A（3段階パイプラインを簡潔に）

> Using Python scripts with PIL image quantization, I extracted dominant colors from representative ukiyoe prints across 9 historical periods, sourced from the MET Open Access collection and Wikimedia Commons.
>
> The raw hex values alone weren't meaningful for comparison. Each era used different pigments, but comparing unstructured color lists across time periods was visually noisy. So I designed a normalization structure: 9 canonical color slots (ink black, crimson, gold, green, blue-gray, indigo, Prussian blue, mica gray, warm paper) that remain in fixed positions across all periods. Each era declares which slots are "active." Unused slots appear as ghosts, preserving their position.
>
> The result: reading left to right, you can see how the available palette expanded from a single ink tone in 1670 to the full Prussian blue revolution of the 1800s. This structure powers the color visualization in the timeline gallery.

**このテキストが解決すること:**
- Step 1 (Raw): Python + PIL + 画像ソースを具体的に
- Step 2 (Curated): 「生 hex 値だけでは比較できない」という課題提起
- Step 3 (Structured): 正規スロット方式の設計判断と、なぜそう設計したか
- 結果: タイムラインギャラリーの可視化に反映（CSS 変数とは言わない）
- em dash なし

### テキスト: Option B（より短く、ビジュアルに語らせる版）

> I wrote Python scripts to extract dominant colors from actual ukiyoe prints spanning 9 eras, using the MET Open Access API and Wikimedia Commons as sources. The raw extraction revealed how available pigments expanded over time, but unstructured hex lists were hard to compare across periods.
>
> To make this progression legible, I defined 9 canonical color categories (from ink black to warm paper) in fixed positions. Each era declares which colors it uses; the rest appear as faded ghosts. This lets viewers read the evolution of ukiyoe's palette at a glance.

### テキスト: Option C（最小限）

> Python scripts extracted dominant colors from ~45 ukiyoe prints across 9 historical periods. I then normalized these into 9 canonical pigment categories, each in a fixed position, so the gradual expansion of available colors becomes visible at a glance.

---

### ビジュアル構成案

#### 上段（現状維持可 + 軽微な調整）
作品サムネイルのグリッド + 各作品下の抽出色スウォッチ。
→ 「Step 1: Raw extraction」を示す役割。

#### 中段（追加を推奨）
**正規スロット方式のビジュアル:**
9時代分の正規スロットを縦に並べた図。各行が1時代。
- アクティブなスロット = 塗りつぶし
- 非アクティブなスロット = ゴースト（薄い表示）
- 左から右に読むと「色が増えていく」パターンが見える

```
1670  ■ ● ● ○ ○ ○ ○ ○ ●   墨摺絵（4色）
1700  ■ ○ ● ○ ○ ○ ○ ○ ●   役者絵（3色）
1720  ■ ● ● ○ ○ ○ ○ ○ ●   漆絵（4色）
1740  ■ ● ○ ● ○ ○ ○ ○ ●   紅摺絵（4色）← 緑が初登場
1750  ■ ● ● ● ● ○ ○ ○ ●   技術向上（6色）← 青灰が初登場
1765  ■ ● ● ● ● ○ ○ ○ ●   錦絵成立（6色）
1770  ■ ● ● ● ● ● ○ ○ ●   大判化（7色）← 藍が初登場
1790  ■ ● ○ ○ ● ● ○ ● ●   歌麿・写楽（6色）← 銀灰が初登場
1800  ■ ● ○ ● ○ ● ● ○ ●   北斎・広重（6色）← ベロ藍が初登場

      墨 紅 金 緑 灰 藍 ベ 銀 肌
      ■ = 常時使用  ● = この時代で使用  ○ = ゴースト
```

→ 「Step 3: Structured normalization」を示す。これがこのセクションの核。
→ 実サイトの ArtworkGalleryGrid セクションヘッダーのスクリーンショットを併置するとさらに説得力が増す。

#### 下段（色版分離画像は移動）
現在の5枚の色版分離画像（K-means レイヤー分解）は「Printing Process Study」セクションへ移動。そちらのテキスト（printing order, layer-stacking animations）と整合する。

---

### 「Printing Process Study」セクションへの影響

**現在のテキスト（変更不要）:**
> I studied the precise order in which colors were applied during the printing process. In nishiki-e, for example, a single print could require 10 or more separate woodblocks, each carrying a different color. Understanding this sequence was crucial for designing the layer-stacking animations on the top page, where each color layer appears in historically accurate order.

**ビジュアル:**
Color Extraction から移動した色版分離画像をここに配置。テキスト内容と直接対応する。

---

## 実装手順（Figma 上の作業）

1. Color Extraction セクション（821:91）のテキスト（821:96）を Option A/B/C のいずれかに差し替え
2. 下段の色版分離画像（instance 897:21078 内、または作業中フレーム 876:15260 内）を Printing Process Study（821:100）へ移動
3. 中段に正規スロット方式のビジュアルを新規作成（上記 ASCII 図を参考に Figma でデザイン）
4. 必要に応じて上段のサムネイルグリッドのキャプションを調整（「~45 prints from MET Open Access & Wikimedia Commons」等）

---

## 参照ファイル（実装の根拠）

| ファイル | 内容 |
|---|---|
| `scripts/extract_period_colors.py` | 主要な色抽出スクリプト（PIL 量子化 + Wikipedia/MET 画像） |
| `scripts/extract_colors_remaining.py` | Rate Limit 回避用の補完スクリプト（MET Open Access 直接取得） |
| `scripts/color_layer_separation.py` | 色版分離スクリプト（K-means、印刷プロセスアニメーション素材用） |
| `src/data/periodColors.js` | 正規スロット方式の最終データ（CANONICAL_SLOTS, PERIOD_COLORS, activeSlots） |
| `src/data/techniques.js` | ホームページタイムライン用の象徴色（手動選定） |
| `docs/COLOR_GUIDELINES.md` | CSS デザインシステム色の根拠（アダチ版画研究所等の文献ベース） |

---

## 備考

- テキスト Option A が最も情報量が多く、ポートフォリオとしての説得力が高い。ただしセクション全体の長さとのバランスで B/C も選択肢
- 正規スロットのビジュアルは、実サイトの ArtworkGalleryGrid のスクリーンショットで代用することも可能
- em dash は避け、カンマやピリオドで代替（lessons.md 2026-02-24 参照）
