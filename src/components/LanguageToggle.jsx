import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="language-toggle">
      {/* Japanese Button */}
      <motion.button
        className={`hanko-button ${language === 'ja' ? 'active' : ''}`}
        onClick={() => setLanguage('ja')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="日本語"
      >
        <span>日</span>
      </motion.button>

      {/* English Button */}
      <motion.button
        className={`hanko-button ${language === 'en' ? 'active' : ''}`}
        onClick={() => setLanguage('en')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="English"
      >
        <span>EN</span>
      </motion.button>
    </div>
  )
}

