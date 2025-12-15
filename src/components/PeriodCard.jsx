import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { getLocalizedField } from '../data/ukiyoe'
import { useState } from 'react'

export default function PeriodCard({ period, index, onClick }) {
  const { language } = useLanguage()
  const [imageError, setImageError] = useState(false)

  const yearRange = `${period.year_start}–${period.year_end}`
  const keyEvent = getLocalizedField(period, 'key_event', language)
  const artists = getLocalizedField(period, 'artists', language)

  const exampleWorks = getLocalizedField(period, 'example_works', language)

  return (
    <motion.div 
      className="period-card"
      onClick={onClick}
      whileHover={{ 
        y: -8,
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Year marker on timeline */}
      <div className="year-marker">
        <div className="year-dot" />
        <span className="year-text">{yearRange}</span>
      </div>

      {/* Card content */}
      <div className="card-image-container">
        {!imageError ? (
          <img 
            src={period.image_url} 
            alt={keyEvent || (language === 'ja' ? '浮世絵作品' : 'Ukiyo-e work')}
            className="card-image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="card-image-placeholder">
            <span>{language === 'ja' ? '画像がございません' : 'No Image'}</span>
          </div>
        )}
        <div className="card-overlay" />
        
        {/* Japanese vertical text overlay on image */}
        {language === 'ja' && (
          <>
            <div className="vertical-text artist-name">
              {artists}
            </div>
            <div className="vertical-text work-title">
              {exampleWorks}
            </div>
          </>
        )}
      </div>

      <div className="card-content">
        <h3 className="card-title">{keyEvent}</h3>
        {language === 'en' && (
          <div className="card-artists">
            <span className="artists-label">Artists</span>
            <span className="artists-names">{artists}</span>
          </div>
        )}
        <div className="card-cta">
          {language === 'ja' ? '詳細をご覧になる' : 'View Details'}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

