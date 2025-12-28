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
export default function GalleryIndicators({ 
  activePeriod, 
  isComplete, 
  isAutoAnimating, 
  onPlayPauseClick 
}) {
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
                  animationPlayState: isAutoAnimating ? 'running' : 'paused',
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
