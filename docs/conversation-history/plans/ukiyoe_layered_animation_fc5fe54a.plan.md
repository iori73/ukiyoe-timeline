---
name: Ukiyoe Layered Animation
overview: Figmaからエクスポートされた6層のSVGを使用して、浮世絵の摺り工程を再現するアニメーションを実装する。各レイヤーが順番に現れて重なっていく効果を実現する。
todos:
  - id: get-svg
    content: ユーザーからFigmaエクスポートSVGを受け取り、プロジェクトに配置
    status: completed
  - id: parse-layers
    content: SVG解析スクリプトを更新してレイヤー構造を正しく抽出
    status: completed
  - id: update-component
    content: UkiyoeLoadingコンポーネントのアニメーションを修正
    status: completed
  - id: test-animation
    content: アニメーションの動作確認と調整
    status: completed
---

# 浮世絵摺り工程アニメーションの実装

## 問題点

現在の実装は、1つのSVGからパスを色でグループ化してopacityをアニメーションしているが、これでは「色が一枚ずつ重なっていく」効果にならない。Figmaの6つの独立したレイヤーを正しく使用する必要がある。

## 解決策

Figmaからエクスポートされた構造化SVG（各レイヤーが`<g>`タグで分離されている）を使用し、レイヤーごとに順番に表示するアニメーションを実装する。

## 実装手順

### 1. SVGファイルの取得と配置

ユーザーがFigmaの`simplified`フレーム（1:13522）をSVGとしてエクスポートし、プロジェクトに配置する。

配置先: `/Users/iorikawano/Documents/Ukiyoe/public/images/ukiyoe-layers.svg` または同等の場所

### 2. SVG解析スクリプトの更新

[scripts/extract-svg-layers.js](scripts/extract-svg-layers.js) を更新して、Figmaからエクスポートされたレイヤー構造（`<g>`タグ）を認識するようにする。

```javascript
// 各 <g name="layer"> を個別レイヤーとして抽出
// 出力: 各レイヤーのSVGコンテンツを配列として保存
```

### 3. UkiyoeLoadingコンポーネントの修正

[src/components/UkiyoeLoading.jsx](src/components/UkiyoeLoading.jsx) を以下のように修正:

- 各レイヤーを`<motion.g>`でラップし、delayを設定してsequential表示
- `opacity: 0 -> 1` のアニメーションで各レイヤーが現れる
- 一度表示されたレイヤーは`opacity: 1`を維持（重なりを表現）

タイミング設定（既存のSURI_TIMINGを使用）:

| レイヤー | 遅延 | 内容 |

|---------|------|------|

| 1 | 0s | 薄い緑茶色（枝ベース） |

| 2 | 0.4s | 薄い紅色（花ベース） |

| 3 | 0.8s | 濃い緑茶色（枝重ね） |

| 4 | 1.2s | 濃い紅色（花重ね） |

| 5 | 1.6s | 深紅色（花アクセント） |

| 6 | 2.2s | 輪郭線（最後） |

### 4. データ構造の変更

[src/data/ukiyoe-loading-layers.json](src/data/ukiyoe-loading-layers.json) の構造:

```json
{
  "viewBox": "...",
  "width": "...",
  "height": "...",
  "layers": [
    { "id": "layer1", "content": "<g>...</g>全体のSVGマークアップ" },
    ...
  ]
}
```

または、各レイヤーを個別の`<path>`配列として保持し、レイヤー順序を正しく維持する。

## ユーザーへの依頼事項

Figmaから以下の手順でSVGをエクスポート:

1. `simplified`フレーム（1:13522）を選択
2. 右クリック → Copy/Paste → Copy as SVG
3. またはExport → SVG形式
4. ファイルをプロジェクトルートに配置

## 確認事項

エクスポートされたSVGの構造を確認後、具体的な実装を進める。