import { useRef, useEffect, useState, useCallback } from 'react'
import { useSpring } from 'framer-motion'

/**
 * HorizontalScroll Component
 * 
 * Hijacks vertical scroll (mouse wheel) and converts it to horizontal section navigation
 * Implements smooth section-based snapping - one wheel gesture = one section transition
 */
export default function HorizontalScroll({ children, onSectionChange, totalSections }) {
  const containerRef = useRef(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const isTransitioning = useRef(false)
  const accumulatedDelta = useRef(0)
  const scrollCooldownRef = useRef(null)
  const lastScrollTime = useRef(0)
  
  // Smooth spring animation for scroll progress
  const scrollProgress = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Smooth scroll to a specific section
  const scrollToSection = useCallback((sectionIndex, updateState = true) => {
    if (!containerRef.current) return
    if (sectionIndex < 0 || sectionIndex >= totalSections) return

    const container = containerRef.current
    const sectionWidth = container.clientWidth
    const targetScroll = sectionIndex * sectionWidth

    isTransitioning.current = true
    setIsScrolling(true)

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })

    if (updateState && sectionIndex !== currentSection) {
      setCurrentSection(sectionIndex)
      onSectionChange?.(sectionIndex)
    }

    // Update scroll progress
    const maxScroll = container.scrollWidth - container.clientWidth
    const progress = maxScroll > 0 ? targetScroll / maxScroll : 0
    scrollProgress.set(progress)

    // Reset transitioning flag after animation completes
    setTimeout(() => {
      isTransitioning.current = false
      setIsScrolling(false)
      accumulatedDelta.current = 0
      lastScrollTime.current = Date.now()
    }, 800) // 少し長めのクールダウン
  }, [currentSection, totalSections, onSectionChange, scrollProgress])

  // Handle wheel event - convert horizontal scroll to section navigation
  // Allow vertical scroll in scrollable panels
  const handleWheel = useCallback((e) => {
    // Check if scrolling over image panel - completely ignore scroll events on images
    const imagePanel = e.target.closest('.image-panel')
    if (imagePanel) {
      // Ignore all scroll events on image panel to prevent any shifting
      e.preventDefault()
      return
    }
    
    // Check if scrolling within a scrollable area (text-panel or intro-section)
    const scrollablePanel = e.target.closest('.text-panel, .intro-section-ukiyoe')
    
    if (scrollablePanel) {
      const { scrollTop, scrollHeight, clientHeight } = scrollablePanel
      const isAtTop = scrollTop <= 1
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
      
      // Determine scroll direction - prioritize vertical scroll
      const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX)
      
      if (isVerticalScroll) {
        // Vertical scroll detected
        if ((e.deltaY < 0 && !isAtTop) || (e.deltaY > 0 && !isAtBottom)) {
          // Allow vertical scrolling within the panel
          return
        }
        // If at boundary, fall through to potential horizontal navigation
        // But require significant horizontal component to navigate
        if (Math.abs(e.deltaX) < 30) {
          return // Not enough horizontal movement
        }
      }
    }

    // Only process horizontal scrolling for navigation
    const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY)
    
    // If it's primarily vertical scroll and not in a scrollable area, ignore it
    if (!isHorizontalScroll && Math.abs(e.deltaX) < 30) {
      return
    }

    e.preventDefault()

    // Don't allow new scroll during transition or cooldown
    if (isTransitioning.current) return
    
    // Check cooldown period - prevent multiple triggers
    const now = Date.now()
    const timeSinceLastScroll = now - lastScrollTime.current
    if (timeSinceLastScroll < 800) {
      return // Still in cooldown period
    }

    // Use horizontal delta for navigation
    const delta = e.deltaX || e.deltaY
    
    // Check if we're at a boundary and trying to scroll beyond it
    const direction = delta > 0 ? 1 : -1
    const wouldTargetSection = currentSection + direction
    
    // If at boundary and trying to scroll beyond, ignore this event completely
    if (wouldTargetSection < 0 || wouldTargetSection >= totalSections) {
      // Reset accumulated delta to prevent any lingering accumulation
      accumulatedDelta.current = 0
      // Clear any pending cooldown timeout
      if (scrollCooldownRef.current) {
        clearTimeout(scrollCooldownRef.current)
        scrollCooldownRef.current = null
      }
      return
    }
    
    // Accumulate delta for trackpad gestures (small incremental deltas)
    accumulatedDelta.current += delta
    
    // Threshold for triggering section change
    // Higher threshold for more intentional navigation
    const threshold = 80
    
    // Clear any existing cooldown
    if (scrollCooldownRef.current) {
      clearTimeout(scrollCooldownRef.current)
    }

    // If accumulated delta exceeds threshold, trigger navigation (ONLY ONCE)
    if (Math.abs(accumulatedDelta.current) >= threshold) {
      const direction = accumulatedDelta.current > 0 ? 1 : -1
      const targetSection = currentSection + direction

      if (targetSection >= 0 && targetSection < totalSections) {
        // Immediately reset to prevent multiple triggers
        accumulatedDelta.current = 0
        lastScrollTime.current = now
        
        // Trigger navigation
        scrollToSection(targetSection)
      } else {
        // At boundary, reset accumulated delta and clear cooldown
        accumulatedDelta.current = 0
        if (scrollCooldownRef.current) {
          clearTimeout(scrollCooldownRef.current)
          scrollCooldownRef.current = null
        }
      }
    } else {
      // Reset accumulated delta after a short pause (for separate scroll gestures)
      scrollCooldownRef.current = setTimeout(() => {
        accumulatedDelta.current = 0
      }, 250)
    }
  }, [currentSection, totalSections, scrollToSection])

  // Handle native scroll event (for programmatic scrolls and touch)
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isTransitioning.current) {
      return
    }

    const container = containerRef.current
    const scrollLeft = container.scrollLeft
    const sectionWidth = container.clientWidth
    const newSection = Math.round(scrollLeft / sectionWidth)

    if (newSection !== currentSection && newSection >= 0 && newSection < totalSections) {
      // Only allow one section change at a time
      const sectionDiff = Math.abs(newSection - currentSection)
      
      // If trying to skip multiple sections, force to adjacent section
      if (sectionDiff > 1) {
        const direction = newSection > currentSection ? 1 : -1
        const adjacentSection = currentSection + direction
        
        // Directly scroll to adjacent section without calling scrollToSection
        const targetScroll = adjacentSection * sectionWidth
        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        })
        
        setCurrentSection(adjacentSection)
        onSectionChange?.(adjacentSection)
        return
      }
      
      setCurrentSection(newSection)
      onSectionChange?.(newSection)
    }
  }, [currentSection, totalSections, onSectionChange])

  // Setup wheel event listener - Listen on window for scroll handling
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    
    // Add wheel event listener for all sections to handle smart scrolling
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      container.removeEventListener('scroll', handleScroll)
      if (scrollCooldownRef.current) {
        clearTimeout(scrollCooldownRef.current)
      }
    }
  }, [handleWheel, handleScroll])

  // Control body scroll - disable for horizontal scroll experience
  useEffect(() => {
    // Disable body scroll to prevent conflicts
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  // Keyboard navigation - only horizontal arrows for section navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't navigate if transitioning
      if (isTransitioning.current) return
      
      // Check cooldown period
      const now = Date.now()
      const timeSinceLastScroll = now - lastScrollTime.current
      if (timeSinceLastScroll < 800) {
        return // Still in cooldown
      }

      // Only handle horizontal arrow keys for navigation
      // Let vertical arrows work for scrolling within panels
      if (e.key === 'ArrowRight') {
        if (currentSection < totalSections - 1) {
          e.preventDefault()
          lastScrollTime.current = now
          scrollToSection(currentSection + 1)
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentSection > 0) {
          e.preventDefault()
          lastScrollTime.current = now
          scrollToSection(currentSection - 1)
        }
      } else if (e.key === 'Home') {
        e.preventDefault()
        lastScrollTime.current = now
        scrollToSection(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        lastScrollTime.current = now
        scrollToSection(totalSections - 1)
      }
      // Remove PageDown, PageUp, Space, ArrowUp, ArrowDown to allow vertical scrolling
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSection, totalSections, scrollToSection])

  // Touch support for mobile
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let touchStartX = 0
    let touchStartY = 0
    let isSwiping = false
    let touchTarget = null

    const handleTouchStart = (e) => {
      // Check if touch started on image panel - ignore if so
      const imagePanel = e.target.closest('.image-panel')
      if (imagePanel) {
        isSwiping = false
        touchTarget = null
        return
      }
      
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
      touchTarget = e.target
      isSwiping = true
    }

    const handleTouchMove = (e) => {
      // Check if touch is on image panel - prevent scroll
      const imagePanel = e.target.closest('.image-panel')
      if (imagePanel) {
        if (e.cancelable) e.preventDefault()
        return
      }

      if (!isSwiping) return

      const touchCurrentX = e.touches[0].clientX
      const touchCurrentY = e.touches[0].clientY
      const deltaX = touchStartX - touchCurrentX
      const deltaY = touchStartY - touchCurrentY

      // Check if touch started in a scrollable panel
      const scrollablePanel = touchTarget?.closest('.text-panel, .intro-section-ukiyoe')
      
      if (scrollablePanel) {
        const { scrollTop, scrollHeight, clientHeight } = scrollablePanel
        const isAtTop = scrollTop <= 1
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
        
        // If vertical swipe is more significant and panel can scroll
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          // Allow vertical scroll within panel
          if ((deltaY < 0 && !isAtTop) || (deltaY > 0 && !isAtBottom)) {
            return // Let native scroll happen
          }
        }
      }

      // If horizontal swipe is more significant than vertical, prevent default
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e) => {
      if (!isSwiping) return
      
      // Check if still in cooldown period
      const now = Date.now()
      const timeSinceLastScroll = now - lastScrollTime.current
      if (timeSinceLastScroll < 800) {
        isSwiping = false
        touchTarget = null
        return // Still in cooldown, ignore this swipe
      }

      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const deltaX = touchStartX - touchEndX
      const deltaY = touchStartY - touchEndY
      const threshold = 50 // minimum swipe distance

      // Only navigate if horizontal swipe is dominant
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) * 1.5

      if (isHorizontalSwipe && Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && currentSection < totalSections - 1) {
          // Swipe left - go to next section
          lastScrollTime.current = now
          scrollToSection(currentSection + 1)
        } else if (deltaX < 0 && currentSection > 0) {
          // Swipe right - go to previous section
          lastScrollTime.current = now
          scrollToSection(currentSection - 1)
        }
      }

      isSwiping = false
      touchTarget = null
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentSection, totalSections, scrollToSection])

  // Resize handler for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Recalculate section positions on resize
      if (containerRef.current) {
        const sectionWidth = window.innerWidth
        containerRef.current.scrollLeft = currentSection * sectionWidth
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentSection])

  return (
    <div 
      ref={containerRef}
      className="horizontal-scroll-container"
      data-scrolling={isScrolling}
      data-current-section={currentSection}
    >
      {children}
    </div>
  )
}

