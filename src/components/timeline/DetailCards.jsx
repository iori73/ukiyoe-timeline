import { motion } from 'framer-motion'
import { duration, easing } from '../../constants/motion'
import { useLanguage } from '../../context/LanguageContext'
import { getLocalizedField } from '../../data/ukiyoe'
import './DetailCards.css'

/**
 * DetailCards Component
 * 
 * 4つの詳細カード（時代背景、主題と特徴、市場と流通、技術と技法）を表示
 * Figmaデザインの下部カードセクションを再現
 */
export default function DetailCards({ period, isActive }) {
  const { language } = useLanguage()

  const detailSections = [
    { 
      key: 'background', 
      labelJa: '時代背景', 
      labelEn: 'Historical Background',
      icon: '📜'
    },
    { 
      key: 'themes', 
      labelJa: '主題と特徴', 
      labelEn: 'Themes & Characteristics',
      icon: '🎨'
    },
    { 
      key: 'market', 
      labelJa: '市場と流通', 
      labelEn: 'Market & Distribution',
      icon: '🏪'
    },
    { 
      key: 'technique', 
      labelJa: '技術と技法', 
      labelEn: 'Technique',
      icon: '🖌️'
    },
  ]

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: duration.slow,
        delay: index * 0.1,
        ease: easing.ukiyoe
      }
    })
  }

  return (
    <div className="detail-cards">
      <div className="detail-cards__grid">
        {detailSections.map((section, index) => {
          const content = getLocalizedField(period, section.key, language)
          if (!content) return null

          return (
            <motion.div
              key={section.key}
              className="detail-card"
              variants={cardVariants}
              initial="hidden"
              animate={isActive ? "visible" : "hidden"}
              custom={index}
            >
              <div className="detail-card__header">
                <h4 className="detail-card__title">
                  {language === 'ja' ? section.labelJa : section.labelEn}
                </h4>
              </div>
              <p className="detail-card__content">
                {content}
              </p>
            </motion.div>
          )
        })}
      </div>
      
      {/* グリッド区切り線 */}
      <div className="detail-cards__dividers">
        <div className="detail-cards__divider-horizontal" />
        <div className="detail-cards__divider-vertical" />
      </div>
    </div>
  )
}

