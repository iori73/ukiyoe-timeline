import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PeriodCard from './PeriodCard'
import { useLanguage } from '../context/LanguageContext'

export default function Timeline({ data, onSelectPeriod }) {
  const scrollRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const { language } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        const progress = scrollLeft / (scrollWidth - clientWidth)
        setScrollProgress(progress)
      }
    }

    const container = scrollRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Calculate the full year range
  const minYear = Math.min(...data.map(d => parseInt(d.year_start)))
  const maxYear = Math.max(...data.map(d => parseInt(d.year_end)))

  return (
    <div className="timeline-container">
      {/* Era indicator bar */}
      <div className="era-bar">
        <div className="era-label start">{minYear}</div>
        <div className="era-progress">
          <motion.div 
            className="era-progress-fill"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="era-label end">{maxYear}</div>
      </div>

      {/* Horizontal scroll container */}
      <div className="timeline-scroll" ref={scrollRef}>
        <div className="timeline-track">
          {/* Timeline line */}
          <div className="timeline-line" />
          
          {/* Period cards */}
          <div className="timeline-cards">
            {data.map((period, index) => (
              <motion.div
                key={period.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <PeriodCard 
                  period={period} 
                  index={index}
                  onClick={() => onSelectPeriod(period)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div 
        className="scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span>{language === 'ja' ? '← スクロールして時代を巡ります →' : '← Scroll to explore eras →'}</span>
      </motion.div>
    </div>
  )
}






