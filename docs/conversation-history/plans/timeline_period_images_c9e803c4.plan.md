---
name: Timeline Period Images
overview: ""
todos:
  - id: verify-urls
    content: 現在のPERIOD_ARTWORKS内の画像URLの有効性を確認
    status: completed
  - id: collect-images
    content: 各時代に適した代表作品の画像URLを収集（Wikipedia/美術館から）
    status: completed
  - id: update-period-artworks
    content: src/data/ukiyoe.jsのPERIOD_ARTWORKSを更新
    status: completed
    dependencies:
      - verify-urls
      - collect-images
---

# TimelinePageの各時代の画像を4-5枚に整備するプラン

## 現状

[`src/data/ukiyoe.js`](src/data/ukiyoe.js)の`PERIOD_ARTWORKS`には既に9つの時代それぞれに4-5枚の画像URLが定義されている。これらはTimelinePageの`ParallaxArtworks`コンポーネントで表示される。

## 各時代と現在の画像内容

| 時代 | 年代 | 主な絵師 | 特徴 | 現在の画像数 |
|------|------|----------|------|--------------|
| 初期浮世絵 | 1670-1679 | 菱川師宣 | 墨一色・肉筆中心 | 4枚 |
| 役者絵発展期 | 1700-1719 | 鳥居清信・清倍 | 歌舞伎役者・看板絵 | 4枚 |
| 漆絵・紅絵期 | 1720-1739 | 奥村政信 | 着色技術導入 | 4枚 |
| 紅摺絵隆盛期 | 1740-1749 | 石川豊信 | 2-3色版画 | 4枚 |
| 紅摺絵技術向上期 | 1750-1764 | 石川豊信・春信初期 | 4-5色への発展 | 4枚 |
| 錦絵成立期 | 1765-1770 | 鈴木春信 | 10色以上の多色摺り | 5枚 |
| 錦絵拡大期 | 1770-1789 | 清長・春章 | 大判美人画 | 4枚 |
| 大首絵期 | 1790-1799 | 歌麿・写楽 | 顔のクローズアップ | 5枚 |
| 風景画期 | 1800-1850 | 北斎・広重 | 風景画の隆盛 | 5枚 |

## 実施内容

### 1. 画像URLの有効性確認

現在の画像URLにアクセスできるか確認し、壊れているリンクを特定する

### 2. 各時代の特徴に基づく画像の選定

各時代の特徴を反映した代表作品の画像URLを、以下の信頼性の高いソースから収集:

- **Wikipedia Commons** - パブリックドメインの浮世絵
- **メトロポリタン美術館 (MET)** - オープンアクセス画像
- **大英博物館** - オンラインコレクション
- **日本の美術館デジタルアーカイブ** (文化遺産オンラインなど)

### 3. `PERIOD_ARTWORKS`の更新

[`src/data/ukiyoe.js`](src/data/ukiyoe.js)の`PERIOD_ARTWORKS`オブジェクトを更新し、各時代に4-5枚の適切な画像を設定

## 主要な修正ファイル

- [`src/data/ukiyoe.js`](src/data/ukiyoe.js) - PERIOD_ARTWORKSオブジェクトの画像URL更新