import './TimelineGalleryIndicators.css'

/**
 * TimelineGalleryIndicators
 * 
 * /timeline用のギャラリーインジケーター
 * - 9つの時代に対応
 * - GalleryIndicatorsManualスタイルを踏襲
 * - クリックで該当時代へスクロール
 * 
 * 状態:
 * - ACTIVE: 高いバー（100px）、塗りつぶし
 * - PAST: 小さい円（12px）、塗りつぶし
 * - FUTURE: 小さい円（12px）、薄い
 */
export default function TimelineGalleryIndicators({ 
  currentSection, 
  totalSections,
  onSectionClick,
  periods = []
}) {
  // 統一された白っぽい色（背景が暗いため）
  const indicatorColor = {
    color: 'rgba(245, 240, 230, 0.95)',      // washi色（クリーム白）
    bgColor: 'rgba(245, 240, 230, 0.2)'      // 薄い背景
  }

  return (
    <div className="timeline-gallery-controls">
      <div className="timeline-gallery-indicators">
        {Array.from({ length: totalSections }, (_, index) => {
          const isActive = index === currentSection
          const isPast = index < currentSection
          const isFuture = index > currentSection
          
          // 状態クラスを決定
          const stateClass = isActive 
            ? 'timeline-gallery-indicator--active' 
            : isPast 
              ? 'timeline-gallery-indicator--past' 
              : 'timeline-gallery-indicator--future'
          
          // フィル高さ
          const fillHeight = isPast || isActive ? 100 : 0
          
          return (
            <button
              key={index}
              className={`timeline-gallery-indicator ${stateClass}`}
              style={{ backgroundColor: indicatorColor.bgColor }}
              onClick={() => onSectionClick?.(index)}
              aria-label={`Go to section ${index + 1}`}
              aria-current={isActive ? 'true' : 'false'}
            >
              {/* フィル要素 */}
              <div 
                className="timeline-gallery-indicator__fill"
                style={{ 
                  backgroundColor: indicatorColor.color,
                  opacity: isFuture ? 0.4 : 1,
                  height: `${fillHeight}%`,
                }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

