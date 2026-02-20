/**
 * 時代別色彩の使用割合
 *
 * 各時代における色の使用割合を、横並びの比例バーで表現。
 * バーの幅 = その色の使用割合（面積比の推定値）
 *
 * デザイン根拠:
 *   - 時代ごとに「どの色が主役か」を視覚的に把握
 *   - 墨摺絵時代（墨が支配的）→ 錦絵時代（多色化）の変遷が見える
 */

import { CANONICAL_SLOTS, PERIOD_COLOR_PROPORTIONS } from '../../data/periodColors'
import { useLanguage } from '../../context/LanguageContext'
import './PeriodColorViz.css'

/**
 * 単一時代の比例バー
 */
function PeriodProportionBar({ periodData, language }) {
  const { year_start, proportions } = periodData

  // 使用されている色のみフィルタリング（proportion > 0）
  const usedColors = CANONICAL_SLOTS.filter((slot) => proportions[slot.id] > 0)

  // 合計が1.0になっているか確認（デバッグ用）
  const total = Object.values(proportions).reduce((sum, val) => sum + val, 0)
  if (Math.abs(total - 1.0) > 0.01) {
    console.warn(`Period ${year_start}: proportions sum to ${total.toFixed(2)}, expected 1.0`)
  }

  return (
    <div className="period-color-viz__period-row">
      {/* 時代ラベル */}
      <div className="period-color-viz__period-label">
        <span className="period-color-viz__year">{year_start}</span>
      </div>

      {/* 比例バー */}
      <div
        className="period-color-viz__proportion-bar"
        role="img"
        aria-label={`${year_start}: ${usedColors.map((s) => `${language === 'ja' ? s.label_ja : s.label_en} ${Math.round(proportions[s.id] * 100)}%`).join(', ')}`}
      >
        {usedColors.map((slot) => {
          const proportion = proportions[slot.id]
          const widthPercent = proportion * 100

          return (
            <div
              key={slot.id}
              className="period-color-viz__color-segment"
              style={{
                width: `${widthPercent}%`,
                backgroundColor: slot.hex,
              }}
              title={`${language === 'ja' ? slot.label_ja : slot.label_en}: ${Math.round(widthPercent)}%`}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function PeriodColorViz() {
  const { language } = useLanguage()

  return (
    <section className="period-color-viz" aria-labelledby="period-color-viz-title">
      <header className="period-color-viz__header">
        <h2 id="period-color-viz-title" className="period-color-viz__title">
          {language === 'ja' ? '時代別の色彩使用割合' : 'Color Usage by Period'}
        </h2>
        <p className="period-color-viz__subtitle">
          {language === 'ja'
            ? '各時代で最も使われている色を面積比で表現'
            : 'Color proportions in each period by area'}
        </p>
      </header>

      <div className="period-color-viz__bars">
        {PERIOD_COLOR_PROPORTIONS.map((periodData) => (
          <PeriodProportionBar
            key={periodData.year_start}
            periodData={periodData}
            language={language}
          />
        ))}
      </div>
    </section>
  )
}
