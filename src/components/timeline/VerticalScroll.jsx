import { useRef, useEffect, useState, useCallback, Children, cloneElement } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './VerticalScroll.css'

/**
 * VerticalScroll Component
 *
 * ホイールイベントをキャプチャして、作品レイヤーのスクロールを制御
 * - 各セクションは100vh固定
 * - ホイールイベントで作品レイヤーをスクロール
 * - 作品レイヤーが最後までスクロールしたら次のセクションへ遷移
 */
/**
 * スクロール速度の正規化
 * - trackpad/マウスホイールの違いを吸収
 * - 極端に大きい値を制限
 */
const normalizeWheelDelta = (deltaY, deltaMode) => {
  // deltaMode: 0 = pixels, 1 = lines, 2 = pages
  let normalized = deltaY

  if (deltaMode === 1) {
    // lines → pixels (1 line ≈ 16px)
    normalized = deltaY * 16
  } else if (deltaMode === 2) {
    // pages → pixels
    normalized = deltaY * window.innerHeight
  }

  // 最大値を制限（1フレームで50px以上スクロールしない）
  const maxDelta = 50
  return Math.max(-maxDelta, Math.min(maxDelta, normalized))
}

export default function VerticalScroll({
  children,
  onSectionChange,
  totalSections,
  currentSection: externalCurrentSection,
  setCurrentSection: externalSetCurrentSection,
  scrollToSectionRef
}) {
  const containerRef = useRef(null)
  const sectionRefs = useRef([])
  const [internalCurrentSection, setInternalCurrentSection] = useState(0)
  const isTransitioning = useRef(false)
  const lastWheelTime = useRef(0)
  const transitionCooldown = useRef(0)  // 遷移後のクールダウン
  const consecutiveTransitionAttempts = useRef(0)  // 連続遷移試行回数

  // 外部制御またはローカル状態を使用
  const currentSection = externalCurrentSection ?? internalCurrentSection
  const setCurrentSection = externalSetCurrentSection ?? setInternalCurrentSection

  // セクションrefを設定
  const setSectionRef = useCallback((index) => (ref) => {
    sectionRefs.current[index] = ref
  }, [])

  // 特定のセクションへ遷移
  const goToSection = useCallback((sectionIndex, direction = null) => {
    if (sectionIndex < 0 || sectionIndex >= totalSections) return
    if (isTransitioning.current) return

    // クールダウン中は遷移をブロック
    const now = Date.now()
    if (now < transitionCooldown.current) {
      return
    }

    isTransitioning.current = true
    consecutiveTransitionAttempts.current = 0  // リセット

    // 遷移方向を自動検出（指定がない場合）
    const transitionDirection = direction || (sectionIndex > currentSection ? 'next' : 'prev')

    // 新しいセクションの準備（方向に応じた初期位置を設定）
    const newSectionRef = sectionRefs.current[sectionIndex]
    if (newSectionRef?.prepareEntry) {
      newSectionRef.prepareEntry(transitionDirection)
    }

    setCurrentSection(sectionIndex)
    onSectionChange?.(sectionIndex)

    // 遷移完了後にフラグをリセット + クールダウン設定
    setTimeout(() => {
      isTransitioning.current = false
      // 遷移後800msは次の遷移をブロック（momentum scrollの継続を防ぐ）
      transitionCooldown.current = Date.now() + 800
    }, 600)
  }, [currentSection, totalSections, onSectionChange, setCurrentSection])

  // scrollToSection を外部から呼び出せるようにする
  useEffect(() => {
    if (scrollToSectionRef) {
      scrollToSectionRef.current = goToSection
    }
  }, [scrollToSectionRef, goToSection])

  // ホイールイベントを処理
  const handleWheel = useCallback((e) => {
    e.preventDefault()

    // 遷移中またはクールダウン中はスクロールを無視
    const now = Date.now()
    if (isTransitioning.current || now < transitionCooldown.current) {
      return
    }

    // スロットリング（60fps）
    if (now - lastWheelTime.current < 16) return
    lastWheelTime.current = now

    // deltaYを正規化（trackpad/マウスの違いを吸収、極端な値を制限）
    const deltaY = normalizeWheelDelta(e.deltaY, e.deltaMode)

    // アクティブなセクションにホイールイベントを渡す
    const activeRef = sectionRefs.current[currentSection]
    if (activeRef?.handleWheel) {
      const result = activeRef.handleWheel(deltaY)

      if (!result.consumed) {
        // 連続遷移試行をカウント（デバッグ用 & 安全弁）
        consecutiveTransitionAttempts.current++

        // 異常な連続遷移を検出してブロック
        if (consecutiveTransitionAttempts.current > 3) {
          console.warn('Blocked excessive transition attempts')
          transitionCooldown.current = now + 500
          consecutiveTransitionAttempts.current = 0
          return
        }

        // セクションがスクロールを消費しなかった場合、次/前のセクションへ
        if (result.direction === 'next' && currentSection < totalSections - 1) {
          goToSection(currentSection + 1, 'next')
        } else if (result.direction === 'prev' && currentSection > 0) {
          goToSection(currentSection - 1, 'prev')
        }
      } else {
        // スクロールが消費された場合、連続試行カウンタをリセット
        consecutiveTransitionAttempts.current = 0
      }
    }
  }, [currentSection, totalSections, goToSection])

  // ホイールイベントリスナー
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel])

  // キーボードナビゲーション
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTransitioning.current) return

      // アクティブなセクションにキーイベントを渡す
      const activeRef = sectionRefs.current[currentSection]
      const scrollAmount = window.innerHeight * 0.3 // 30vh per key press

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        if (activeRef?.handleWheel) {
          const result = activeRef.handleWheel(scrollAmount)
          if (!result.consumed && result.direction === 'next') {
            if (currentSection < totalSections - 1) {
              goToSection(currentSection + 1, 'next')
            }
          }
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        if (activeRef?.handleWheel) {
          const result = activeRef.handleWheel(-scrollAmount)
          if (!result.consumed && result.direction === 'prev') {
            if (currentSection > 0) {
              goToSection(currentSection - 1, 'prev')
            }
          }
        }
      } else if (e.key === 'Home') {
        e.preventDefault()
        goToSection(0, 'prev')
      } else if (e.key === 'End') {
        e.preventDefault()
        goToSection(totalSections - 1, 'next')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSection, totalSections, goToSection])

  // childrenにrefとpropsを追加
  const childrenWithRefs = Children.map(children, (child, index) => {
    return cloneElement(child, {
      ref: setSectionRef(index),
      isActive: currentSection === index
    })
  })

  return (
    <div
      ref={containerRef}
      className="vertical-scroll-container"
      data-current-section={currentSection}
    >
      <div className="vertical-sections-stack">
        {childrenWithRefs}
      </div>
    </div>
  )
}
