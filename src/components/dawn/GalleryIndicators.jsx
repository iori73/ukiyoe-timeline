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
 * Uses JS-controlled progress for perfect sync with animation timer
 */
export default function GalleryIndicators({ 
  activePeriod, 
  isComplete, 
  isAutoAnimating, 
  onPlayPauseClick,
  periodDuration = 3333, // Animation duration in ms
  elapsedTime = 0, // Current elapsed time in ms (for JS-controlled progress)
}) {
  // Calculate progress percentage (0-100)
  const progress = periodDuration > 0 
    ? Math.min((elapsedTime / periodDuration) * 100, 100) 
    : 0
  return (
    <div className="gallery-controls">
      {/* Play/Pause Button - 2rem above indicators */}
      <button 
        className="gallery-play-button"
        onClick={onPlayPauseClick}
        aria-label={isAutoAnimating ? "一時停止" : "再生"}
      >
        {isAutoAnimating ? (
          // Pause icon - two vertical bars
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 40 40" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle 
              cx="20" 
              cy="20" 
              r="19" 
              stroke="#334E6C" 
              strokeWidth="2" 
              fill="transparent"
            />
            <rect x="14" y="12" width="4" height="16" rx="2" fill="#334E6C" />
            <rect x="22" y="12" width="4" height="16" rx="2" fill="#334E6C" />
          </svg>
        ) : (
          // Play icon - triangle
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 40 40" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle 
              cx="20" 
              cy="20" 
              r="19" 
              stroke="#334E6C" 
              strokeWidth="2" 
              fill="transparent"
            />
            <path 
              d="M16 12L28 20L16 28V12Z" 
              fill="#334E6C"
            />
          </svg>
        )}
      </button>

      {/* Progress Indicators */}
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
          
          // Calculate fill height based on state
          // Active: use JS-controlled progress, Past: 100%, Future: 0%
          const fillHeight = isPast ? 100 : isActive ? progress : 0
          
          return (
            <div 
              key={period.id}
              className={`gallery-indicator ${stateClass}`}
              style={{ backgroundColor: period.bgColor }}
            >
              {/* Fill element - JS controlled height for perfect sync */}
              <div 
                className="gallery-indicator__fill"
                style={{ 
                  backgroundColor: period.color,
                  opacity: isFuture ? 0.4 : 1,
                  height: `${fillHeight}%`,
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
