import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { getLocalizedField } from '../data/ukiyoe'
import { memo, useMemo, useState } from 'react'

/**
 * FullscreenSection Component
 * 
 * Displays each Ukiyo-e period as a fullscreen section with all details
 * Inspired by sawataya.jp's design with large imagery and elegant typography
 * All information is displayed without requiring a modal
 */
function FullscreenSection({ period, index, isActive }) {
  const { language } = useLanguage()
  const [imageError, setImageError] = useState(false)

  const sectionVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)'
    },
    visible: { 
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 1,
        ease: [0.19, 1.0, 0.22, 1.0], // Smooth ease-out
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(5px)',
      transition: {
        duration: 0.5,
        ease: [0.19, 1.0, 0.22, 1.0]
      }
    }
  }

  const childVariants = {
    hidden: { 
      opacity: 0,
      y: 40,
      filter: 'blur(4px)'
    },
    visible: { 
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.19, 1.0, 0.22, 1.0]
      }
    }
  }
  
  // Special variant for title with slide effect
  const titleVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      filter: 'blur(8px)'
    },
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1,
        ease: [0.19, 1.0, 0.22, 1.0]
      }
    }
  }

  // Memoize computed values for performance
  const primaryImage = useMemo(
    () => period.images?.[0] || period.image_url,
    [period.images, period.image_url]
  )

  const artistNames = useMemo(
    () => period.key_artists || period.artists || '',
    [period.key_artists, period.artists]
  )

  const description = useMemo(
    () => language === 'ja' 
      ? (period.characteristics || period.description)
      : (period.characteristics_en || period.description_en || period.characteristics || period.description),
    [language, period.characteristics, period.description, period.characteristics_en, period.description_en]
  )

  const periodName = useMemo(
    () => language === 'ja' 
      ? (period.period_name || period.name)
      : (period.period_name_en || period.name_en || period.period_name || period.name),
    [language, period.period_name, period.name, period.period_name_en, period.name_en]
  )

  // Detail sections from modal
  const detailSections = [
    { key: 'background', labelJa: '時代背景', labelEn: 'Historical Background' },
    { key: 'themes', labelJa: '主題と特徴', labelEn: 'Themes & Characteristics' },
    { key: 'market', labelJa: '市場と流通', labelEn: 'Market & Distribution' },
    { key: 'technique', labelJa: '技術と技法', labelEn: 'Technique' },
  ]

  const keyEvent = useMemo(
    () => getLocalizedField(period, 'key_event', language),
    [period, language]
  )

  const exampleWorks = useMemo(
    () => getLocalizedField(period, 'example_works', language),
    [period, language]
  )

  return (
    <motion.section 
      className={`fullscreen-section split-layout ${index === 0 ? 'first-section' : ''}`}
      variants={sectionVariants}
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
      data-active={isActive}
      data-index={index}
      style={{
        // Prevent layout shift during animations
        willChange: isActive ? 'opacity, transform, filter' : 'auto'
      }}
    >
      {/* Left Panel - Image */}
      <motion.div 
        className="image-panel"
        initial={{ opacity: 0, x: -30 }}
        animate={{ 
          opacity: isActive ? 1 : 0,
          x: isActive ? 0 : -30
        }}
        transition={{ 
          duration: 1, 
          ease: [0.19, 1.0, 0.22, 1.0]
        }}
      >
        <div className="image-panel-inner">
          {primaryImage && !imageError ? (
            <motion.img 
              src={primaryImage} 
              alt={language === 'ja' 
                ? `${periodName || period.period_name || period.name} - ${getLocalizedField(period, 'artists', language)}`
                : `${periodName || period.period_name || period.name} - ${getLocalizedField(period, 'artists', language)}`}
              className="panel-image"
              loading={index < 2 ? "eager" : "lazy"}
              initial={{ scale: 1.1 }}
              animate={{ 
                scale: isActive ? 1 : 1.1
              }}
              transition={{ duration: 1.2, ease: [0.19, 1.0, 0.22, 1.0] }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="image-placeholder">
              <p className="placeholder-text">
                {language === 'ja' 
                  ? '画像を読み込むことができませんでした'
                  : 'Image could not be loaded'}
              </p>
              <p className="placeholder-subtext">
                {language === 'ja' 
                  ? `${periodName || period.period_name || period.name}`
                  : `${periodName || period.period_name || period.name}`}
              </p>
            </div>
          )}
          {/* Vignette overlay */}
          {!imageError && <div className="image-vignette" />}
        </div>
      </motion.div>

      {/* Right Panel - Text Content */}
      <motion.div 
        className="text-panel"
        variants={childVariants}
      >
        <div className="text-panel-inner">
          {/* Section Title (h2 for accessibility) */}
          <h2 className="section-title-h2 visually-hidden">{periodName}</h2>

          {/* Section Number and Date Range - Horizontal Layout */}
          <motion.div 
            className="section-header-row"
            variants={childVariants}
          >
            {/* Section Number */}
            <div className="section-number-figma">
              <span className="number-label">{language === 'ja' ? '第' : 'Section '}</span>
              <span className="number-value">{String(index + 1).padStart(2, '0')}</span>
            </div>

            {/* Date Range */}
            <div className="section-date-range-figma">
              <div className="section-date-range-inner">
                <span className="date-start">{period.year_start}</span>
                <span className="date-separator">—</span>
                <span className="date-end">{period.year_end}</span>
              </div>
              <div className="section-date-range-divider"></div>
            </div>
          </motion.div>

          {/* Key Event & Works - Two Column Layout */}
          <motion.div 
            className="section-meta-container"
            variants={childVariants}
          >
            {keyEvent && (
              <div className="section-meta-item">
                <div className="section-meta-header">
                  <span className="section-meta-label">
                    {language === 'ja' ? '重要な出来事' : 'Key Event'}
                  </span>
                  <div className="section-meta-divider"></div>
                </div>
                <p className="section-meta-text">{keyEvent}</p>
              </div>
            )}

            {exampleWorks && (
              <div className="section-meta-item">
                <div className="section-meta-header">
                  <span className="section-meta-label">
                    {language === 'ja' ? '代表作品' : 'Key Works'}
                  </span>
                  <div className="section-meta-divider"></div>
                </div>
                <p className="section-meta-text section-meta-text-accent">{exampleWorks}</p>
              </div>
            )}
          </motion.div>

          {/* Detail Sections */}
          <motion.div className="section-details-figma" variants={childVariants}>
            {detailSections.map((section, idx) => {
              const content = getLocalizedField(period, section.key, language)
              if (!content) return null
              
              return (
                <motion.div
                  key={section.key}
                  className="detail-section-figma"
                  variants={childVariants}
                >
                  <div className="detail-section-header-figma">
                    <div className="detail-section-double-lines-figma">
                      <div className="detail-section-title-box-figma">
                        <span className="detail-section-title-figma">
                          {language === 'ja' ? section.labelJa : section.labelEn}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="detail-section-content-figma">{content}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  )
}

// Memoize component to prevent unnecessary re-renders
export default memo(FullscreenSection, (prevProps, nextProps) => {
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.period.id === nextProps.period.id &&
    prevProps.index === nextProps.index
  )
})
