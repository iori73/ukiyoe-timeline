import LayeredImages from './LayeredImages'
import './PeriodSlide.css'

/**
 * PeriodSlide - A full-viewport slide for one historical period
 * Content is vertically centered within the viewport
 */
export default function PeriodSlide({ 
  period, 
  isActive, 
  isPast,
  isFirstVisit,
  isComplete,
  isAutoAnimating = false,
  periodDuration = 3333,
  syncElapsedTime = 0,
}) {
  // For sumizuri-e, show single image; for others, show layered images
  const isSingleImage = period.id === 'sumizuri'

  // Content visibility based on scroll position
  // Fade in as the slide comes into view
  const contentOpacity = isActive || isPast || isComplete ? 1 : 0
  const contentTransform = isActive || isPast || isComplete 
    ? 'translateY(0)' 
    : 'translateY(30px)'

  return (
    <div className={`period-slide period-slide--${period.id}`}>
      <div className="period-slide__viewport">
        <div 
          className="period-slide__content"
          style={{
            opacity: contentOpacity,
            transform: contentTransform,
            transition: 'opacity 1s ease-out, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Images */}
          <div className="period-slide__images">
            <LayeredImages 
              periodId={period.id}
              imageCount={period.imageCount}
              isSingleImage={isSingleImage}
              isFirstVisit={isFirstVisit}
              isActive={isActive}
              isPast={isPast}
              isAutoAnimating={isAutoAnimating}
              periodDuration={periodDuration}
              syncElapsedTime={syncElapsedTime}
            />
          </div>
          
          {/* Text */}
          <div className="period-slide__text">
            <div className="period-slide__header">
              <h2 
                className="period-slide__title"
                style={{ color: period.titleColor }}
              >
                {period.name}
              </h2>
              <div className="period-slide__years">
                <span className="period-slide__years-main">{period.years}</span>
                {period.yearsNote && (
                  <span className="period-slide__years-note">{period.yearsNote}</span>
                )}
              </div>
              {/* カラーパレット */}
              {period.palette && period.palette.length > 0 && (
                <div className="period-slide__palette">
                  {period.palette.map((color, index) => (
                    <span 
                      key={index}
                      className="period-slide__palette-dot"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              )}
            </div>
            <p className="period-slide__description">
              {period.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

