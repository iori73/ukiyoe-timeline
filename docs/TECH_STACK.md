# TECH_STACK.md - Technology Stack

> Last Updated: 2026-02-17
> AI はこのドキュメントに記載されたパッケージのみを使用する。
> 新しい依存関係を追加する場合は、ユーザーに確認し、このドキュメントも更新する。

---

## 1. コアフレームワーク

| パッケージ | バージョン | 用途 |
|---|---|---|
| React | ^18.3.1 | UIライブラリ |
| React DOM | ^18.3.1 | DOM レンダリング |
| Vite | ^6.0.1 | ビルドツール / 開発サーバー |
| React Router DOM | ^7.11.0 | クライアントサイドルーティング |

---

## 2. アニメーション

| パッケージ | バージョン | 用途 |
|---|---|---|
| Framer Motion | ^11.11.0 | React アニメーション（ページ遷移、モーダル、インタラクション） |

---

## 3. スタイリング

| 技術 | 詳細 |
|---|---|
| カスタム CSS | CSS変数ベースのデザインシステム（`src/App.css` で `:root` 定義） |
| Framer Motion 定数 | `src/constants/motion.js` で JS 側のアニメーション定数を定義 |

**注意**: Tailwind CSS、CSS-in-JS ライブラリは使用しない。

---

## 4. データ処理

| パッケージ | バージョン | 用途 |
|---|---|---|
| PapaParse | ^5.4.1 | CSV パース（データ読み込み） |

---

## 5. 開発ツール

| パッケージ | バージョン | 用途 |
|---|---|---|
| @vitejs/plugin-react | ^4.3.3 | Vite の React プラグイン |
| Vitest | ^4.0.16 | テストフレームワーク |
| @testing-library/react | ^16.3.1 | React テスティングユーティリティ |
| @testing-library/jest-dom | ^6.9.1 | DOM マッチャー拡張 |
| @types/react | ^18.3.12 | React 型定義（エディタ補完用） |
| @types/react-dom | ^18.3.1 | React DOM 型定義 |
| SVGO | ^4.0.0 | SVG 最適化ツール |

---

## 6. ユーティリティ（依存関係に含まれるが限定的な使用）

| パッケージ | バージョン | 用途 |
|---|---|---|
| jsdom | ^27.3.0 | テスト環境の DOM シミュレーション |
| Puppeteer | ^24.32.0 | スクリーンショット生成 / E2Eテスト |

---

## 7. パッケージマネージャー

| ツール | 用途 |
|---|---|
| **pnpm** | 依存関係管理（npm は使用しない） |

---

## 8. デプロイ

| サービス | 用途 |
|---|---|
| **Vercel / Netlify**（推奨） | ホスティング・CI/CD。Git 連携・プレビュー・HTTPS 自動。手順は [docs/PRODUCTION_QA.md](PRODUCTION_QA.md) 参照。 |
| GitHub | バージョン管理 |

---

## 9. 禁止事項

- **このドキュメントに記載のないパッケージを無断で追加しない**（ユーザーに確認必須）
- バージョンを勝手にアップグレードしない
- 代替ライブラリに無断で置き換えない（例: Framer Motion → GSAP への変更など）
- CSS フレームワーク（Tailwind, Bootstrap 等）を追加しない
- CSS-in-JS ライブラリ（styled-components, Emotion 等）を追加しない
