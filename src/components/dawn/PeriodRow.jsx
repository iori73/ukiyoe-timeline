import { ProgressBar } from './ProgressTimeline'
import LayeredImages from './LayeredImages'
import './PeriodRow.css'

/**
 * PeriodRow - A single row in the timeline showing one era
 * Contains progress bar + content (images + text)
 */
export default function PeriodRow({ 
  period, 
  isActive, 
  progress, 
  isPast,
  index,
  isFirstVisit,
  isComplete,
}) {
  // For sumizuri-e, show single image; for others, show layered images
  const isSingleImage = period.id === 'sumizuri'

  // 紅摺絵 and 錦絵 fade in with progress bar
  // sumizuri (index 0) is always visible
  // benizuri (index 1) and nishiki (index 2) fade in as their progress advances
  // When animation is complete, all content stays visible at full opacity
  const shouldFadeIn = index > 0
  const contentOpacity = isComplete
    ? 1 // Animation complete - all content fully visible
    : shouldFadeIn
      ? isPast 
        ? 1 
        : isActive 
          ? Math.min(progress / 30, 1) // Fade in during first 30% of progress
          : 0
      : 1

  return (
    <div 
      className={`period-row period-row--${period.id} ${shouldFadeIn && !isPast && !isActive && !isComplete ? 'period-row--hidden' : ''}`}
      style={shouldFadeIn && !isComplete ? { 
        opacity: contentOpacity,
        transition: 'opacity 0.8s ease-out',
      } : undefined}
    >
      <div className="period-row__container">
        {/* Progress Bar */}
        <ProgressBar 
          period={period}
          isActive={isActive}
          progress={progress}
          isPast={isPast}
        />
        
        {/* Content */}
        <div className="period-row__content">
          {/* Images */}
          <div className="period-row__images">
            <LayeredImages 
              periodId={period.id}
              imageCount={period.imageCount}
              isSingleImage={isSingleImage}
              isFirstVisit={isFirstVisit}
              isActive={isActive}
              isPast={isPast}
            />
          </div>
          
          {/* Text */}
          <div className="period-row__text">
            <div className="period-row__header">
              <h3 
                className="period-row__title"
                style={{ color: period.titleColor }}
              >
                {period.name}
              </h3>
              <div className="period-row__years">
                <span className="period-row__years-main">{period.years}</span>
                {period.yearsNote && (
                  <span className="period-row__years-note">{period.yearsNote}</span>
                )}
              </div>
            </div>
            <p className="period-row__description">
              {period.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

