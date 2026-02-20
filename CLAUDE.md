# CLAUDE.md - Ukiyoe Project

> このファイルは AI（Claude / Cursor）がプロジェクトを理解し、一貫した開発を行うためのガイドラインです。
> セッション開始時に自動的に読み込まれます。

---

## セッション初期化プロトコル

1. **このファイル（CLAUDE.md）を読む**
2. **[progress.txt](progress.txt) を読む** — 現在の進捗と次のタスクを把握
3. **[lessons.md](lessons.md) を読む** — 過去の失敗パターンを確認

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
- **iPhone 実機テスト**: `pnpm dev` 起動時に表示される **Network** の URL（例: `http://192.168.x.x:5173`）を同一 Wi‑Fi の iPhone の Safari で開く。詳細は [docs/PRODUCTION_QA.md](docs/PRODUCTION_QA.md) 参照。

---

## User Discipline Protocol（ユーザー行動規範）

AI はユーザーのパートナーであり、同時にプロセスの番人である。

### 曖昧プロンプトの検出と具体化要求

以下のような非具体的な指示を受けた場合、**実行前に** 具体化を求める：

- 「いい感じにして」「直して」「なんかおかしい」→ 何が、どのように、どうなるべきかを質問する
- 「全部やって」→ スコープを確認し、段階的な実行計画を提示する
- 「前と同じようにして」→ 具体的にどの前例を指すか確認する

### Documentation-First の強制

コード変更の指示を受けた時：

- **新機能追加**: [SCOPE.md](docs/SCOPE.md) に記載があるか確認 → なければスコープ追加の確認
- **大きな設計変更**: 変更理由と影響範囲をドキュメントに記録してから実行
- **新しい仕様**: `docs/specs/` に仕様書を作成してから実装

### スコープクリープ防止

- SCOPE.md に定義されていない機能追加要求に対して: 「これはスコープ外ですが、追加しますか？ドキュメントも更新します」と確認する
- 「ついでにこれも」系の要求: 現在の作業を完了してからの対応を提案する

### 進捗・学習記録の促進

- 機能実装が完了したら: 「progress.txt を更新しましょう」と促す
- バグ修正や大きな方向転換の後: 「lessons.md に今回の学びを記録しましょう」と促す
- セッション終了時: 未記録の進捗があれば更新を提案する

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

### 確認が必要な操作
以下の操作は実行前にユーザーへ確認する：

- **新規パッケージの追加** → [TECH_STACK.md](docs/TECH_STACK.md) に記載のないものは確認
- **デザイントークンの変更** → [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) との整合性確認
- **コンポーネントの props やインターフェースの変更**
- **ファイル構造の大幅な変更**
- **秘密情報（.env、APIキー等）をコード内にハードコードしない**

---

## コーディング規約

### 技術スタック
詳細は [TECH_STACK.md](docs/TECH_STACK.md) を参照。

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
├── progress.txt           # 進捗追跡
├── lessons.md             # 学びの記録
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

## 開発サイクル

すべての作業は以下のサイクルで進める：

```
Plan → Build → Verify → Document → Commit
```

1. **Plan**: Ask/Plan モードで設計を検討。仕様書が必要な場合は `docs/specs/` に作成
2. **Build**: Agent モードで1機能ずつ実装。小さな単位で作業する
3. **Verify**: 実装が期待通りに動作するか確認。ブラウザ MCP / Figma MCP で検証
4. **Document**: progress.txt を更新。問題があった場合は lessons.md も更新
5. **Commit**: git commit で変更を保存。具体的なメッセージを記載

### Cursor モードの使い分け

- **Ask mode**: コードの理解、影響範囲の調査、計画の前段階
- **Plan mode**: アーキテクチャ設計、実装計画、複数アプローチの比較
- **Agent mode**: 実装の実行、ファイル編集、コマンド実行
- **Debug mode**: 頑固なバグの調査、仮説生成、ランタイムログの計測

### スクリーンショット参照の活用

UI に関わる作業では：
- 参考にしたいデザインのスクリーンショットを AI に共有する
- 作業中の画面をスクリーンショットして「これが現状、ここが問題」と伝える
- 言葉で説明するより視覚的参照の方が曖昧さが減る

---

## 過去の学び

> 詳細は [lessons.md](lessons.md) を参照。
> 以下は特に重要な教訓のサマリー。

### 2026-02-14: タイムラインのスクロール不具合
- **パッチを重ねない。設計を変えるなら設計ごと切り替える**
- **2回連続で修正が空振りしたら、修正を止めて根本原因調査に切り替える**
- **コンポーネントの props が実際に使われているか確認する**

### 2026-01-09: 作品詳細モーダルの説明文欠落
- **データとUIの整合性を常に確認すること**

---

## ドキュメント相互参照マップ

各ドキュメントの役割と関係：

| ドキュメント | 役割 |
|---|---|
| **CLAUDE.md**（このファイル） | すべてのルールと参照を集約 |
| [SCOPE.md](docs/SCOPE.md) | 何を作るか（プロジェクト範囲の定義） |
| [APP_FLOW.md](docs/APP_FLOW.md) | どう体験するか（画面遷移・ユーザーフロー） |
| [TECH_STACK.md](docs/TECH_STACK.md) | 何で作るか（技術スタック・依存管理） |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | どう見せるか（色・フォント・スペーシング） |
| [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) | どの順序で作るか（実装ロードマップ） |
| [PRODUCTION_QA.md](docs/PRODUCTION_QA.md) | 公開前チェック（iPhone実機テスト・OG画像・パフォーマンス・デプロイ） |
| [progress.txt](progress.txt) | 現在地の記録 |
| [lessons.md](lessons.md) | 学びの蓄積 |
| [docs/specs/](docs/specs/) | 機能ごとの仕様書 |

### CLAUDE.md は生きたドキュメント

- AI が間違いを犯し、ユーザーが修正した場合 → CLAUDE.md を更新して再発防止
- 新しいパターンや規約が確立された場合 → CLAUDE.md に追記
- CLAUDE.md は自己改善するルールブック

---

## 関連ドキュメント

- [progress.txt](progress.txt) — 進捗追跡
- [lessons.md](lessons.md) — 学びの蓄積
- [SCOPE.md](docs/SCOPE.md) — プロジェクト範囲の定義
- [APP_FLOW.md](docs/APP_FLOW.md) — 画面遷移・ユーザーフロー
- [TECH_STACK.md](docs/TECH_STACK.md) — 技術スタック・依存管理
- [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) — 実装ロードマップ
- [デザインシステム](docs/DESIGN_SYSTEM.md)
- [カラーガイドライン](docs/COLOR_GUIDELINES.md)
- [Production QA](docs/PRODUCTION_QA.md) — iPhone実機テスト・OG画像・デプロイ手順
- [参考サイト・インスピレーション](docs/REFERENCES.md) — 外部サイトから何を学び、何を取り入れたかの記録
- [仕様書テンプレート](docs/specs/_template.md)

