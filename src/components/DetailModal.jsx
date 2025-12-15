import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { getLocalizedField } from '../data/ukiyoe'
import { useState } from 'react'

export default function DetailModal({ period, isOpen, onClose }) {
  const { language } = useLanguage()
  const [imageError, setImageError] = useState(false)

  if (!period) return null

  const sections = [
    { key: 'background', labelJa: '時代背景', labelEn: 'Historical Background' },
    { key: 'themes', labelJa: '主題と特徴', labelEn: 'Themes & Characteristics' },
    { key: 'market', labelJa: '市場と流通', labelEn: 'Market & Distribution' },
    { key: 'technique', labelJa: '技術と技法', labelEn: 'Technique' },
  ]

  // Format section number (e.g., "01", "02")
  // Use period index from data array (1-based for display)
  // If period has an id, use it; otherwise default to 1
  const sectionNumber = period.id 
    ? String(period.id).padStart(2, '0')
    : '01'

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          {/* Modal */}
          <motion.div
            className="modal"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button - Hanko Style */}
            <motion.button 
              className="hanko-button modal-close" 
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={language === 'ja' ? '閉じる' : 'Close'}
            >
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>×</span>
            </motion.button>

            {/* Hero image */}
            <div className="modal-hero">
              {!imageError ? (
                <img 
                  src={period.image_url} 
                  alt={getLocalizedField(period, 'key_event', language) || (language === 'ja' ? '浮世絵作品' : 'Ukiyo-e work')}
                  onError={() => setImageError(true)}
                />
              ) : (
                  <div className="modal-hero-placeholder">
                  <span>{language === 'ja' ? '画像を読み込むことができませんでした' : 'Image could not be loaded'}</span>
                </div>
              )}
              <div className="modal-hero-overlay" />
              <div className="modal-hero-content">
                <span className="modal-year">{period.year_start}–{period.year_end}</span>
                <h2 className="modal-title">
                  {getLocalizedField(period, 'key_event', language)}
                </h2>
              </div>
            </div>

            {/* Text Panel - Figma Design Style */}
            <div className="modal-text-panel">
              <div className="modal-text-panel-inner">
                {/* Section Number */}
                <div className="modal-section-number">
                  <span className="modal-section-number-label">
                    {language === 'ja' ? '第' : 'Section '}
                  </span>
                  <span className="modal-section-number-value">{sectionNumber}</span>
                </div>

                {/* Date Range */}
                <div className="modal-date-range">
                  <div className="modal-date-range-inner">
                    <span className="modal-date-start">{period.year_start}</span>
                    <span className="modal-date-separator">—</span>
                    <span className="modal-date-end">{period.year_end}</span>
                  </div>
                  <div className="modal-date-divider"></div>
                </div>

                {/* Key Event & Works - Two Column Layout */}
                <div className="modal-meta-blur-container">
                  <div className="modal-meta-blur-item">
                    <div className="modal-meta-blur-header">
                      <span className="modal-meta-blur-label">
                        {language === 'ja' ? '重要な出来事' : 'Key Event'}
                      </span>
                      <div className="modal-meta-blur-divider"></div>
                    </div>
                    <p className="modal-meta-blur-text">
                      {getLocalizedField(period, 'key_event', language)}
                    </p>
                  </div>

                  <div className="modal-meta-blur-item">
                    <div className="modal-meta-blur-header">
                      <span className="modal-meta-blur-label">
                        {language === 'ja' ? '代表作品' : 'Key Works'}
                      </span>
                      <div className="modal-meta-blur-divider"></div>
                    </div>
                    <p className="modal-meta-blur-text">
                      {getLocalizedField(period, 'example_works', language)}
                    </p>
                  </div>
                </div>

                {/* Detail Sections */}
                <div className="modal-detail-sections">
                  {sections.map((section, index) => {
                    const content = getLocalizedField(period, section.key, language)
                    if (!content) return null

                    return (
                      <motion.div
                        key={section.key}
                        className="modal-detail-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="modal-detail-section-header">
                          <div className="modal-detail-section-double-lines">
                            <div className="modal-detail-section-title-box">
                              <span className="modal-detail-section-title">
                                {language === 'ja' ? section.labelJa : section.labelEn}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="modal-detail-section-content">{content}</p>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

