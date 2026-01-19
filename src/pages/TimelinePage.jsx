import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loadUkiyoeData } from '../data/ukiyoe'
import TimelineDetailSection from '../components/timeline/TimelineDetailSection'
import VerticalScroll from '../components/timeline/VerticalScroll'
import TimelineGalleryIndicators from '../components/timeline/TimelineGalleryIndicators'
import LanguageToggle from '../components/LanguageToggle'
import { LayeredLogo } from '../components/common/AnimatedLogo'
import '../components/timeline/VerticalScroll.css'
import './TimelinePage.css'

/**
 * TimelinePage Component
 * 
 * /timeline ページ - 浮世絵の時代を垂直スクロールで巡る
 * - 垂直スクロールでセクション間をナビゲート
 * - 各セクションにparallax作品画像と固定テキスト
 * - GalleryIndicatorsスタイルのナビゲーション
 */
export default function TimelinePage() {
  const [periods, setPeriods] = useState([])
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // データ読み込み
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await loadUkiyoeData()
        setPeriods(data)
      } catch (err) {
        console.error('Failed to load ukiyoe data:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // セクション変更ハンドラ
  const handleSectionChange = useCallback((index) => {
    setCurrentSection(index)
  }, [])

  // インジケータークリックでスクロール
  // NOTE: 直接スクロールせず、VerticalScroll の scrollToSection に任せる
  // setCurrentSection だけ呼び出し、VerticalScroll が onSectionChange で同期
  const scrollToSectionRef = useRef(null)
  
  const handleIndicatorClick = useCallback((index) => {
    // VerticalScroll の scrollToSection を呼び出す
    if (scrollToSectionRef.current) {
      scrollToSectionRef.current(index)
    }
  }, [])

  // ローディング表示
  if (isLoading) {
    return (
      <div className="timeline-page timeline-page--loading">
        <div className="timeline-loading">
          <div className="timeline-loading__spinner" />
          <p className="timeline-loading__text">
            浮世絵の歴史を読み込み中...
          </p>
        </div>
      </div>
    )
  }

  // エラー表示
  if (error) {
    return (
      <div className="timeline-page timeline-page--error">
        <div className="timeline-error">
          <p>データの読み込みに失敗しました</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="timeline-page">
      {/* ヘッダー */}
      <header className="header">
        <motion.div 
          className="header-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            to="/"
            className="logo" 
            style={{ cursor: 'pointer', textDecoration: 'none' }}
          >
            <LayeredLogo size="small" animate={false} />
          </Link>
          <LanguageToggle />
        </motion.div>
      </header>

      {/* ギャラリーインジケーター */}
      <TimelineGalleryIndicators
        currentSection={currentSection}
        totalSections={periods.length}
        onSectionClick={handleIndicatorClick}
        periods={periods}
      />

      {/* 垂直スクロールコンテナ */}
      <VerticalScroll
        totalSections={periods.length}
        onSectionChange={handleSectionChange}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        scrollToSectionRef={scrollToSectionRef}
      >
        {periods.map((period, index) => (
          <TimelineDetailSection
            key={period.id || index}
            period={period}
            index={index}
            totalPeriods={periods.length}
          />
        ))}
      </VerticalScroll>
    </div>
  )
}

