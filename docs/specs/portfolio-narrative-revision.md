# Portfolio: 詳細ページ テキスト改訂（全セクション）

> 作成日: 2026-03-10
> 最終更新: 2026-03-10
> ステータス: Final Draft
> Figma: https://www.figma.com/design/7MnH47lP4yJOQK5xgpKixk/portfolio_v3?node-id=821-2

---

## 改訂の軸

1. **なぜ浮世絵か** — 博物館での体験 + AI進化がトリガー（Overview 冒頭）
2. **AI can create, but it can't craft** — Medium 記事のテーゼをポートフォリオでも展開
3. **手仕事の証拠** — Fresco timelapse で「自分の手で作った」ことを映像で証明
4. **文化リサーチ → デザイン → 感動** の一貫したストーリー

---

## 推奨セクション順序

| # | セクション | 変更内容 |
|---|---|---|
| 1 | Overview | 動機を博物館体験 + AI仮説の2段階で書き直し |
| 2 | Research & Discovery | 変更なし |
| 3 | Design Process | 変更なし（Color System は既存の仕様書参照） |
| 4 | **Hand-Coloring the Layers** | **新設**: Fresco timelapse 動画 + テキスト |
| 5 | AI Collaboration | "create vs craft" テーゼを統合、独立セクション化 |
| 6 | Technical Highlights | AI 部分を除いた技術詳細のみ |
| 7 | Reflection | 博物館体験の回収 + craft テーゼの回収 |

---

## 1. Overview — 博物館体験 + AI仮説

### Figma node: 821:55 (Paragraph)

### 現在のテキスト

> Ukiyoe is an interactive web experience that visualizes the evolution of Japanese woodblock printing techniques. The site guides visitors through three major eras — monochrome sumizuri-e, two-color benizuri-e, and full-color nishiki-e — using scroll-driven layer animations that recreate the actual printing process of stacking color layers one by one.

### 改訂テキスト

> A couple of years ago, I visited the ukiyoe gallery at the Tokyo National Museum. I had seen woodblock prints before in textbooks and online, but standing in front of the real thing was different. The paper had texture. The pigments had depth. I was looking at prints of Tokyo landscapes: snow falling on Shinagawa, Mount Fuji visible over low rooftops, rivers that no longer look the way they do today. The same city, seen through the eyes and craft of people who lived here centuries ago. That stuck with me. When AI tools matured enough to support complex front-end work, I saw an opportunity: the layered printing process that makes ukiyoe unique could be recreated as an interactive web experience.
>
> The site visualizes how these printing techniques evolved, from monochrome sumizuri-e to two-color benizuri-e to full-color nishiki-e, using scroll-driven animations that stack color layers one by one, just as a printer would have done by hand.

### 変更のポイント

- **博物館体験を具体的に描写**: 質感、品川の雪、富士山が見えた低い屋根、違う景色の川。「同じ都市、違う世界」
- **2段階の動機**: (1) 実物を見た感動（2年前）→ (2) AI の進化が「今なら作れる」という仮説を生んだ
- **5文 + 機能説明1文** = 1段落 + 1短段落（計6-7文）
- 「That stuck with me.」で感情的なフックを作り、「When AI tools matured...」で仮説への転換を自然に接続
- em dash なし

---

## 2. Color Extraction & Analysis — 3段階パイプライン

### Figma node: 821:95 (Paragraph)

### 現在のテキスト

> Using Python scripts, I extracted dominant color palettes from actual ukiyoe prints across different eras. This analysis revealed how the available pigment range expanded over time — from pure black ink in sumizuri-e to the rich, multi-layered palette of nishiki-e. These extracted colors became the foundation of the site's design system, with CSS variables mapped to historically accurate pigments.

### 改訂テキスト

> Using Python scripts with PIL image quantization, I extracted dominant colors from representative ukiyoe prints across 9 historical periods, sourced from the MET Open Access collection and Wikimedia Commons.
>
> The raw hex values alone were not meaningful for comparison. Each era used different pigments, but comparing unstructured color lists across time periods was visually noisy. So I designed a normalization structure: 9 canonical color slots (ink black, crimson, gold, green, blue-gray, indigo, Prussian blue, mica gray, warm paper) arranged in fixed positions across all periods. Each era declares which slots are "active." Unused slots appear as ghosts, preserving their position.
>
> The result: reading left to right, you can see how the available palette expanded from a single ink tone in 1670 to the full Prussian blue revolution of the 1800s. This structure powers the color proportion bars in the timeline gallery.

### ビジュアル

- 上段: 作品サムネイル + 抽出色スウォッチ（現状維持）
- 中段: Proportion Bars（`scripts/portfolio-color-viz.html` で生成済み、artwork-gallery__color-segment と同じ視覚言語）
- 下段: 色版分離画像は Printing Process Study セクションへ移動

### 変更のポイント

- 「CSS variables mapped to historically accurate pigments」を削除（不正確）
- 3段階パイプライン（Raw → Curated → Structured）を明示
- 正規スロット方式の設計判断を語る（なぜこの構造にしたか）
- em dash なし
- 詳細は [portfolio-color-section-revision.md](portfolio-color-section-revision.md) 参照

---

## 3. Hand-Coloring the Layers — 新設セクション

### Figma 配置: Design Process の直後、AI Collaboration の直前
### Figma timelapse 動画: [Ukiyoe Figma node 1142-17422](https://www.figma.com/design/KfbKROQ1hvrrR9ZVJ3bEn4/Ukiyoe?node-id=1142-17422)

### テキスト

> The core animation on this site shows color layers stacking to form a complete print, just as a real Edo-period printer would have pressed each woodblock in sequence. To build this, I needed images of each individual color layer: the red pigment areas on one layer, green foliage on another, gold accents on a third.
>
> These assets do not exist in any dataset. I tried AI image generation, but it could not produce layers with the color accuracy and edge precision required to align and stack convincingly. So I did what a printer would have done: I separated the colors by hand.
>
> Using Adobe Fresco, I painted each layer individually, referencing the original prints to match pigment areas. This was the most time-consuming part of the entire project, and the part AI could not shortcut. The timelapse below shows the process.

### ビジュアル

- **メイン**: Fresco timelapse 動画の埋め込み（手塗りプロセスのリアルタイム証拠）
- **補足**: 完成した各色レイヤーの並び（墨 → 紅 → 緑 → 藍 → 完成形）

### 変更のポイント

- **新規セクション**: 記事（note / Medium 両方）で最もインパクトのあったエピソード
- **「AI がショートカットできなかった部分」を映像で証明**: timelapse は採用担当者にとって最も説得力のある素材
- Design Process（デザインの構想）の直後に配置することで「構想 → 手仕事」の流れが自然
- AI Collaboration の直前に配置することで、「手で作る + AI で実装する」という協業の全体像を示す

---

## 4. AI Collaboration — "AI can create, but it can't craft"

### Figma node: 821:210 (Container, 現在 "The Role of AI")
### 変更: Technical Highlights (821:188) から分離し、独立した H2 セクションに格上げ。

### 現在のテキスト

> AI accelerated ideation and code implementation — generating component scaffolds, exploring layout variations, and iterating on responsive design. However, the project revealed clear boundaries: AI could not create the hand-painted layer assets that form the core visual experience, nor could it make the nuanced design judgments required when working within a specific cultural context.
>
> The most valuable outcomes came from human curiosity — the leap from studying printing processes to imagining isometric layer animations, the insight that ukiyoe was folk art rather than museum art, and the decision to use historically extracted colors rather than approximated palettes. AI was a powerful collaborator, but the creative direction required human exploration.

### 改訂テキスト

> I estimated this project would take 2 to 3 weeks with AI handling the implementation. It took three months. Not because AI failed, but because the work that mattered most turned out to be the work AI could not do: hand-coloring layer assets, making cultural design judgments, and finding unexpected connections between historical research and interaction design.
>
> AI was still central to execution. I used Claude and Cursor to prototype components, iterate on responsive layouts, and implement scroll-driven animations that would have taken much longer to build alone. But my process goes beyond prompting. I bring cultural context, historical references, and design intent into every interaction. When building the timeline's color system, I did not ask AI to "pick nice colors." I researched pigment histories, wrote Python scripts to extract colors from museum archives, then designed a canonical slot structure that makes 130 years of palette evolution legible at a glance. AI implemented each step faster. The story, the structure, and the judgment were mine.
>
> AI can create, but it can't craft. Craft is the narrative behind a design choice, the sensitivity to a cultural context, the attention to a detail that nobody requested but that makes the whole thing feel intentional. The isometric layer animations, the kushi-dango navigation motif, the canonical color slots: each reflects a specific design decision rooted in genuine research, not generic output. What AI gave me was speed. What I brought was direction, a cultural story, and the conviction that the details matter.

### 変更のポイント

- **オープニングに「期待と現実のギャップ」**: 2-3週間 → 3ヶ月。note 記事の最も印象的なフック
- **防御的な書き方を排除**: 「AI could not...」「However...」を削除
- **"AI can create, but it can't craft" テーゼを明示**: Medium 記事と同じフレーミング
- **"craft" を定義**: narrative, sensitivity, attention to detail
- **具体例で独自性を示す**: 色抽出パイプラインを例に「ただ聞くのではなく、文化的コンテキストを盛り込む」プロセスを描写
- **最後の一文でバランス**: 「What AI gave me was speed. What I brought was direction, a cultural story, and the conviction that the details matter.」
- em dash なし

### セクション見出し

- 推奨: **"AI Can Create, But It Can't Craft"**（テーゼそのものを見出しに。記事との一貫性、読者の興味を引く）
- 代替: "AI as a Collaborator"

---

## 5. Technical Highlights — AI 部分を除外した残り

### Figma node: 821:188 (Section)

### 変更内容

"The Role of AI" サブセクション（821:210）を独立セクションに移動した後、残る内容:

- H2: Technical Highlights
- 本文: 「The site is built with React 18 and Vite 6...」（変更なし）
- H3: Scroll-Driven Layer Animation（変更なし）
- H3: Parallax Artwork Gallery（変更なし）

これらの技術詳細は現状のままで問題なし。AI セクションを分離するだけ。

---

## 6. Reflection — 博物館体験の回収 + craft テーゼの回収

### Figma node: 821:228 (Paragraph, "What I Learned")

### 現在のテキスト

> This project taught me that deep domain research fundamentally shapes design decisions. Understanding that nishiki-e required 10+ woodblocks directly informed the animation design. Knowing that ukiyoe was mass-produced popular art — not precious gallery pieces — influenced the timeline's organic layout. Cultural context is not decoration; it is the design foundation.

### 改訂テキスト

> Standing in front of those prints at the Tokyo National Museum, I was moved by a simple fact: the same streets I walk today once looked entirely different, and someone centuries ago cared enough to carve that vision into wood, ink it, and press it onto paper, one color at a time. This project let me follow that same impulse through a different medium.
>
> What I learned is that genuine curiosity about a subject is not separate from the design process. It is the design process. Understanding that nishiki-e required 10+ woodblocks shaped the animation sequence. Knowing that ukiyoe was mass-produced popular art, not gallery pieces, shaped the timeline's casual layout. Researching Edo-period publisher marks shaped the logo. Every design decision traced back to something I learned because I wanted to, not because a brief required it.
>
> Cultural context is not decoration. It is the design foundation. And in an era where AI can generate layouts, write code, and produce visual assets at speed, what sets work apart is craft: the cultural story behind each decision, the hand-painted layers that no algorithm could shortcut, and the conviction that these details are what make a project feel genuinely made, not just generated.

### 変更のポイント

- **Overview の博物館体験を回収**: 「Standing in front of those prints...」で冒頭のエピソードに戻る
- **「なぜ」の回収**: 「someone centuries ago cared enough to carve that vision into wood」→ 「This project let me follow that same impulse through a different medium.」
- **craft テーゼの回収**: 「what sets work apart is craft」で AI Collaboration セクションのテーゼを着地させる
- **手塗りセクションの回収**: 「the hand-painted layers that no algorithm could shortcut」
- **採用担当者へのメッセージ**: 「genuinely made, not just generated」が最後の言葉。AI時代のデザイナーの差別化を暗示
- em dash なし

---

## Figma 上の実装手順

1. **Overview**（821:55）: 既存テキストを削除し、改訂テキスト（博物館 + AI仮説 + 機能説明）に差し替え
2. **Color Extraction**（821:95）: Option A テキストに差し替え、下段ビジュアルを Printing Process Study へ移動、Proportion Bars ビジュアルを追加
3. **Hand-Coloring the Layers**（新設）: Design Process の直後に H2 セクションを追加、timelapse 動画を配置
4. **AI Collaboration**: 821:210 を Technical Highlights から切り出し、Hand-Coloring の直後に H2 セクションとして配置、テキストを差し替え。見出しを "AI Can Create, But It Can't Craft" に変更
5. **Technical Highlights**（821:188）: AI サブセクション削除後の技術詳細のみ残す
6. **Reflection**（821:228）: What I Learned のテキストを差し替え
7. **全体チェック**: em dash（—）が残っていないか確認、ページ内のストーリーの一貫性を確認

---

## ストーリーの流れ（改訂後）

```
Overview: 博物館で実物に触れた感動 → AIの進化で「今なら作れる」→ 何を作ったか
  ↓
Research: 25+サイトを調査、印刷工程を理解、色を抽出
  ↓
Design Process: アイソメトリック、タイムライン再設計、ロゴ、色彩システム
  ↓
Hand-Coloring: AIができなかった手仕事（timelapse で証明）
  ↓
AI Collaboration: "AI can create, but it can't craft" → 速度 vs 方向性のバランス
  ↓
Technical: React, Framer Motion, スクロールアニメーション
  ↓
Reflection: 博物館体験の回収 → 好奇心がデザインの基盤 → craft が差別化要因
```

冒頭の「博物館で感動した」が末尾の「Standing in front of those prints...」で回収される円環構造。
"craft" が Hand-Coloring → AI Collaboration → Reflection と3回登場し、テーゼが積み重なる。
