---
name: Dawn Page Implementation
overview: React Router を導入し、新規 `/dawn` ページに「錦絵の黎明」デザインを実装。3つの時代（墨摺絵・紅摺絵・錦絵）のプログレスバーが Apple iPhone Air ページのように自動で順番に進行するアニメーションと、摺り順序を表すレイヤー画像のプレースホルダー構造を作成する。
todos:
  - id: install-router
    content: react-router-dom パッケージをインストール
    status: completed
  - id: setup-routing
    content: main.jsx と App.jsx に Router 設定を追加
    status: completed
    dependencies:
      - install-router
  - id: create-dawn-page
    content: DawnPage.jsx とスタイルを作成（ヘッダー・タイトル・ボタン含む）
    status: completed
    dependencies:
      - setup-routing
  - id: create-progress-timeline
    content: ProgressTimeline コンポーネント（自動進行アニメーション）
    status: completed
    dependencies:
      - setup-routing
  - id: create-period-row
    content: PeriodRow コンポーネント（3時代それぞれの行）
    status: completed
    dependencies:
      - create-progress-timeline
  - id: create-layered-images
    content: LayeredImages コンポーネント（摺り順序プレースホルダー）
    status: completed
    dependencies:
      - create-period-row
  - id: integrate-components
    content: 全コンポーネントを DawnPage に統合
    status: completed
    dependencies:
      - create-dawn-page
      - create-layered-images
---

# 錦絵の黎明ページ実装計画

## 概要

現在のトップページを維持しつつ、React Router を導入して `/dawn` パスに Figma デザインの「錦絵の黎明」ページを新規作成する。

## 主要な変更点

### 1. React Router 導入

- `react-router-dom` パッケージをインストール
- [src/main.jsx](src/main.jsx) に `BrowserRouter` を設定
- [src/App.jsx](src/App.jsx) を Routes で構成

### 2. 新規コンポーネント作成

**[src/pages/DawnPage.jsx](src/pages/DawnPage.jsx)** - メインページコンポーネント

- ヘッダー（ロゴ + 言語切替）
- タイトル「錦絵の黎明」+ 説明文
- 3つの時代セクション（墨摺絵・紅摺絵・錦絵）
- 「歴史を見る」ボタン

**[src/components/dawn/ProgressTimeline.jsx](src/components/dawn/ProgressTimeline.jsx)** - プログレスバー付きタイムライン

- 各時代の左側に縦長プログレスバー
- Apple dotnav のように自動で進行するアニメーション
- 墨摺絵完了 → 紅摺絵開始 → 錦絵開始 の順次実行

**[src/components/dawn/PeriodRow.jsx](src/components/dawn/PeriodRow.jsx)** - 各時代の行コンポーネント

- プログレスバー + コンテンツ（画像群 + テキスト）
- 紅摺絵・錦絵は複数の摺りレイヤー画像を横並び表示

**[src/components/dawn/LayeredImages.jsx](src/components/dawn/LayeredImages.jsx)** - 摺り順序画像表示

- 各色レイヤーを別画像として表示
- プレースホルダー対応（後から実画像に差し替え可能）

### 3. プログレスバーのアニメーション仕様

```
墨摺絵 (5秒) → 紅摺絵 (5秒) → 錦絵 (5秒)
```

- CSS `@keyframes` でバーが上から下へ伸びるアニメーション
- `animation-delay` で順次開始を制御
- 背景は薄い色、アニメーション部分は濃い色（Figma デザイン準拠）

### 4. 画像構成

| 時代 | 画像数 | 枠の色 |
|------|--------|--------|
| 墨摺絵 | 1枚 | 藍色 (#334e6c) |
| 紅摺絵 | 4枚（摺り順） | 赤枠で強調 + opacity でフェード |
| 錦絵 | 5枚（摺り順） | 赤枠で強調 + opacity でフェード |

画像はプレースホルダー構造で実装し、後から `public/images/dawn/` に配置予定。

### 5. スタイリング

[src/pages/DawnPage.css](src/pages/DawnPage.css) に専用スタイルを追加

- 既存の CSS 変数（`--washi`, `--ai-iro`, `--beni-iro` 等）を活用
- Figma のカラー・フォント指定を反映
- レスポンシブ対応

## ファイル構成

```
src/
├── main.jsx              (Router 設定追加)
├── App.jsx               (Routes 構成に変更)
├── pages/
│   └── DawnPage.jsx      (新規)
│   └── DawnPage.css      (新規)
└── components/
    └── dawn/
        ├── ProgressTimeline.jsx (新規)
        ├── PeriodRow.jsx        (新規)
        └── LayeredImages.jsx    (新規)
```

## 画像プレースホルダーの配置先

```
public/images/dawn/
├── sumizuri-e/
│   └── main.png
├── benizuri-e/
│   ├── layer-1.png
│   ├── layer-2.png
│   ├── layer-3.png
│   └── layer-4.png
└── nishiki-e/
    ├── layer-1.png
    ├── layer-2.png
    ├── layer-3.png
    ├── layer-4.png
    └── layer-5.png
```