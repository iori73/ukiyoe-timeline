import { PERIOD_ORDER, PERIODS } from './ProgressTimeline'
import './GalleryIndicatorsManual.css'

/**
 * GalleryIndicatorsManual - Fixed left-side progress indicators (no play button)
 * 
 * Manual scroll version:
 * - ACTIVE period: Tall bar fully filled
 * - PAST period: Small filled dot
 * - FUTURE period: Small dim dot
 * 
 * No auto-animation - user controls scroll
 */
export default function GalleryIndicatorsManual({ 
  activePeriod, 
  isComplete, 
}) {
  return (
    <div className="gallery-controls-manual">
      {/* Progress Indicators - no play button */}
      <div className="gallery-indicators-manual">
        {PERIOD_ORDER.map((periodKey, index) => {
          const period = PERIODS[periodKey]
          const isLast = index === PERIOD_ORDER.length - 1
          const isActive = (index === activePeriod && !isComplete) || (isComplete && isLast)
          const isPast = index < activePeriod || (isComplete && !isLast)
          const isFuture = index > activePeriod && !isComplete
          
          // Determine CSS class for height morphing
          const stateClass = isActive 
            ? 'gallery-indicator-manual--active' 
            : isPast 
              ? 'gallery-indicator-manual--past' 
              : 'gallery-indicator-manual--future'
          
          // Fill height: Active and Past are 100%, Future is 0%
          const fillHeight = isPast || isActive ? 100 : 0
          
          return (
            <div 
              key={period.id}
              className={`gallery-indicator-manual ${stateClass}`}
              style={{ 
                backgroundColor: period.titleColor, // 不透明な色で串を隠す
                opacity: isFuture ? 0.4 : 1,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

