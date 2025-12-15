import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { memo } from 'react'

/**
 * ScrollIndicators Component
 * 
 * Displays scroll hints, dot navigation, and progress indicator
 * Inspired by sawataya.jp's elegant UI elements
 * Optimized with memoization for better performance
 */
function ScrollIndicators({ 
  currentSection, 
  totalSections, 
  onNavigate,
  showHint = true 
}) {
  const { language } = useLanguage()

  return (
    <>
      {/* Scroll Hint - Enhanced Sawataya style "scroll → ↓" */}
      {/* Only show on sections after the intro (not on first section) */}
      <AnimatePresence>
        {showHint && currentSection > 0 && currentSection < totalSections - 1 && (
          <motion.div
            className="scroll-hint-indicator"
            initial={{ opacity: 0, x: 30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.9 }}
            transition={{ 
              duration: 1,
              delay: 2,
              ease: [0.19, 1.0, 0.22, 1.0]
            }}
          >
            <motion.div 
              className="scroll-hint-content"
              animate={{ 
                x: [0, 12, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.span 
                className="scroll-text"
                animate={{ 
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                scroll
              </motion.span>
              <div className="scroll-arrows">
                <motion.span 
                  className="arrow-horizontal"
                  animate={{ 
                    x: [0, 5, 0],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  →
                </motion.span>
                <motion.span 
                  className="arrow-vertical"
                  animate={{ 
                    rotate: [90, 95, 90]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3
                  }}
                >
                  ↓
                </motion.span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dot Navigation with Enhanced Animations */}
      {/* Only show on period sections (not on intro) */}
      <AnimatePresence>
        {currentSection > 0 && (
          <motion.div 
            className="dot-navigation"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {Array.from({ length: totalSections - 1 }).map((_, index) => {
              const sectionIndex = index + 1 // Skip intro section
              return (
                <motion.button
                  key={sectionIndex}
                  className={`dot-nav-item ${sectionIndex === currentSection ? 'active' : ''}`}
                  onClick={() => onNavigate?.(sectionIndex)}
                  whileHover={{ scale: 1.4 }}
                  whileTap={{ scale: 0.85 }}
                  initial={{ opacity: 0, x: -15, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    scale: 1
                  }}
                  transition={{ 
                    delay: 0.7 + index * 0.08,
                    duration: 0.5,
                    ease: [0.19, 1.0, 0.22, 1.0]
                  }}
                  aria-label={`Go to section ${index + 1}`}
                >
                  <motion.span 
                    className="dot-inner"
                    animate={{
                      scale: sectionIndex === currentSection ? [1, 1.3, 1] : 1
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut"
                    }}
                  />
                  <motion.span 
                    className="dot-label"
                    initial={{ opacity: 0, x: -5 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {index + 1}
                  </motion.span>
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar - Bottom with Enhanced Animation */}
      <div className="progress-bar-container">
        <motion.div 
          className="progress-bar-fill"
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: (currentSection + 1) / totalSections 
          }}
          transition={{ 
            duration: 0.8,
            ease: [0.19, 1.0, 0.22, 1.0]
          }}
        />
        <motion.div
          className="progress-bar-glow"
          style={{
            position: 'absolute',
            left: `${((currentSection + 1) / totalSections) * 100}%`,
            top: 0,
            width: '20px',
            height: '100%',
            background: 'radial-gradient(circle, rgba(201, 168, 76, 0.6) 0%, transparent 70%)',
            transform: 'translateX(-50%)',
            pointerEvents: 'none'
          }}
          animate={{
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Section Counter with Enhanced Animation */}
      {/* Only show on period sections (not on intro) */}
      <AnimatePresence>
        {currentSection > 0 && (
          <motion.div 
            className="section-counter"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ 
              delay: 0.8,
              duration: 0.6,
              ease: [0.19, 1.0, 0.22, 1.0]
            }}
          >
            <motion.span 
              className="counter-current"
              key={currentSection}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.19, 1.0, 0.22, 1.0] }}
            >
              {String(currentSection).padStart(2, '0')}
            </motion.span>
            <span className="counter-divider">/</span>
            <span className="counter-total">{String(totalSections - 1).padStart(2, '0')}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Arrows - Hanko Style */}
      <div className="navigation-arrows">
        {/* Previous Button */}
        <AnimatePresence>
          {currentSection > 0 && (
            <motion.button
              className="hanko-button large nav-arrow nav-arrow-prev"
              onClick={() => onNavigate?.(currentSection - 1)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={language === 'ja' ? '前へ' : 'Previous section'}
              title={language === 'ja' ? '前へ' : 'Prev'}
            >
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>←</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Next Button */}
        <AnimatePresence>
          {currentSection < totalSections - 1 && (
            <motion.button
              className="hanko-button large nav-arrow nav-arrow-next"
              onClick={() => onNavigate?.(currentSection + 1)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={language === 'ja' ? '次へ' : 'Next section'}
              title={language === 'ja' ? '次へ' : 'Next'}
            >
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>→</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

// Memoize component to prevent unnecessary re-renders
export default memo(ScrollIndicators, (prevProps, nextProps) => {
  return (
    prevProps.currentSection === nextProps.currentSection &&
    prevProps.totalSections === nextProps.totalSections &&
    prevProps.showHint === nextProps.showHint
  )
})
