# CLAUDE.md - Ukiyoe Project

> このファイルは AI（Claude / Cursor）がプロジェクトを理解し、一貫した開発を行うためのガイドラインです。

---

## 開発ワークフロー

### パッケージマネージャー
**pnpm を使用する**（npm は使わない）

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動
pnpm dev

# 本番ビルド
pnpm build

# ビルドプレビュー
pnpm preview

# テスト実行
pnpm test

# テスト（1回のみ実行）
pnpm test:run
```

### 開発サーバー
- URL: `http://localhost:5173`
- Vite による HMR（Hot Module Replacement）対応

---

## プロジェクト固有のルール

### ファイル削除ポリシー
- **絶対にファイルを削除しない**（agent mode で delete_file ツールを使用禁止）
- ファイル削除が必要な場合は、ユーザーに手動削除を依頼する
- 既存のファイルは可能な限り保持する

### 一般的なガイドライン
- 新規ファイル作成より、既存ファイルの編集を優先する
- 変更を加える前に必ずファイルを読んで内容を確認する
- 既存のコード構造とパターンを維持する

### 破壊的変更の禁止
- **ユーザー向け機能を削除・無効化する変更は禁止**
- データフィールドの削除は禁止（追加・修正は許可）
- 既存の動作を変更する場合は事前にユーザーへ確認を取る
- コンポーネントの props やインターフェースを削除しない
- 動作中の機能を「リファクタリング」名目で壊さない

---

## コーディング規約

### 技術スタック
- **フレームワーク**: React 18.3 + Vite 6
- **アニメーション**: Framer Motion 11
- **ルーティング**: React Router DOM 7
- **スタイリング**: カスタム CSS（CSS変数ベース）

### CSS ルール
デザインシステムは [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) を参照。

#### CSS変数の使用
```css
/* 色 */
color: var(--sumi-iro);      /* 墨色：主要テキスト */
color: var(--beni-iro);      /* 紅色：アクセント */
color: var(--ai-iro);        /* 藍色：セカンダリ */
background: var(--washi);    /* 和紙色：背景 */

/* フォント */
font-family: var(--font-serif);  /* 見出し：Shippori Mincho */
font-family: var(--font-sans);   /* 本文：Hiragino Kaku Gothic */

/* スペーシング（8px グリッド） */
margin: var(--space-md);     /* 24px */
padding: var(--space-lg);    /* 32px */

/* アニメーション */
transition: all var(--duration-normal) var(--ease-ukiyoe);
```

### コンポーネント規約
- 関数コンポーネント + Hooks を使用
- スタイルは同名の `.css` ファイルに分離（例: `Component.jsx` + `Component.css`）
- コンポーネントは `src/components/` 以下に配置

### バイリンガル対応
- すべてのユーザー向けテキストは日本語/英語両方を用意
- `LanguageContext` を使用して言語切り替え
- データは `src/data/ukiyoe.js` で管理

### コメント
- 日本語コメント OK
- 複雑なロジックには説明コメントを追加

---

## ディレクトリ構造

```
ukiyoe/
├── CLAUDE.md              # このファイル
├── src/
│   ├── components/        # React コンポーネント
│   │   ├── common/        # 共通コンポーネント
│   │   ├── dawn/          # Dawn ページ用
│   │   └── timeline/      # タイムライン用
│   ├── context/           # React Context
│   ├── data/              # データファイル
│   ├── pages/             # ページコンポーネント
│   ├── test/              # テストセットアップ
│   ├── App.jsx            # メインアプリ
│   ├── App.css            # グローバルスタイル（CSS変数定義含む）
│   └── main.jsx           # エントリーポイント
├── public/                # 静的アセット
│   ├── fonts/             # カスタムフォント
│   └── images/            # 画像
├── docs/                  # ドキュメント
│   ├── DESIGN_SYSTEM.md   # デザインシステム
│   ├── COLOR_GUIDELINES.md
│   └── specs/             # 機能仕様書
└── scripts/               # ユーティリティスクリプト
```

---

## 仕様ファースト開発

新機能を実装する前に、必ず仕様書を作成する：

1. `docs/specs/` に仕様書を作成
2. テンプレート: `docs/specs/_template.md` を使用
3. 仕様書を Claude に渡して実装
4. 完成後、仕様書は参照ドキュメントとして残す

---

## デザインQA

実装完了時に、Figma MCP とブラウザ MCP を使ってデザイン差異を確認する。

### ワークフロー

1. **Figma MCP で参照デザインを取得**
   - `mcp_Figma_get_screenshot` で Figma 上のデザインをスクリーンショット
   - `mcp_Figma_get_design_context` でデザイン詳細（色、サイズ等）を取得

2. **ブラウザ MCP で実装を確認**
   - `browser_navigate` で `http://localhost:5173` にアクセス
   - `browser_take_screenshot` で実装画面をスクリーンショット
   - `browser_snapshot` で DOM 構造を確認

3. **比較・確認**
   - 両方のスクリーンショットを見比べて差異を確認
   - 色、フォント、スペーシング、レイアウトの一致を検証

### 確認タイミング

- コンポーネント実装完了時
- スタイル変更後
- レスポンシブ対応後（異なる画面幅で確認）

---

## 過去の学び

> Claude が間違えた際に追記し、同じミスを防ぐセクション

### 2026-01-09
- **作品詳細モーダルの説明文欠落**: `ArtworkDetailModal.jsx` は説明文表示に対応していたが、`ukiyoe.js` のデータに `description_ja` / `description_en` フィールドがなく、説明文が表示されなかった。データとUIの整合性を常に確認すること。

### 2026-01-05
- （初期作成：今後の学びをここに追記）

---

## 関連ドキュメント

- [デザインシステム](docs/DESIGN_SYSTEM.md)
- [カラーガイドライン](docs/COLOR_GUIDELINES.md)
- [仕様書テンプレート](docs/specs/_template.md)

