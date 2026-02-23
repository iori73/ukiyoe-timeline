# 浮世絵デザインシステム | Ukiyoe Design System

> **「伝統と現代ウェブの融合」** - 江戸時代の版画技法を現代的に解釈したデジタル体験を創出する

このドキュメントはプロジェクト全体のデザイン指針をまとめたものです。
CSS変数は `src/App.css` の `:root` で定義。Framer Motion 定数は `src/constants/motion.js` で定義。

---

## 📖 目次

1. [デザイン哲学](#デザイン哲学)
2. [カラーシステム](#カラーシステム)
3. [タイポグラフィ](#タイポグラフィ)
4. [スペーシング](#スペーシング)
5. [角丸・ボーダー](#角丸ボーダー)
6. [シャドウ](#シャドウ)
7. [Z-Index スケール](#z-index-スケール)
8. [不透明度](#不透明度)
9. [アニメーション](#アニメーション)
10. [Framer Motion 定数 (JS)](#framer-motion-定数-js)
11. [コンポーネント](#コンポーネント)
12. [レイアウトパターン](#レイアウトパターン)
13. [Do / Don't](#do--dont)

---

## 🎨 デザイン哲学

### 三つの原則

| 原則 | 意味 | 説明 |
|------|------|------|
| **真 (Shin)** | 一貫性 | すべての要素が同じ世界観に属すること |
| **明 (Mei)** | 明瞭性 | 日本の美学を活かした明確な視覚階層 |
| **速 (Soku)** | 効率性 | 再利用可能なコンポーネントによる開発加速 |

### トーン

> **文化的, 洗練された, 静謐, 教育的, 本格派**

### トークン設計方針

- **CSS変数 + JSモジュール** のシンプルな構成（JSON/YAML トークンファイルは使わない）
- **"smallest set" の原則**: 実際にコードベースで使われている値のみをトークン化
- **Primitive + Semantic の2層**: Component層は必要な箇所のみに限定

---

## 🎨 カラーシステム

浮世絵版画の歴史的な色彩進化に基づいたパレット。

```
墨摺絵（モノクロ）→ 紅摺絵（2-3色）→ 錦絵（多色）
```

### 基本色

| 色名 | Hex | CSS変数 | 用途 |
|------|-----|---------|------|
| **白** | `#ffffff` | `--color-white` | 純白の背景・テキスト |
| **黒** | `#000000` | `--color-black` | 純黒のボーダー・要素 |

### 主色（摺り色）

| 色名 | Hex | CSS変数 | 用途 |
|------|-----|---------|------|
| **墨色** | `#2d2d2d` | `--sumi-iro` | 主要テキスト, 輪郭線 |
| **紅色** | `#d64e4e` | `--beni-iro` | アクセント, CTA |
| **藍色** | `#1e3a5f` | `--ai-iro` | セカンダリテキスト, ラベル |
| **金色** | `#c9a84c` | `--kin-iro` | 特別なハイライト |

### 地色（紙の色）

| 色名 | Hex | CSS変数 | 用途 |
|------|-----|---------|------|
| **和紙** | `#f5f0e6` | `--washi` | メイン背景 |
| **淡雪** | `#fefefe` | `--awayuki` | セカンダリ背景 |
| **越前** | `#ebdcbd` | `--echizen` | Dawnページ背景 |
| **和紙（半透明）** | `rgba(245, 240, 230, 0.95)` | `--washi-translucent` | 半透明パネル |

### 透明度バリエーション

| CSS変数 | 値 | ベース色 |
|---------|-----|---------|
| `--beni-05` | `rgba(214, 78, 78, 0.05)` | 紅色 5% |
| `--beni-10` | `rgba(214, 78, 78, 0.1)` | 紅色 10% |
| `--beni-15` | `rgba(214, 78, 78, 0.15)` | 紅色 15% |
| `--ai-05` | `rgba(30, 58, 95, 0.05)` | 藍色 5% |
| `--ai-10` | `rgba(30, 58, 95, 0.1)` | 藍色 10% |
| `--ai-15` | `rgba(30, 58, 95, 0.15)` | 藍色 15% |

### オーバーレイ

| CSS変数 | 値 | 用途 |
|---------|-----|------|
| `--overlay-dark` | `rgba(0, 0, 0, 0.8)` | モーダル背景、暗いオーバーレイ |
| `--overlay-light` | `rgba(255, 255, 255, 0.85)` | 明るいオーバーレイ |

### 時代別カラー

歴史的な版画技法に対応した色（[COLOR_GUIDELINES.md](./COLOR_GUIDELINES.md) 参照）。

| 時代 | Hex | CSS変数 | 用途 |
|------|-----|---------|------|
| **墨摺絵** | `#1a1a1a` | `--period-sumizuri` | 墨摺絵のタイトル・ボーダー |
| **紅摺絵** | `#C33433` | `--period-benizuri` | 紅摺絵のタイトル・ボーダー |
| **錦絵** | `#1B3E5B` | `--period-nishiki` | 錦絵のタイトル・ボーダー（ベロ藍） |

### 時代別装飾色（コンテキスト固有）

| 色名 | Hex | CSS変数 | 用途 |
|------|-----|---------|------|
| **草色** | `#95a078` | `--period-decor-kusa` | 紅摺絵の装飾・タイトル |
| **丹色** | `#f8604f` | `--period-decor-akane` | 錦絵の装飾・タイトル |

JS で同じ値が必要な場合は `src/constants/colors.js` の `periodDecorKusa` / `periodDecorAkane` を参照。

### セマンティックカラー

| CSS変数 | 参照先 | 用途 |
|---------|--------|------|
| `--text-primary` | `var(--sumi-iro)` | 主要テキスト |
| `--text-secondary` | `var(--ai-iro)` | セカンダリテキスト |
| `--text-accent` | `var(--beni-iro)` | アクセントテキスト |
| `--text-highlight` | `var(--kin-iro)` | ハイライトテキスト |
| `--text-tertiary` | `#999999` | 補助テキスト（ミュート・ラベル等） |
| `--bg-primary` | `var(--washi)` | メイン背景 |
| `--bg-secondary` | `var(--awayuki)` | セカンダリ背景 |

### 後方互換エイリアス

| エイリアス | 参照先 |
|-----------|--------|
| `--ai` | `var(--ai-iro)` |
| `--shu` | `var(--beni-iro)` |
| `--kin` | `var(--kin-iro)` |
| `--sumi` | `var(--sumi-iro)` |
| `--accent` | `var(--beni-iro)` |

---

## 📝 タイポグラフィ

### フォントファミリー

| 用途 | フォント | CSS変数 |
|------|----------|---------|
| **見出し** | Shippori Mincho | `--font-serif` |
| **本文** | Hiragino Kaku Gothic ProN | `--font-sans` |
| **ロゴ** | HOT-Tenshokk-M | カスタム (`@font-face`) |

### フォントサイズスケール

PC 向けに最小16px を基準とした rem スケール。

| 名前 | rem | 実効px | CSS変数 |
|------|-----|--------|---------|
| 2xs | 0.75rem | 12px | `--text-2xs` |
| xs | 0.875rem | 14px | `--text-xs` |
| sm | 1rem | 16px | `--text-sm` |
| base | 1.125rem | 18px | `--text-base` |
| lg | 1.25rem | 20px | `--text-lg` |
| xl | 1.4375rem | 23px | `--text-xl` |
| 2xl | 1.75rem | 28px | `--text-2xl` |
| 3xl | 2.25rem | 36px | `--text-3xl` |
| 4xl | 2.875rem | 46px | `--text-4xl` |
| 5xl | 3.4375rem | 55px | `--text-5xl` |
| 6xl | 4.5rem | 72px | `--text-6xl` |
| 7xl | 5.75rem | 92px | `--text-7xl` |
| 8xl | 6.875rem | 110px | `--text-8xl` |

### 行間（Line Height）

| 名前 | 値 | CSS変数 | 用途 |
|------|-----|---------|------|
| tight | 1.3 | `--leading-tight` | 見出し |
| normal | 1.6 | `--leading-normal` | 標準本文 |
| relaxed | 1.8 | `--leading-relaxed` | 長文 |
| loose | 2.0 | `--leading-loose` | 詩的なテキスト |

### 字間（Letter Spacing）

| 名前 | 値 | CSS変数 |
|------|-----|---------|
| tight | -0.02em | `--tracking-tight` |
| normal | 0 | `--tracking-normal` |
| wide | 0.05em | `--tracking-wide` |
| wider | 0.1em | `--tracking-wider` |
| widest | 0.2em | `--tracking-widest` |

### セマンティックタイポグラフィースタイル

プリミティブトークン（サイズ・行間・字間）を組み合わせた、用途別のタイポグラフィースタイル。
ユーティリティクラスとして `src/styles/typography.css` で定義。

#### カテゴリ概要

| カテゴリ | フォント | 役割 | weight |
|----------|----------|------|--------|
| **display** | serif | Hero / ページレベル見出し | 400（em: 700） |
| **headline** | serif | セクション見出し | 600 |
| **title** | serif | カード / コンポーネント見出し | 700 |
| **body** | sans | 本文 / 説明文 | 300（em: 600） |
| **label** | sans | ラベル / メタデータ | 500 |

headline と title は同じサイズステップを共有しつつ、weight と letter-spacing で役割を区別する。

#### display（`--font-serif`）

| スタイル | CSS クラス | サイズ | weight | line-height | letter-spacing |
|----------|-----------|--------|--------|-------------|----------------|
| display/large | `.typo-display-lg` | 7xl (92px) | 400 | 1.3 | 0.05em |
| display/large-emphasized | `.typo-display-lg-em` | 7xl (92px) | 700 | 1.3 | 0.05em |
| display/medium | `.typo-display-md` | 6xl (72px) | 400 | 1.2 | 0.04em |
| display/medium-emphasized | `.typo-display-md-em` | 6xl (72px) | 700 | 1.2 | 0.04em |
| display/small | `.typo-display-sm` | 5xl (55px) | 400 | 1.2 | 0.04em |
| display/small-emphasized | `.typo-display-sm-em` | 5xl (55px) | 700 | 1.2 | 0.04em |

#### headline（`--font-serif`）

| スタイル | CSS クラス | サイズ | weight | line-height | letter-spacing |
|----------|-----------|--------|--------|-------------|----------------|
| headline/large | `.typo-headline-lg` | 4xl (46px) | 600 | 1.3 | 0.08em |
| headline/medium | `.typo-headline-md` | 3xl (36px) | 600 | 1.3 | 0.05em |
| headline/small | `.typo-headline-sm` | 2xl (28px) | 600 | 1.3 | 0.05em |

#### title（`--font-serif`）

| スタイル | CSS クラス | サイズ | weight | line-height | letter-spacing |
|----------|-----------|--------|--------|-------------|----------------|
| title/x-large | `.typo-title-xl` | 3xl (36px) | 700 | 1.3 | 0 |
| title/large | `.typo-title-lg` | 2xl (28px) | 700 | 1.3 | 0 |
| title/medium | `.typo-title-md` | xl (23px) | 700 | 1.4 | 0 |
| title/small | `.typo-title-sm` | lg (20px) | 700 | 1.4 | 0 |

#### body（`--font-sans`）

| スタイル | CSS クラス | サイズ | weight | line-height | letter-spacing |
|----------|-----------|--------|--------|-------------|----------------|
| body/large | `.typo-body-lg` | lg (20px) | 300 | 1.6 | 0 |
| body/large-emphasized | `.typo-body-lg-em` | lg (20px) | 600 | 1.6 | 0 |
| body/medium | `.typo-body-md` | base (18px) | 300 | 1.6 | 0 |
| body/medium-emphasized | `.typo-body-md-em` | base (18px) | 600 | 1.6 | 0 |
| body/small | `.typo-body-sm` | sm (16px) | 300 | 1.6 | 0 |
| body/small-emphasized | `.typo-body-sm-em` | sm (16px) | 600 | 1.6 | 0 |
| body/x-small | `.typo-body-xs` | xs (14px) | 300 | 1.6 | 0 |
| body/x-small-emphasized | `.typo-body-xs-em` | xs (14px) | 600 | 1.6 | 0 |

#### label（`--font-sans`）

| スタイル | CSS クラス | サイズ | weight | line-height | letter-spacing |
|----------|-----------|--------|--------|-------------|----------------|
| label/medium | `.typo-label-md` | sm (16px) | 500 | 1 | 0.05em |
| label/small | `.typo-label-sm` | xs (14px) | 500 | 1 | 0.05em |
| label/x-small | `.typo-label-xs` | 2xs (12px) | 500 | 1 | 0.05em |

#### 使い方

```html
<!-- display: ページのヒーロータイトル -->
<h1 class="typo-display-lg">浮世絵の世界</h1>

<!-- headline: セクション見出し -->
<h2 class="typo-headline-md">墨摺絵の技法</h2>

<!-- title: カード見出し（headline より太く、字間が詰まる） -->
<h3 class="typo-title-lg">見返り美人図</h3>

<!-- body: 本文 -->
<p class="typo-body-md">浮世絵は江戸時代に発展した...</p>

<!-- body-emphasized: 強調本文 -->
<p class="typo-body-md-em">重要な発見</p>

<!-- label: メタデータ -->
<span class="typo-label-sm">1765年頃</span>
```

---

## 📐 スペーシング

**8pxグリッド**に基づいた一貫したスペーシングシステム。
「間(Ma)」の概念を意識し、余白を重視したレイアウトを実現。

| 名前 | 値 | CSS変数 | 用途 |
|------|-----|---------|------|
| xs | 8px | `--space-xs` | コンポーネント内部 |
| sm | 16px | `--space-sm` | 関連要素のグルーピング |
| md | 24px | `--space-md` | サブセクション間 |
| lg | 32px | `--space-lg` | セクション内コンテンツ |
| xl | 48px | `--space-xl` | 主要セクション間 |
| 2xl | 64px | `--space-2xl` | トップレベルコンテナ |
| 3xl | 96px | `--space-3xl` | 大きなセクション区切り |
| 4xl | 128px | `--space-4xl` | ページレベルの余白 |
| 5xl | 192px | `--space-5xl` | 特大の余白 |
| 6xl | 256px | `--space-6xl` | 最大の余白 |

---

## 🔲 角丸・ボーダー

### 角丸（Border Radius）

| 名前 | 値 | CSS変数 | 用途 |
|------|-----|---------|------|
| xs | 2px | `--radius-xs` | 微妙な角丸、パネル |
| sm | 4px | `--radius-sm` | カード、画像フレーム |
| md | 8px | `--radius-md` | コンテナ、セクション |
| lg | 16px | `--radius-lg` | モーダル、大きなカード |
| full | 9999px | `--radius-full` | 円形（ボタンなど） |

### ボーダー

| CSS変数 | 値 | 用途 |
|---------|-----|------|
| `--border-thin` | 1px | デフォルトのボーダー |
| `--border-normal` | 2px | 強調ボーダー |
| `--border-thick` | 3px | 太いボーダー |
| `--border-primary` | `var(--sumi-iro)` | 主要ボーダー色 |
| `--border-secondary` | `var(--ai-iro)` | セカンダリボーダー色 |
| `--border-accent` | `var(--beni-iro)` | アクセントボーダー色 |
| `--border-subtle` | `rgba(45, 45, 45, 0.1)` | 控えめなボーダー |

---

## 🌫️ シャドウ

浮世絵の「控えめな美」に合わせ、シャドウは最小限に抑える。

| CSS変数 | 値 | 用途 |
|---------|-----|------|
| `--shadow-subtle` | `0 2px 8px rgba(0, 0, 0, 0.05)` | 非常に控えめなシャドウ |
| `--shadow-sm` | `0 1px 3px rgba(0, 0, 0, 0.08)` | 小さなシャドウ |
| `--shadow-md` | `0 4px 16px rgba(0, 0, 0, 0.1)` | 標準シャドウ |
| `--shadow-lg` | `0 8px 32px rgba(0, 0, 0, 0.15)` | 大きなシャドウ（モーダル等） |

---

## 📊 Z-Index スケール

グローバルなスタッキングコンテキストを管理する。ローカルな z-index（0, 1, 2 など）は変数化しない。

| CSS変数 | 値 | 用途 |
|---------|-----|------|
| `--z-base` | 0 | ベース |
| `--z-above` | 10 | 直上の要素 |
| `--z-dropdown` | 100 | ドロップダウン、ヘッダー |
| `--z-sticky` | 500 | スティッキー要素 |
| `--z-modal` | 900 | モーダル背景 |
| `--z-header` | 1100 | ヘッダー（モーダルの上） |
| `--z-overlay` | 1200 | オーバーレイ |
| `--z-tooltip` | 1300 | ツールチップ |

---

## 👁️ 不透明度

| CSS変数 | 値 | 用途 |
|---------|-----|------|
| `--opacity-subtle` | 0.05 | 背景の微かな色付け |
| `--opacity-muted` | 0.4 | ミュートされたテキスト |
| `--opacity-semi` | 0.6 | 半透明の要素 |
| `--opacity-overlay` | 0.8 | オーバーレイ |

---

## ✨ アニメーション

版画の「摺り」を想起させる、落ち着いた動きを基調とする。

### デュレーション（CSS）

| 名前 | 値 | CSS変数 | 用途 |
|------|-----|---------|------|
| fast | 0.2s | `--duration-fast` | ホバー, フォーカス |
| normal | 0.3s | `--duration-normal` | 標準のトランジション |
| slow | 0.6s | `--duration-slow` | コンテンツ表示/非表示 |
| slower | 1s | `--duration-slower` | ローディング |
| slowest | 1.5s | `--duration-slowest` | ページ遷移 |

### イージング（CSS）

| 名前 | CSS変数 | cubic-bezier | 用途 |
|------|---------|-------------|------|
| ease-in | `--ease-in` | `(0.4, 0, 1, 1)` | 画面外への退出 |
| ease-out | `--ease-out` | `(0, 0, 0.2, 1)` | 画面への登場 |
| ease-in-out | `--ease-in-out` | `(0.4, 0, 0.2, 1)` | 標準のトランジション |
| **ease-ukiyoe** | `--ease-ukiyoe` | `(0.19, 1.0, 0.22, 1.0)` | 浮世絵独自の優雅なイージング |

### ease-ukiyoe について

```css
--ease-ukiyoe: cubic-bezier(0.19, 1.0, 0.22, 1.0);
```

急速に始まり、ゆっくりと収束する。摺りの動きを想起させる独自のイージング。
判子ボタン、ページ遷移、モーダルなど、プロジェクト特有のインタラクションに使用。

---

## 🎬 Framer Motion 定数 (JS)

**ファイル:** `src/constants/motion.js`

CSS変数は Framer Motion から直接参照できないため、同じ値を JS 定数として定義している。

### duration

```js
import { duration } from '../constants/motion'

duration.fast    // 0.2  → --duration-fast
duration.normal  // 0.3  → --duration-normal
duration.slow    // 0.6  → --duration-slow
duration.slower  // 1    → --duration-slower
duration.slowest // 1.5  → --duration-slowest
```

### easing

```js
import { easing } from '../constants/motion'

easing.ukiyoe   // [0.19, 1.0, 0.22, 1.0]  → --ease-ukiyoe
easing.easeIn   // [0.4, 0, 1, 1]           → --ease-in
easing.easeOut  // [0, 0, 0.2, 1]           → --ease-out
easing.easeInOut // [0.4, 0, 0.2, 1]        → --ease-in-out
```

### transition（プリセット）

```js
import { transition } from '../constants/motion'

transition.fast     // { duration: 0.2, ease: easeInOut }
transition.normal   // { duration: 0.3, ease: easeInOut }
transition.slow     // { duration: 0.6, ease: ukiyoe }
transition.slower   // { duration: 1,   ease: ukiyoe }
transition.pageEnter // { duration: 1.5, ease: ukiyoe }
```

### spring（バネアニメーション）

```js
import { spring } from '../constants/motion'

spring.gentle // { type: 'spring', stiffness: 15, damping: 12, mass: 1.2 }
spring.snappy // { type: 'spring', stiffness: 300, damping: 30 }
```

### stagger（子要素の遅延）

```js
import { stagger } from '../constants/motion'

stagger.fast   // 0.03
stagger.normal // 0.05
stagger.slow   // 0.1
```

### 使用例

```jsx
import { duration, easing, transition, spring } from '../constants/motion'

// トランジション指定
<motion.div transition={{ duration: duration.slow, ease: easing.ukiyoe }} />

// プリセット使用
<motion.div transition={transition.slow} />

// スプリング
<motion.div transition={spring.gentle} />
```

---

## 🧩 コンポーネント

### 判子ボタン (Hanko Button)

浮世絵に押された落款（判子）をモチーフにしたボタン。

| プロパティ | 値 |
|-----------|-----|
| 形状 | 円形 |
| サイズ | 48px (default), 56px (large), 40px (small) |
| 背景色 | `var(--color-white)` → hover: `var(--ai-iro)` |
| ボーダー | 1px solid `var(--sumi-iro)` |
| トランジション | all `var(--duration-normal)` `var(--ease-ukiyoe)` |

### 言語切替ボタン

| プロパティ | 値 |
|-----------|-----|
| 背景 | transparent |
| フォント | `var(--font-serif)` |
| サイズ | `var(--text-lg)` |
| 色 | `var(--ai-iro)` |
| アクティブ時 | font-weight: 600 + border |

---

## 📱 レイアウトパターン

### 3カラムギャラリー (Pattern C)

3つの画像を横に並べたギャラリーレイアウト。

- ギャップ: 2%
- ホバー効果: scale(1.02) + shadow

### ブレークポイント（参考値）

CSS変数はメディアクエリの値には使えないため、コメントとして記録。

| 名前 | 値 | 用途 |
|------|-----|------|
| sm | 600px | モバイル（小） |
| md | 900px | モバイル（大）/ タブレット |
| lg | 1200px | タブレット / デスクトップ |

---

## ✅ Do / Don't

### Do

```css
/* 色はトークンを使う */
color: var(--ai-iro);
background: var(--washi);

/* スペーシングはトークンを使う */
padding: var(--space-md);
gap: var(--space-sm);

/* トランジションはトークンを使う */
transition: opacity var(--duration-normal) var(--ease-ukiyoe);

/* z-index（グローバル）はトークンを使う */
z-index: var(--z-modal);
```

### Don't

```css
/* ❌ ハードコードの色 */
color: #1e3a5f;
background: #f5f0e6;

/* ❌ ハードコードのスペーシング（トークンにマッチする値の場合） */
padding: 24px;  /* → var(--space-md) */
gap: 16px;      /* → var(--space-sm) */

/* ❌ ハードコードのトランジション値 */
transition: opacity 0.3s ease;

/* ❌ ハードコードのグローバル z-index */
z-index: 1000;  /* → var(--z-modal) */
```

### 例外（トークン化しなくてよい）

- `clamp()` 内のレスポンシブ値（柔軟性を優先）
- ローカルな z-index（0, 1, 2 などの相対値）
- コンポーネント固有の `rgba()` 値（グラデーション内など）
- `prefers-contrast: high` 内のフォールバック値

---

## 📁 ファイル参照

| ファイル | 内容 |
|----------|------|
| `src/App.css` | CSS変数定義 (`:root` ブロック) |
| `src/constants/motion.js` | Framer Motion アニメーション定数 |
| `docs/COLOR_GUIDELINES.md` | 歴史的カラーガイドライン |

---

## 📚 関連ドキュメント

- [COLOR_GUIDELINES.md](./COLOR_GUIDELINES.md) - 浮世絵の色彩と歴史的背景
- [CLAUDE.md](../CLAUDE.md) - AI 開発ガイドライン

---

*最終更新: 2026-02-15*
