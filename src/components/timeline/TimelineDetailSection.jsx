import { useRef, useMemo, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import { getLocalizedField, getArtworksForPeriod } from '../../data/ukiyoe'
import ParallaxArtworks from './ParallaxArtworks'
import './TimelineDetailSection.css'

/**
 * 作品レイヤーの高さ（vh単位）
 * 
 * 【修正】200vh → 280vh に拡大
 * - 上部バッファ: 作品を見始める前の余白
 * - 作品エリア: 4作品を十分な間隔で配置
 * - 下部バッファ: 最後の作品を見終えてから次の時代に移る余白
 * 
 * これにより、ユーザーが全ての作品を十分に見てから次の時代に移れる
 */
const ARTWORK_LAYER_HEIGHT_VH = 280

/**
 * 作品レイヤーの最大スクロール量（vh単位）
 * = レイヤー高さ - ビューポート高さ = 280 - 100 = 180vh
 */
const MAX_ARTWORK_SCROLL_VH = ARTWORK_LAYER_HEIGHT_VH - 100

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
 * TimelineDetailSection Component
 *
 * 各時代の詳細セクション
 * - ビューポート: 100vh固定
 * - 作品レイヤー: 200vh（スクロールで上に移動）
 * - パネル・インジケーター: 固定表示
 * - 作品レイヤーが最後までスクロールしたら次の時代へ
 */
const TimelineDetailSection = forwardRef(function TimelineDetailSection({
  period,
  index,
  isActive,
  totalPeriods,
  onScrollComplete,
  onScrollStart
}, ref) {
  const { language } = useLanguage()
  const sectionRef = useRef(null)
  
  // モーダル開閉状態（パネルの不透明度を制御）
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false)

  // maxScrollを計算（windowサイズに基づく）
  const maxScroll = typeof window !== 'undefined'
    ? (MAX_ARTWORK_SCROLL_VH / 100) * window.innerHeight
    : 800

  // スクロール位置をrefで管理（stale closure問題を回避）
  const scrollYRef = useRef(0)
  // UI更新用のstate（springアニメーション用）
  const [, forceUpdate] = useState(0)

  // スムーズなアニメーション用のspring
  const springY = useSpring(0, {
    stiffness: 100,
    damping: 30,
    mass: 0.5
  })

  // スクロール位置をリセット（セクション切り替え時）
  const hasEntryPrepared = useRef(false)

  useEffect(() => {
    if (isActive && !hasEntryPrepared.current) {
      // prepareEntryが呼ばれていない場合のみリセット（初回表示など）
      scrollYRef.current = 0
      springY.set(0)
    }
    if (isActive) {
      hasEntryPrepared.current = false
    }
  }, [isActive, springY])

  // ホイールイベントを処理（refを使って常に最新の値を参照）
  const handleWheel = useCallback((deltaY) => {
    if (!isActive) return { consumed: false, direction: null }

    const currentScrollY = scrollYRef.current
    const newScrollY = currentScrollY + deltaY

    // 上にスクロール（前の時代へ戻る）
    if (newScrollY < 0) {
      if (currentScrollY <= 0) {
        // すでに先頭なので、前のセクションへ
        return { consumed: false, direction: 'prev' }
      }
      // 境界までスクロールを消費
      scrollYRef.current = 0
      springY.set(0)
      return { consumed: true, direction: null }
    }

    // 下にスクロール（次の時代へ）
    if (newScrollY > maxScroll) {
      if (currentScrollY >= maxScroll) {
        // すでに最後なので、次のセクションへ
        return { consumed: false, direction: 'next' }
      }
      // 境界までスクロールを消費
      scrollYRef.current = maxScroll
      springY.set(-maxScroll)
      onScrollComplete?.()
      return { consumed: true, direction: null }
    }

    // 通常のスクロール（作品レイヤーを移動）
    scrollYRef.current = newScrollY
    springY.set(-newScrollY)
    if (currentScrollY === 0 && deltaY > 0) {
      onScrollStart?.()
    }
    return { consumed: true, direction: null }
  }, [isActive, maxScroll, onScrollComplete, onScrollStart, springY])

  // 親コンポーネントからhandleWheelを呼び出せるようにする
  useImperativeHandle(ref, () => ({
    handleWheel,
    resetScroll: () => {
      scrollYRef.current = 0
      springY.set(0)
    },
    getScrollProgress: () => scrollYRef.current / maxScroll,
    // トランジション準備 - 入ってくる方向に応じて初期位置を設定
    prepareEntry: (direction) => {
      hasEntryPrepared.current = true

      if (direction === 'next') {
        // 下から入ってくる - 作品レイヤーを下に配置してから上にアニメーション
        // スクロール位置は0（先頭）からスタート
        scrollYRef.current = 0
        springY.jump(maxScroll * 0.3)  // 視覚的に下にオフセット
        requestAnimationFrame(() => {
          springY.set(0)  // 0にアニメーション
        })
      } else if (direction === 'prev') {
        // 上から入ってくる
        // 重要: スクロール位置は0（先頭）にして、視覚的にだけ上からアニメーション
        // これにより、継続する上スクロールですぐに境界に達しない
        scrollYRef.current = 0
        springY.jump(-maxScroll * 0.3)  // 視覚的に上にオフセット
        requestAnimationFrame(() => {
          springY.set(0)  // 0にアニメーション
        })
      }
    }
  }), [handleWheel, maxScroll, springY])

  // 作品画像を取得
  const artworks = useMemo(() => {
    return getArtworksForPeriod(String(period.year_start))
  }, [period.year_start])

  // ローカライズされたフィールド
  const keyEvent = useMemo(
    () => getLocalizedField(period, 'key_event', language),
    [period, language]
  )

  const exampleWorks = useMemo(
    () => getLocalizedField(period, 'example_works', language),
    [period, language]
  )

  const backgroundSummary = useMemo(() => {
    const fullBackground = getLocalizedField(period, 'background', language)
    return truncateToSentences(fullBackground, 2, language)
  }, [period, language])

  const sectionNumber = String(index + 1).padStart(2, '0')

  return (
    <section
      ref={sectionRef}
      className={`timeline-section ${isActive ? 'timeline-section--active' : ''}`}
      data-index={index}
      data-active={isActive}
    >
      {/* 固定ビューポート - 100vh */}
      <div className="timeline-section__viewport">
        {/* 作品レイヤー - 200vh、スクロールで上に移動 */}
        <motion.div
          className="timeline-section__artwork-layer"
          style={{
            height: `${ARTWORK_LAYER_HEIGHT_VH}vh`,
            y: springY
          }}
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

        {/* グラデーションオーバーレイ（モーダル時は薄く） */}
        <motion.div 
          className="timeline-section__gradient-overlay"
          animate={{
            opacity: isArtworkModalOpen ? 0.2 : 1
          }}
          transition={{ duration: 0.4 }}
        />

        {/* 左下パネル - 固定表示（モーダル時は薄く） */}
        <motion.div
          className="timeline-section__panel"
          initial={{ opacity: 0, y: 40 }}
          animate={{
            opacity: isActive ? (isArtworkModalOpen ? 0.15 : 1) : 0,
            y: isActive ? 0 : 40
          }}
          transition={{
            duration: 0.4,
            ease: [0.19, 1.0, 0.22, 1.0]
          }}
        >
          <div className="timeline-section__header">
            <div className="timeline-section__number">
              {sectionNumber}
            </div>
            <div className="timeline-section__date-range">
              <div className="timeline-section__date-inner">
                <span className="timeline-section__date-start">
                  {period.year_start}
                </span>
                <span className="timeline-section__date-separator">—</span>
                <span className="timeline-section__date-end">
                  {period.year_end}
                </span>
              </div>
              <div className="timeline-section__date-divider" />
            </div>
          </div>

          <div className="timeline-section__meta">
            {keyEvent && (
              <div className="timeline-section__meta-item">
                <div className="timeline-section__meta-header">
                  <span className="timeline-section__meta-label">
                    {language === 'ja' ? '重要な出来事' : 'Key Event'}
                  </span>
                  <div className="timeline-section__meta-divider" />
                </div>
                <p className="timeline-section__meta-text">
                  {keyEvent}
                </p>
              </div>
            )}

            {exampleWorks && (
              <div className="timeline-section__meta-item">
                <div className="timeline-section__meta-header">
                  <span className="timeline-section__meta-label">
                    {language === 'ja' ? '代表作品' : 'Key Works'}
                  </span>
                  <div className="timeline-section__meta-divider" />
                </div>
                <p className="timeline-section__meta-text">
                  {exampleWorks}
                </p>
              </div>
            )}
          </div>

          {backgroundSummary && (
            <div className="timeline-section__summary">
              <p className="timeline-section__summary-text">
                {backgroundSummary}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
})

export default TimelineDetailSection
