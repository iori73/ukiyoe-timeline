---
name: Dawn Manual を Main に
overview: DawnManualPage を `/` のメインページにし、既存の横スクロールタイムラインと DawnPage はコードを残しつつルートから削除する。
todos:
  - id: update-routes
    content: App.jsx のルーティングを変更し DawnManualPage を / に設定
    status: pending
  - id: handle-button
    content: 「歴史を見る」ボタンの処理を決定・修正
    status: pending
---

# DawnManualPage をメインページ化

## 変更内容

### 1. ルーティング変更 ([src/App.jsx](src/App.jsx))

現在:

```jsx
<Routes>
  <Route path="/" element={<MainPageWithHashRouting />} />
  <Route path="/dawn" element={<DawnPage />} />
  <Route path="/dawn-manual" element={<DawnManualPage />} />
</Routes>
```

変更後:

```jsx
<Routes>
  <Route path="/" element={<DawnManualPage />} />
  {/* アーカイブ: /dawn と /dawn-manual は削除 */}
  {/* コンポーネントは残すがルートからは除外 */}
</Routes>
```

### 2. 「歴史を見る」ボタンの対応 ([src/pages/DawnManualPage.jsx](src/pages/DawnManualPage.jsx))

現在、末尾の「歴史を見る」ボタンは `Link to="/"` になっています。メインページが DawnManualPage になると、自分自身にリンクすることになります。

**確認**: このボタンはどうしますか？

- 削除する
- 別のアクション（ページトップに戻るなど）に変更する
- 一旦そのまま残す（後で対応）