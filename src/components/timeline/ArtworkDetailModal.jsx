import { useEffect, useRef, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { duration, easing } from '../../constants/motion'
import { useLanguage } from '../../context/LanguageContext'
import './ArtworkDetailModal.css'

/**
 * ArtworkDetailModal Component
 *
 * 作品画像クリック時に表示されるモーダル
 * - 画像が中央にスムーズにズーム
 * - 作品情報（年代、タイトル、作者、概要）を横に表示
 * - 外側クリックで閉じる
 * - アクセシビリティ: role="dialog", aria-modal, focus trap
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
  const previousFocusRef = useRef(null)
  const titleId = 'artwork-modal-title'
  const [imageError, setImageError] = useState(false)

  // モーダルが開くたびに画像エラー状態をリセット
  useEffect(() => {
    if (isOpen) setImageError(false)
  }, [isOpen, artwork])

  // モーダル開閉時のフォーカス管理
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement
      // モーダル内の最初のフォーカス可能な要素にフォーカス
      requestAnimationFrame(() => {
        const closeBtn = contentRef.current?.querySelector('.artwork-modal__close-btn')
        closeBtn?.focus()
      })
      // body スクロールを無効化
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      // 閉じた時にトリガー要素にフォーカスを戻す
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
        previousFocusRef.current = null
      }
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

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

  // フォーカストラップ: Tabキーがモーダル内に留まる
  const handleKeyDown = useCallback((e) => {
    if (e.key !== 'Tab') return
    const modal = contentRef.current
    if (!modal) return

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusableElements[0]
    const last = focusableElements[focusableElements.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
  }, [])

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
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.normal, ease: easing.ukiyoe }}
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
        >
          {/* 背景オーバーレイ */}
          <motion.div
            className="artwork-modal__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.slow }}
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
              duration: duration.normal,
              ease: easing.ukiyoe
            }}
          >
            {/* 画像 */}
            <div className="artwork-modal__image-container">
              {!imageError ? (
                <img
                  src={artwork.url}
                  alt={title}
                  className="artwork-modal__image"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div
                  className="artwork-modal__image-placeholder"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '300px',
                    height: '300px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(245, 240, 230, 0.5)',
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'var(--text-sm)',
                    textAlign: 'center',
                    padding: '24px',
                  }}
                >
                  {language === 'ja'
                    ? '画像を読み込めませんでした'
                    : 'Image could not be loaded'}
                </div>
              )}
            </div>

            {/* 作品情報 */}
            <motion.div
              className="artwork-modal__info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: duration.normal,
                ease: easing.ukiyoe,
                delay: 0.15
              }}
            >
              <div className="artwork-modal__year">
                {artwork.year}
              </div>

              <h2 id={titleId} className="artwork-modal__title">
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
