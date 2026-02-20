# 俵屋旅館サイト（the-tawaraya.jp）のトランジション技術分析

## 概要

俵屋サイトの「綺麗でスムーズな transition」を実現している技術を調査し、Ukiyoe タイムラインへの適用指針をまとめる。

---

## 1. 技術スタック（判明分）

| 項目 | 内容 |
|------|------|
| フレームワーク | **Next.js**（`_next/static/chunks`, Turbopack, RSC `?_rsc=`） |
| フォント | Fontplus（FOT-筑紫Cオールド明朝 Pr6N R 等） |
| 音声 | Tone.js |
| 動画 | 月別データ（`monthly-data.json`）+ `positions.json` + AV1 WebM。スクロール連動用の座標データあり |

---

## 2. スクロールの扱い（最重要）

- **ホイールをキャプチャしていない**。`e.preventDefault()` でスクロールを止める処理は行っていない。
- **ネイティブのブラウザスクロール**のまま。
- スクロールバーは非表示: `scrollbar-width:none`, `::-webkit-scrollbar{display:none}`。
- オーバースクロールのみ無効: `html,body{overscroll-behavior:none}`。

→ **「何回もスクロールしないと進めない」原因は、Ukiyoe 側の「ホイールを奪ってセクション単位で消費する」設計にある。俵屋はその方式を取っていない。**

---

## 3. トランジション・アニメーションの実装

### 3.1 ページ／メインコンテンツの出し入れ

```css
main {
  opacity: 1;
  transition: opacity 1s cubic-bezier(.42, 0, .15, 1);
}
main.hide {
  opacity: 0;
}
```

- ルートやメインの表示切り替えは **opacity 1s** の CSS transition のみ。
- イージング: `cubic-bezier(.42, 0, .15, 1)`（イージングアウト系）。

### 3.2 スクロール連動の「見え方」アニメーション（.js__fade-in 系）

- **トリガー**: おそらく **Intersection Observer** で要素がビューポートに入ったら `.show` を付与。
- **アニメーションはすべて CSS の transition**。JS で transform を毎フレーム書き換えるようなことはしていない。

共通パターン:

- 初期: `opacity: 0`, `transform: translateY(90px)`（または `-60px`）
- `.show` 時: `opacity: 1`, `transform: translateY(0)`
- 遷移時間: **1.8s**
- イージング:  
  - `cubic-bezier(.42, 0, .15, 1)`  
  - `cubic-bezier(.19, 1, .22, 1)`（ややオーバーシュート気味のイージングアウト）

例（.js__fade-in）:

```css
.js__fade-in {
  opacity: 0;
  transition: opacity 1.8s cubic-bezier(.42,0,.15,1),
              transform 1.8s cubic-bezier(.19,1,.22,1), ...;
  transform: translateY(90px);
}
.js__fade-in.show {
  opacity: 1;
  transform: translateY(0);
}
```

画像用（.js__image-fade-in）:

- 親: 上記と同様の fade + translateY。
- 子 img: `scale(1.3)` → `scale(1)` を **2s** で transition。

### 3.3 ストラグル（順番に出現）

- `.js__fade-in-container` 内の子要素や、`.js__news-item` の日付・タイトル・画像に **transition-delay** を付与。
- 例: `75ms`, `.15s`, `.225s` など数十〜200ms 単位のずらし。

→ **長めの duration（1.8s）＋ 短い delay のストラグル**で、まとまりのある「流れ」を出している。

### 3.4 スクロール連動の動画・変数

- body に CSS 変数:  
  `--monthly-video-x`, `--monthly-video-y`, `--monthly-video-scale`, `--fv-video-scale`, `--fv-scroll-area-height: 100vh`（`100dvh` のフォールバックあり）。
- スクロール位置に応じて JS でこれらを更新し、動画の位置・スケールを制御していると推測される（スクロールドリブン）。

---

## 4. モバイル（スワイプ）

- 横スワイプ用: `--slideX`, `.swipe-container { transform: translateX(calc(var(--slideX)*1px)); display: flex }`。
- `.swipe-item` は `82.6667vw` 幅で flex-shrink: 0。
- タッチで `--slideX` を更新する実装と推測。

---

## 5. Ukiyoe への適用指針

### 5.1 スクロールモデル（根本）

- **俵屋**: ネイティブスクロール ＋ スクロール位置に応じた「見せ方」の変化（Intersection Observer + CSS transition、必要なら scroll で CSS 変数更新）。
- **Ukiyoe 現状**: ホイールを奪い、セクションごとに「消費」し、ブロックやクールダウンで一覧への遷移が阻害されがち。

**提案:**

1. **理想に近づける**: タイムラインを「ネイティブスクロールの1本の長いページ」にし、セクションは「スクロール位置でどれがアクティブか」を決めるだけにする（ホイールを消費しない）。一覧への遷移は「最後のセクションの下」をスクロールで通過するか、固定の「一覧へ」ボタンで行う。
2. **現構成を維持する場合**: 少なくとも「最後のセクション → 一覧」は、**ホイールを奪わずに即座に遷移**する（前回修正の通り）。セクション間の連続遷移ブロックは「一覧へ」には一切適用しない。

### 5.2 見た目のスムーズさ（俵屋っぽくする）

- **長めの duration**: 1.2s〜1.8s の opacity / transform transition。
- **イージング**:  
  - `cubic-bezier(.42, 0, .15, 1)`  
  - `cubic-bezier(.19, 1, .22, 1)`  
  を、セクションの出し入れや、作品・テキストの表示に使う。
- **ストラグル**: 子要素に 50ms〜200ms 程度の `transition-delay` をずらして付与。
- **メインの切り替え**: 俵屋と同様、`main` やコンテナの `opacity` で 1s 前後の fade を検討。

### 5.3 実装チェックリスト

- [ ] タイムラインでホイールを `preventDefault` している箇所を見直し、ネイティブスクロール寄せできるか検討する。
- [ ] 「最後のセクション → 一覧」は、ブロック・クールダウン・連続遷移カウントの対象外にする（済）。
- [ ] セクション切り替えや作品表示に、上記の長めの duration と cubic-bezier を適用する。
- [ ] 必要なら Intersection Observer で「ビューポートに入ったら .show」を付け、アニメーションはすべて CSS transition に寄せる。

---

## 参考: 俵屋で使われている主な値

- メイン fade: `1s`, `cubic-bezier(.42, 0, .15, 1)`
- 要素の出現: `1.8s`, `cubic-bezier(.42, 0, .15, 1)` / `cubic-bezier(.19, 1, .22, 1)`
- 画像 scale: `2s`, `cubic-bezier(.19, 1, .22, 1)`
- delay: `50ms`, `75ms`, `.15s`, `.225s` など
