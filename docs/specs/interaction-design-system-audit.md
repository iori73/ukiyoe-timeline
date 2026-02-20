# インタラクション・アニメーション デザインシステム適用状況

> 目的: 全ページで「摺りを想起させる落ちついた動き」が一貫しているか確認し、バウンスや規定外イージングをデザインシステムに合わせる。

## デザインシステムの規定（要約）

- **方針**: 版画の「摺り」を想起させる、**落ち着いた動き**を基調とする。
- **デュレーション**: `--duration-fast`(0.2s) 〜 `--duration-slowest`(1.5s)。ハードコード禁止。
- **イージング**: `--ease-ukiyoe` を推奨（優雅な収束）。`--ease-in` / `--ease-out` / `--ease-in-out` もトークンで使用。
- **Don't**: `transition: opacity 0.3s ease` のようなハードコード。
- **Spring**: `spring.gentle` / `spring.snappy` のみ使用。独自の stiffness/damping は一貫性を崩す。

参照: [DESIGN_SYSTEM.md § アニメーション / Framer Motion 定数](../DESIGN_SYSTEM.md)

---

## 監査結果サマリ

| 状態 | 内容 |
|------|------|
| ❌ 要修正 | バウンス系・オーバーシュート系のイージングが一部で使用されている |
| ❌ 要修正 | CSS で `ease` のみ・`0.3s ease` 等のハードコードが複数 |
| ❌ 要修正 | JS で duration/spring をハードコードしている箇所がある |
| ✅ 適用済 | 多くのコンポーネントで `var(--duration-*)` / `var(--ease-ukiyoe)` または motion 定数を使用 |

---

## 1. バウンス・オーバーシュート（ブランドから外れやすい）

| ファイル | 内容 | 問題 |
|----------|------|------|
| **PeriodSlide.jsx** | `cubic-bezier(0.16, 1, 0.3, 1)` | 第2引数が 1 で**オーバーシュート**＝バウンス。規定は「落ち着いた動き」のため不適合。 |
| **LayeredImages.jsx** | `cubic-bezier(0.25, 0.46, 0.45, 0.94)`、1.2s | 独自イージング・デュレーション。トークン未使用。 |
| **DetailModal.jsx** | `spring damping: 25, stiffness: 300` | 規定は `spring.snappy`(damping: 30)。damping が低いとわずかにバウンスしうる。 |
| **TimelineDetailSection.jsx** | `useSpring(0, { stiffness: 100, damping: 30, mass: 0.5 })` | motion の `spring.gentle` / `spring.snappy` と異なる独自値。 |
| **HorizontalScroll.jsx** | `stiffness: 100, damping: 30` | 同上。定数参照に統一すべき。 |

**推奨**: オーバーシュートのない `--ease-ukiyoe` / `--ease-out` へ統一。Spring は `motion.js` の `spring.gentle` または `spring.snappy` のみ使用。

---

## 2. CSS のハードコード（イージング・デュレーション）

| ファイル | 該当行例 | 推奨 |
|----------|----------|------|
| LayerAnimationPage.css | `ease` | `var(--ease-ukiyoe)` |
| App.css | `0.3s ease`, `0.2s ease`, `gap 0.2s`, `0.15s ease` 等 | `var(--duration-*)` + `var(--ease-ukiyoe)` または `var(--ease-in-out)` |
| DawnPage.css | `0.2s ease` | `var(--duration-fast)` + `var(--ease-ukiyoe)` |
| LayeredImages.css | `0.3s ease-out` | `var(--duration-normal)` + `var(--ease-out)` |
| GalleryIndicators.css | `ease` のみ | `var(--ease-in-out)` または `var(--ease-ukiyoe)` |
| GalleryIndicatorsManual.css | `0.5s cubic-bezier(...)`, `0.3s ease` | トークンへ |
| ArtworkDetailModal.css | `ease` のみ | `var(--ease-ukiyoe)` |
| ArtworkGalleryGrid.css | `ease` | 同上 |
| TimelineDetailSection.css | `ease` | 同上 |
| TimelineGalleryIndicators.css | `ease` 混在 | 同上 |
| ProgressTimeline.jsx (inline) | `0.3s ease-out` | duration/easing 定数または CSS クラスでトークン使用 |
| concepts/CardPlayground.css, LogoPreview.css | 複数 `0.2s` / `0.3s` ease | トークンへ（必要に応じて） |

---

## 3. JS / Framer Motion のハードコード

| ファイル | 内容 | 推奨 |
|----------|------|------|
| App.jsx | ページ表示に `easing.easeInOut` | 規定では `pageEnter` は **easing.ukiyoe** |
| LayerAnimationPage.jsx | `duration: 0.8`, `ease: 'easeOut'` | `duration.slower`(1), `easing.easeOut` |
| ParallaxArtworks.jsx | `duration: 0.9` | `duration.slow`(0.6) または `duration.slower`(1) + `easing.ukiyoe` |
| AnimatedLogo.jsx | `easing.easeInOut` | ロゴの「登場」は `easing.ukiyoe` で統一可能 |
| PeriodRow.jsx | `0.8s ease-out` | `duration.slower` + `easing.easeOut` |
| FullscreenSection.jsx | `ease: [0.19, 1.0, 0.22, 1.0]` | 既に ukiyoe と同等。`easing.ukiyoe` を import して参照すると一貫 |

---

## 4. 適用済み・問題なしの例

- **ArtworkDetailModal.jsx**: `duration`, `easing.ukiyoe` 使用。
- **TimelinePage.css**: ボタンに `var(--ease-ukiyoe)` 使用。
- **ParallaxArtworks.css**: `var(--ease-ukiyoe)` 使用。
- **LayerStackAnimation.jsx**: `var(--ease-ukiyoe)` 使用。
- **App.css** の判子ボタン・ナビ: `var(--duration-normal)` + `var(--ease-ukiyoe)`。

---

## 5. 修正の優先度

1. **高**: PeriodSlide.jsx のバウンス系 cubic-bezier → `--ease-ukiyoe` または `--ease-out` に変更。
2. **高**: LayeredImages.jsx の独自イージング・duration → motion トークンに統一。
3. **中**: CSS の `ease` 単体・`0.3s ease` をトークンに置き換え（全ページの一貫性）。
4. **中**: JS の spring をすべて `motion.js` の `spring.gentle` / `spring.snappy` に統一。
5. **低**: App.jsx のページ表示を `easing.ukiyoe` に変更。concepts / LogoPreview は必要に応じて。

---

## 6. 実施した修正（2026-02-15）

- **PeriodSlide.jsx**: バウンス系 `cubic-bezier(0.16, 1, 0.3, 1)` を廃止し、`PeriodSlide.css` で `--ease-ukiyoe` / `--ease-out` に統一。
- **LayeredImages.jsx**: 独自イージング・1.2s を `duration.slower` + `easingCss.ukiyoe` + `stagger.slow` に変更。
- **LayeredImages.css**: `0.3s ease-out` → `var(--duration-normal) var(--ease-out)`。
- **TimelineDetailSection.jsx**: 独自 spring を `spring.gentle` に統一。
- **HorizontalScroll.jsx**: 独自 spring を `spring.snappy` に統一。
- **DetailModal.jsx**: 独自 spring を `spring.snappy` に統一。
- **App.jsx**: ローディング／メイン表示の ease を `easing.ukiyoe` に統一。
- **LayerAnimationPage.jsx / .css**: duration・ease を motion トークンと `--ease-ukiyoe` に統一。
- **App.css / DawnPage.css / GalleryIndicators*.css / ArtworkDetailModal.css / ArtworkGalleryGrid.css / TimelineDetailSection.css / TimelineGalleryIndicators.css**: `ease` 単体や `0.3s ease` を `var(--duration-*)` + `var(--ease-ukiyoe)` 等に置換。
- **ProgressTimeline.jsx**: インライン transition を `var(--duration-normal) var(--ease-out)` に変更。
- **PeriodRow.jsx**: `0.8s ease-out` → `duration.slower` + `var(--ease-out)`。
- **ParallaxArtworks.jsx**: `duration: 0.9` → `duration.slower`。
- **motion.js**: inline style 用に `easingCss`（ukiyoe / easeOut / easeInOut）を追加。

未修正（低優先）: concepts/CardPlayground.css, LogoPreview.css, AnimatedLogo の easeInOut → ukiyoe の統一は必要に応じて実施。

---

*最終更新: 2026-02-15*
