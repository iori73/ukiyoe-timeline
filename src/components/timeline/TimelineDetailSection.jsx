import { useRef, useMemo, useState, useEffect, useCallback, forwardRef, useImperativeHandle, memo } from 'react'
import { motion, useSpring } from 'framer-motion'
import { duration, easing, spring } from '../../constants/motion'
import { useLanguage } from '../../context/LanguageContext'
import { getLocalizedField, getArtworksForPeriod } from '../../data/ukiyoe'
import { truncateToSentences } from '../../utils/text'
import ParallaxArtworks from './ParallaxArtworks'
import './TimelineDetailSection.css'

/**
 * 作品レイヤーの高さ（vh単位）
 * ネイティブスクロール時: 1時代あたりのスクロール量 = この値 - 100vh
 *
 * 280vh にすることで:
 * - 17%間隔 × 280vh = 47.6vh のカード間スペース
 * - 画像最大45vh + テキスト ≈ 50vh に対して十分な余裕
 * - ブラウザ幅が狭い場合やモバイルでも重なりが起きない
 * - progress=1 時に最後の作品（73% = 204.4vh）が画面内に収まる
 */
export const ARTWORK_LAYER_HEIGHT_VH = 280

/** 作品レイヤーの最大スクロール量（vh単位） */
const MAX_ARTWORK_SCROLL_VH = ARTWORK_LAYER_HEIGHT_VH - 100

// ========================================
// パネル（時代情報） - 共通サブコンポーネント
// ========================================
function PeriodPanel({ period, index, language, isActive, isArtworkModalOpen }) {
  const sectionNumber = String(index + 1).padStart(2, '0')
  const keyEvent = getLocalizedField(period, 'key_event', language)
  const exampleWorks = getLocalizedField(period, 'example_works', language)
  const fullBg = getLocalizedField(period, 'background', language)
  const backgroundSummary = truncateToSentences(fullBg, 2, language)

  // パネル自体は固定、テキストコンテンツのみをふわっと上に消すアニメーション
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const panelOpacity = isActive ? (isArtworkModalOpen ? 0.15 : 1) : 0

  return (
    <motion.div
      className="timeline-section__panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: panelOpacity }}
      transition={{ duration: duration.normal, ease: easing.ukiyoe }}
    >
      <motion.div
        className="timeline-section__panel-content"
        initial="hidden"
        animate={isActive ? "visible" : "exit"}
        variants={contentVariants}
        transition={{ duration: duration.normal, ease: easing.ukiyoe }}
      >
        <div className="timeline-section__header">
          <div className="timeline-section__number">{sectionNumber}</div>
          <div className="timeline-section__date-range">
            <div className="timeline-section__date-bar">
              <div className="timeline-section__date-bar-line" />
              <div className="timeline-section__date-bar-dot timeline-section__date-bar-dot--start" />
              <div className="timeline-section__date-bar-dot timeline-section__date-bar-dot--end" />
            </div>
            <div className="timeline-section__date-inner">
              <span className="timeline-section__date-start">{period.year_start}</span>
              <span className="timeline-section__date-end">{period.year_end}</span>
            </div>
          </div>
        </div>

        <div className="timeline-section__meta">
          {keyEvent && (
            <div className="timeline-section__meta-item">
              <div className="timeline-section__meta-header">
                <span className="timeline-section__meta-label">{language === 'ja' ? '重要な出来事' : 'Key Event'}</span>
                <div className="timeline-section__meta-divider" />
              </div>
              <p className="timeline-section__meta-text">{keyEvent}</p>
            </div>
          )}
          {exampleWorks && (
            <div className="timeline-section__meta-item">
              <div className="timeline-section__meta-header">
                <span className="timeline-section__meta-label">{language === 'ja' ? '代表作品' : 'Key Works'}</span>
                <div className="timeline-section__meta-divider" />
              </div>
              <p className="timeline-section__meta-text">{exampleWorks}</p>
            </div>
          )}
        </div>

        {backgroundSummary && (
          <div className="timeline-section__summary">
            <p className="timeline-section__summary-text">{backgroundSummary}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ========================================
// メインコンポーネント
// ========================================
const TimelineDetailSection = memo(forwardRef(function TimelineDetailSection({
  period,
  index,
  isActive,
  totalPeriods,
  useNativeScroll = false,
  onArtworkDetailOpenChange,
  // 旧VerticalScroll用（互換）
  scrollProgress = 0,
  onScrollComplete,
  onScrollStart
}, ref) {
  const { language } = useLanguage()
  const sectionRef = useRef(null)
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false)

  // 作品詳細モーダルの開閉を親に通知
  useEffect(() => {
    onArtworkDetailOpenChange?.(isArtworkModalOpen)
  }, [isArtworkModalOpen, onArtworkDetailOpenChange])

  // 作品画像を取得
  const artworks = useMemo(() => getArtworksForPeriod(String(period.year_start)), [period.year_start])

  // ============================
  // ネイティブスクロール（俵屋方式）
  // ============================
  if (useNativeScroll) {
    // ref を section 要素に直接紐付ける（親が offsetTop/offsetHeight を読む）
    const setRef = (el) => {
      sectionRef.current = el
      if (typeof ref === 'function') ref(el)
      else if (ref) ref.current = el
    }

    return (
      <section
        ref={setRef}
        className="timeline-ns"
        style={{ height: `${ARTWORK_LAYER_HEIGHT_VH}vh` }}
        data-index={index}
      >
        {/* sticky viewport: スクロールしても画面に留まり、中の作品レイヤーだけが動く */}
        <div className="timeline-ns__viewport">
          {/* transform は TimelinePage の scroll handler が直接 DOM 操作で設定 */}
          <div
            className="timeline-ns__artwork-layer"
            style={{ height: `${ARTWORK_LAYER_HEIGHT_VH}vh` }}
          >
            <ParallaxArtworks
              artworks={artworks}
              isActive={isActive}
              sectionRef={sectionRef}
              sectionIndex={index}
              layerHeight={ARTWORK_LAYER_HEIGHT_VH}
              onModalStateChange={setIsArtworkModalOpen}
            />
          </div>

          <motion.div
            className="timeline-section__gradient-overlay"
            animate={{ opacity: isArtworkModalOpen ? 0.2 : 1 }}
            transition={{ duration: duration.normal }}
          />

          {/* パネルは TimelinePage レベルで position: fixed 表示 */}
        </div>
      </section>
    )
  }

  // ============================
  // 旧方式（VerticalScroll 用 - /timeline-old などの互換）
  // ============================
  const maxScroll = typeof window !== 'undefined' ? (MAX_ARTWORK_SCROLL_VH / 100) * window.innerHeight : 800
  const scrollYRef = useRef(0)
  const springY = useSpring(0, spring.gentle)
  const hasEntryPrepared = useRef(false)

  useEffect(() => {
    if (useNativeScroll) return
    if (isActive && !hasEntryPrepared.current) { scrollYRef.current = 0; springY.set(0) }
    if (isActive) hasEntryPrepared.current = false
  }, [isActive, springY, useNativeScroll])

  const handleWheel = useCallback((deltaY) => {
    if (!isActive) return { consumed: false, direction: null }
    const cur = scrollYRef.current
    const next = cur + deltaY
    if (next < 0) {
      if (cur <= 0) return { consumed: false, direction: 'prev' }
      scrollYRef.current = 0; springY.set(0); return { consumed: true, direction: null }
    }
    if (next > maxScroll) {
      if (cur >= maxScroll) return { consumed: false, direction: 'next' }
      scrollYRef.current = maxScroll; springY.set(-maxScroll); onScrollComplete?.(); return { consumed: true, direction: null }
    }
    scrollYRef.current = next; springY.set(-next)
    if (cur === 0 && deltaY > 0) onScrollStart?.()
    return { consumed: true, direction: null }
  }, [isActive, maxScroll, onScrollComplete, onScrollStart, springY])

  useImperativeHandle(ref, () => ({
    handleWheel,
    resetScroll: () => { scrollYRef.current = 0; springY.set(0) },
    getScrollProgress: () => scrollYRef.current / maxScroll,
    prepareEntry: (dir) => {
      hasEntryPrepared.current = true; scrollYRef.current = 0
      springY.jump(dir === 'next' ? maxScroll * 0.3 : -maxScroll * 0.3)
      requestAnimationFrame(() => springY.set(0))
    }
  }), [handleWheel, maxScroll, springY])

  return (
    <section
      ref={sectionRef}
      className={`timeline-section ${isActive ? 'timeline-section--active' : ''}`}
      data-index={index}
      data-active={isActive}
    >
      <div className="timeline-section__viewport">
        <motion.div
          className="timeline-section__artwork-layer"
          style={{ height: `${ARTWORK_LAYER_HEIGHT_VH}vh`, y: springY }}
        >
          <ParallaxArtworks
            artworks={artworks}
            isActive={isActive}
            sectionRef={sectionRef}
            sectionIndex={index}
            layerHeight={ARTWORK_LAYER_HEIGHT_VH}
            onModalStateChange={setIsArtworkModalOpen}
          />
        </motion.div>
        <motion.div
          className="timeline-section__gradient-overlay"
          animate={{ opacity: isArtworkModalOpen ? 0.2 : 1 }}
          transition={{ duration: duration.normal }}
        />
        <PeriodPanel
          period={period}
          index={index}
          language={language}
          isActive={isActive}
          isArtworkModalOpen={isArtworkModalOpen}
        />
      </div>
    </section>
  )
}))

export default TimelineDetailSection
