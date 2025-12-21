import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

/**
 * IntroSection - トップページ導入セクション
 * 
 * 構造:
 * - 導入部: タイトル・説明文（中央上部）
 * - 技法カード: 画像+説明を1つのカードにまとめた3枚
 */
export default function IntroSection({ isActive }) {
  const { language } = useLanguage()

  const content = {
    ja: {
      title: '錦絵の黎明',
      subtitle: '多色摺り木版画の誕生と進化',
      description: 'このデジタルアーカイブは、1760年代から1770年代にかけての浮世絵技術の劇的な進化を可視化したものです。18世紀中頃まで、浮世絵は「紅摺絵」と呼ばれる2〜3色の限られた色彩で制作されていました。しかし1765年、鈴木春信らによる技術革新により、10色以上の版木を重ね合わせる多色摺り木版画「錦絵」が誕生します。',
      techniques: [
        { period: '1660年頃', name: '墨摺絵', color: '#000000', image: '/sumizuri-e.png',
          desc: '墨（黒）一色のみで摺った木版画。菱川師宣の流麗な線描により、浮世絵は独立した芸術形式として確立された。' },
        { period: '1740年代頃', name: '紅摺絵', color: '#95a078', image: '/benizuri-e.png',
          desc: '紅色と緑色の版木を追加し、「見当」という位置合わせ技術で重ね摺りした版画。手彩色より大量生産が可能になった。' },
        { period: '1765年以降', name: '錦絵', color: '#f8604f', image: '/nishiki-e.png',
          desc: '10枚以上の版木を精密に重ね、ぼかしや空摺りなどの高度な技法を導入。浮世絵の技術的頂点である。' }
      ]
    },
    en: {
      title: 'The Dawn of Nishiki-e',
      subtitle: 'The Birth and Evolution of Multicolor Woodblock Printing',
      description: 'This digital archive visualizes the dramatic evolution of Ukiyo-e techniques from the 1760s to 1770s. Until the mid-18th century, Ukiyo-e were produced using "Benizuri-e," limited to 2-3 colors. However, in 1765, innovations by Suzuki Harunobu led to "Nishiki-e," multicolor prints using 10+ blocks.',
      techniques: [
        { period: 'c. 1660', name: 'Sumizuri-e', color: '#000000', image: '/sumizuri-e.png',
          desc: 'Woodblock prints using only black ink. Through Moronobu\'s fluid linework, ukiyo-e was established as an independent art form.' },
        { period: 'c. 1740s', name: 'Benizuri-e', color: '#95a078', image: '/benizuri-e.png',
          desc: 'Added pink and green blocks using "kento" registration marks. Enabled mass production with improved color consistency.' },
        { period: '1765+', name: 'Nishiki-e', color: '#f8604f', image: '/nishiki-e.png',
          desc: 'Precisely overlaying 10+ woodblocks with advanced techniques like bokashi and karazuri. The technical peak of ukiyo-e.' }
      ]
    }
  }

  const t = content[language] || content.ja

  return (
    <motion.section 
      className="fullscreen-section intro-section intro-section-ukiyoe first-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1, ease: [0.19, 1.0, 0.22, 1.0] }}
    >
      {/* 導入部 */}
      <motion.div 
        className="intro-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="intro-title-group">
          <h1 className="intro-title">{t.title}</h1>
          <h2 className="intro-subtitle">{t.subtitle}</h2>
        </div>
        <p className="intro-description">{t.description}</p>
      </motion.div>

      {/* 技法カード（画像+説明） */}
      <div className="intro-cards">
        {t.techniques.map((tech, i) => (
          <motion.article 
            key={tech.name}
            className="technique-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
            transition={{ duration: 0.8, delay: 0.4 + i * 0.15 }}
          >
            <div className="technique-card-image">
              <img src={tech.image} alt={tech.name} />
            </div>
            <div className="technique-card-info">
              <div className="technique-card-header">
                <h3 style={{ color: tech.color }}>{tech.name}</h3>
                <span className="technique-period">{tech.period}</span>
              </div>
              <p>{tech.desc}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}
