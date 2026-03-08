import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { duration, easing } from '../constants/motion'
import { loadUkiyoeData, getLocalizedField, getArtworksForPeriod } from '../data/ukiyoe'
import TimelineDetailSection, { ARTWORK_LAYER_HEIGHT_VH } from '../components/timeline/TimelineDetailSection'
import TimelineGalleryIndicators from '../components/timeline/TimelineGalleryIndicators'
import ArtworkGalleryGrid from '../components/timeline/ArtworkGalleryGrid'
import LanguageToggle from '../components/LanguageToggle'
import { useLanguage } from '../context/LanguageContext'
import './TimelinePage.css'

/**
 * 文章を指定した文数に短縮する
 */
const truncateToSentences = (text, maxSentences = 2, lang = 'ja') => {
  if (!text) return ''
  const pattern = lang === 'ja'
    ? /[^。！？]+[。！？]/g
    : /[^.!?]+[.!?]+/g
  const sentences = text.match(pattern) || [text]
  return sentences.slice(0, maxSentences).join('')
}

/**
 * テキストコンテンツのアニメーション variants
 * ふわっと上に消えて、下からふわっと現れる
 */
const panelContentVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 }
}

/**
 * Fixed パネル - 左下に固定、テキストだけが AnimatePresence で切り替わる
 */
function FixedPeriodPanel({ period, index, language, isArtworkDetailOpen, showGallery }) {
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    setIsExpanded(false)
  }, [index])

  if (!period) return null

  const sectionNumber = String(index + 1).padStart(2, '0')
  const keyEvent = getLocalizedField(period, 'key_event', language)
  const exampleWorks = getLocalizedField(period, 'example_works', language)
  const fullBg = getLocalizedField(period, 'background', language)
  const backgroundSummary = truncateToSentences(fullBg, 2, language)

  return (
    <motion.div
      className={`timeline-fixed-panel ${isExpanded ? 'timeline-fixed-panel--expanded' : ''}`}
      animate={{ opacity: showGallery ? 0 : (isArtworkDetailOpen ? 0.15 : 1) }}
      transition={{ duration: duration.normal, ease: easing.ukiyoe }}
      style={{ pointerEvents: showGallery ? 'none' : 'auto' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="timeline-fixed-panel__content"
          variants={panelContentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: duration.normal, ease: easing.ukiyoe }}
        >
          <div className="timeline-section__header">
            <div className="timeline-section__heading">
              <div className="timeline-section__number">{sectionNumber}</div>
              <div className="timeline-section__date-badge">
                <span className="timeline-section__date-start">{period.year_start}</span>
                <span className="timeline-section__date-dash">—</span>
                <span className="timeline-section__date-end">{period.year_end}</span>
              </div>
              <button
                className="timeline-fixed-panel__toggle"
                onClick={() => setIsExpanded(prev => !prev)}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            {keyEvent && (
              <p className="timeline-section__header-title">{keyEvent.replace(/[（(][^）)]*[）)]/g, '').trim()}</p>
            )}
          </div>

          <div className={`timeline-fixed-panel__collapsible ${isExpanded ? 'timeline-fixed-panel__collapsible--expanded' : ''}`}>
            {exampleWorks && (
              <div className="timeline-section__meta">
                <div className="timeline-section__meta-item">
                  <div className="timeline-section__meta-header">
                    <span className="timeline-section__meta-label">{language === 'ja' ? '代表作品' : 'Key Works'}</span>
                    <div className="timeline-section__meta-divider" />
                  </div>
                  <p className="timeline-section__meta-text">{exampleWorks}</p>
                </div>
              </div>
            )}

            {backgroundSummary && (
              <div className="timeline-section__summary">
                <p className="timeline-section__summary-text">{backgroundSummary}</p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

/**
 * TimelinePage Component
 *
 * /timeline - ネイティブスクロールの1本の長いページ（俵屋方式）
 * - ホイールは消費しない。セクションはスクロール位置で「アクティブ」を決めるだけ
 * - 一覧へは最後までスクロールで遷移
 */
export default function TimelinePage() {
  const { language } = useLanguage()
  const [periods, setPeriods] = useState([])
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showGallery, setShowGallery] = useState(false)
  const [isArtworkDetailOpen, setIsArtworkDetailOpen] = useState(false)

  const sectionRefs = useRef([])
  const galleryRef = useRef(null)
  const rafId = useRef(null)
  const currentSectionRef = useRef(0)

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

  // 最初のセクションの画像をプリフェッチ（ユーザーが最初に見る画像の読み込みを高速化）
  useEffect(() => {
    if (periods.length === 0) return
    const firstPeriod = periods[0]
    const artworks = getArtworksForPeriod(String(firstPeriod.year_start))
    artworks.slice(0, 5).forEach(artwork => {
      const img = new Image()
      img.src = artwork.url
    })
  }, [periods])

  // ネイティブスクロール: parallax transform は直接 DOM 操作、section 切り替えのみ React state
  useEffect(() => {
    const total = periods.length
    if (total === 0) return

    const maxScrollVh = ARTWORK_LAYER_HEIGHT_VH - 100

    const updateFromScroll = () => {
      const vh = window.innerHeight
      const scrollY = window.scrollY
      let newCurrent = 0

      for (let i = 0; i < total; i++) {
        const el = sectionRefs.current[i]
        if (!el) continue
        const top = el.offsetTop
        const height = el.offsetHeight
        const scrollable = Math.max(0, height - vh)
        const progress = scrollable <= 0 ? 0 : Math.max(0, Math.min(1, (scrollY - top) / scrollable))

        // 直接 DOM 操作 — React 再レンダーをバイパス
        const layer = el.querySelector('.timeline-ns__artwork-layer')
        if (layer) {
          layer.style.transform = `translateY(-${maxScrollVh * progress}vh)`
        }

        if (scrollY >= top && scrollY < top + height) {
          newCurrent = i
        }
      }

      const lastEl = sectionRefs.current[total - 1]
      if (lastEl && scrollY >= lastEl.offsetTop + lastEl.offsetHeight) {
        newCurrent = total - 1
      }

      // セクションが変わった時だけ React state を更新（低頻度）
      if (newCurrent !== currentSectionRef.current) {
        currentSectionRef.current = newCurrent
        setCurrentSection(newCurrent)
      }
    }

    const onScroll = () => {
      if (rafId.current !== null) return
      rafId.current = requestAnimationFrame(() => {
        updateFromScroll()
        rafId.current = null
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateFromScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [periods.length])

  // ギャラリー表示: ギャラリーが画面の一定以上に入ったら一覧表示モード
  useEffect(() => {
    if (!galleryRef.current) return

    const check = () => {
      const galleryRect = galleryRef.current.getBoundingClientRect()
      const threshold = window.innerHeight * 0.4
      if (galleryRect.top < threshold) {
        setShowGallery(true)
      } else if (galleryRect.top > window.innerHeight * 0.5) {
        setShowGallery(false)
      }
    }

    const onScroll = () => requestAnimationFrame(check)
    window.addEventListener('scroll', onScroll, { passive: true })
    check()
    return () => window.removeEventListener('scroll', onScroll)
  }, [periods.length])

  const handleIndicatorClick = useCallback((index) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleGalleryClick = useCallback(() => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const setSectionRef = useCallback((index) => (node) => {
    sectionRefs.current[index] = node
  }, [])

  if (isLoading) {
    return (
      <div className="timeline-page timeline-page--loading">
        <div className="timeline-loading">
          <p className="timeline-loading__text">
            {language === 'ja' ? '浮世絵の歴史を読み込み中...' : 'Loading ukiyoe timeline...'}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="timeline-page timeline-page--error">
        <div className="timeline-error">
          <p>{language === 'ja' ? 'データの読み込みに失敗しました' : 'Failed to load data'}</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`timeline-page timeline-page--native-scroll${showGallery ? ' timeline-page--gallery-mode' : ''}`}>
      <header className={`header${isArtworkDetailOpen ? ' header--detail-open' : ''}`}>
        <motion.div
          className="header-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.slow }}
        >
          <Link to="/" className="logo" style={{ cursor: 'pointer', textDecoration: 'none' }} aria-hidden={isArtworkDetailOpen}>
            <span className="logo-kanji">
              <img src="/images/logo-square.svg" alt="浮世絵" className="logo-kanji-image" width="48" height="48" />
            </span>
          </Link>
          <LanguageToggle />
        </motion.div>
      </header>

      <TimelineGalleryIndicators
        currentSection={currentSection}
        totalSections={periods.length}
        onSectionClick={handleIndicatorClick}
        onGalleryClick={handleGalleryClick}
        periods={periods}
        isGalleryMode={showGallery}
      />

      {/* 左下固定パネル: position fixed でスクロールに影響されない */}
      <FixedPeriodPanel
        period={periods[currentSection]}
        index={currentSection}
        language={language}
        isArtworkDetailOpen={isArtworkDetailOpen}
        showGallery={showGallery}
      />

      <div className="timeline-native-scroll">
        {periods.map((period, index) => (
          <TimelineDetailSection
            key={period.id || index}
            ref={setSectionRef(index)}
            period={period}
            index={index}
            totalPeriods={periods.length}
            isActive={currentSection === index}
            useNativeScroll
            onArtworkDetailOpenChange={setIsArtworkDetailOpen}
          />
        ))}

        <div ref={galleryRef}>
          <ArtworkGalleryGrid periods={periods} onModalStateChange={setIsArtworkDetailOpen} />
        </div>
      </div>
    </div>
  )
}
