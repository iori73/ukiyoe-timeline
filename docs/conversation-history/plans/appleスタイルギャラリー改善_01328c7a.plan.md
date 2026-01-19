---
name: Appleスタイルギャラリー改善
overview: Apple iPhone Air の `#aap-media-card-gallery` パターンを参考に、DawnPageのギャラリーアニメーションを改善します。レイヤー横スライドは現状維持。
todos:
  - id: sync-elapsed-time
    content: DawnPageで経過時間をGalleryIndicatorsに渡す仕組みを追加
    status: completed
  - id: js-progress-indicator
    content: GalleryIndicatorsをCSSアニメーションからJS制御の進捗表示に変更
    status: completed
  - id: touch-detection
    content: ユーザー操作検出を精緻化（touchstartの即時停止を改善）
    status: completed
---

# Appleスタイルギャラリー改善プラン

## 参考にするAppleのパターン

Apple iPhone Air ページの「まずは、ハイライトから。」セクション（`#aap-media-card-gallery`）の特徴：

1. **プログレスインジケーター**: タブ形式で、アクティブなタブに進捗フィルアニメーション
2. **自動トランジション**: 進捗が100%になると次のカードにフェード/スライド
3. **再生/一時停止**: インタラクティブな制御ボタン
4. **タイミング同期**: インジケーターの進捗とコンテンツ切り替えが完全同期

---

## 現在の実装との差分

| 項目 | 現在 | Appleスタイル |

|------|------|---------------|

| トランジション | 縦スクロール（`scrollIntoView`） | インプレース切り替え |

| インジケーター | 縦棒（フィルアニメーション） | 横タブ（フィルアニメーション） |

| タイミング | CSS animationで分離気味 | JS制御で完全同期 |

---

## 改善方針

### 1. インジケーターの進捗同期を強化

[`GalleryIndicators.jsx`](src/components/dawn/GalleryIndicators.jsx) で CSS animation ではなく JS ベースの進捗計算に変更：

```jsx
// 現在: CSSアニメーション
animationDuration: isActive ? `${periodDuration}ms` : undefined,

// 改善: JS で経過時間を追跡し、width/height を直接制御
```

### 2. トランジションタイミングの改善

[`DawnPage.jsx`](src/pages/DawnPage.jsx) の `useEffect` 内で、経過時間を追跡する `elapsedTimeRef` を `GalleryIndicators` に渡し、同期を取る。

### 3. ユーザー操作検出の精緻化

現在の問題: `touchstart` ですぐに停止 → モバイルで意図しない停止

改善案: タッチ開始から一定距離/時間移動した場合のみ「操作」と判定

---

## 対象ファイル

1. [`src/pages/DawnPage.jsx`](src/pages/DawnPage.jsx) - 経過時間追跡と同期制御
2. [`src/components/dawn/GalleryIndicators.jsx`](src/components/dawn/GalleryIndicators.jsx) - JS制御の進捗表示
3. [`src/components/dawn/GalleryIndicators.css`](src/components/dawn/GalleryIndicators.css) - スタイル調整

---

## 期待される結果

- インジケーターの進捗フィルとコンテンツ切り替えの完全同期
- 一時停止/再開時のスムーズな継続
- 意図しないアニメーション停止の防止
- レイヤー横スクロールは現状維持（`LayeredImages` は変更なし）