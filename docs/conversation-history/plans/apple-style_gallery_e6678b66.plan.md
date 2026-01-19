---
name: Apple-style Gallery
overview: Apple iPhone Air風の中央配置ギャラリーを実装。各時代がビューポート中央に表示され、プログレスバーに連動して自動進行。ユーザーのスクロールでいつでも操作可能で、スクロール時は自動アニメーションが停止する。
todos:
  - id: layout-structure
    content: DawnPage.jsx/cssをフルスクリーンギャラリーレイアウトに変更
    status: completed
  - id: slide-component
    content: PeriodRowをビューポート高さの中央配置スライドに変更
    status: completed
  - id: scroll-sync
    content: スクロール位置からアクティブ期間とプログレスを計算するロジック実装
    status: completed
  - id: auto-animation
    content: 自動スクロールアニメーション + ユーザー操作検知で停止する機能
    status: completed
  - id: progress-indicators
    content: 左固定のプログレスインジケーター（ドット+バー）を実装
    status: completed
---

# Apple風中央配置ギャラリーの実装

## 概要

Dawn pageを「1つの時代が画面中央に表示される」Apple風ギャラリーに変更。自動アニメーションとスクロール操作の両方に対応し、ユーザーがスクロールすると自動進行が停止する。

## アーキテクチャ

```mermaid
flowchart TB
subgraph DawnPage[DawnPage Component]
Header[Fixed Header]
Title[Fixed Title Section]
Gallery[Gallery Viewport]
Indicators[Fixed Progress Indicators]
end

subgraph GalleryContent[Gallery Viewport - scroll container]
Slide1[Sumizuri Slide - 100vh]
Slide2[Benizuri Slide - 100vh]
Slide3[Nishiki Slide - 100vh]
end

Gallery --> GalleryContent

subgraph ScrollLogic[Scroll Logic]
ScrollPos[Scroll Position]
ActivePeriod[Active Period Index]
Progress[Progress Percentage]
end

ScrollPos --> ActivePeriod
ActivePeriod --> Progress
Progress --> Indicators