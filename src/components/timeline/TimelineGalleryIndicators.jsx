import './TimelineGalleryIndicators.css'

/**
 * TimelineGalleryIndicators
 * 
 * /timeline用のインジケーター + ギャラリーアイコン
 * Figmaデザイン準拠（1440w / 390w）
 * 
 * 構造: indicators（dots） + separator + gallery icon
 * 
 * インジケーター状態:
 * - ACTIVE: 白い縦棒（PC: 103px / SP: 72px）
 * - INACTIVE: 16px丸、距離に応じてopacity減衰（90%→10%）
 */
export default function TimelineGalleryIndicators({ 
  currentSection, 
  totalSections,
  onSectionClick,
  onGalleryClick,
  periods = [],
  isGalleryMode = false
}) {
  return (
    <div className={`timeline-gallery-controls${isGalleryMode ? ' timeline-gallery-controls--gallery-mode' : ''}`}>
      <div className="timeline-gallery-indicators">
        <div className="timeline-gallery-controls__dots">
          {Array.from({ length: totalSections }, (_, index) => {
            const isActive = index === currentSection
            const distanceFromActive = Math.abs(index - currentSection)
            const opacity = isActive ? 1 : Math.max(0.1, 1 - (distanceFromActive * 0.1))
            
            return (
              <div
                key={index}
                className={`timeline-gallery-controls__item${isActive ? ' timeline-gallery-controls__item--active' : ''}`}
              >
                {periods[index]?.year_start && (
                  <span className="timeline-gallery-controls__year">
                    {periods[index].year_start}
                  </span>
                )}
                <button
                  className={`timeline-gallery-indicator ${isActive ? 'timeline-gallery-indicator--active' : 'timeline-gallery-indicator--inactive'}`}
                  style={!isActive ? { opacity } : undefined}
                  onClick={() => onSectionClick?.(index)}
                  aria-label={`Go to section ${index + 1}`}
                  aria-current={isActive ? 'true' : 'false'}
                />
              </div>
            )
          })}
        </div>

        <div className="timeline-gallery-controls__separator" aria-hidden="true" />

        <button
          className="timeline-gallery-controls__gallery-btn"
          onClick={onGalleryClick}
          aria-label="Show gallery"
        >
          <span className="timeline-gallery-controls__gallery-cell" />
          <span className="timeline-gallery-controls__gallery-cell" />
          <span className="timeline-gallery-controls__gallery-cell" />
          <span className="timeline-gallery-controls__gallery-cell" />
        </button>
      </div>
    </div>
  )
}

