import './TimelineGalleryIndicators.css'

/**
 * TimelineGalleryIndicators
 * 
 * /timeline用のギャラリーインジケーター
 * - 9つの時代に対応
 * - Figmaデザインに準拠
 * - クリックで該当時代へスクロール
 * 
 * 状態:
 * - ACTIVE: 長い白い縦棒（100px）、不透明度100%
 * - PAST/FUTURE: 小さい灰色の丸（12px）、アクティブから離れるほど薄くなる
 *   - アクティブから1つ離れた位置: 90%
 *   - アクティブから2つ離れた位置: 80%
 *   - アクティブから3つ離れた位置: 70%... と10%ずつ減少（最小10%）
 */
export default function TimelineGalleryIndicators({ 
  currentSection, 
  totalSections,
  onSectionClick,
  periods = [],
  isGalleryMode = false
}) {
  // 浮世絵作品一覧が表示されているときはインジケーターは不要
  if (isGalleryMode) {
    return null
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
            : 'timeline-gallery-indicator--inactive'
          
          // アクティブからの距離に基づいて不透明度を計算
          let opacity = 1
          if (isPast || isFuture) {
            const distanceFromActive = Math.abs(index - currentSection)
            // 90%, 80%, 70%... と10%ずつ減少（最小10%）
            opacity = Math.max(0.1, 1 - (distanceFromActive * 0.1))
          }
          
          return (
            <button
              key={index}
              className={`timeline-gallery-indicator ${stateClass}`}
              style={!isActive ? { opacity } : undefined}
              onClick={() => onSectionClick?.(index)}
              aria-label={`Go to section ${index + 1}`}
              aria-current={isActive ? 'true' : 'false'}
            />
          )
        })}
      </div>
    </div>
  )
}

