/**
 * 浮世絵の8つの技法データ
 * トップページのタイムライン表示用
 *
 * milestoneLeft / labelLeft は全て中央基準（translateX(-50%) と併用）
 * CSS側の色サンプル left 値も同じ中央座標を使う
 */

const LABEL_TOP = 98

export const TECHNIQUES = [
  {
    id: 'sumizuri',
    name_ja: '墨摺絵',
    name_en: 'Sumizuri-e',
    major: true,
    colors: ['#1a1a1a'],
    milestoneLeft: 14,
    labelLeft: 14,
    labelTop: LABEL_TOP
  },
  {
    id: 'tan',
    name_ja: '丹絵',
    name_en: 'Tan-e',
    major: false,
    colors: [],
    milestoneLeft: 114,
    labelLeft: 114,
    labelTop: LABEL_TOP
  },
  {
    id: 'beni',
    name_ja: '紅絵',
    name_en: 'Beni-e',
    major: false,
    colors: [],
    milestoneLeft: 222,
    labelLeft: 222,
    labelTop: LABEL_TOP
  },
  {
    id: 'urushi',
    name_ja: '漆絵',
    name_en: 'Urushi-e',
    major: false,
    colors: [],
    milestoneLeft: 330,
    labelLeft: 330,
    labelTop: LABEL_TOP
  },
  {
    id: 'benizuri',
    name_ja: '紅摺絵',
    name_en: 'Benizuri-e',
    major: true,
    colors: ['#c04545', '#7a9060'],
    milestoneLeft: 446,
    labelLeft: 446,
    labelTop: LABEL_TOP
  },
  {
    id: 'nishiki',
    name_ja: '錦絵',
    name_en: 'Nishiki-e',
    major: true,
    colors: ['#c9a050', '#607888', '#2a3848', '#2d4f6e', '#b8b0a4', '#d9c5b8'],
    milestoneLeft: 554,
    labelLeft: 554,
    labelTop: LABEL_TOP
  },
  {
    id: 'kira',
    name_ja: '雲母摺',
    name_en: 'Kira-zuri',
    major: false,
    colors: [],
    milestoneLeft: 654,
    labelLeft: 654,
    labelTop: LABEL_TOP
  },
  {
    id: 'shomen',
    name_ja: '正面摺',
    name_en: 'Shōmen-zuri',
    major: false,
    colors: [],
    milestoneLeft: 762,
    labelLeft: 762,
    labelTop: LABEL_TOP
  }
]
