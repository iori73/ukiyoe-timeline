# タイムラインパネル - Figma と実装の差分

**Figma（パネル単体）**: [Ukiyoe – node 988:5967](https://www.figma.com/design/KfbKROQ1hvrrR9ZVJ3bEn4/Ukiyoe?node-id=988-5967)

**対象**: 左下固定パネル（`.timeline-section__panel` / `.timeline-fixed-panel`）の **font size** と **panel 内の gap**。

- ノード **988:5967** = パネルコンポーネント（09 + 1800→1850 + 重要な出来事 / 代表作品 + 要約）
- ノード 985:1970 = 全体フレーム（大きすぎて API で詳細取得不可）

---

## 1. 現在の実装値（コードベース）

### パネルコンテナ
| 項目 | 値 | ファイル |
|------|-----|---------|
| パネル padding | `14px 16px` | TimelinePage.css, TimelineDetailSection.css |
| レスポ 900px以下 | `padding: .5rem` (8px) | 同上 |
| レスポ 600px以下 | `padding: .5rem` | 同上 |

### フォントサイズ
| 要素 | 現在の値 | ファイル |
|------|----------|----------|
| セクション番号 `.timeline-section__number` | `clamp(1.5rem, 1.875vw, 1.5rem)` → 901px以上で `32px` | TimelineDetailSection.css |
| 年代 `.timeline-section__date-start/end` | `var(--text-sm)` = 16px | 同上 |
| 年代セパレータ | `var(--text-sm)` = 16px | 同上 |
| メタラベル（重要な出来事・代表作品） | `var(--text-sm)` = 16px | 同上 |
| メタ本文 `.timeline-section__meta-text` | `var(--text-xs)` = 14px | 同上 |
| 要約 `.timeline-section__summary-text` | `var(--text-xs)` = 14px | 同上 |

### パネル内の gap（余白）
| 要素 | 現在の値 | ファイル |
|------|----------|----------|
| ヘッダー内 gap（番号と年代の間） | `8px` | `.timeline-section__header { gap: 8px }` |
| ヘッダー下マージン | `0.75rem` (12px) | `margin-bottom: 0.75rem` |
| 年代ブロック内 gap | `4px` (date-range), `8px` (date-inner) | 同上 |
| メタブロック間 gap | `16px` | `.timeline-section__meta { gap: 16px; margin-bottom: 16px }` |
| メタアイテム内 gap | `8px` | `.timeline-section__meta-item { gap: 8px }` |
| メタヘッダー内 gap | `4px` | `.timeline-section__meta-header { gap: 4px }` |
| 要約ブロック上 | `padding-top: 0`（メタの margin-bottom のみ） | 同上 |

**レスポ時（900px以下）**
- ヘッダー: `margin-bottom: .5rem`, `gap: 8px`
- メタ: `gap: 12px`, `margin-bottom: .5rem`

**レスポ時（600px以下）**
- ヘッダー: `margin-bottom: .5rem`, `gap: 4px`
- メタ: `gap: 10px`, `margin-bottom: .5rem`

---

## 2. Figma 側の情報（スクリーンショット・API から得た範囲）

- **get_design_context** はノード 985:1970 が「大きすぎる」ためフル仕様を返せず。
- **get_variable_defs** は該当ノードで `{}`（変数未使用 or 未取得）。
- スクリーンショット説明から読み取れる目安:
  - メイン見出し相当: 約 **30–36px**
  - サブタイトル・説明文: 約 **14–16px**
  - 時代見出し相当: 約 **18–20px**
  - タイトル〜サブタイトル間: 約 1.5 行高
  - サブタイトル〜コンテンツ間: 約 2.5–3 行高
  - 時代タイトル〜グリッド間: 約 0.5 行高
  - グリッド内: 約 **10–16px**

※ 上記は「画面のパネル＋グリッド」全体の説明であり、**左下のテキストパネルだけ**の指定かは Figma 上で要確認。

---

## 3. 差分の整理（フォント・gap）

Figma で「パネル」＝左下の時代情報パネルだと仮定した場合の対応案。

### フォントサイズ
- 実装は **番号 32px / 本文 14–16px**。Figma で 30–36px / 14–16px / 18–20px など別指定になっていれば、Figma の Inspect で **各テキストの font-size** を確認し、ここに書き出してから実装を合わせるのが確実。
- デザインシステムの `--text-*` に合わせる場合の目安:
  - 番号: `--text-2xl` (28px) または `--text-3xl` (36px)
  - ラベル: `--text-sm` (16px) または `--text-xs` (14px)
  - 本文: `--text-xs` (14px)

### パネル内 gap
- 実装は **8px / 12px / 16px** 混在。Figma が **8px グリッド**なら `--space-xs`(8px), `--space-sm`(16px), `--space-md`(24px) に寄せる。
- **パネル padding** は現状 `14px 16px`。Figma が 16px や 20px などなら、`padding: var(--space-sm)` や `padding: var(--space-md)` に変更する候補。

---

## 4. Figma の指定値（ノード 988:5967 から取得）

| 項目 | Figma の値 |
|------|-----------|
| パネル padding | `24px 16px` (上下 24px、左右 16px) |
| コンテンツ gap | `16px` |
| ヘッダー gap | `16px` |
| 番号フォント | `24px` |
| 年代フォント | `16px` |
| ラベルフォント | `16px` |
| 本文フォント | `14px` |
| メタブロック gap | `16px` |
| メタアイテム gap | `8px` |

## 5. 実装済み（2026-02-17）

以下の CSS を Figma 指定値に合わせて修正しました：

- `TimelineDetailSection.css`: `.timeline-section__panel`, `.timeline-section__panel-content`, `.timeline-section__header`, `.timeline-section__number`, `.timeline-section__meta`
- `TimelinePage.css`: `.timeline-fixed-panel`, `.timeline-fixed-panel__content`

**変更内容**:
- パネル padding: `14px 16px` → `24px 16px`
- コンテンツに `gap: 16px` を追加（ヘッダー → メタ → 要約の間隔）
- ヘッダー gap: `8px` → `16px`
- ヘッダー margin-bottom を削除（コンテンツ gap で代用）
- セクション番号: `32px` → `24px`
- メタ margin-bottom を削除（コンテンツ gap で代用）
- レスポンシブ時も gap を調整（900px以下: 12px、600px以下: 8px）
