---
name: Dawn Manual を Main に
overview: DawnManualPage を `/` のメインページにし、現在の横スクロールタイムラインを `/timeline` に移動。「歴史を見る」ボタンから `/timeline` に遷移できるようにする。
todos:
  - id: update-routes
    content: "App.jsx: DawnManualPage を / に、MainPageWithHashRouting を /timeline に変更"
    status: completed
  - id: update-button
    content: "DawnManualPage: 「歴史を見る」ボタンのリンク先を /timeline に変更"
    status: completed
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
  <Route path="/timeline" element={<MainPageWithHashRouting />} />
  {/* /dawn と /dawn-manual は削除（コードは残す） */}
</Routes>
```

### 2. 「歴史を見る」ボタンの更新 ([src/pages/DawnManualPage.jsx](src/pages/DawnManualPage.jsx))

```jsx
// 変更前
<Link to="/" className="dawn-button">

// 変更後
<Link to="/timeline" className="dawn-button">
```

### 3. ヘッダーロゴのリンク

- DawnManualPage: `to="/"` → そのまま（トップページとして正しい）
- 横スクロールタイムライン側: ロゴクリックで `/` に戻る → そのまま（DawnManualPageに戻る）