# 参考サイト・インスピレーション

> 外部サイトや文献から何を学び、何を Ukiyoe に取り入れたかの記録。
> 新たに参考にしたサイトがあれば、このファイルに追記する。

---

## 1. 俵屋旅館 — the-tawaraya.jp

| 項目 | 内容 |
|------|------|
| URL | https://the-tawaraya.jp/ |
| 調査日 | 2026-02-14 |
| 技術スタック | Next.js (Turbopack), Fontplus (FOT-筑紫Cオールド明朝), Tone.js, AV1 WebM |
| 詳細分析 | [docs/specs/tawaraya-transition-analysis.md](specs/tawaraya-transition-analysis.md) |

### 学んだこと

1. **スクロールは奪わない**  
   ホイールを `preventDefault` せず、ネイティブのブラウザスクロールをそのまま使う。スクロールバーは CSS で非表示にするだけ。`overscroll-behavior: none` でバウンスのみ抑制。

2. **トランジションは CSS だけ、長めでゆったり**  
   - 要素の出現: `opacity 1.8s` + `transform: translateY(90px→0)` 1.8s  
   - イージング: `cubic-bezier(.42, 0, .15, 1)` と `cubic-bezier(.19, 1, .22, 1)`  
   - 画像: `scale(1.3→1)` を 2s  
   - メインの表示切替: `opacity 1s`  
   - JS で毎フレーム transform を書き換えるのではなく、Intersection Observer で `.show` を付けて CSS transition に任せる。

3. **ストラグル（順次出現）**  
   子要素に 50ms〜225ms の `transition-delay` をずらして付与。長めの duration と組み合わせて「流れ」を出す。

4. **スクロール連動は CSS 変数で**  
   `--monthly-video-x`, `--monthly-video-scale` などを body に持ち、scroll イベントで JS から更新。動画やレイアウトの位置はこの変数を参照。

### Ukiyoe に取り入れたこと

- [x] `/timeline` をネイティブスクロールの1本の長いページに変更（俵屋方式）  
- [x] ホイールキャプチャ・セクション消費・クールダウンを廃止  
- [x] 各セクションを `position: relative` で縦に並べ、sticky viewport で作品レイヤーを駆動  
- [ ] 要素の出現アニメーションに俵屋の duration / easing を適用（未着手）  
- [ ] Intersection Observer + CSS transition への移行（未着手）  
- [ ] ストラグル（transition-delay のずらし）の適用（未着手）

---

## 2. 澤田屋 — sawataya.jp

| 項目 | 内容 |
|------|------|
| URL | https://sawataya.jp/ |
| 影響時期 | 2025-12〜2026-01（プロジェクト初期） |

### 学んだこと

1. **大画面フルスクリーンの画像配置**  
   1枚の画像をビューポート全体に使い、テキストはオーバーレイで最小限に。

2. **水平スクロール + インジケーター**  
   セクション間を横スクロールで移動し、進捗をドットで表示。

3. **スクロールヒントの UI**  
   「scroll → ↓」のような控えめなガイド表示。

### Ukiyoe に取り入れたこと

- [x] 水平スクロールナビゲーション（`HorizontalScroll` — 現在は `/timeline-old` でアーカイブ）  
- [x] フルスクリーンセクション（`FullscreenSection`）の大画像 + オーバーレイテキスト構成  
- [x] スクロールインジケーター（`ScrollIndicators` — Sawataya スタイルのドット + カウンター）  
- [x] スクロールヒント表示（「scroll → ↓」）

---

## 3. Apple iPhone Air ページ

| 項目 | 内容 |
|------|------|
| URL | https://www.apple.com/iphone-air/ （`#aap-media-card-gallery` セクション） |
| 影響時期 | 2026-01 |

### 学んだこと

1. **プログレスインジケーター付きギャラリー**  
   自動遷移する画像ギャラリーに、線形のプログレスバーで残り時間を表示。

2. **再生 / 一時停止**  
   ユーザーが操作するとタイマーをリセットし、自動遷移を一時停止。

3. **タイミング同期**  
   アニメーションの duration とインジケーターの進捗が厳密に同期している。

### Ukiyoe に取り入れたこと

- [x] Dawn ページのプログレスタイムライン（`ProgressTimeline` — Apple dotnav スタイル）  
- [x] 自動遷移 + 一時停止の仕組み  

---

## 4. 谷崎潤一郎『陰翳礼讃』

| 項目 | 内容 |
|------|------|
| 種別 | 文学作品（エッセイ） |
| 影響時期 | 2026-01 |

### 学んだこと

1. **障子の光の透過**  
   「障子の紙を漉して這入る外光」の描写。光を完全に通さず、完全に遮らず、柔らかく拡散する質感。

2. **陰と余白の美学**  
   暗さの中にこそ美があるという日本的感覚。フラットに照らすのではなく、影のグラデーションで奥行きを出す。

### Ukiyoe に取り入れたこと

- [x] 障子テクスチャフィルター（`App.jsx` — ボタンやオーバーレイに適用した半透明の和紙質感）  
- [x] カラーガイドラインへの反映（暗い背景 + 控えめな光 の設計思想）

---

## 5. デザインシステム方法論

| 項目 | 内容 |
|------|------|
| 参照 | Atomic Design (Brad Frost), Material Design 3, Apple Human Interface Guidelines |
| 影響時期 | プロジェクト全体 |

### 学んだこと

- **Atomic Design**: コンポーネントの粒度設計（atoms → molecules → organisms）
- **Material Design 3**: トークン命名規則、elevation / shadow 体系
- **Apple HIG**: タッチターゲットサイズ（44pt 最小）、インタラクション状態の設計

### Ukiyoe に取り入れたこと

- [x] CSS 変数ベースのデザイントークン（`docs/DESIGN_SYSTEM.md`）  
- [x] 8px グリッドのスペーシング体系  
- [x] カラー・フォント・シャドウの一元管理

---

## 6. 浮世絵の歴史・技法資料

| 項目 | 内容 |
|------|------|
| adachi-hanga.com | 北斎今昔 — 色彩の変遷、技法の歴史的文脈 |
| ukiyoe-ota-muse.jp | 太田記念美術館 — 作品データ、時代区分 |
| Wikipedia / ukiyo-e.org | 作品画像の出典 |

### Ukiyoe に取り入れたこと

- [x] カラーガイドライン（`docs/COLOR_GUIDELINES.md`）の歴史的根拠  
- [x] `ukiyoe.js` の作品データ・画像 URL  
- [x] 時代区分（9期）の定義と解説テキスト

---

## 7. Tokyo Museum Collection (ToMuCo) — ヒーロー画像の出典

| 項目 | 内容 |
|------|------|
| URL | https://museumcollection.tokyo/ |
| 利用条件 | https://museumcollection.tokyo/terms/ |
| 本プロジェクトでの利用 | トップページヒーロー画像：歌川国貞(初代)「今様見立士農工商 職人」([作品ページ](https://museumcollection.tokyo/works/6256752/))、江戸東京博物館蔵 |

### 利用規約の要点（要約）

- **作品情報（メタデータ・画像を除く）**: CC BY 4.0。出典「Tokyo Museum Collection（当該ページのURL）」の表示が条件。
- **画像**: 著作権法第47条に基づく公開。学術・研究・教育目的の利用は収蔵館への申請許可が必要。商業利用は[東京都歴史文化財団 イメージライセンス事業](https://www.rekibun.or.jp/about/project/licence/)へ申請。

### Ukiyoe に取り入れたこと

- [x] ヒーロー画像の出典表示（トップページに作品名・蔵・Tokyo Museum Collection へのリンク）
- [x] 画像クレジットと利用条件のドキュメント（[docs/IMAGE_CREDITS.md](IMAGE_CREDITS.md)）
