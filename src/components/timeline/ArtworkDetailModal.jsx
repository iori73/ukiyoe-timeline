import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import './ArtworkDetailModal.css'

/**
 * ArtworkDetailModal Component
 *
 * 作品画像クリック時に表示されるモーダル
 * - 画像が中央にスムーズにズーム
 * - 作品情報（年代、タイトル、作者、概要）を横に表示
 * - 外側クリックで閉じる
 */
export default function ArtworkDetailModal({
  artwork,
  isOpen,
  onClose,
  initialRect
}) {
  const { language } = useLanguage()
  const modalRef = useRef(null)
  const contentRef = useRef(null)

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // 外側クリックで閉じる
  const handleBackdropClick = (e) => {
    if (contentRef.current && !contentRef.current.contains(e.target)) {
      onClose()
    }
  }

  if (!artwork) return null

  const title = language === 'ja' ? artwork.title_ja : artwork.title_en
  const artist = language === 'ja' ? artwork.artist_ja : artwork.artist_en
  const description = language === 'ja'
    ? (artwork.description_ja || artwork.description || '')
    : (artwork.description_en || artwork.description || '')

  // body直下にPortalでレンダリング（親のtransformの影響を受けない）
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          className="artwork-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.19, 1.0, 0.22, 1.0] }}
          onClick={handleBackdropClick}
        >
          {/* 背景オーバーレイ */}
          <motion.div
            className="artwork-modal__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* コンテンツ - 画面中央 */}
          <motion.div
            ref={contentRef}
            className="artwork-modal__content"
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.95
            }}
            transition={{
              duration: 0.4,
              ease: [0.19, 1.0, 0.22, 1.0]
            }}
          >
            {/* 画像 */}
            <div className="artwork-modal__image-container">
              <img
                src={artwork.url}
                alt={title}
                className="artwork-modal__image"
              />
            </div>

            {/* 作品情報 */}
            <motion.div
              className="artwork-modal__info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.19, 1.0, 0.22, 1.0],
                delay: 0.15
              }}
            >
              <div className="artwork-modal__year">
                {artwork.year}
              </div>

              <h2 className="artwork-modal__title">
                {title}
              </h2>

              <div className="artwork-modal__artist">
                {artist}
              </div>

              {description && (
                <p className="artwork-modal__description">
                  {description}
                </p>
              )}

              <button
                className="artwork-modal__close-btn"
                onClick={onClose}
              >
                <span className="artwork-modal__close-text">
                  {language === 'ja' ? '閉じる' : 'Close'}
                </span>
                <span className="artwork-modal__close-icon">
                  <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="13.5" cy="13.5" r="13" stroke="currentColor" strokeWidth="1"/>
                    <path d="M10 10L17 17M17 10L10 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
