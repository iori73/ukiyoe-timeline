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
  
  // Animation duration per period (in ms) - must match CSS
  const PERIOD_DURATION = 3333 // 3.33 seconds
  const TRANSITION_DURATION = 600 // Transition animation duration
  
  // Scroll to specific period element
  const scrollToPeriod = useCallback((periodIndex) => {
    const slide = slideRefs.current[periodIndex]
    if (slide && galleryRef.current) {
      slide.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])
  
  // Auto-advance: wait for CSS fill animation, then transition
  useEffect(() => {
    if (!isAutoAnimating || isTransitioning || userInteractedRef.current) return
    
    // Wait for CSS fill animation to complete
    timerRef.current = setTimeout(() => {
      if (userInteractedRef.current) return
      
      if (activePeriod < PERIOD_ORDER.length - 1) {
        // Transition to next period
        setIsTransitioning(true)
        scrollToPeriod(activePeriod + 1)
        
        // After scroll transition, activate next period
        setTimeout(() => {
          setActivePeriod(activePeriod + 1)
          setIsTransitioning(false)
        }, TRANSITION_DURATION)
      } else {
        // All periods complete
        setIsComplete(true)
        setIsAutoAnimating(false)
      }
    }, PERIOD_DURATION)
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isAutoAnimating, isTransitioning, activePeriod, scrollToPeriod, PERIOD_DURATION, TRANSITION_DURATION])
  
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
        
        // Scroll to top, then start animation
        if (galleryRef.current) {
          galleryRef.current.scrollTo({ top: 0, behavior: 'smooth' })
        }
        
        setTimeout(() => {
          setIsAutoAnimating(true)
        }, 500)
      } else {
        // Animation paused in middle - resume from current position
        userInteractedRef.current = false
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
  useEffect(() => {
    const gallery = galleryRef.current
    if (!gallery) return
    
    const onWheel = () => handleUserInteraction()
    const onTouchStart = () => handleUserInteraction()
    const onKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
        handleUserInteraction()
      }
    }
    
    gallery.addEventListener('wheel', onWheel, { passive: true })
    gallery.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    
    return () => {
      gallery.removeEventListener('wheel', onWheel)
      gallery.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [handleUserInteraction])

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
                  <circle cx="13.5" cy="13.5" r="13" stroke="currentColor" strokeWidth="1"/>
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
