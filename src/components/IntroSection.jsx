import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

/**
 * IntroSection - トップページ導入セクション
 * 
 * 構造:
 * - 導入部: タイトル・説明文（中央上部）
 * - インタラクティブスライダー: 3つの技法を重ねて表示（Concept A採用）
 */
export default function IntroSection({ isActive }) {
  const { language } = useLanguage()
  
  // スライダー関連の状態管理
  const [sliderValue, setSliderValue] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  
  const trackRef = useRef(null)
  const animationRef = useRef(null)
  const lastTimeRef = useRef(null)

  // 技法データ（年代情報を含む）
  const techniques = [
    { 
      id: 'sumizuri', 
      name: { ja: '墨摺絵', en: 'Sumizuri-e' },
      period: { ja: '1660年頃', en: 'c. 1660' },
      yearStart: 1660,
      yearEnd: 1740,
      visualWidth: 40, // 視覚的な幅（%）
      color: '#1a1a1a',
      image: '/sumizuri-e.png',
      desc: { 
        ja: '墨（黒）一色のみで摺りました木版画です。菱川師宣の流麗な線描により、浮世絵は独立した芸術形式として確立されました。線の強弱と濃淡で豊かな表現を追求しました。',
        en: 'Woodblock prints using only black ink. Through Moronobu\'s fluid linework, ukiyo-e was established as an independent art form. Rich expressions were pursued through line variation and tonal gradation.'
      }
    },
    { 
      id: 'benizuri', 
      name: { ja: '紅摺絵', en: 'Benizuri-e' },
      period: { ja: '1740年代', en: 'c. 1740s' },
      yearStart: 1740,
      yearEnd: 1765,
      visualWidth: 28, // 視覚的な幅（%）
      color: '#95a078',
      image: '/benizuri-e.png',
      desc: { 
        ja: '紅色と緑色の版木を追加し、「見当」という位置合わせ技術で重ね摺りしました版画です。手彩色より大量生産が可能になりました。2〜3色の限られた色彩ながら、華やかな印象を生み出しました。',
        en: 'Added pink and green blocks using "kento" registration marks. Enabled mass production with improved color consistency. Despite the limited palette of 2-3 colors, it created a vibrant impression.'
      }
    },
    { 
      id: 'nishiki', 
      name: { ja: '錦絵', en: 'Nishiki-e' },
      period: { ja: '1765年以降', en: '1765+' },
      yearStart: 1765,
      yearEnd: 1800,
      visualWidth: 32, // 視覚的な幅（%）
      color: '#f8604f',
      image: '/nishiki-e.png',
      desc: { 
        ja: '10枚以上の版木を精密に重ね、ぼかしや空摺りなどの高度な技法を導入しました。浮世絵の技術的頂点です。錦織のような豪華絢爛な色彩表現が可能になりました。',
        en: 'Precisely overlaying 10+ woodblocks with advanced techniques like bokashi and karazuri. The technical peak of ukiyo-e. Achieved gorgeous, brocade-like polychrome expressions.'
      }
    }
  ]

  const content = {
    ja: {
      title: '錦絵の黎明',
      subtitle: '多色摺り木版画の誕生と進化',
      description: 'このデジタルアーカイブは、1760年代から1770年代にかけての浮世絵技術の劇的な進化を可視化したものです。18世紀中頃まで、浮世絵は「紅摺絵」と呼ばれる2〜3色の限られた色彩で制作されていました。しかし1765年、鈴木春信らによる技術革新により、10色以上の版木を重ね合わせる多色摺り木版画「錦絵」が誕生します。'
    },
    en: {
      title: 'The Dawn of Nishiki-e',
      subtitle: 'The Birth and Evolution of Multicolor Woodblock Printing',
      description: 'This digital archive visualizes the dramatic evolution of Ukiyo-e techniques from the 1760s to 1770s. Until the mid-18th century, Ukiyo-e were produced using "Benizuri-e," limited to 2-3 colors. However, in 1765, innovations by Suzuki Harunobu led to "Nishiki-e," multicolor prints using 10+ blocks.'
    }
  }

  const t = content[language] || content.ja

  // 各技法のセグメント情報（視覚的な幅を使用）
  const segments = useMemo(() => {
    let currentStart = 0
    return techniques.map(tech => {
      const segment = {
        id: tech.id,
        color: tech.color,
        start: currentStart,
        width: tech.visualWidth
      }
      currentStart += tech.visualWidth
      return segment
    })
  }, [])

  // 各セグメントのfill率を計算（Appleスタイルのプログレスバー用）
  const getSegmentFillPercent = useCallback((segmentStart, segmentWidth) => {
    if (sliderValue < segmentStart) {
      // まだこのセグメントに到達していない
      return 0
    } else if (sliderValue >= segmentStart + segmentWidth) {
      // このセグメントは完全にfillされた
      return 100
    } else {
      // このセグメントをfill中
      return ((sliderValue - segmentStart) / segmentWidth) * 100
    }
  }, [sliderValue])

  // 自動再生の速度（%/秒）
  const AUTO_PLAY_SPEED = 7.5

  // requestAnimationFrameを使った自動再生
  const animate = useCallback((currentTime) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = currentTime
    }

    const deltaTime = (currentTime - lastTimeRef.current) / 1000
    lastTimeRef.current = currentTime

    setSliderValue((prev) => {
      let newValue = prev + AUTO_PLAY_SPEED * deltaTime
      if (newValue >= 100) {
        newValue = 0
      }
      return newValue
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    if (isPlaying && !isDragging && isActive) {
      lastTimeRef.current = null
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, isDragging, isActive, animate])

  // ドラッグ処理
  const calculateValueFromPosition = useCallback((clientX) => {
    if (!trackRef.current) return sliderValue
    
    const rect = trackRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    return percentage
  }, [sliderValue])

  const handleDragStart = useCallback((clientX) => {
    setIsDragging(true)
    const newValue = calculateValueFromPosition(clientX)
    setSliderValue(newValue)
  }, [calculateValueFromPosition])

  const handleDragMove = useCallback((clientX) => {
    if (!isDragging) return
    const newValue = calculateValueFromPosition(clientX)
    setSliderValue(newValue)
  }, [isDragging, calculateValueFromPosition])

  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      setIsPlaying(false)
    }
  }, [isDragging])

  const handleMouseDown = (e) => {
    e.preventDefault()
    handleDragStart(e.clientX)
  }

  const handleTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX)
  }

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e) => handleDragMove(e.clientX)
      const handleGlobalMouseUp = () => handleDragEnd()
      const handleGlobalTouchMove = (e) => handleDragMove(e.touches[0].clientX)
      const handleGlobalTouchEnd = () => handleDragEnd()

      window.addEventListener('mousemove', handleGlobalMouseMove)
      window.addEventListener('mouseup', handleGlobalMouseUp)
      window.addEventListener('touchmove', handleGlobalTouchMove)
      window.addEventListener('touchend', handleGlobalTouchEnd)

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove)
        window.removeEventListener('mouseup', handleGlobalMouseUp)
        window.removeEventListener('touchmove', handleGlobalTouchMove)
        window.removeEventListener('touchend', handleGlobalTouchEnd)
      }
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  // 透明度計算（visualWidthベース）
  const opacities = useMemo(() => {
    const benizuriStart = techniques[0].visualWidth / 100 // 墨摺絵の幅
    const nishikiStart = (techniques[0].visualWidth + techniques[1].visualWidth) / 100 // 墨摺絵+紅摺絵の幅
    const value = sliderValue / 100
    
    if (value <= benizuriStart) {
      const t = value / benizuriStart
      return {
        sumizuri: 1 - t,
        benizuri: t,
        nishiki: 0
      }
    } else if (value <= nishikiStart) {
      const t = (value - benizuriStart) / (nishikiStart - benizuriStart)
      return {
        sumizuri: 0,
        benizuri: 1 - t,
        nishiki: t
      }
    } else {
      return {
        sumizuri: 0,
        benizuri: 0,
        nishiki: 1
      }
    }
  }, [sliderValue])

  // 現在アクティブな技法を判定（visualWidthベース）
  const activeTechnique = useMemo(() => {
    const benizuriStart = techniques[0].visualWidth // 墨摺絵の幅
    const nishikiStart = techniques[0].visualWidth + techniques[1].visualWidth // 墨摺絵+紅摺絵の幅
    
    if (sliderValue < benizuriStart) return 0
    if (sliderValue < nishikiStart) return 1
    return 2
  }, [sliderValue])

  // 再生/一時停止の切り替え
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // ラベルクリック時（visualWidthベース）
  const handleLabelClick = (index) => {
    // 各技法の開始位置を計算
    let targetValue = 0
    for (let i = 0; i < index; i++) {
      targetValue += techniques[i].visualWidth
    }
    setSliderValue(targetValue)
    setIsPlaying(false)
  }

  return (
    <motion.section 
      className="fullscreen-section intro-section intro-section-ukiyoe first-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1, ease: [0.19, 1.0, 0.22, 1.0] }}
    >
      {/* 2カラムレイアウト */}
      <motion.div 
        className="intro-content-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* 左カラム: テキストとコントロール */}
        <div className="intro-left-column">
          {/* タイトル・説明 */}
          <div className="intro-text-content">
            <div className="intro-title-container">
              <h1 className="intro-title">{t.title}</h1>
              <h2 className="intro-subtitle">{t.subtitle}</h2>
            </div>
            <p className="intro-description">{t.description}</p>
          </div>

          {/* スライダーと技法情報のコンテナ */}
          <div className="slider-technique-container">
            {/* スライダーコントロール */}
            <div className="slider-control">
            {/* プログレスバーと再生ボタンの行 */}
            <div className="slider-bar-row">
              {/* 再生/一時停止ボタン */}
              <button 
                className={`play-pause-button ${isPlaying ? 'playing' : 'paused'}`}
                onClick={togglePlayPause}
                aria-label={isPlaying ? '一時停止' : '再生'}
              >
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* プログレスバー（ドラッグ可能）*/}
              <div className="slider-bar-wrapper">
                <div 
                  ref={trackRef}
                  className={`slider-track-container ${isDragging ? 'dragging' : ''}`}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                >
                  <div className="slider-track">
                    {/* 各技法の繁栄期間をセグメントとして表示（Appleスタイル） */}
                    <div className="slider-segments">
                      {segments.map((seg) => {
                        const fillPercent = getSegmentFillPercent(seg.start, seg.width)
                        return (
                          <div
                            key={seg.id}
                            className="slider-segment"
                            style={{
                              left: `${seg.start}%`,
                              width: `${seg.width}%`,
                              backgroundColor: 'rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            {/* Fill部分 */}
                            <div
                              className="segment-fill"
                              style={{
                                width: `${fillPercent}%`,
                                backgroundColor: seg.color
                              }}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* 年代ラベル（visualWidthに基づいて配置） */}
                <div className="slider-years-positioned">
                  <span style={{ left: '0%' }}>1660</span>
                  <span style={{ left: `${techniques[0].visualWidth}%` }}>1740</span>
                  <span style={{ left: `${techniques[0].visualWidth + techniques[1].visualWidth}%` }}>1765</span>
                  <span style={{ left: '100%' }}>1800</span>
                </div>
              </div>
            </div>
          </div>

          {/* 現在の技法情報 */}
          <motion.div 
            className="current-technique-info"
            key={activeTechnique}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="current-technique-header">
              <span 
                className="technique-name"
                style={{ color: techniques[activeTechnique].color }}
              >
                {techniques[activeTechnique].name[language]}
              </span>
              <span className="technique-year">
                {techniques[activeTechnique].period[language]}
              </span>
            </div>
            <p className="technique-description">
              {techniques[activeTechnique].desc[language]}
            </p>
          </motion.div>
          </div>
        </div>

        {/* 右カラム: 重ねられた画像 */}
        <div className="intro-right-column">
          <div className="slider-image-stack">
            {techniques.map((tech, index) => (
              <motion.img
                key={tech.id}
                src={tech.image}
                alt={tech.name[language]}
                className="slider-image-layer"
                style={{
                  zIndex: index + 1,
                  opacity: opacities[tech.id]
                }}
                animate={{
                  opacity: opacities[tech.id]
                }}
                transition={{ duration: isDragging ? 0.05 : 0.15, ease: 'easeOut' }}
                draggable={false}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}
