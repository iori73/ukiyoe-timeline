# IMPLEMENTATION_PLAN.md - Implementation Plan

> Last Updated: 2026-02-17
> AI は「現在のステップのみ」を実装する。先に進まない、飛ばさない。
> 各ステップ完了後に progress.txt を更新する。

---

## 実装順序

### Phase 1: 基盤構築（完了）

#### Step 1.1: プロジェクト初期化
- [x] React 18.3 + Vite 6 セットアップ
- [x] pnpm による依存パッケージのインストール
- [x] ディレクトリ構造の作成（components/, pages/, data/, context/）
- [x] ESLint 設定
- [x] .gitignore 設定
- [x] git init + 初期コミット

#### Step 1.2: デザインシステム基盤
- [x] CSS変数定義（`:root` ブロック in `src/App.css`）
- [x] 和風カラーパレット（墨色、紅色、藍色、金色、和紙色）
- [x] フォント設定（Shippori Mincho, Hiragino Kaku Gothic, HOT-Tenshokk-M）
- [x] 8px グリッドスペーシングシステム
- [x] アニメーション定数（CSS変数 + `src/constants/motion.js`）
- [x] DESIGN_SYSTEM.md 作成

#### Step 1.3: 共通基盤
- [x] React Router DOM によるルーティング設定
- [x] LanguageContext によるバイリンガル対応（日本語 / 英語）
- [x] LanguageToggle コンポーネント
- [x] ロゴデザイン（SVG）
- [x] 共通ヘッダー構造

---

### Phase 2: ページ実装（完了）

#### Step 2.1: 旧タイムライン（水平スクロール版）
- [x] HorizontalScroll コンポーネント
- [x] FullscreenSection コンポーネント
- [x] IntroSection（導入画面）
- [x] UkiyoeLoading（摺り工程ローディングアニメーション）
- [x] ScrollIndicators（スクロール進捗表示）
- [x] 5時代のデータ構造（`src/data/ukiyoe.js`）
- [x] → 後に `/timeline-old` にアーカイブ

#### Step 2.2: Dawn ページ（錦絵の黎明）
- [x] PeriodSlide コンポーネント（時代ごとのスライド）
- [x] LayeredImages（版画レイヤー表示）
- [x] ProgressTimeline（時代進捗インジケーター）
- [x] GalleryIndicators（ギャラリーナビゲーション）
- [x] LayerStackAnimation（レイヤー積層アニメーション）
- [x] セクション単位のスクロール制御
- [x] レイヤー画像の用意（墨摺絵・紅摺絵・錦絵）

#### Step 2.3: タイムライン v2（ネイティブスクロール版）
- [x] TimelinePage リファクタリング（ネイティブスクロール方式に移行）
- [x] FixedPeriodPanel（左下固定テキストパネル）
- [x] TimelineDetailSection（時代別詳細セクション）
- [x] ParallaxArtworks（パララックス作品画像）
- [x] ArtworkDetailModal（作品詳細モーダル）
- [x] ArtworkGalleryGrid（全作品一覧グリッド）
- [x] TimelineGalleryIndicators（ギャラリーインジケーター）
- [x] 5時代 × 複数作品のデータ整備

#### Step 2.4: ホームページ（LayerAnimationPage）
- [x] 3技法時代のレイヤーアニメーション
- [x] Figma レイヤー構造の忠実な再現（墨摺絵・紅摺絵・錦絵）
- [x] スクロール連動のアニメーショントリガー
- [x] 技法解説テキスト（`src/data/techniques.js`）
- [x] フッターナビゲーション（→ /timeline）

---

### Phase 3: デザインQA・品質改善（完了）

#### Step 3.1: デザインQAワークフロー確立
- [x] Figma MCP によるデザイン取得
- [x] ブラウザ MCP による実装確認
- [x] 比較・差異修正ワークフロー

#### Step 3.2: デザインシステム整合性
- [x] CSS変数の一貫した使用
- [x] Framer Motion 定数の JS モジュール化
- [x] DESIGN_SYSTEM.md のトークン精査・更新

---

### Phase 4: 今後のロードマップ（未着手）

<!-- 以下はユーザーとの議論で優先順位を決定する -->

#### Step 4.1: レスポンシブ対応
- [ ] モバイル表示の確認・最適化（全ページ）
- [ ] タブレット表示の確認・最適化
- [ ] タッチ操作の最適化（スクロール、モーダル）

#### Step 4.2: パフォーマンス最適化
- [ ] 画像の遅延読み込み（Lazy Loading）
- [ ] 画像最適化（WebP 変換、サイズ調整）
- [ ] 不要な再レンダリングの排除
- [ ] バンドルサイズの確認・最適化

#### Step 4.3: アクセシビリティ
- [ ] キーボードナビゲーション対応
- [ ] スクリーンリーダー対応（ARIA ラベル）
- [ ] フォーカス管理（モーダル、ページ遷移）

#### Step 4.4: ホーム → Dawn への遷移
- [ ] ホームページから `/dawn` への遷移リンク追加
- [ ] ナビゲーション構造の見直し

#### Step 4.5: デプロイ
- [ ] デプロイ先の選定（Vercel / Netlify / etc.）
- [ ] ビルド最適化
- [ ] 本番環境での動作確認
- [ ] OGP / メタタグの設定

---

## 現在の位置

**現在のステップ**: Phase 3 完了、Phase 4 の優先順位を検討中
**次のステップ**: ユーザーと Phase 4 の優先順位を議論
