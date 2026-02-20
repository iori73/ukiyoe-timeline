# デザインシステム準拠状況オーディト（2026-02-19）

> 目的: 現時点のコードベースが `docs/DESIGN_SYSTEM.md` および `src/App.css` のトークンにどこまで準拠しているかを確認する。

---

## サマリ

**結論: すべての要素がデザインシステムに完全準拠しているわけではありません。**  
前回のオーディト指摘と同様、色・スペーシング・タイポグラフィ・アニメーションに未準拠または未定義が残っています。

| 観点 | 状態 | 概要 |
|------|------|------|
| **色（トークン化）** | ⚠️ 一部未準拠 | ハードコードの hex / 未定義セマンティック（`--text-tertiary`）の使用あり |
| **スペーシング** | ⚠️ 一部未準拠 | 8/16/24/32/48px 等の直書きが複数ファイルに残存、`--space-*` 未使用箇所あり |
| **タイポグラフィ** | ⚠️ 一部未準拠 | `font-size` の直書き（18/20/21/22/24/28/30/32px）、`--text-tertiary` は参照のみで定義なし |
| **アニメーション** | ⚠️ 一部未準拠 | 多くの箇所はトークン化済み。CardPlayground.css / LogoPreview.css / 一部 JSX でハードコード残存 |
| **フォント** | ✅ おおむね準拠 | `var(--font-serif)` / `var(--font-sans)` が広く使用されている |
| **Z-Index** | ✅ 問題なし | グローバル z-index の不適切な直書きは見当たらない |

---

## 1. 色（カラー）

### 1.1 未定義セマンティック

- **`--text-tertiary`**  
  - **使用箇所**: `App.css` で `color: var(--text-tertiary, #999);`（スライダー年代ラベル等、2箇所）  
  - **問題**: `DESIGN_SYSTEM.md` および `App.css` の `:root` に **定義が存在しない**。  
  - **推奨**:  
    - デザインシステムに「補助テキスト（ミュート）」として追加し、`:root` に例: `--text-tertiary: #999999;` を定義する  
    - または `--text-secondary` + `--opacity-muted` で表現し、`--text-tertiary` の参照をやめる  

### 1.2 ハードコードされている色（トークン化すべき例）

| 値 | 主な使用箇所 | 推奨 |
|----|----------------|------|
| **#fff / #ffffff** | `ArtworkDetailModal.css`, `ParallaxArtworks.css`, `LayerAnimationPage.css`, `CardPlayground.css` | `var(--color-white)` に統一 |
| **#999** | `PeriodSlide.css`, `PeriodRow.css`, `App.css`（`--text-tertiary` のフォールバック）, `AnimatedLogo.jsx` | 上記 `--text-tertiary` 定義後に `var(--text-tertiary)` に統一 |
| **#95a078**（草色） | `PeriodSlide.css`, `PeriodRow.css`, `IntroSection.jsx`, `ConceptA/B/C.jsx` | 時代・コンテキスト固有色として DESIGN_SYSTEM に記載するか、必要ならトークン化 |
| **#f8604f**（丹色） | 同上 | 同上 |
| **#334E6C** | `GalleryIndicators.jsx`（SVG fill/stroke）, `DawnPage.css`（`var(--ai-iro, #334e6c)` のフォールバック） | 藍系なら `var(--ai-iro)` または `--period-nishiki` に寄せる。現状 `--ai-iro` は `#1e3a5f` のため、意図が「錦絵寄り」なら `--period-nishiki` を検討 |
| **#F5F1E6** | `AnimatedLogo.jsx`, `LogoPreview.jsx`, `LogoPreview.css` | 和紙に近いが `--washi`（#f5f0e6）と異なる。意図的なら DESIGN_SYSTEM に「ロゴ用和紙」として記載、そうでなければ `--washi` に統一 |

### 1.3 例外として許容されうるもの

- `App.css` の `:root` 内の hex → トークン定義そのものなので問題なし  
- `var(--sumi-iro, #2d2d2d)` のようなフォールバック → 許容  
- グラデーション・シャドウ内の `rgba()` → デザインシステムの「コンポーネント固有の rgba」例外に該当  
- データファイル（`periodColors.js`, `techniques.js` 等）の色データ → 仕様次第。可能な範囲で時代色トークンと整合させると一貫する  

---

## 2. スペーシング（8px グリッド）

デザインシステムでは 24px → `var(--space-md)`、16px → `var(--space-sm)` 等のトークン利用が推奨されている。

### 2.1 現状

- 多くの CSS で **8 / 16 / 24 / 32 / 40 / 48 / 64 / 96px が直書き**されている（ファイルごとの該当箇所数は検索で確認済み）。  
- 例: `TimelineDetailSection.css`, `ArtworkDetailModal.css`, `TimelinePage.css`, `DawnPage.css`, `ArtworkGalleryGrid.css`, `GalleryIndicators.css`, `PeriodSlide.css`, `DetailCards.css`, `LayerAnimationPage.css`, `LayerStackAnimation.css`, `App.css` など。  
- `ArtworkGalleryGrid.css` では `clamp(48px, 8vh, 96px)` や `8px`, `16px`, `32px` の直書きあり。デザインシステムの「clamp 内のレスポンシブ値は例外」に該当する部分と、`--space-*` に置き換え可能な部分が混在。

### 2.2 推奨

- レイアウトの意図が同じ場合、直書きの 8/16/24/32/48px を `var(--space-xs)` 〜 `var(--space-xl)` に段階的に置き換える。  
- `clamp(48px, 8vh, 96px)` のように「柔軟性を優先する値」は例外として残してよい。

---

## 3. タイポグラフィ

### 3.1 font-size の直書き

| ファイル | 値（例） | 推奨トークン |
|----------|----------|----------------|
| `TimelineDetailSection.css` | 24px, 20px, 18px | `--text-2xl`(28px) に近い 24px → `--text-2xl` または新規, `--text-xl`(23px), `--text-lg`(20px), `--text-base`(18px) |
| `LayerAnimationPage.css` | 21px, 30px, 22px, 28px, 20px, 18px | `--text-*` で近いものに寄せる（21→xl, 30→3xl 等） |
| `ArtworkGalleryGrid.css` | 32px | `--text-3xl`(36px) が近い。意図が 32px ならデザインシステムに 32px スケールの要否を検討 |

### 3.2 --text-tertiary

- 上述のとおり、**参照のみで定義なし**。セマンティックとして追加するか、別のトークンで表現する必要あり。

---

## 4. アニメーション

### 4.1 適用済み・問題なし

- 多くのコンポーネントで `var(--duration-*)` / `var(--ease-ukiyoe)` または `src/constants/motion.js` の `duration` / `easing` / `spring` を使用。  
- 例: `ArtworkDetailModal.jsx`, `TimelineDetailSection.jsx`, `TimelinePage.jsx`, `ParallaxArtworks.jsx`, `GalleryIndicators.css`, `PeriodSlide.css`, `App.css` の判子ボタン・ナビなど。

### 4.2 未修正・要修正

**CSS**

| ファイル | 内容 | 推奨 |
|----------|------|------|
| `CardPlayground.css` | `0.15s ease`, `0.3s ease`, `0.2s ease` 等 | `var(--duration-fast)` / `var(--duration-normal)` + `var(--ease-ukiyoe)` 等 |
| `LogoPreview.css` | `0.4s ease`, `0.3s ease` | 同上 |

**JS / Framer Motion**

| ファイル | 内容 | 推奨 |
|----------|------|------|
| `FullscreenSection.jsx` | `duration: 1`, `0.5`, `0.8`, `1.2` と `ease: [0.19, 1.0, 0.22, 1.0]` を直書き | `duration` / `easing.ukiyoe` を import して使用 |
| `DetailCards.jsx` | `duration: 0.6`, `ease: [0.19, 1.0, 0.22, 1.0]` | `duration.slow`, `easing.ukiyoe` に統一 |
| `IntroSection.jsx` | `duration: 1`, `0.8`, `0.4`, `0.15` 等、一部 `ease: 'easeOut'` | motion 定数に寄せる |
| `ConceptA/B/C.jsx` | 数値 duration、`ease: 'easeOut'`、ConceptC の `stiffness: 300, damping: 30` | `duration.*`, `easing.*`, `spring.snappy` を検討 |
| `ScrollIndicators.jsx` | 多数の `duration` / `ease: [0.19, 1.0, 0.22, 1.0]` 直書き | `duration` / `easing.ukiyoe` を import して使用 |
| `Timeline.jsx` | `ease: [0.25, 0.46, 0.45, 0.94]` | デザインシステムのイージング（`easing.ukiyoe` 等）に統一 |
| `AnimatedLogo.jsx` | `ease: 'easeInOut'` 文字列 | `easing.ukiyoe` で統一可能 |
| `LogoPreview.jsx` | `duration: 3`（ループアニメ） | 意図的な長さならコメントで明示。それ以外は `duration.slowest` 等を検討 |
| `UkiyoeLoading.jsx` | 独自 duration / ease | 必要に応じて motion 定数へ寄せる |

`docs/specs/interaction-design-system-audit.md` の「実施した修正」以降も、上記ファイルの多くは未修正または一部のみ修正の状態。

---

## 5. 推奨アクション（優先度順）

1. **DESIGN_SYSTEM.md と App.css**  
   - `--text-tertiary` の有無を決め、定義する場合は `:root` に追加し、DESIGN_SYSTEM に記載する。

2. **色**  
   - `#fff` / `#ffffff` を `var(--color-white)` に置き換え。  
   - `#999` は `--text-tertiary` 定義後に `var(--text-tertiary)` に統一。  
   - `#334E6C` / `#F5F1E6` / 草色・丹色は意図を決め、トークンまたはドキュメントで整理。

3. **スペーシング**  
   - 8の倍数の直書きを、意図が同じ箇所から `var(--space-*)` に段階的に置き換え。

4. **タイポグラフィ**  
   - 主要 UI の `font-size` 直書きを `--text-*` に置き換え。

5. **アニメーション**  
   - `CardPlayground.css` / `LogoPreview.css` の transition をトークン化。  
   - 上記 JSX の duration / ease / spring を `motion.js` および CSS トークンに統一。

---

## 6. 参照

- [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md)  
- [interaction-design-system-audit.md](./interaction-design-system-audit.md)  
- [COLOR_GUIDELINES.md](../COLOR_GUIDELINES.md)  

---

*作成: 2026-02-19（最新コードベースに基づく再オーディト）*

---

## 7. 実施した揃え（2026-02-19）

以下を実施し、デザインシステムへ揃えた。

1. **--text-tertiary** を `App.css` の `:root` と `DESIGN_SYSTEM.md` に定義（`#999999`）。
2. **色**: `#fff`/`#ffffff` → `var(--color-white)`、`#999` → `var(--text-tertiary)`、`#334E6C` → `var(--period-nishiki)`、`#F5F1E6` → `var(--washi)`。時代装飾色 `#95a078`/`#f8604f` を `--period-decor-kusa`/`--period-decor-akane` として定義し、CSS/JS でトークンまたは `constants/colors.js` を参照するよう変更。
3. **スペーシング**: 主要 CSS で 8/16/24/32/48/64/96px の直書きを `var(--space-xs)` 〜 `var(--space-3xl)` に置換（DawnPage, PeriodSlide, PeriodRow, ArtworkDetailModal, ArtworkGalleryGrid, TimelineDetailSection, LayerAnimationPage 等）。
4. **タイポグラフィ**: `font-size` の直書きを `--text-base`/`--text-lg`/`--text-xl`/`--text-2xl`/`--text-3xl` に置換（TimelineDetailSection, ArtworkGalleryGrid, LayerAnimationPage）。
5. **アニメーション（CSS）**: CardPlayground.css / LogoPreview.css の `0.15s`/`0.3s`/`0.2s` ease を `var(--duration-*)` + `var(--ease-ukiyoe)` に置換。
6. **アニメーション（JS）**: FullscreenSection, DetailCards, IntroSection, ConceptA/B/C, ScrollIndicators, Timeline, AnimatedLogo で `duration`/`easing`/`spring` を `src/constants/motion.js` の定数に統一。
