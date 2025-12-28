import { PERIOD_ORDER, PERIODS } from './ProgressTimeline'
import './GalleryIndicators.css'

/**
 * GalleryIndicators - Fixed left-side progress indicators
 * 
 * Apple-style behavior with shape morphing:
 * - ACTIVE period: Tall bar with progress fill (top → bottom)
 * - PAST period: Small filled dot
 * - FUTURE period: Small dim dot
 * 
 * Uses a single element that morphs via CSS height transition
 */
export default function GalleryIndicators({ activePeriod, isComplete }) {
  return (
    <div className="gallery-indicators">
      {PERIOD_ORDER.map((periodKey, index) => {
        const period = PERIODS[periodKey]
        const isActive = index === activePeriod && !isComplete
        const isPast = index < activePeriod || isComplete
        const isFuture = index > activePeriod && !isComplete
        
        // Determine CSS class for height morphing
        const stateClass = isActive 
          ? 'gallery-indicator--active' 
          : isPast 
            ? 'gallery-indicator--past' 
            : 'gallery-indicator--future'
        
        return (
          <div 
            key={period.id}
            className={`gallery-indicator ${stateClass}`}
            style={{ backgroundColor: period.bgColor }}
          >
            {/* Fill element - CSS handles animation */}
            <div 
              className="gallery-indicator__fill"
              style={{ 
                backgroundColor: period.color,
                opacity: isFuture ? 0.4 : 1,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
