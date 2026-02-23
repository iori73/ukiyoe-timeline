import { useState, useEffect, useRef } from 'react'
import './LayerStackAnimation.css'

/**
 * 紅摺絵の色版レイヤー定義（黒→緑→ピンクの順で重ねる）
 * 初期オフセットは「浮いている」離れ具合（参考画像程度）
 */
const BENIZURI_LAYERS = [
  { src: '/images/dawn/benizuri-e/layers/layer-01.webp', label: '黒', initialOffset: { x: 0, y: 0 } },
  { src: '/images/dawn/benizuri-e/layers/layer-02.webp', label: '緑', initialOffset: { x: 18, y: -22 } },
  { src: '/images/dawn/benizuri-e/layers/layer-03.webp', label: 'ピンク', initialOffset: { x: -12, y: 14 } },
  { src: '/images/dawn/benizuri-e/layers/layer-04.webp', label: '色', initialOffset: { x: 14, y: 10 } },
]

const LAYER_DURATION_MS = 700
const INTERSECTION_THRESHOLD = 0.25
const INTERSECTION_ROOT_MARGIN = '0px 0px -15% 0px'

/**
 * LayerStackAnimation - 色別レイヤーが順に重なり一枚の絵になるアニメーション
 * - スクロールで画面に入ったら開始
 * - 一度だけ再生し、完成形で止まる
 * - 黒→緑→ピンクの順に一つずつ重なる
 * - アイソメ（3D遠近感）を保持
 */
export default function LayerStackAnimation() {
  const sectionRef = useRef(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [alignedUpTo, setAlignedUpTo] = useState(-1)
  const hasTriggeredRef = useRef(false)

  // 画面に入ったら一度だけ開始
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry.isIntersecting || hasTriggeredRef.current) return
        hasTriggeredRef.current = true
        setHasStarted(true)
      },
      { threshold: INTERSECTION_THRESHOLD, rootMargin: INTERSECTION_ROOT_MARGIN }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // 順番にレイヤーを重ねる: 0 → 1 → 2 → 3（各レイヤー完了後に次へ）
  useEffect(() => {
    if (!hasStarted) return
    if (alignedUpTo >= BENIZURI_LAYERS.length - 1) return

    const nextIndex = alignedUpTo + 1
    const delayMs = nextIndex === 0 ? 150 : LAYER_DURATION_MS
    const timer = setTimeout(() => setAlignedUpTo(nextIndex), delayMs)
    return () => clearTimeout(timer)
  }, [hasStarted, alignedUpTo])

  return (
    <section ref={sectionRef} className="layer-stack" aria-label="印刷版の重なり">
      <div className="layer-stack__inner">
        <div className="layer-stack__isometric">
          <div className="layer-stack__frame">
            {BENIZURI_LAYERS.map((layer, index) => {
              const isAligned = index <= alignedUpTo
              const { x, y } = layer.initialOffset
              return (
                <div
                  key={index}
                  className="layer-stack__layer"
                  style={{
                    transform: isAligned ? 'translate(0, 0)' : `translate(${x}px, ${y}px)`,
                    transition: `transform ${LAYER_DURATION_MS}ms var(--ease-ukiyoe, cubic-bezier(0.19, 1, 0.22, 1))`,
                    zIndex: index + 1,
                  }}
                  aria-hidden
                >
                  <img
                    src={layer.src}
                    alt=""
                    className="layer-stack__img"
                    decoding="async"
                    draggable={false}
                  />
                </div>
              )
            })}
          </div>
        </div>
        <p className="layer-stack__caption">紅摺絵 — 色版が順に重なり一枚の絵になる</p>
      </div>
    </section>
  )
}
