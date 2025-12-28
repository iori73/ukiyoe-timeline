import { useState, useEffect } from 'react'
import './LayeredImages.css'

/**
 * LayeredImages - Displays woodblock printing layer sequence
 * Shows the progression of color layers in ukiyo-e printing process
 * 
 * Props:
 * - periodId: 'sumizuri' | 'benizuri' | 'nishiki'
 * - imageCount: number of layers to display
 * - isFirstVisit: whether to show card slide-in animation
 * - isActive: whether this period is currently active
 * - isPast: whether this period has already been shown
 */
export default function LayeredImages({ 
  periodId, 
  imageCount = 1, 
  isSingleImage = false,
  isFirstVisit = false,
  isActive = false,
  isPast = false,
}) {
  // Track if slide-in animation has been triggered
  const [hasAnimated, setHasAnimated] = useState(!isFirstVisit)
  
  // Trigger animation when period becomes active (only on first visit)
  useEffect(() => {
    if (isFirstVisit && isActive && !hasAnimated && !isSingleImage) {
      // Small delay before starting the card spread animation
      const timeout = setTimeout(() => {
        setHasAnimated(true)
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [isFirstVisit, isActive, hasAnimated, isSingleImage])

  // Generate placeholder image paths
  // Actual images will be placed in public/images/dawn/{periodId}/layer-{n}.png
  const images = Array.from({ length: imageCount }, (_, i) => ({
    index: i,
    path: isSingleImage 
      ? `/images/dawn/${periodId}/main.png`
      : `/images/dawn/${periodId}/layer-${i + 1}.png`,
    // All images have same opacity - no progressive fade needed
    opacity: 1,
  }))

  // Calculate animation styles for card spread effect
  const getCardStyle = (index) => {
    if (isSingleImage || index === 0) {
      // First card or single image - no animation needed
      return {}
    }

    const shouldAnimate = isFirstVisit && !isPast
    const isSpread = hasAnimated || isPast || !isFirstVisit

    if (!shouldAnimate && !isPast) {
      // Not first visit and not past - just show spread
      return {}
    }

    // Card spread animation: cards slide in from left (stacked position)
    // Gap between cards is 224px (200px card + 24px gap)
    const cardOffset = 224 * index
    
    return {
      transform: isSpread ? 'translateX(0)' : `translateX(-${cardOffset}px)`,
      transition: `transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s`,
      zIndex: imageCount - index, // Higher z-index for earlier cards
    }
  }

  return (
    <div className={`layered-images ${!hasAnimated && isFirstVisit && !isSingleImage ? 'layered-images--stacked' : ''}`}>
      {images.map((image) => (
        <div 
          key={image.index}
          className="layered-images__item"
          style={{ 
            opacity: image.opacity,
            ...getCardStyle(image.index),
          }}
        >
          <div className="layered-images__frame">
            {/* Placeholder with gradient background until actual images are added */}
            <div className="layered-images__placeholder">
              <span className="layered-images__placeholder-text">
                Layer {image.index + 1}
              </span>
            </div>
            {/* Actual image (will show when file exists) */}
            <img 
              src={image.path}
              alt={`${periodId} layer ${image.index + 1}`}
              className="layered-images__img"
              onError={(e) => {
                // Hide image on error, show placeholder
                e.target.style.display = 'none'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

