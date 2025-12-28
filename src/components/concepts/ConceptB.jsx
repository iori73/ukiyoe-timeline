import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Concept B: タイムライン融合型
 * 
 * 時間軸（1660-1765+）に連動して画像が変化
 * 各技法の繁栄期間を幅で可視化
 */
export default function ConceptB() {
  const [currentYear, setCurrentYear] = useState(1660)
  const timelineRef = useRef(null)

  const techniques = [
    { 
      id: 'sumizuri', 
      name: '墨摺絵', 
      yearStart: 1660,
      yearEnd: 1740,
      duration: 80, // years
      color: '#1a1a1a',
      image: '/sumizuri-e.png',
      desc: '墨一色のみで摺った木版画。菱川師宣により浮世絵が芸術形式として確立された。'
    },
    { 
      id: 'benizuri', 
      name: '紅摺絵', 
      yearStart: 1740,
      yearEnd: 1765,
      duration: 25,
      color: '#95a078',
      image: '/benizuri-e.png',
      desc: '紅色と緑色の版木を追加。「見当」技術で重ね摺りが可能になった。'
    },
    { 
      id: 'nishiki', 
      name: '錦絵', 
      yearStart: 1765,
      yearEnd: 1800,
      duration: 35,
      color: '#f8604f',
      image: '/nishiki-e.png',
      desc: '10枚以上の版木を精密に重ね、ぼかしや空摺りなどの高度な技法を導入。'
    }
  ]

  const minYear = 1660
  const maxYear = 1800
  const totalYears = maxYear - minYear

  // 現在の年に対応する技法を取得
  const activeTechnique = useMemo(() => {
    for (let i = techniques.length - 1; i >= 0; i--) {
      if (currentYear >= techniques[i].yearStart) {
        return techniques[i]
      }
    }
    return techniques[0]
  }, [currentYear])

  // タイムラインクリック/ドラッグでの年選択
  const handleTimelineInteraction = (e) => {
    if (!timelineRef.current) return
    
    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, x / rect.width))
    const year = Math.round(minYear + percentage * totalYears)
    setCurrentYear(year)
  }

  // ドラッグ中の処理
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e) => {
    setIsDragging(true)
    handleTimelineInteraction(e)
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleTimelineInteraction(e)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 年の位置をパーセンテージで計算
  const yearToPercent = (year) => {
    return ((year - minYear) / totalYears) * 100
  }

  return (
    <div 
      className="concept-b"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="concept-header">
        <h3>Concept B</h3>
        <p className="concept-subtitle">タイムライン融合型 — 時代の流れを体験</p>
      </div>

      {/* 画像エリア */}
      <div className="timeline-image-container">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeTechnique.id}
            src={activeTechnique.image}
            alt={activeTechnique.name}
            className="timeline-image"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
          />
        </AnimatePresence>

        {/* 年代インジケーター */}
        <div className="year-indicator">
          <span className="year-value">{currentYear}</span>
          <span 
            className="technique-badge"
            style={{ backgroundColor: activeTechnique.color }}
          >
            {activeTechnique.name}
          </span>
        </div>
      </div>

      {/* タイムライン */}
      <div 
        ref={timelineRef}
        className="timeline-bar"
        onMouseDown={handleMouseDown}
      >
        {/* 各技法の期間バー */}
        <div className="timeline-periods">
          {techniques.map((tech) => (
            <div
              key={tech.id}
              className={`period-bar ${activeTechnique.id === tech.id ? 'active' : ''}`}
              style={{
                left: `${yearToPercent(tech.yearStart)}%`,
                width: `${yearToPercent(tech.yearEnd) - yearToPercent(tech.yearStart)}%`,
                backgroundColor: tech.color
              }}
            >
              <span className="period-label">{tech.name}</span>
            </div>
          ))}
        </div>

        {/* 現在位置マーカー */}
        <div 
          className="timeline-cursor"
          style={{ left: `${yearToPercent(currentYear)}%` }}
        >
          <div className="cursor-line" />
          <div className="cursor-dot" />
        </div>

        {/* 年代マーカー */}
        <div className="timeline-ticks">
          {[1660, 1700, 1740, 1765, 1800].map((year) => (
            <div 
              key={year}
              className="tick"
              style={{ left: `${yearToPercent(year)}%` }}
            >
              <span className="tick-label">{year}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 説明テキスト */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTechnique.id}
          className="technique-info"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="info-header">
            <span 
              className="info-name"
              style={{ color: activeTechnique.color }}
            >
              {activeTechnique.name}
            </span>
            <span className="info-period">
              {activeTechnique.yearStart}–{activeTechnique.yearEnd}
              <span className="duration">（約{activeTechnique.duration}年間）</span>
            </span>
          </div>
          <p className="info-desc">{activeTechnique.desc}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

