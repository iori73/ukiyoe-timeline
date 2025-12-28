import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

/**
 * Concept A: スライダー型（摺りの重ね体験）
 * 
 * - デフォルトで自動再生（ゆっくり0%→100%→0%とループ）
 * - プログレスバーをドラッグ/クリックで位置指定
 * - ドラッグ終了後は停止したまま
 * - 再生/一時停止ボタンで制御
 */
export default function ConceptA() {
  const [sliderValue, setSliderValue] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  
  const trackRef = useRef(null)
  const animationRef = useRef(null)
  const lastTimeRef = useRef(null)

  // 各技法の繁栄期間（年）とプログレスバー上の位置
  // 1660-1800年を100%として計算
  const techniques = [
    { 
      id: 'sumizuri', 
      name: '墨摺絵', 
      nameEn: 'Sumizuri-e',
      year: '1660年頃', 
      yearEn: 'c. 1660',
      yearStart: 1660,
      yearEnd: 1740,
      color: '#1a1a1a',
      image: '/sumizuri-e.png',
      desc: '墨一色のみで摺りました木版画です。線の強弱や濃淡で立体感や質感を表現しました'
    },
    { 
      id: 'benizuri', 
      name: '紅摺絵', 
      nameEn: 'Benizuri-e',
      year: '1740年代', 
      yearEn: 'c. 1740s',
      yearStart: 1740,
      yearEnd: 1765,
      color: '#95a078',
      image: '/benizuri-e.png',
      desc: '紅色と緑色を追加しました版画です。2〜3色程度の限られた色彩で華やかさを演出しました'
    },
    { 
      id: 'nishiki', 
      name: '錦絵', 
      nameEn: 'Nishiki-e',
      year: '1765年以降', 
      yearEn: '1765+',
      yearStart: 1765,
      yearEnd: 1800,
      color: '#f8604f',
      image: '/nishiki-e.png',
      desc: '10色以上の多色摺り木版画です。錦織のような豪華絢爛な色彩表現を実現しました'
    }
  ]

  // タイムライン全体の範囲
  const timelineStart = 1660
  const timelineEnd = 1800
  const timelineTotal = timelineEnd - timelineStart

  // 年をパーセンテージに変換
  const yearToPercent = (year) => ((year - timelineStart) / timelineTotal) * 100

  // 各技法のセグメント情報
  const segments = techniques.map(tech => ({
    id: tech.id,
    color: tech.color,
    start: yearToPercent(tech.yearStart),
    width: yearToPercent(tech.yearEnd) - yearToPercent(tech.yearStart)
  }))

  // 自動再生の速度（%/秒）- ゆっくり（約20秒で0→100%）
  const AUTO_PLAY_SPEED = 5

  // 自動再生アニメーション
  const animate = useCallback((currentTime) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = currentTime
    }

    const deltaTime = (currentTime - lastTimeRef.current) / 1000 // 秒に変換
    lastTimeRef.current = currentTime

    setSliderValue((prev) => {
      let newValue = prev + AUTO_PLAY_SPEED * deltaTime

      // 100%に達したら0%に戻ってループ
      if (newValue >= 100) {
        newValue = 0
      }

      return newValue
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [])

  // 自動再生の開始/停止
  useEffect(() => {
    if (isPlaying && !isDragging) {
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
  }, [isPlaying, isDragging, animate])

  // プログレスバーの位置からスライダー値を計算
  const calculateValueFromPosition = useCallback((clientX) => {
    if (!trackRef.current) return sliderValue
    
    const rect = trackRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    return percentage
  }, [sliderValue])

  // ドラッグ開始
  const handleDragStart = useCallback((clientX) => {
    setIsDragging(true)
    const newValue = calculateValueFromPosition(clientX)
    setSliderValue(newValue)
  }, [calculateValueFromPosition])

  // ドラッグ中
  const handleDragMove = useCallback((clientX) => {
    if (!isDragging) return
    const newValue = calculateValueFromPosition(clientX)
    setSliderValue(newValue)
  }, [isDragging, calculateValueFromPosition])

  // ドラッグ終了
  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      setIsPlaying(false) // ドラッグ後は停止
    }
  }, [isDragging])

  // マウスイベント
  const handleMouseDown = (e) => {
    e.preventDefault()
    handleDragStart(e.clientX)
  }

  // タッチイベント
  const handleTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX)
  }

  // グローバルマウス/タッチイベント（ドラッグ中にコンテナ外に出ても追従）
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

  // スライダー値に基づいて各画像の透明度を計算（実際の年代期間に基づく）
  const opacities = useMemo(() => {
    const benizuriStart = yearToPercent(1740) / 100 // 約0.5714
    const nishikiStart = yearToPercent(1765) / 100   // 0.75
    const value = sliderValue / 100
    
    if (value <= benizuriStart) {
      // 0-57.14%: 墨摺絵 → 紅摺絵
      const t = value / benizuriStart
      return {
        sumizuri: 1 - t,
        benizuri: t,
        nishiki: 0
      }
    } else if (value <= nishikiStart) {
      // 57.14-75%: 紅摺絵 → 錦絵
      const t = (value - benizuriStart) / (nishikiStart - benizuriStart)
      return {
        sumizuri: 0,
        benizuri: 1 - t,
        nishiki: t
      }
    } else {
      // 75-100%: 錦絵のみ
      return {
        sumizuri: 0,
        benizuri: 0,
        nishiki: 1
      }
    }
  }, [sliderValue])

  // 現在アクティブな技法を判定（実際の年代境界に基づく）
  const activeTechnique = useMemo(() => {
    // 各セグメントの境界値を使用
    const benizuriStart = yearToPercent(1740) // 約57.14%
    const nishikiStart = yearToPercent(1765)   // 75%
    
    if (sliderValue < benizuriStart) return 0 // 墨摺絵
    if (sliderValue < nishikiStart) return 1  // 紅摺絵
    return 2                                   // 錦絵
  }, [sliderValue])

  // 再生/一時停止の切り替え
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // ラベルクリック時（各技法の開始位置にジャンプして停止）
  const handleLabelClick = (index) => {
    const targetYear = techniques[index].yearStart
    setSliderValue(yearToPercent(targetYear))
    setIsPlaying(false)
  }

  return (
    <div className="concept-a">
      <div className="concept-header">
        <h3>Concept A</h3>
        <p className="concept-subtitle">スライダー型 — 摺りの重ね体験</p>
      </div>

      {/* 画像エリア - 3枚を重ねて表示 */}
      <div className="slider-image-container">
        <div className="slider-image-stack">
          {techniques.map((tech, index) => (
            <motion.img
              key={tech.id}
              src={tech.image}
              alt={tech.name}
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

        {/* 現在の技法ラベル */}
        <motion.div 
          className="current-technique-label"
          key={activeTechnique}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span 
            className="technique-name"
            style={{ color: techniques[activeTechnique].color }}
          >
            {techniques[activeTechnique].name}
          </span>
          <span className="technique-year">
            {techniques[activeTechnique].year}
          </span>
        </motion.div>
      </div>

      {/* スライダーコントロール */}
      <div className="slider-control">
        <div className="slider-labels">
          {techniques.map((tech, index) => (
            <button
              key={tech.id}
              className={`slider-label ${activeTechnique === index ? 'active' : ''}`}
              onClick={() => handleLabelClick(index)}
              style={{
                '--accent-color': tech.color
              }}
            >
              <span className="label-name">{tech.name}</span>
              <span className="label-year">{tech.year}</span>
            </button>
          ))}
        </div>

        {/* プログレスバー（ドラッグ可能）- 期間セグメント付き */}
        <div 
          ref={trackRef}
          className={`slider-track-container ${isDragging ? 'dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="slider-track">
            {/* 各技法の繁栄期間をセグメントとして表示 */}
            <div className="slider-segments">
              {segments.map((seg, index) => (
                <div
                  key={seg.id}
                  className={`slider-segment ${sliderValue >= seg.start && sliderValue < seg.start + seg.width ? 'active' : ''}`}
                  style={{
                    left: `${seg.start}%`,
                    width: `${seg.width}%`,
                    backgroundColor: seg.color,
                    opacity: sliderValue >= seg.start ? 0.8 : 0.3
                  }}
                />
              ))}
            </div>
            {/* 現在位置のつまみ */}
            <div 
              className="slider-thumb"
              style={{ left: `${sliderValue}%` }}
            />
          </div>
        </div>

        {/* 年代ラベル - 各技法の開始年を正確な位置に配置 */}
        <div className="slider-years-positioned">
          <span style={{ left: '0%' }}>1660</span>
          <span style={{ left: `${yearToPercent(1740)}%` }}>1740</span>
          <span style={{ left: `${yearToPercent(1765)}%` }}>1765</span>
          <span style={{ left: '100%' }}>1800</span>
        </div>

        {/* 再生/一時停止ボタン - 右下に配置 */}
        <div className="play-pause-wrapper">
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
        </div>
      </div>

      {/* 説明テキスト */}
      <motion.p 
        className="technique-description"
        key={activeTechnique}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {techniques[activeTechnique].desc}
      </motion.p>
    </div>
  )
}
