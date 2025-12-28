import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

// ローカル画像を使用
const imgSumizurie = "/sumizurie.png"
const imgBenizurie = "/benizurie.png"
const imgNishikie = "/nishikie.png"

/**
 * IntroSection Component
 * 
 * Figmaデザインに基づく導入セクション
 * - 3つの技法カード（墨摺絵、紅摺絵、錦絵）を表示
 * - 各カードに画像、年代、名前、説明を含む
 */
export default function IntroSection({ isActive, onStart }) {
  const { language } = useLanguage()

  // シンプルなフェードインのみ
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.19, 1.0, 0.22, 1.0]
      }
    }
  }

  // 控えめなスライドアップ
  const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.19, 1.0, 0.22, 1.0],
        delay: 0.3
      }
    }
  }

  const content = {
    ja: {
      title: '錦絵の黎明',
      subtitle: '多色摺り木版画の誕生と進化',
      description: 'このデジタルアーカイブは、1760年代から1770年代にかけての浮世絵技術の劇的な進化を可視化したものです。',
      detail: '18世紀中頃まで、浮世絵は「紅摺絵」と呼ばれる2〜3色の限られた色彩で制作されていました。しかし1765年、鈴木春信らによる技術革新により、10色以上の版木を重ね合わせる多色摺り木版画「錦絵」が誕生します。',
      techniques: [
        {
          period: '1660年頃',
          name: '墨摺絵',
          nameColor: '#000000',
          description: '墨（黒）一色のみで摺った木版画です。菱川師宣の流麗な線描により、浮世絵は独立した芸術形式として確立されました。',
          image: imgSumizurie
        },
        {
          period: '1740年代頃',
          name: '紅摺絵',
          nameColor: '#cebe91',
          description: '紅色と緑色の版木を追加し、「見当」という位置合わせ技術で重ね摺りした版画です。手彩色より大量生産が可能になりました。',
          image: imgBenizurie
        },
        {
          period: '1765年以降',
          name: '錦絵',
          nameColor: '#f8604f',
          description: '10枚以上の版木を精密に重ね、ぼかしや空摺り（エンボス）などの高度な技法を導入しました。浮世絵の技術的頂点です。',
          image: imgNishikie
        }
      ]
    },
    en: {
      title: 'The Dawn of Nishiki-e',
      subtitle: 'The Birth and Evolution of Multicolor Woodblock Printing',
      description: 'This digital archive visualizes the dramatic evolution of Ukiyo-e techniques from the 1760s to 1770s.',
      detail: 'Until the mid-18th century, Ukiyo-e were produced using "Benizuri-e," limited to 2-3 colors. However, in 1765, innovations by Suzuki Harunobu led to "Nishiki-e," multicolor prints using 10+ blocks.',
      techniques: [
        {
          period: 'c. 1660',
          name: 'Sumizuri-e',
          nameColor: '#000000',
          description: 'Woodblock prints using only black ink. Through Hishikawa Moronobu\'s fluid linework, ukiyo-e was established as an independent art form.',
          image: imgSumizurie
        },
        {
          period: 'c. 1740s',
          name: 'Benizuri-e',
          nameColor: '#cebe91',
          description: 'Added pink and green blocks using "kento" registration marks for precise overlay printing. Enabled mass production with improved color consistency.',
          image: imgBenizurie
        },
        {
          period: '1765+',
          name: 'Nishiki-e',
          nameColor: '#f8604f',
          description: 'Precisely overlaying 10+ woodblocks with advanced techniques like bokashi (gradation) and karazuri (embossing). The technical peak of ukiyo-e.',
          image: imgNishikie
        }
      ]
    }
  }

  const text = content[language] || content.ja

  return (
    <motion.section 
      className="fullscreen-section intro-section-ukiyoe first-section"
      variants={fadeIn}
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
    >
      {/* 背景 - シンプルなレイヤー構造 */}
      <div className="intro-bg-layer-gradient" />

      {/* コンテンツ */}
      <motion.div 
        className="intro-content-new"
        variants={slideUp}
      >
        {/* テキストコンテンツ（幅制限あり） */}
        <div className="intro-text-content">
          {/* タイトルと副題のグループ */}
          <div className="intro-title-group">
            {/* 大見出し */}
            <motion.h1 className="intro-title-large">
              {text.title}
            </motion.h1>

            {/* 副題 */}
            <motion.p className="intro-subtitle-thin">
              {text.subtitle}
            </motion.p>
          </div>

          {/* 説明文 */}
          <motion.div className="intro-text-block">
            <p className="intro-description-text">
              {text.description}
            </p>
            <p className="intro-detail-text">
              {text.detail}
            </p>
          </motion.div>
        </div>

        {/* 技法の進化カード（幅制限なし、横並び） */}
        <motion.div className="intro-evolution-cards">
          {text.techniques.map((technique, index) => (
            <motion.div 
              key={technique.name}
              className="evolution-card"
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5 + index * 0.15, duration: 0.6 }}
            >
              {/* タイトルと年代を横並び */}
              <div className="evolution-card-header">
                {/* タイトル */}
                <h3 
                  className="evolution-card-name" 
                  style={{ color: technique.nameColor }}
                >
                  {technique.name}
                </h3>
                
                {/* 年代とdivider */}
                <div className="evolution-card-period-container">
                  <div className="evolution-card-period">
                    {technique.period}
                  </div>
                  <div className="evolution-card-period-divider" />
                </div>
              </div>
              
              {/* 画像 */}
              <div className="evolution-card-image-container">
                <img 
                  src={technique.image} 
                  alt={technique.name}
                  className="evolution-card-image"
                />
              </div>
              
              {/* 説明テキスト（画像の下） */}
              <p className="evolution-card-description">
                {technique.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
