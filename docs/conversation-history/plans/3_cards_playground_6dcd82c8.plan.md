---
name: 3 Cards Playground
overview: "3つのカードデザインコンセプト（A: スライダー型、B: タイムライン型、C: レイヤー重ね型）を一覧・比較できるプレイグラウンドページを作成する。"
todos:
  - id: create-concepts-dir
    content: src/components/concepts/ ディレクトリと3つのコンセプトコンポーネントを作成
    status: completed
  - id: concept-a
    content: "Concept A: スライダー型コンポーネント実装"
    status: completed
    dependencies:
      - create-concepts-dir
  - id: concept-b
    content: "Concept B: タイムライン融合型コンポーネント実装"
    status: completed
    dependencies:
      - create-concepts-dir
  - id: concept-c
    content: "Concept C: 透過レイヤー型コンポーネント実装"
    status: completed
    dependencies:
      - create-concepts-dir
  - id: playground-page
    content: CardPlayground.jsx メインページ作成（3コンセプトを一覧表示）
    status: completed
    dependencies:
      - concept-a
      - concept-b
      - concept-c
  - id: routing
    content: App.jsx に /playground ルートを追加
    status: completed
    dependencies:
      - playground-page
---

# 3カードデザイン Playground 作成

## 概要

3つのデザインコンセプトを実際に見比べられる専用ページを作成し、最適なデザインを選定できるようにする。

## 作成するファイル

### 1. プレイグラウンドコンポーネント
`[src/components/CardPlayground.jsx](src/components/CardPlayground.jsx)` - 3つのコンセプトを一覧表示するメインコンポーネント

### 2. 各コンセプトコンポーネント

| ファイル | コンセプト | 特徴 |
|----------|------------|------|
| `[src/components/concepts/ConceptA.jsx](src/components/concepts/ConceptA.jsx)` | スライダー型 | スライダーで墨摺絵→紅摺絵→錦絵へ遷移。CSSブレンドモードで「版を重ねる」体験 |
| `[src/components/concepts/ConceptB.jsx](src/components/concepts/ConceptB.jsx)` | タイムライン融合型 | 時間軸（1660-1765+）に連動して画像が変化。各技法の繁栄期間を幅で可視化 |
| `[src/components/concepts/ConceptC.jsx](src/components/concepts/ConceptC.jsx)` | 透過レイヤー型 | 3枚を物理的に重ねて表示。ホバーで各層が分離・フォーカス |

### 3. スタイル
`[src/components/concepts/CardPlayground.css](src/components/concepts/CardPlayground.css)` - プレイグラウンド専用スタイル

## 実装詳細

### Concept A: スライダー型（摺りの重ね体験）
```
[大きな画像エリア]
   墨摺絵 ←→ 紅摺絵 ←→ 錦絵
   
◯────●────────────────○
1660     1740s        1765+
```
- range input でスライダー操作
- opacity と mix-blend-mode で3枚の画像をブレンド
- スライダー位置に応じて各レイヤーの透明度を調整

### Concept B: タイムライン融合型
```
1660━━━━━━━━1740s━━━1765+━━→
  ┃墨摺絵期┃     ┃
           ┃紅摺絵┃
                  ┃錦絵期━━→
                  
      [中央に大きな画像]
```
- 横軸タイムラインをドラッグ/クリック
- 各技法の繁栄期間を異なる幅で表現
- 画像がfade/crossfadeで遷移

### Concept C: 透過レイヤー型
```
    ┌─────────────┐
   ┌┴────────────┐│ 錦絵
  ┌┴────────────┐││ 紅摺絵
  │             │││ 墨摺絵
  └─────────────┴┴┘
```
- 3枚を perspective + translateZ で3D的に重ねる
- ホバーで層が分離してスプレッド
- クリックで各層にフォーカス

## ルーティング

[src/App.jsx](src/App.jsx) に `/playground` パスを追加し、開発中に直接アクセス可能にする。

## 使用する画像

- `/sumizuri-e.png` (墨摺絵)
- `/benizuri-e.png` (紅摺絵)  
- `/nishiki-e.png` (錦絵)