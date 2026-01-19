---
name: Timeline Detail Redesign
overview: 現在の/timelineページを、Figmaデザインに基づいて垂直スクロール・複数作品parallax・固定テキスト・GalleryIndicators ナビゲーションに再設計します。
todos:
  - id: research-images
    content: 各時代の追加作品画像URL（3-5枚/時代）をWeb検索で調査
    status: completed
  - id: update-data
    content: ukiyoe.jsに複数画像データ構造を追加
    status: completed
  - id: parallax-component
    content: ParallaxArtworks コンポーネント作成（異なるspeed値でparallax効果）
    status: completed
  - id: detail-section
    content: TimelineDetailSection コンポーネント作成（固定テキスト+progressive blur）
    status: completed
  - id: detail-cards
    content: "DetailCards コンポーネント作成（4カード: 時代背景/主題/市場/技法）"
    status: completed
  - id: vertical-scroll
    content: HorizontalScrollを垂直スクロールに変更またはVerticalScrollコンポーネント作成
    status: completed
  - id: gallery-indicators
    content: GalleryIndicatorsManualを/timeline用に適用（9時代対応）
    status: completed
  - id: remove-old-nav
    content: dot-navigation, section-counter, navigation-arrowsを削除
    status: completed
  - id: integrate-all
    content: 全コンポーネントを統合してApp.jsxで/timelineに適用
    status: completed
---

# Timeline Detail Page 再設計

## 概要

`/timeline` ページを水平スクロールから垂直スクロールに変更し、Figmaデザインに合わせて複数の作品画像にparallax効果を適用、テキスト部分を固定配置にする。

## 主要な変更点

### 1. データ拡張 - 各時代に複数の作品画像を追加

現在CSVには各時代1つの`image_url`のみ。各時代に3-5つの浮世絵作品画像URLを追加する必要があります。

**追加する画像情報（Webで調査）:**

- 墨摺絵期（1670-1679）: 菱川師宣の追加作品
- 役者絵発展期（1700-1719）: 鳥居清信・清倍の作品
- 漆絵・紅絵期（1720-1739）: 奥村政信の作品
- 紅摺絵隆盛期（1740-1749）: 石川豊信の作品
- 紅摺絵技術向上期（1750-1764）: 豊信・春信初期作品
- 錦絵成立期（1765-1770）: 鈴木春信の追加作品
- 錦絵拡大期（1770-1789）: 清長・春章の作品
- 大首絵期（1790-1799）: 歌麿・写楽の作品
- 風景画期（1800-1850）: 北斎・広重の追加作品

### 2. レイアウト変更

**現在:** 水平スクロール（HorizontalScroll + FullscreenSection）

**新設計:** 垂直スクロール、各時代がフルスクリーンセクション

```
┌─────────────────────────────────────────┐
│  [Indicators]                           │
│      ●        ┌──────────┬──────────┐   │
│      ○        │          │ 第01     │   │
│      ○        │ 作品画像群│ 1670-79 │   │
│      ○        │ (parallax)│          │   │
│               │          │ [固定    │   │
│               │          │  テキスト]│   │
│               ├──────────┴──────────┤   │
│               │ 4つのカード          │   │
│               │ (時代背景/主題/市場/技法) │
│               └─────────────────────┘   │
└─────────────────────────────────────────┘
```

### 3. 実装ファイル

**新規作成:**

- `src/components/timeline/TimelineDetailSection.jsx` - 各時代のセクションコンポーネント
- `src/components/timeline/TimelineDetailSection.css` - スタイル
- `src/components/timeline/ParallaxArtworks.jsx` - 作品画像のparallax表示
- `src/components/timeline/ParallaxArtworks.css` - スタイル
- `src/components/timeline/DetailCards.jsx` - 下部の4カード
- `src/components/timeline/DetailCards.css` - スタイル

**変更:**

- [`src/components/FullscreenSection.jsx`](src/components/FullscreenSection.jsx) - 新レイアウトに変更
- [`src/components/HorizontalScroll.jsx`](src/components/HorizontalScroll.jsx) - 垂直スクロールに変更（または新コンポーネント作成）
- [`src/App.jsx`](src/App.jsx) - ナビゲーション更新
- [`src/App.css`](src/App.css) - スタイル更新
- [`src/data/ukiyoe.js`](src/data/ukiyoe.js) - 複数画像データを追加

### 4. 技術的実装詳細

**A. Progressive Background Blur:**

```css
.artwork-section::before {
  content: '';
  position: absolute;
  inset: 0;
  backdrop-filter: blur(var(--blur-amount));
  transition: backdrop-filter 0.3s ease;
}
```

スクロール位置に応じて`--blur-amount`を動的に調整。

**B. Parallax Effect:**

各作品画像に異なる`data-parallax-speed`を設定（0.2〜0.8の範囲）して有機的な動きを実現:

```jsx
const parallaxSpeeds = [0.3, 0.5, 0.2, 0.6, 0.4]
// スクロール時にtranslateYを適用
transform: `translateY(${scrollY * speed}px)`
```

**C. GalleryIndicatorsManual の適用:**

[`src/components/dawn/GalleryIndicatorsManual.jsx`](src/components/dawn/GalleryIndicatorsManual.jsx) を参考に、時代数（9つ）に対応したインジケーターを作成。クリックで該当時代へスクロール。

**D. 固定テキストセクション（position: fixed）:**

以下のテキスト要素を`position: fixed`にして、作品画像のparallaxを際立たせる：

```css
/* テキストパネル全体を固定 */
.text-panel-fixed {
  position: fixed;
  right: 0;
  top: 0;
  width: 45%;
  height: 100vh;
  z-index: 10;
}

/* 固定される要素: */
/* - .section-header-row (第01, 1670-1679) */
/* - .section-meta-container (重要な出来事, 代表作品) */
/* - .section-details-figma (時代背景, 主題と特徴, 市場と流通, 技術と技法) */
```

作品画像側（左側）のみがスクロールに追従してparallax動作。テキストは固定されて動かない。

### 5. 削除するもの

- `dot-navigation` コンポーネント/スタイル
- `section-counter` コンポーネント/スタイル
- 水平スクロールの `navigation-arrows`（次へ/前へボタン）