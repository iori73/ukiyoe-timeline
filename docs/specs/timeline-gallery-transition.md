# タイムライン ⇔ 浮世絵作品一覧（ギャラリー）遷移

> 作成日: 2026-02-14
> ステータス: Completed

---

## 概要

/timeline ページで、時代セクション（01〜09）の末尾から「浮世絵作品一覧」へ進み、一覧から再びタイムラインに戻るまでの挙動を定義する。

---

## 要件（必須）

### タイムライン → ギャラリー
- 最後のセクション（09）で下方向にスクロールしきると、自動で「浮世絵作品一覧」に遷移する。
- 遷移後は通常のページスクロールで一覧を閲覧できる。

### ギャラリー → タイムライン
- **インジケーターは常に表示する**（ギャラリー表示中も左側の丸/棒を非表示にしない）。
- ギャラリー表示中はインジケーターを「ギャラリーモード」用の見た目（全ドット・低めの不透明度）にする。
- **戻り方1**: インジケーターをクリックすると、該当セクションに戻りギャラリーモードを解除する。
- **戻り方2**: ギャラリー内で上方向にスクロールし、ビューがタイムライン領域に入ったら自動でギャラリーモードを解除し、セクション操作に戻る。

### 不具合防止
- 09からギャラリーへ進む下スクロールを、戻る検出で阻害しない（「ギャラリー上部付近」で即戻るような条件にしない）。
- 戻る判定は「ビューがギャラリー領域を出た」ときのみ行う（例: スクロール位置がギャラリー上端より十分上）。

---

## 技術メモ（2026-02 ネイティブスクロール化）

- **ネイティブスクロール**: タイムラインは「1本の長いページ」。ホイールは消費せず、セクションはスクロール位置で「アクティブ」を決めるだけ（俵屋方式）。`VerticalScroll` は /timeline では使用しない。
- **TimelinePage**: 各時代を `TimelineDetailSection`（`useNativeScroll`）で縦に並べ、その下に「一覧へ」ゲートブロック、続けて `ArtworkGalleryGrid`。`window` の scroll で `currentSection` と各セクションの `scrollProgress` を算出し、インジケーターと作品レイヤーの位置を更新。
- **一覧へ**: (1) 最後のセクションの下までスクロールするとそのままギャラリー領域へ。(2) ゲート内の「一覧へ」ボタンで `galleryRef.scrollIntoView({ behavior: 'smooth' })`。
- **showGallery**: ギャラリー領域がビューに入ったら `true`（インジケーター非表示）。上にスクロールしてゲート付近に戻ったら `false`。`window.scrollTo(0,0)` は行わない（自然なスクロールのみ）。

---

## 影響ファイル

- `src/pages/TimelinePage.jsx`
- `src/pages/TimelinePage.css`
- `src/components/timeline/TimelineDetailSection.jsx` / `.css`（`useNativeScroll` + `scrollProgress`、sticky viewport）
- `src/components/timeline/TimelineGalleryIndicators.jsx` / `.css`
- `src/components/timeline/ArtworkGalleryGrid.jsx`
- （参考）`src/components/timeline/VerticalScroll.jsx` — /timeline では未使用。他ページで必要なら利用可能。
