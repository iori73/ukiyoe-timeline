import { useState, useEffect, useRef } from 'react'
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
 * - isAutoAnimating: whether auto-animation is playing (for mobile auto-scroll)
 */
export default function LayeredImages({ 
  periodId, 
  imageCount = 1, 
  isSingleImage = false,
  isFirstVisit = false,
  isActive = false,
  isPast = false,
  isAutoAnimating = false,
  periodDuration = 3333,
  syncElapsedTime = 0,
}) {
  const containerRef = useRef(null)
  // Track if slide-in animation has been triggered
  const [hasAnimated, setHasAnimated] = useState(!isFirstVisit)
  
  // Track animation state
  const animationStartTimeRef = useRef(0)
  const startElapsedRef = useRef(0)
  const isSnappingRef = useRef(false)
  
  // Use refs to avoid stale closure issues in requestAnimationFrame
  const isActiveRef = useRef(isActive)
  const isAutoAnimatingRef = useRef(isAutoAnimating)
  
  // Keep refs in sync with props
  useEffect(() => {
    isActiveRef.current = isActive
  }, [isActive])
  
  useEffect(() => {
    isAutoAnimatingRef.current = isAutoAnimating
  }, [isAutoAnimating])
  
  /**
   * Calculate scroll progress (0-1) from elapsed time
   * Timeline: 800ms waiting → scroll → 800ms waiting
   * Uses absolute time (800ms) instead of percentage to match DawnPage's periodDuration calculation
   */
  const VIEW_TIME = 800 // Fixed viewing time at start/end (ms)
  
  const calculateScrollProgress = (elapsed, duration) => {
    if (duration <= 0) return 0
    if (elapsed <= VIEW_TIME) return 0                    // Start waiting phase (800ms)
    if (elapsed >= duration - VIEW_TIME) return 1         // End waiting phase (last 800ms)
    
    const scrollTime = duration - (VIEW_TIME * 2)         // Actual scroll time
    const scrollElapsed = elapsed - VIEW_TIME
    return Math.min(scrollElapsed / scrollTime, 1)        // Linear scroll
  }
  
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

  // Auto-scroll horizontally on mobile when this period is active
  // Duration synced with gallery indicator fill animation
  useEffect(() => {
    if (!isActive || !isAutoAnimating || isSingleImage) return
    
    const container = containerRef.current
    if (!container) return
    
    // Check if there's horizontal overflow
    const hasOverflow = container.scrollWidth > container.clientWidth
    if (!hasOverflow) return
    
    // Calculate scroll distance
    const scrollDistance = container.scrollWidth - container.clientWidth
    if (scrollDistance <= 0) return
    
    // Main scroll animation - uses elapsed time for constant speed
    const startMainAnimation = () => {
      const animate = () => {
        // Skip if paused or snapping
        if (!isActiveRef.current || !isAutoAnimatingRef.current || isSnappingRef.current) {
          return
        }
        
        // Calculate total elapsed time
        const now = Date.now()
        const animationElapsed = now - animationStartTimeRef.current
        const totalElapsed = startElapsedRef.current + animationElapsed
        
        // Calculate scroll progress from elapsed time
        const scrollProgress = calculateScrollProgress(totalElapsed, periodDuration)
        
        // Set scroll position
        container.scrollLeft = scrollDistance * scrollProgress
        
        // Continue animation if not complete
        if (scrollProgress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }
    
    // Determine if this is a fresh start or resume
    const isResume = syncElapsedTime > 0
    
    // For fresh start, reset everything
    if (!isResume) {
      container.scrollLeft = 0
      startElapsedRef.current = 0
      animationStartTimeRef.current = Date.now()
    } else {
      // Resume: sync to the indicator's elapsed time
      startElapsedRef.current = syncElapsedTime
      animationStartTimeRef.current = Date.now()
      
      // Calculate expected scroll position based on elapsed time
      const expectedProgress = calculateScrollProgress(syncElapsedTime, periodDuration)
      const expectedScrollLeft = scrollDistance * expectedProgress
      const currentScrollLeft = container.scrollLeft
      
      // If positions differ significantly, snap to expected position
      const positionDiff = Math.abs(expectedScrollLeft - currentScrollLeft)
      if (positionDiff > 5) {
        // Snap animation: smoothly move to expected position
        isSnappingRef.current = true
        const snapStartTime = Date.now()
        const snapDuration = 300 // ms
        const snapStartPos = currentScrollLeft
        const snapEndPos = expectedScrollLeft
        
        const animateSnap = () => {
          const snapElapsed = Date.now() - snapStartTime
          const snapProgress = Math.min(snapElapsed / snapDuration, 1)
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - snapProgress, 3)
          container.scrollLeft = snapStartPos + (snapEndPos - snapStartPos) * eased
          
          if (snapProgress < 1 && isAutoAnimatingRef.current) {
            requestAnimationFrame(animateSnap)
          } else {
            // Snap complete, update start time and start main animation
            isSnappingRef.current = false
            animationStartTimeRef.current = Date.now()
            startElapsedRef.current = syncElapsedTime + snapDuration
            // Start main animation after snap
            startMainAnimation()
          }
        }
        
        requestAnimationFrame(animateSnap)
        return // Don't start main animation yet, it will be triggered after snap
      }
    }
    
    // Start animation (with small delay for fresh start to show first card)
    const delay = isResume ? 0 : 50
    const animationTimeout = setTimeout(() => {
      if (!isSnappingRef.current) {
        startMainAnimation()
      }
    }, delay)
    
    return () => {
      clearTimeout(animationTimeout)
    }
  }, [isActive, isAutoAnimating, isSingleImage, periodDuration, syncElapsedTime, calculateScrollProgress])
  
  // Reset when period changes
  useEffect(() => {
    if (isActive) {
      // Fresh start for new active period
      startElapsedRef.current = 0
      animationStartTimeRef.current = Date.now()
      isSnappingRef.current = false
      if (containerRef.current) {
        containerRef.current.scrollLeft = 0
      }
    }
  }, [periodId])

  // Generate image paths based on period
  // Layer 1: root images (sumizuri-e.png, benizuri-e.png, nishiki-e.png)
  // Layer 2+: /images/dawn/{periodId}/layers/{periodId}-e-{n}.png
  const getImagePath = (periodId, layerIndex) => {
    if (layerIndex === 0) {
      // Layer 1: Use root public images
      return `/${periodId}-e.png`
    }
    // Layer 2+: Use layers folder images
    return `/images/dawn/${periodId}-e/layers/${periodId}-e-${layerIndex + 1}.png`
  }

  const images = Array.from({ length: imageCount }, (_, i) => ({
    index: i,
    path: isSingleImage 
      ? `/${periodId}-e.png`  // sumizuri uses root image
      : getImagePath(periodId, i),
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
    <div 
      ref={containerRef}
      className={`layered-images ${!hasAnimated && isFirstVisit && !isSingleImage ? 'layered-images--stacked' : ''}`}
    >
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

