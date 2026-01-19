import { useLanguage } from '../context/LanguageContext'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="language-toggle">
      {/* Japanese Button */}
      <button
        className={`language-button ${language === 'ja' ? 'active' : ''}`}
        onClick={() => setLanguage('ja')}
        aria-label="日本語"
      >
        日
      </button>

      {/* English Button */}
      <button
        className={`language-button ${language === 'en' ? 'active' : ''}`}
        onClick={() => setLanguage('en')}
        aria-label="English"
      >
        EN
      </button>
    </div>
  )
}

