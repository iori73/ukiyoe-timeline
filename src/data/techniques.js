/**
 * 浮世絵の8つの技法データ
 * トップページのタイムライン表示用
 * 
 * Figmaデザイン準拠:
 * - タイムラインは左から右への時系列順
 * - 横線: top: 80px（タイムラインコンテナ225px内）
 * - マイルストーン（円）: 横線上（top: 72px）
 * - ラベル: 縦書き、横線の下に配置
 * - 色サンプル: 横線の上部（top: 0〜56px領域）
 */

export const TECHNIQUES = [
  {
    id: 'sumizuri',
    name_ja: '黒摺絵',
    name_en: 'Sumizuri-e',
    major: true,
    colors: ['#2d2d2d'],
    milestoneLeft: 6,
    labelLeft: 15,
    labelTop: 187     // 横線80px + 107px = 187px
  },
  {
    id: 'tan',
    name_ja: '丹絵',
    name_en: 'Tan-e',
    major: false,
    colors: [],
    milestoneLeft: 108,
    labelLeft: 116,
    labelTop: 144     // 横線から約60px下（80 + 64 = 144）
  },
  {
    id: 'beni',
    name_ja: '紅絵',
    name_en: 'Beni-e',
    major: false,
    colors: [],
    milestoneLeft: 216,
    labelLeft: 224,
    labelTop: 144
  },
  {
    id: 'urushi',
    name_ja: '漆絵',
    name_en: 'Urushi-e',
    major: false,
    colors: [],
    milestoneLeft: 324,
    labelLeft: 332,
    labelTop: 144
  },
  {
    id: 'benizuri',
    name_ja: '紅摺絵',
    name_en: 'Benizuri-e',
    major: true,
    colors: ['#7A8B5A', '#B85B5B'],
    milestoneLeft: 438,
    labelLeft: 447,
    labelTop: 187
  },
  {
    id: 'nishiki',
    name_ja: '錦絵',
    name_en: 'Nishiki-e',
    major: true,
    colors: ['#3D5A73', '#C9A84C', '#d64e4e', '#9fc09f'],
    milestoneLeft: 546,
    labelLeft: 555,
    labelTop: 170     // 横線から90px下（80 + 90 = 170）
  },
  {
    id: 'kira',
    name_ja: '雲母摺',
    name_en: 'Kira-zuri',
    major: false,
    colors: [],
    milestoneLeft: 648,
    labelLeft: 656,
    labelTop: 158     // 横線から約80px下
  },
  {
    id: 'shomen',
    name_ja: '正面摺',
    name_en: 'Shōmen-zuri',
    major: false,
    colors: [],
    milestoneLeft: 756,
    labelLeft: 764,
    labelTop: 158
  }
]
