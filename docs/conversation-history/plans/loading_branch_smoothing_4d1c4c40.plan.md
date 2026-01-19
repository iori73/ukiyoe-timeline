---
name: Loading Branch Smoothing
overview: ローディングアニメーションの梅の枝を、現在のストロークベースを維持しながら、接続部分を滑らかにして一つの有機的な物体に見えるように改善します。
todos:
  - id: analyze-frames
    content: 全SVGフレームの枝パス構造を分析
    status: completed
  - id: update-branch-paths
    content: loading-svg-frames内のフレームの枝パスを統合・滑らか化
    status: completed
  - id: verify-animation
    content: ブラウザでアニメーションの動作確認
    status: completed
---

# 梅の枝の接続部分の滑らか化

## 現状の問題
現在の枝（`layer-sumi`）は複数の個別ストロークパスで構成されており、各セグメントの接続部分で不自然な区切りが見える状態です：

```svg
<!-- 現在：別々のpath要素 -->
<path d="M 140 320 Q ... 210 190" stroke-width="3"/>
<path d="M 210 190 Q ... 235 155" stroke-width="2.5"/>
<path d="M 235 155 Q ... 270 140" stroke-width="2"/>
```

## 解決アプローチ

### 1. パスの統合
- 連続する枝セグメントを1つのパスに統合
- 主幹部分を一筆書きの曲線として再構築
- 分岐点で自然に接続するようパス座標を調整

### 2. ストローク属性の最適化
- `stroke-linecap: round` - 線端を丸く
- `stroke-linejoin: round` - 接続部を丸く
- 太さのグラデーション（幹から先端に向かって細く）を維持

### 3. 対象ファイル

主な修正対象:
- [`loading-svg-frames/frame-*.svg`](loading-svg-frames/) - 各フレームのSVGファイル
- 枝のパス定義を統合版に更新

### 4. アニメーション互換性
- 現在のopacity/transform ベースのアニメーションを維持
- pathLengthとstroke-dasharrayによる描画アニメーションもそのまま機能

## 具体的な変更

現在の分割パス:
```
M 140 320 → 210 190 (幹)
M 210 190 → 235 155 (上枝1)
M 235 155 → 270 140 (上枝2)
M 180 250 → 150 240 (左枝1)
M 235 155 → 275 130 (右小枝)
M 150 240 → 125 255 (左枝2)
```

統合後の構造:
```
主幹パス: M 140 320 Q ... 210 190 Q ... 270 140 (1本の連続パス)
左分岐パス: 180 250 → 125 255 (連続パス)
右小枝パス: 235 155 → 275 130 (そのまま)
```