/**
 * 浮世絵9時代の色彩データ — 正規スロット方式
 *
 * 設計思想（データ可視化）:
 *   CANONICAL_SLOTS: 固定された9つの色カテゴリを「常に同じ順・同じ位置」で並べる
 *   PERIOD_COLORS:   各時代が「どのスロットを使うか」だけを宣言する
 *
 *   表示ルール:
 *     activeSlots に含まれる  → 塗りつぶし（使用中）
 *     activeSlots に含まれない → ゴースト（薄く表示、位置を保持）
 *
 *   読み取り方:
 *     左から右へ「墨（黒）から始まり、後の時代ほど色が増えていく」流れが視覚化される
 *     黒は常にSlot1（左端）に固定 → 「墨摺絵から始まった技術の積み重ね」を体現する
 *
 * スロット順の設計根拠:
 *   暗色（印刷の基本）→ 暖色（紅・金）→ 寒色（緑・青・藍・ベロ藍）→ 中性（銀灰・肌）
 *   歴史的な初登場順とも概ね一致する
 */

/**
 * 正規色スロット（全時代共通の固定パレット）
 * 並び順: 墨 → 紅 → 金/茶 → 緑 → 青灰 → 藍 → ベロ藍 → 銀灰 → 肌/紙
 */
export const CANONICAL_SLOTS = [
  { id: 'sumi',   label_ja: '墨',     label_en: 'Ink Black',     hex: '#1a1a1a' },
  { id: 'beni',   label_ja: '紅',     label_en: 'Crimson',       hex: '#c04545' },
  { id: 'kin',    label_ja: '金/茶',  label_en: 'Gold / Ochre',  hex: '#c9a050' },
  { id: 'midori', label_ja: '緑',     label_en: 'Green',         hex: '#7a9060' },
  { id: 'ao',     label_ja: '青灰',   label_en: 'Blue-gray',     hex: '#607888' },
  { id: 'ai',     label_ja: '藍',     label_en: 'Indigo',        hex: '#2a3848' },
  { id: 'bero',   label_ja: 'ベロ藍', label_en: 'Prussian Blue', hex: '#2d4f6e' },
  { id: 'gin',    label_ja: '銀灰',   label_en: 'Mica Gray',     hex: '#b8b0a4' },
  { id: 'hada',   label_ja: '肌/紙',  label_en: 'Warm Paper',    hex: '#d9c5b8' },
]

/**
 * 各時代の色彩データ
 *
 * activeSlots: その時代の作品で実際に使われた色スロットのID配列
 *   - 「初登場」の色は、それ以前の時代ではゴースト表示になることで新登場が見える
 *   - 時代ごとに増えていくスロット数が「色彩の豊かさ」を示す
 *
 * 初登場まとめ:
 *   1670: sumi, beni, kin, hada（基本4色）
 *   1700: sumi, kin, hada      （役者絵は墨主体、beniは後退）
 *   1720: sumi, beni, kin, hada（漆・紅で原点回帰）
 *   1740: sumi, beni, midori ← 緑が初登場（紅摺絵の2色が定義する時代）
 *   1750: sumi, beni, kin, midori, ao ← 青灰が初登場（4-5色化）
 *   1765: sumi, beni, kin, midori, ao（錦絵確立、スロット数維持・精度向上）
 *   1770: sumi, beni, kin, midori, ao, ai ← 藍が初登場（大判化）
 *   1790: sumi, beni, ao, ai, gin ← 銀灰（雲母摺）が初登場（歌麿・写楽）
 *   1800: sumi, beni, midori, ai, bero ← ベロ藍が初登場（北斎・広重）
 */
export const PERIOD_COLORS = [
  {
    year_start: 1670,
    label_ja: '墨摺絵・肉筆の時代',
    label_en: 'Sumizuri-e and Hand-painted',
    activeSlots: ['sumi', 'beni', 'kin', 'hada'],
    technique_ja: '墨一色の木版画 + 肉筆手彩色',
    technique_en: 'Monochrome woodblock + hand-painted'
  },
  {
    year_start: 1700,
    label_ja: '役者絵・手彩色',
    label_en: 'Actor Prints, Hand-coloring',
    // 役者絵は墨線が主体。丹・黄土系の手彩色が中心でbeniは薄い
    activeSlots: ['sumi', 'kin', 'hada'],
    technique_ja: '墨摺絵に丹・黄土の手彩色',
    technique_en: 'Sumizuri with tan/ochre hand-coloring'
  },
  {
    year_start: 1720,
    label_ja: '漆絵・紅絵',
    label_en: 'Urushi-e and Beni-e',
    // 漆の艶黒(sumi)、紅花の深紅(beni)、金泥(kin)が技法の核
    activeSlots: ['sumi', 'beni', 'kin', 'hada'],
    technique_ja: '漆の艶黒 + 紅花の深紅 + 金泥',
    technique_en: 'Lacquer black, safflower crimson, gold pigment'
  },
  {
    year_start: 1740,
    label_ja: '紅摺絵の隆盛',
    label_en: 'Rise of Benizuri-e',
    // この時代を定義する2色: 紅(beni) + 緑(midori)。金は使われない
    activeSlots: ['sumi', 'beni', 'midori', 'hada'],
    technique_ja: '紅（beni）+ 緑の2〜3色版木、金なし',
    technique_en: 'Beni + green 2–3 block printing (no gold)'
  },
  {
    year_start: 1750,
    label_ja: '紅摺絵の技術向上',
    label_en: 'Benizuri-e Refinement',
    // 4-5色化: 金・青灰が追加される
    activeSlots: ['sumi', 'beni', 'kin', 'midori', 'ao', 'hada'],
    technique_ja: '4〜5色、ぼかし（bokashi）の導入、青灰が初登場',
    technique_en: '4–5 colors, bokashi introduced, blue-gray added'
  },
  {
    year_start: 1765,
    label_ja: '錦絵の成立（春信）',
    label_en: 'Birth of Nishiki-e (Harunobu)',
    // 10色以上だが主要スロットは1750と同じ。精度と色数が向上
    activeSlots: ['sumi', 'beni', 'kin', 'midori', 'ao', 'hada'],
    technique_ja: '10色以上の多色版木、ぼかし・空摺り',
    technique_en: '10+ color polychrome, bokashi & blind emboss'
  },
  {
    year_start: 1770,
    label_ja: '大判錦絵・清長・春章',
    label_en: 'Large-format Nishiki-e',
    // 藍(ai)・紺色が初登場（清長の群青・春章の深い藍）
    activeSlots: ['sumi', 'beni', 'kin', 'midori', 'ao', 'ai', 'hada'],
    technique_ja: '大判（39×26cm）、藍色が初登場',
    technique_en: 'Oban format, indigo blue added'
  },
  {
    year_start: 1790,
    label_ja: '歌麿・写楽の時代',
    label_en: 'Utamaro and Sharaku',
    // 銀灰(gin)=雲母摺りが初登場。金(kin)・緑(midori)は後退し肌表現に特化
    activeSlots: ['sumi', 'beni', 'ao', 'ai', 'gin', 'hada'],
    technique_ja: '雲母摺（mica）が初登場、肌の繊細表現',
    technique_en: 'Mica printing (kirazuri) added, delicate skin'
  },
  {
    year_start: 1800,
    label_ja: '北斎・広重の風景画',
    label_en: 'Hokusai and Hiroshige Landscapes',
    // ベロ藍(bero)=プルシアンブルーが初登場。この時代の最大の革新
    activeSlots: ['sumi', 'beni', 'midori', 'ai', 'bero', 'hada'],
    technique_ja: 'ベロ藍（プルシアンブルー）が初登場',
    technique_en: 'Prussian blue (bero-ai) introduced'
  }
]

/**
 * 各スロットが何時代で使われているかの集計（全9時代中の使用数）
 *
 * 使い方:
 *   SLOT_FREQUENCIES['sumi']  → 9  （全時代で使用 → 基盤色）
 *   SLOT_FREQUENCIES['bero']  → 1  （ベロ藍は1800年代のみ → 革新色）
 *
 * データ可視化用: スウォッチの「頻度バー」幅の計算に使用
 */
export const SLOT_FREQUENCIES = CANONICAL_SLOTS.reduce((acc, slot) => {
  acc[slot.id] = PERIOD_COLORS.filter((p) => p.activeSlots.includes(slot.id)).length
  return acc
}, {})

/**
 * 各時代における色の使用割合（面積比の推定値）
 *
 * ⚠️ 重要: これらの数値は推定値であり、以下の根拠に基づく
 *
 * データソース:
 *   1. PERIOD_COLORS の技法説明文（「墨一色」「紅摺絵」「ベロ藍が初登場」など）
 *   2. 浮世絵技法に関する一般的知識
 *   3. 論理的推論（例: 墨摺絵時代 = 墨版が主体 → 墨の割合を高く設定）
 *
 * NOT based on（根拠としていないもの）:
 *   ❌ 実際の作品画像の色面積測定
 *   ❌ 美術史論文の精密な統計データ
 *   ❌ 専門家による検証済みの数値
 *
 * 推定ロジック:
 *   - 墨摺絵（1670-1700）: 墨版が土台 → 墨 50-60%
 *   - 紅摺絵（1740）: 紅・緑が技法の核 → 紅 30%, 緑 20%
 *   - 錦絵（1765-）: 多色版木 → 色が均等化（各色 12-18%）
 *   - ベロ藍革命（1800）: 風景画の空・海 → ベロ藍 29%（時代の主役）
 *
 * 精度レベル:
 *   - 方向性: ✅ 正しい（技法的特徴と一致）
 *   - 数値: ⚠️ ±10%程度の誤差想定
 *   - 用途: データ可視化での**傾向把握**（学術的厳密性は保証しない）
 *
 * 改善方法:
 *   1. 画像解析: scripts/extract_colors_*.py で実測
 *   2. 美術史文献: 専門書からの引用
 *   3. 手動調整: 視覚的バランスを見て微調整
 */
export const PERIOD_COLOR_PROPORTIONS = [
  {
    year_start: 1670,
    // 墨摺絵・肉筆: 墨一色の木版画 + 肉筆手彩色
    // 墨版が主体、紅・金は部分的な手彩色
    proportions: {
      sumi: 0.50,   // 墨版が半分を占める
      beni: 0.15,   // 手彩色の紅（衣装の一部）
      kin: 0.10,    // 手彩色の金/丹（装飾）
      hada: 0.25    // 紙の地色（余白・肌）
    }
  },
  {
    year_start: 1700,
    // 役者絵: 墨摺絵に丹・黄土の手彩色
    // 役者絵は墨線が主体、beni は後退
    proportions: {
      sumi: 0.60,   // 墨線がより支配的
      kin: 0.15,    // 丹・黄土の手彩色
      hada: 0.25    // 紙の地色
    }
  },
  {
    year_start: 1720,
    // 漆絵・紅絵: 漆の艶黒 + 紅花の深紅 + 金泥
    // 漆黒・深紅・金泥が技法の核
    proportions: {
      sumi: 0.35,   // 漆の艶黒
      beni: 0.25,   // 紅花の深紅（原点回帰）
      kin: 0.15,    // 金泥
      hada: 0.25    // 紙の地色
    }
  },
  {
    year_start: 1740,
    // 紅摺絵: 紅（beni）+ 緑の2〜3色版木、金なし
    // この時代を定義する2色: 紅 + 緑
    proportions: {
      sumi: 0.30,   // 輪郭線
      beni: 0.30,   // 紅版（この時代の主役）
      midori: 0.20, // 緑版（初登場、補色）
      hada: 0.20    // 紙の地色
    }
  },
  {
    year_start: 1750,
    // 紅摺絵の技術向上: 4〜5色、ぼかし導入、青灰初登場
    // 多色化の始まり、より均等な分布へ
    proportions: {
      sumi: 0.22,   // 輪郭線（割合減少）
      beni: 0.20,   // 紅版
      kin: 0.12,    // 金/茶（復活）
      midori: 0.15, // 緑版
      ao: 0.10,     // 青灰（初登場、控えめ）
      hada: 0.21    // 紙の地色
    }
  },
  {
    year_start: 1765,
    // 錦絵の成立: 10色以上の多色版木、ぼかし・空摺り
    // 多色化の完成、バランスの取れた配色
    proportions: {
      sumi: 0.15,   // 輪郭線程度
      beni: 0.18,   // 紅版
      kin: 0.15,    // 金版
      midori: 0.13, // 緑版
      ao: 0.14,     // 青灰版
      hada: 0.25    // 紙の地色（余白の美）
    }
  },
  {
    year_start: 1770,
    // 大判錦絵: 大判化、藍色初登場
    // 藍が加わり、より豊かな色彩
    proportions: {
      sumi: 0.14,   // 輪郭線
      beni: 0.17,   // 紅版
      kin: 0.13,    // 金版
      midori: 0.12, // 緑版
      ao: 0.12,     // 青灰版
      ai: 0.12,     // 藍版（初登場）
      hada: 0.20    // 紙の地色
    }
  },
  {
    year_start: 1790,
    // 歌麿・写楽: 雲母摺初登場、肌の繊細表現
    // 金・緑が後退、肌色表現に特化
    proportions: {
      sumi: 0.16,   // 輪郭線
      beni: 0.20,   // 紅版（美人画の口紅・衣装）
      ao: 0.13,     // 青灰版（背景）
      ai: 0.12,     // 藍版（衣装）
      gin: 0.08,    // 銀灰/雲母（初登場、光沢効果）
      hada: 0.31    // 肌/紙（美人画の肌表現が主役）
    }
  },
  {
    year_start: 1800,
    // 北斎・広重: ベロ藍（プルシアンブルー）初登場
    // ベロ藍が革命的に使用される（空・海）
    proportions: {
      sumi: 0.15,   // 輪郭線
      beni: 0.15,   // 紅版（富士山など）
      midori: 0.14, // 緑版（風景の緑）
      ai: 0.12,     // 藍版
      bero: 0.29,   // ベロ藍（この時代の主役、空と海）
      hada: 0.15    // 紙の地色
    }
  }
]

/**
 * year_start に対応する時代の色彩データを取得
 */
export function getColorsForPeriod(yearStart) {
  const key = Number(yearStart)
  return PERIOD_COLORS.find((p) => p.year_start === key)
}

/**
 * year_start に対応する時代の色使用割合を取得
 */
export function getProportionsForPeriod(yearStart) {
  const key = Number(yearStart)
  return PERIOD_COLOR_PROPORTIONS.find((p) => p.year_start === key)
}
