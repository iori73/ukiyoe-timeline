import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PERIOD_ORDER, PERIODS, useFirstVisit } from '../components/dawn/ProgressTimeline'
import PeriodSlide from '../components/dawn/PeriodSlide'
import GalleryIndicatorsManual from '../components/dawn/GalleryIndicatorsManual'
import LanguageToggle from '../components/LanguageToggle'
import { LayeredLogo } from '../components/common/AnimatedLogo'
import './DawnPage.css'

/**
 * DawnManualPage - 錦絵の黎明 (Dawn of Nishiki-e) - Manual Version
 * No auto-animation - user controls scroll with section-by-section navigation
 */
export default function DawnManualPage() {
  const galleryRef = useRef(null)
  const slideRefs = useRef([])
  const titleRef = useRef(null)
  const endRef = useRef(null)
  const isFirstVisit = useFirstVisit()
  
  // Current state
  const [activePeriod, setActivePeriod] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  
  // Scroll control refs
  const isTransitioning = useRef(false)
  const lastScrollTime = useRef(0)
  const accumulatedDelta = useRef(0)
  const cooldownTimeout = useRef(null)
  
  // Sections: 0=墨摺絵(+title), 1=紅摺絵, 2=錦絵(+end)
  // Match user's mental model of "3 periods"
  const TOTAL_SECTIONS = PERIOD_ORDER.length // Just the 3 periods
  const [currentSection, setCurrentSection] = useState(0)
  
  // Get scroll target for a given section index (period index)
  const getScrollTarget = useCallback((sectionIndex) => {
    if (!galleryRef.current) return 0
    
    // Section index maps directly to period slides
    const slide = slideRefs.current[sectionIndex]
    if (slide) {
      // For first section (sumizuri), scroll to top to show title
      if (sectionIndex === 0) {
        return 0
      }
      return slide.offsetTop
    }
    return 0
  }, [])
  
  // Scroll to a specific section
  const scrollToSection = useCallback((sectionIndex) => {
    if (!galleryRef.current) return
    if (sectionIndex < 0 || sectionIndex >= TOTAL_SECTIONS) return
    
    isTransitioning.current = true
    const targetScroll = getScrollTarget(sectionIndex)
    
    galleryRef.current.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    })
    
    setCurrentSection(sectionIndex)
    
    // Section index directly maps to activePeriod for indicator display
    setActivePeriod(sectionIndex)
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      isTransitioning.current = false
      accumulatedDelta.current = 0
      lastScrollTime.current = Date.now()
    }, 700)
  }, [getScrollTarget, TOTAL_SECTIONS])
  
  // Scroll to end button area
  const scrollToEnd = useCallback(() => {
    if (!galleryRef.current || !endRef.current) return
    
    isTransitioning.current = true
    
    galleryRef.current.scrollTo({
      top: endRef.current.offsetTop,
      behavior: 'smooth'
    })
    
    setTimeout(() => {
      isTransitioning.current = false
      accumulatedDelta.current = 0
      lastScrollTime.current = Date.now()
    }, 700)
  }, [])
  
  // Handle wheel event - intercept and control scroll
  const handleWheel = useCallback((e) => {
    // Prevent default scroll behavior
    e.preventDefault()
    
    // Don't allow new scroll during transition
    if (isTransitioning.current) return
    
    // Check cooldown period
    const now = Date.now()
    const timeSinceLastScroll = now - lastScrollTime.current
    if (timeSinceLastScroll < 600) {
      return // Still in cooldown
    }
    
    // Use deltaY for vertical scroll
    const delta = e.deltaY
    
    // Determine scroll direction
    const direction = delta > 0 ? 1 : -1
    const targetSection = currentSection + direction
    
    // Check boundaries
    if (targetSection < 0) {
      accumulatedDelta.current = 0
      return
    }
    
    // If past last section, scroll to end button
    const isAtLastSection = currentSection === TOTAL_SECTIONS - 1
    const isScrollingDown = direction > 0
    
    // Accumulate delta for trackpad gestures
    accumulatedDelta.current += delta
    
    // Clear any existing cooldown
    if (cooldownTimeout.current) {
      clearTimeout(cooldownTimeout.current)
    }
    
    // Threshold for triggering section change
    const threshold = 50
    
    // If accumulated delta exceeds threshold, trigger navigation
    if (Math.abs(accumulatedDelta.current) >= threshold) {
      accumulatedDelta.current = 0
      lastScrollTime.current = now
      
      if (isAtLastSection && isScrollingDown) {
        // At last period and scrolling down - scroll to end button
        scrollToEnd()
      } else if (targetSection < TOTAL_SECTIONS) {
        // Normal section navigation
        scrollToSection(targetSection)
      }
    } else {
      // Reset accumulated delta after a short pause
      cooldownTimeout.current = setTimeout(() => {
        accumulatedDelta.current = 0
      }, 200)
    }
  }, [currentSection, TOTAL_SECTIONS, scrollToSection, scrollToEnd])
  
  // Setup wheel event listener
  useEffect(() => {
    const gallery = galleryRef.current
    if (!gallery) return
    
    // Add wheel listener with passive: false to allow preventDefault
    gallery.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      gallery.removeEventListener('wheel', handleWheel)
      if (cooldownTimeout.current) {
        clearTimeout(cooldownTimeout.current)
      }
    }
  }, [handleWheel])
  
  // Sync section state when scroll animation completes
  const handleScroll = useCallback(() => {
    if (!galleryRef.current) return
    
    // Don't update during programmatic scroll
    if (isTransitioning.current) return
    
    const gallery = galleryRef.current
    const scrollTop = gallery.scrollTop
    const viewportCenter = scrollTop + gallery.clientHeight / 2
    
    // Find which slide is most visible
    let closestIndex = 0
    let closestDistance = Infinity
    
    slideRefs.current.forEach((slide, index) => {
      if (slide) {
        const slideCenter = slide.offsetTop + slide.offsetHeight / 2
        const distance = Math.abs(viewportCenter - slideCenter)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      }
    })
    
    // Update both activePeriod and currentSection
    if (closestIndex !== activePeriod) {
      setActivePeriod(closestIndex)
    }
    if (closestIndex !== currentSection) {
      setCurrentSection(closestIndex)
    }
    
    // Check if we've reached the end
    if (closestIndex === PERIOD_ORDER.length - 1) {
      const lastSlide = slideRefs.current[PERIOD_ORDER.length - 1]
      if (lastSlide) {
        const slideBottom = lastSlide.offsetTop + lastSlide.offsetHeight
        const viewportBottom = scrollTop + gallery.clientHeight
        if (viewportBottom >= slideBottom - 100) {
          setIsComplete(true)
        }
      }
    } else {
      setIsComplete(false)
    }
  }, [activePeriod, currentSection])

  return (
    <div className="dawn-page">
      {/* Fixed Header */}
      <header className="dawn-header">
        <div className="dawn-header__container">
          <Link to="/" className="dawn-header__logo">
            <LayeredLogo size="small" animate={false} />
          </Link>
          <LanguageToggle />
        </div>
      </header>

      {/* Fixed Progress Indicators - No play button */}
      <GalleryIndicatorsManual
        activePeriod={activePeriod}
        isComplete={isComplete}
      />

      {/* Scrollable Gallery */}
      <div 
        ref={galleryRef}
        className="dawn-gallery dawn-gallery--controlled"
        onScroll={handleScroll}
      >
        {/* Title Section - scrolls with content */}
        <section ref={titleRef} className="dawn-title">
          <div className="dawn-title__container">
            <div className="dawn-heading">
              <h1 className="dawn-heading__title">錦絵の黎明</h1>
              <span className="dawn-heading__subtitle">多色摺り木版画の誕生と進化</span>
            </div>
            <div className="dawn-intro">
              <p>このデジタルアーカイブは、1760年代から1770年代にかけての浮世絵技術の劇的な進化を可視化したものです。</p>
            </div>
          </div>
        </section>

        {PERIOD_ORDER.map((periodKey, index) => {
          const period = PERIODS[periodKey]
          const isActive = index === activePeriod
          const isPast = index < activePeriod
          
          return (
            <div 
              key={period.id}
              ref={el => slideRefs.current[index] = el}
            >
              <PeriodSlide
                period={period}
                isActive={isActive}
                isPast={isPast}
                isFirstVisit={isFirstVisit}
                isComplete={isComplete}
                isAutoAnimating={false}
                periodDuration={0}
                syncElapsedTime={0}
              />
            </div>
          )
        })}
        
        {/* End Section with Button */}
        <div ref={endRef} className="dawn-gallery__end">
          <section className="dawn-button-section">
            <Link to="/timeline" className="dawn-button">
              <span className="dawn-button__text">歴史を見る</span>
              <span className="dawn-button__icon">
                <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="13.5" cy="13.5" r="13" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M11 9L16 13.5L11 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
            <div className="dawn-button__line" />
          </section>
        </div>
      </div>
    </div>
  )
}

