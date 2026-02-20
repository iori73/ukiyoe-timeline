# public/images フォルダ構成

トップページ・Dawn・タイムラインなどで参照する画像・SVGの配置場所です。

## ディレクトリ構成

| パス | 用途 |
|------|------|
| **top/** | トップページ（`/`）用 |
| | `hero-printing-scene.png` — ヒーロー用。**今様見立士農工商 職人**（A Modern Parody of the Hierarchy of Samurai, Farmers, Artisans, and Merchants : Craftsmen）歌川国貞(初代)/画、江戸東京博物館蔵（[ToMuCo](https://museumcollection.tokyo/works/6256752/)）。クレジット・利用条件は [docs/IMAGE_CREDITS.md](../docs/IMAGE_CREDITS.md) 参照。 |
| **dawn/** | Dawn ページ（`/dawn`）用。墨摺絵・紅摺絵・錦絵のレイヤー画像など |
| | `sumizuri-e/`, `benizuri-e/`, `nishiki-e/` 配下にレイヤー SVG/PNG |
| **直下** | 共通アセット（ロゴ・区切り線・デコレーション） |
| | `hero-printing-scene-source.png` — ヒーロー画像の元ファイル（本番表示は `top/hero-printing-scene.png`） |
| | `og-image.jpg` — **SNSシェア用OG画像（1200×630px推奨）**。未配置だとSNSプレビューで画像が出ない。詳細は [docs/PRODUCTION_QA.md](../docs/PRODUCTION_QA.md) 参照。 |
| | `logo-square.svg`, `logo-round.svg`, `logo-halfround.svg` — ヘッダー等で使用 |
| | `divider.svg`, `divider_lg.svg` — セクション区切り |
| | `underline.svg`, `uki-character.svg`, `logo-concept-*.svg` — デザイン用 |

## 参照時のパス

- ビルド後は `public` がルートになるため、ソース内では **`/images/...`** で参照する。
- 例: `src="/images/top/hero-printing-scene.png"`
