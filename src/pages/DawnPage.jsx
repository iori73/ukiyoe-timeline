import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PERIOD_ORDER, PERIODS, useFirstVisit } from '../components/dawn/ProgressTimeline'
import PeriodSlide from '../components/dawn/PeriodSlide'
import GalleryIndicators from '../components/dawn/GalleryIndicators'
import LanguageToggle from '../components/LanguageToggle'
import './DawnPage.css'

/**
 * DawnPage - 錦絵の黎明 (Dawn of Nishiki-e)
 * Apple-style gallery: content stays still, progress bar fills, then transitions
 */
export default function DawnPage() {
  const galleryRef = useRef(null)
  const slideRefs = useRef([])
  const isFirstVisit = useFirstVisit()
  
  // Current state
  const [activePeriod, setActivePeriod] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  
  // Auto-animation state
  const [isAutoAnimating, setIsAutoAnimating] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timerRef = useRef(null)
  const userInteractedRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Track elapsed time for pause/resume
  const periodStartTimeRef = useRef(Date.now())
  const elapsedTimeRef = useRef(0)
  
  // Real-time elapsed time for progress indicator (updated via requestAnimationFrame)
  const [currentElapsedTime, setCurrentElapsedTime] = useState(0)
  const animationFrameRef = useRef(null)
  
  // Sync trigger - increments when play is pressed to trigger child component sync
  // Contains the elapsed time at the moment of sync
  const [syncElapsedTime, setSyncElapsedTime] = useState(0)
  
  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 900)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Real-time elapsed time update via requestAnimationFrame
  // This keeps the progress indicator in perfect sync with the timer
  useEffect(() => {
    if (!isAutoAnimating || isTransitioning || userInteractedRef.current) {
      // Not animating - cancel any pending frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      return
    }
    
    const updateElapsedTime = () => {
      // Always read the latest values from refs to stay in sync with auto-advance timer
      const now = Date.now()
      const elapsed = elapsedTimeRef.current + (now - periodStartTimeRef.current)
      setCurrentElapsedTime(elapsed)
      animationFrameRef.current = requestAnimationFrame(updateElapsedTime)
    }
    
    // Small delay to ensure auto-advance effect has set periodStartTimeRef
    const startDelay = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(updateElapsedTime)
    }, 10)
    
    return () => {
      clearTimeout(startDelay)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isAutoAnimating, isTransitioning])
  
  // Animation duration per period
  // Mobile: longer duration to allow horizontal scroll at consistent speed
  const TRANSITION_DURATION = 1200 // 1.2秒 - ゆっくり自然なトランジション
  
  // Calculate duration based on layer count for mobile
  // ~100px/s scroll speed, ~176px per layer (160px + 16px gap)
  const calculatePeriodDuration = useCallback((periodIndex) => {
    const periodKey = PERIOD_ORDER[periodIndex]
    const period = PERIODS[periodKey]
    
    if (!isMobile || period.imageCount <= 1) {
      return 3333 // Desktop or single image: 3.33 seconds
    }
    
    // Mobile with multiple layers: calculate based on scroll distance
    // Each additional layer needs ~1.76 seconds at 100px/s (176px per layer)
    const extraLayers = period.imageCount - 1
    const scrollTime = extraLayers * 1760 // ms per layer at 100px/s
    const viewingTime = 1600 // 800ms start + 800ms end viewing
    
    return scrollTime + viewingTime
  }, [isMobile])
  
  // Custom smooth scroll with controlled duration
  const smoothScrollTo = useCallback((element, container, duration = 1000) => {
    const start = container.scrollTop
    const target = element.offsetTop
    const distance = target - start
    const startTime = performance.now()
    
    // Easing function - easeInOutCubic for natural feel
    const easeInOutCubic = (t) => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    }
    
    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeInOutCubic(progress)
      
      container.scrollTop = start + (distance * easedProgress)
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }
    
    requestAnimationFrame(animateScroll)
  }, [])

  // Scroll to specific period element
  const scrollToPeriod = useCallback((periodIndex) => {
    const slide = slideRefs.current[periodIndex]
    if (slide && galleryRef.current) {
      smoothScrollTo(slide, galleryRef.current, TRANSITION_DURATION)
    }
  }, [smoothScrollTo, TRANSITION_DURATION])
  
  // Auto-advance: wait for animation to complete, then transition
  useEffect(() => {
    if (!isAutoAnimating || isTransitioning || userInteractedRef.current) return
    
    // Get duration for current period (longer on mobile for horizontal scroll)
    const periodDuration = calculatePeriodDuration(activePeriod)
    
    // Calculate remaining time (account for elapsed time if resuming)
    const remainingTime = Math.max(0, periodDuration - elapsedTimeRef.current)
    
    // Record start time for this run - this is the authoritative start time
    const runStartTime = Date.now()
    periodStartTimeRef.current = runStartTime
    
    // Wait for animation to complete
    timerRef.current = setTimeout(() => {
      if (userInteractedRef.current) return
      
      // Reset elapsed time for next period
      elapsedTimeRef.current = 0
      
      if (activePeriod < PERIOD_ORDER.length - 1) {
        // Transition to next period
        setIsTransitioning(true)
        scrollToPeriod(activePeriod + 1)
        
        // After scroll transition, activate next period
        setTimeout(() => {
          setActivePeriod(activePeriod + 1)
          setIsTransitioning(false)
          // Reset start time and elapsed time for new period
          periodStartTimeRef.current = Date.now()
          elapsedTimeRef.current = 0
          setCurrentElapsedTime(0)
        }, TRANSITION_DURATION)
      } else {
        // All periods complete
        setIsComplete(true)
        setIsAutoAnimating(false)
      }
    }, remainingTime)
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        // Save elapsed time when cleanup happens (e.g., when paused)
        const additionalElapsed = Date.now() - runStartTime
        elapsedTimeRef.current += additionalElapsed
      }
    }
  }, [isAutoAnimating, isTransitioning, activePeriod, scrollToPeriod, calculatePeriodDuration, TRANSITION_DURATION])
  
  // Handle user scroll - update active period based on visible slide
  const handleScroll = useCallback(() => {
    if (!galleryRef.current || isTransitioning || !userInteractedRef.current) return
    
    // Find which slide is most visible
    const gallery = galleryRef.current
    const scrollTop = gallery.scrollTop
    const viewportCenter = scrollTop + gallery.clientHeight / 2
    
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
    
    if (closestIndex !== activePeriod) {
      setActivePeriod(closestIndex)
    }
  }, [activePeriod, isTransitioning])
  
  // Handle play/pause button click
  const handlePlayPauseClick = useCallback(() => {
    if (isAutoAnimating) {
      // Pause animation
      setIsAutoAnimating(false)
      userInteractedRef.current = true
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    } else {
      // Resume or restart animation
      if (isComplete) {
        // Animation finished - restart from beginning
        setActivePeriod(0)
        setIsComplete(false)
        userInteractedRef.current = false
        // Reset elapsed time for fresh start
        elapsedTimeRef.current = 0
        setCurrentElapsedTime(0)
        periodStartTimeRef.current = Date.now()
        
        // Scroll to top, then start animation
        if (galleryRef.current) {
          galleryRef.current.scrollTo({ top: 0, behavior: 'smooth' })
        }
        
        setTimeout(() => {
          setIsAutoAnimating(true)
        }, 500)
      } else {
        // Animation paused in middle - resume from current position
        // elapsedTimeRef is already set by cleanup function
        userInteractedRef.current = false
        periodStartTimeRef.current = Date.now()
        // Trigger sync in child components with current elapsed time
        setSyncElapsedTime(elapsedTimeRef.current)
        setIsAutoAnimating(true)
      }
    }
  }, [isAutoAnimating, isComplete])
  
  // Detect user interaction - stop auto animation
  const handleUserInteraction = useCallback(() => {
    if (isAutoAnimating && !userInteractedRef.current) {
      userInteractedRef.current = true
      setIsAutoAnimating(false)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isAutoAnimating])
  
  // Add interaction listeners
  // Touch handling: only stop on actual scroll movement (not just touch)
  useEffect(() => {
    const gallery = galleryRef.current
    if (!gallery) return
    
    // Track touch state for refined detection
    let touchStartY = 0
    let touchStartTime = 0
    const SCROLL_THRESHOLD = 10 // pixels moved to count as scroll
    
    const onWheel = () => handleUserInteraction()
    
    const onTouchStart = (e) => {
      // Record touch start position and time
      touchStartY = e.touches[0].clientY
      touchStartTime = Date.now()
    }
    
    const onTouchMove = (e) => {
      if (!isAutoAnimating || userInteractedRef.current) return
      
      // Calculate distance moved
      const touchY = e.touches[0].clientY
      const deltaY = Math.abs(touchY - touchStartY)
      
      // Only trigger interaction if moved beyond threshold (actual scrolling)
      if (deltaY > SCROLL_THRESHOLD) {
        handleUserInteraction()
      }
    }
    
    const onTouchEnd = () => {
      // Reset touch tracking
      touchStartY = 0
      touchStartTime = 0
    }
    
    const onKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
        handleUserInteraction()
      }
    }
    
    gallery.addEventListener('wheel', onWheel, { passive: true })
    gallery.addEventListener('touchstart', onTouchStart, { passive: true })
    gallery.addEventListener('touchmove', onTouchMove, { passive: true })
    gallery.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    
    return () => {
      gallery.removeEventListener('wheel', onWheel)
      gallery.removeEventListener('touchstart', onTouchStart)
      gallery.removeEventListener('touchmove', onTouchMove)
      gallery.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [handleUserInteraction, isAutoAnimating])

  return (
    <div className="dawn-page">
      {/* Fixed Header */}
      <header className="dawn-header">
        <div className="dawn-header__container">
          <Link to="/" className="dawn-header__logo">
            <img 
              src="/images/logo_v2.svg" 
              alt="浮世絵" 
              className="dawn-header__logo-img"
            />
          </Link>
          <LanguageToggle />
        </div>
      </header>

      {/* Fixed Progress Indicators */}
      <GalleryIndicators
        activePeriod={activePeriod}
        isComplete={isComplete}
        isAutoAnimating={isAutoAnimating}
        onPlayPauseClick={handlePlayPauseClick}
        periodDuration={calculatePeriodDuration(activePeriod)}
        elapsedTime={currentElapsedTime}
      />

      {/* Scrollable Gallery */}
      <div 
        ref={galleryRef}
        className="dawn-gallery"
        onScroll={handleScroll}
      >
        {/* Title Section - scrolls with content */}
        <section className="dawn-title">
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
                isAutoAnimating={isAutoAnimating}
                periodDuration={calculatePeriodDuration(index)}
                syncElapsedTime={isActive ? syncElapsedTime : 0}
              />
            </div>
          )
        })}
        
        {/* End Section with Button */}
        <div className="dawn-gallery__end">
          <section className="dawn-button-section">
            <Link to="/" className="dawn-button">
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
