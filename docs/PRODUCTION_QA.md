# Production QA - 公開前チェックとベストプラクティス

> 本番公開前の実機テスト・OG画像・パフォーマンス・画像最適化・デプロイ手順をまとめたドキュメント。
> 開発のベストプラクティスに基づき、IMPLEMENTATION_PLAN Phase 4 および TECH_STACK と整合させる。

---

## 1. iPhone 実機でテストする方法

### 前提

- Mac と iPhone が**同じ Wi‑Fi** に接続されていること
- 開発サーバーは `host: true` により LAN でリッスンしている（`vite.config.js`）

### 手順

1. **Mac で開発サーバーを起動**
   ```bash
   pnpm dev
   ```
   起動ログに **Network** の URL が表示される（例: `http://192.168.1.10:5173`）。

2. **Mac の IP を確認（Network が出ない場合）**
   ```bash
   # macOS
   ipconfig getifaddr en0
   ```
   Wi‑Fi のアドレス（例: `192.168.1.10`）を控える。

3. **iPhone の Safari で開く**
   - アドレスバーに `http://<MacのIP>:5173` を入力（例: `http://192.168.1.10:5173`）
   - トップ・タイムライン・Dawn の各ページ、言語切替、作品タップ、スクロールを確認

### 注意

- **証明書の警告**: 開発サーバーは HTTP のため、一部機能（カメラ等）で制限が出る場合がある。本番は HTTPS でデプロイすれば解消される。
- **ファイアウォール**: Mac の「ファイアウォール」でブロックされる場合は、Vite（Node）を許可するか、一時的に無効化してテストする。
- **キャッシュ**: 表示がおかしい場合は Safari で「履歴とWebサイトデータを消去」してから再アクセスする。

### 代替: プレビュー URL でテスト

- Vercel / Netlify の**プレビューデプロイ**を使う場合、その URL を iPhone で開けば実機確認できる。
- 同一 LAN が不要で、HTTPS でテストできる（本番に近い環境）。

---

## 2. OG 画像（SNS シェア用）

### 仕様

| 項目 | 推奨 |
|------|------|
| ファイル | `public/images/og-image.jpg` |
| サイズ | **1200 × 630 px**（OG/Twitter 推奨比 1.91:1） |
| 形式 | JPG または PNG（ファイルサイズは 1MB 以下が望ましい） |

### 公開前にやること

1. **画像を用意する**
   - トップのヒーロー（`images/top/hero-printing-scene.png`）やロゴをベースに、1200×630 にクロップした画像を用意する。
   - ツール例: Figma、Canva、ImageMagick（`convert -resize 1200x630^ -gravity center -extent 1200x630 input.png og-image.jpg`）

2. **配置する**
   - 上記ファイルを `public/images/og-image.jpg` として保存する。
   - ビルド後はルート相対で `/images/og-image.jpg` として参照される（`index.html` の `og:image` / `twitter:image` で指定済み）。

3. **本番 URL で確認する**
   - デプロイ後、[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) や [Twitter Card Validator](https://cards-dev.twitter.com/validator) で URL を入力し、プレビューを確認する。
   - **注意**: `og:image` は**絶対 URL** が必要。Vercel/Netlify などではデプロイ後のドメインで自動的に解決される。`index.html` では相対パス `/images/og-image.jpg` を指定しているため、デプロイ先のルートドメインが正しく設定されていれば問題ない。

### 未配置時

- `og-image.jpg` が無いままデプロイすると、SNS のプレビューで画像が表示されない（404）。公開前に必ず配置すること（`public/images/README.md` も参照）。

---

## 3. パフォーマンス

### 現状

- **ルート単位のコード分割**: 主要ページは `React.lazy` + `Suspense` で分割済み（初回ロード軽減）。
- **大きなチャンク**: `ukiyoe-loading-layers` が約 1.7MB（gzip 約 658KB）。トップのローディングアニメーション用。ビルド時の警告は出るが、機能上の問題はない。

### 推奨

- **本番**: デプロイ先の CDN とキャッシュ（Cache-Control）を有効にし、2 回目以降のアクセスを軽くする。
- **今後の最適化**: ローディングアニメーションをさらに分割する場合は、`vite.config.js` の `build.rollupOptions.output.manualChunks` で該当モジュールを別チャンクに分ける検討が可能（IMPLEMENTATION_PLAN Phase 4.2 参照）。

---

## 4. 画像最適化

### すでにやっていること

- **遅延読み込み**: タイムライン作品一覧などで `loading="lazy"` を指定済み。
- **CLS 対策**: 主要な画像に `aspect-ratio` や `min-height` を指定し、読み込み時のレイアウトずれを抑制。
- **読み込み失敗時**: 作品詳細モーダル・ギャラリーで `onError` によるフォールバック表示を実装済み。

### 推奨（今後の Phase 4 向け）

- **WebP/AVIF**: 表示用画像を WebP（または AVIF）に変換すると転送量削減に有効。ビルドパイプライン（Vite プラグイン等）での自動変換、または手動変換して `public` に配置する方法がある（IMPLEMENTATION_PLAN Step 4.2 に記載）。
- **外部画像**:  Wikimedia Commons 等の外部 URL に依存している箇所は、docs/IMAGE_CREDITS.md のクレジットを守りつつ、自前ホスト＋最適化した画像への置き換えを検討する。

---

## 5. HTTPS・デプロイ

### 推奨ホスティング

| サービス | 特徴 | HTTPS |
|----------|------|--------|
| **Vercel** | GitHub 連携・プレビュー環境・SPA 対応が容易 | 自動 |
| **Netlify** | 同上。フォーム等のサーバー機能も可能 | 自動 |
| **GitHub Pages** | 静的サイト無料。`react-snap` 等で SPA 対応が必要な場合あり | 自動（*.github.io） |

TECH_STACK.md の「8. デプロイ」に選定結果を記載する。

### デプロイの流れ（Vercel 例）

1. [Vercel](https://vercel.com) で GitHub リポジトリをインポート
2. **Framework Preset**: Vite を選択（または Auto のまま）
3. **Build Command**: `pnpm build`（または `npm run build`）
4. **Output Directory**: `dist`
5. **Install Command**: `pnpm install`
6. デプロイ実行後、HTTPS の本番 URL が自動発行される

### 環境変数

- 現時点で必須の環境変数はない。外部 API キー等を追加した場合は、Vercel/Netlify のダッシュボードで設定する。

### ルーティング（SPA）

- Vite の `server.historyApiFallback: true` と同様に、本番でも「すべてのパスを `index.html` にフォールバック」する設定が必要。Vercel は `vercel.json` で、Netlify は `public/_redirects` または `netlify.toml` で設定する（各サービスの SPA 用テンプレートを参照）。

---

## 関連ドキュメント

- [TECH_STACK.md](./TECH_STACK.md) — 技術スタック・デプロイ先
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) — Phase 4 レスポンシブ・パフォーマンス
- [IMAGE_CREDITS.md](./IMAGE_CREDITS.md) — 画像クレジット・利用条件
- [public/images/README.md](../public/images/README.md) — 画像配置・og-image の説明
