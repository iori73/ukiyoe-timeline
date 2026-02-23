import { useState, useRef, useMemo, useCallback, useEffect, memo } from 'react'
import { motion } from 'framer-motion'
import { duration, stagger } from '../../constants/motion'
import { useLanguage } from '../../context/LanguageContext'
import {
  PERIOD_ARTWORKS,
  getArtworksForPeriod,
  getLocalizedField
} from '../../data/ukiyoe'
import { getProportionsForPeriod, CANONICAL_SLOTS } from '../../data/periodColors'
import ArtworkDetailModal from './ArtworkDetailModal'
import './ArtworkGalleryGrid.css'

/**
 * ArtworkGalleryGrid Component
 *
 * タイムライン末尾に表示されるギャラリービュー
 * - periods 渡し時: 時代別セクション（番号・年範囲・時代名 + 作品グリッド）
 * - periods なし: 全作品をフラットなグリッドで表示（後方互換）
 * - focalPoint による object-position 制御
 * - hover で作品名・作者名をオーバーレイ表示
 * - クリックで ArtworkDetailModal を開く
 */

// 全時代の作品をフラット化（時代順を保持）
function getAllArtworks() {
  const periodKeys = Object.keys(PERIOD_ARTWORKS).sort((a, b) => Number(a) - Number(b))
  const all = []
  for (const key of periodKeys) {
    for (const artwork of PERIOD_ARTWORKS[key]) {
      all.push({ ...artwork, periodKey: key })
    }
  }
  return all
}

const ArtworkCard = memo(function ArtworkCard({ artwork, index, onCardClick, cardRefs }) {
  const { language } = useLanguage()
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const title = language === 'ja' ? artwork.title_ja : artwork.title_en
  const artist = language === 'ja' ? artwork.artist_ja : artwork.artist_en
  const fp = artwork.focalPoint || { x: 0.5, y: 0.5 }
  const objectPosition = `${fp.x * 100}% ${fp.y * 100}%`

  return (
    <motion.div
      className="artwork-gallery__card"
      ref={(el) => { cardRefs.current[artwork.id] = el }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: duration.slow, delay: (index % 8) * stagger.normal }}
      onClick={() => onCardClick(artwork, artwork.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onCardClick(artwork, artwork.id) } }}
      tabIndex={0}
      role="button"
      aria-label={title}
    >
      <div className="artwork-gallery__image-wrapper">
        {!imgError && !imgLoaded && <div className="artwork-gallery__shimmer" />}
        {!imgError ? (
          <img
            src={artwork.url}
            alt={title}
            className={`artwork-gallery__image${imgLoaded ? ' artwork-gallery__image--loaded' : ''}`}
            style={{ objectPosition }}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="artwork-gallery__image-placeholder"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'rgba(245, 240, 230, 0.4)',
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-xs)',
            }}
          >
            {title}
          </div>
        )}
        <div className="artwork-gallery__overlay">
          <span className="artwork-gallery__overlay-title">{title}</span>
          <span className="artwork-gallery__overlay-artist">{artist}</span>
        </div>
      </div>
    </motion.div>
  )
})

export default function ArtworkGalleryGrid({ periods = [], onReturnToTimeline, onModalStateChange }) {
  const { language } = useLanguage()
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [initialRect, setInitialRect] = useState(null)
  const cardRefs = useRef({})
  const galleryRef = useRef(null)
  const lastScrollTop = useRef(0)

  // 作品詳細モーダルの開閉を親（TimelinePage）に通知（ヘッダーロゴの表示制御用）
  useEffect(() => {
    onModalStateChange?.(modalOpen)
  }, [modalOpen, onModalStateChange])

  const totalCount = useMemo(() => getAllArtworks().length, [])
  const usePeriodSections = periods.length > 0
  const flatArtworks = useMemo(
    () => (usePeriodSections ? [] : getAllArtworks()),
    [usePeriodSections]
  )

  // ギャラリーの最上部で上スクロールを検出したら戻る
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const galleryTop = galleryRef.current?.offsetTop || 0

      if (scrollTop <= galleryTop + 100 && scrollTop < lastScrollTop.current) {
        onReturnToTimeline?.()
      }

      lastScrollTop.current = scrollTop
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [onReturnToTimeline])

  const handleCardClick = useCallback((artwork, id) => {
    const el = cardRefs.current[id]
    if (el) {
      setInitialRect(el.getBoundingClientRect())
    }
    setSelectedArtwork(artwork)
    setModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setTimeout(() => setSelectedArtwork(null), 300)
  }, [])

  return (
    <section className="artwork-gallery" ref={galleryRef}>
      <header className="artwork-gallery__header">
        <h2 className="artwork-gallery__title">
          {language === 'ja' ? '浮世絵作品一覧' : 'Ukiyo-e Artwork List'}
        </h2>
        <p className="artwork-gallery__count">
          {totalCount} Works
        </p>
      </header>

      {usePeriodSections ? (
        <div className="artwork-gallery__sections">
          {periods.map((period, sectionIndex) => {
            const sectionNumber = String(sectionIndex + 1).padStart(2, '0')
            const keyEvent = getLocalizedField(period, 'key_event', language)
            const artworks = getArtworksForPeriod(String(period.year_start))

            if (artworks.length === 0) return null

            return (
              <div
                key={period.year_start ?? sectionIndex}
                className="artwork-gallery__section"
              >
                <div className="artwork-gallery__section-header">
                  <span className="artwork-gallery__section-number">
                    {sectionNumber}
                  </span>
                  <span className="artwork-gallery__section-date">
                    {period.year_start} — {period.year_end}
                  </span>
                  {keyEvent && (
                    <span className="artwork-gallery__section-title">
                      {keyEvent}
                    </span>
                  )}
                  {(() => {
                    const proportionData = getProportionsForPeriod(period.year_start)
                    if (!proportionData) return null
                    const { proportions } = proportionData
                    const usedColors = CANONICAL_SLOTS.filter((slot) => proportions[slot.id] > 0)
                    return (
                      <div
                        className="artwork-gallery__section-colors"
                        role="img"
                        aria-label={`色の使用割合: ${usedColors.map((s) => `${s.label_ja} ${Math.round(proportions[s.id] * 100)}%`).join(', ')}`}
                      >
                        {usedColors.map((slot) => {
                          const proportion = proportions[slot.id]
                          const widthPercent = proportion * 100
                          return (
                            <div
                              key={slot.id}
                              className="artwork-gallery__color-segment"
                              style={{
                                width: `${widthPercent}%`,
                                backgroundColor: slot.hex,
                              }}
                              title={`${slot.label_ja}: ${Math.round(widthPercent)}%`}
                            />
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>
                <div className="artwork-gallery__section-grid">
                  {artworks.map((artwork, index) => (
                    <ArtworkCard
                      key={artwork.id}
                      artwork={artwork}
                      index={index}
                      onCardClick={handleCardClick}
                      cardRefs={cardRefs}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="artwork-gallery__grid">
          {flatArtworks.map((artwork, index) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              index={index}
              onCardClick={handleCardClick}
              cardRefs={cardRefs}
            />
          ))}
        </div>
      )}

      <ArtworkDetailModal
        artwork={selectedArtwork}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        initialRect={initialRect}
      />
    </section>
  )
}
