import { useEffect, useRef } from 'react'

/**
 * Small marks drawn by the owner in Figma (portfolio_v6, ukiyoe-timeline page):
 * - Hishi: the flat lozenge for "colour appearing for the first time" (168:56 / 168:376)
 * - Fan: the open/close mark for the era background (168:65)
 * - eraNumber: era numbers as kanji numerals in Japanese (169:395), 01 in English
 */

export function Hishi({ className = '' }) {
  return (
    <svg className={`v2-hishi ${className}`} viewBox="0 0 12 7" width="12" height="7" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M5.88079 0C6.07071 0.0460597 6.95049 0.585493 7.17727 0.719317L10.2625 2.54152C10.7123 2.80731 11.5481 3.33234 12 3.52926C10.1868 4.64492 7.96455 5.9706 6.10086 7C5.89918 7.00035 0.657347 3.82533 0 3.48048C1.9425 2.30122 3.94073 1.18466 5.88079 0Z" />
    </svg>
  )
}

/**
 * Folding fan (sensu) for the open/close control — line pictogram "B" chosen by the owner
 * (Figma 190:27 / spacing 190:112): an outline of the paper with ribs and a rivet (要).
 * Motion follows a real fan: one opening amount t drives everything — the two guard sticks
 * (親骨) spread and the ribs stay evenly spaced between them. Closed ≈ 16° (a tapered wedge
 * with the rivet at its tip, so it does not read as "!"), open ≈ 84° (fits the 24px icon box, ~1px spill).
 */
const CX = 12, CY = 21.5, R = 19.5, RI = 5.5, RIBS = 3, S_CLOSED = 16, S_OPEN = 84
const pt = (rad, deg) => {
  const a = (deg * Math.PI) / 180
  return `${(CX + rad * Math.sin(a)).toFixed(2)} ${(CY - rad * Math.cos(a)).toFixed(2)}`
}
function fanGeometry(t) {
  const S = S_CLOSED + (S_OPEN - S_CLOSED) * t
  const h = S / 2
  const outline = `M${CX} ${CY} L${pt(R, -h)} A${R} ${R} 0 0 1 ${pt(R, h)} Z`
  const ribs = Array.from({ length: RIBS }, (_, k) => {
    const a = -h + (S * (k + 1)) / (RIBS + 1)
    return `M${pt(RI, a)} L${pt(R, a)}`
  }).join(' ')
  const hub = `M${CX} ${CY} L${pt(RI, -h)} A${RI} ${RI} 0 0 1 ${pt(RI, h)} Z`
  return { outline, ribs, hub, ribOpacity: Math.min(1, Math.max(0, (t - 0.15) / 0.35)) }
}
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2)

export function Fan({ className = '' }) {
  const svgRef = useRef(null)
  const tRef = useRef(0)
  const geo = fanGeometry(0)

  useEffect(() => {
    const svg = svgRef.current
    const details = svg?.closest('details')
    if (!svg || !details) return undefined
    const [outlineEl, ribsEl, hubEl] = ['.v2-fan__outline', '.v2-fan__ribs', '.v2-fan__hub'].map((q) => svg.querySelector(q))
    const draw = (t) => {
      const g = fanGeometry(t)
      outlineEl.setAttribute('d', g.outline)
      ribsEl.setAttribute('d', g.ribs)
      ribsEl.style.opacity = g.ribOpacity
      hubEl.setAttribute('d', g.hub)
      tRef.current = t
    }
    let raf = 0
    const animate = () => {
      cancelAnimationFrame(raf)
      const to = details.open ? 1 : 0
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(to); return }
      const from = tRef.current, dur = details.open ? 1200 : 1000, t0 = performance.now()
      const frame = (now) => {
        const p = Math.min(1, (now - t0) / dur)
        draw(from + (to - from) * easeInOut(p))
        if (p < 1) raf = requestAnimationFrame(frame)
      }
      raf = requestAnimationFrame(frame)
    }
    draw(details.open ? 1 : 0)
    details.addEventListener('toggle', animate)
    return () => { details.removeEventListener('toggle', animate); cancelAnimationFrame(raf) }
  }, [])

  return (
    <svg ref={svgRef} className={`v2-fan ${className}`} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
      <path className="v2-fan__hub" d={geo.hub} />
      <path className="v2-fan__ribs" d={geo.ribs} style={{ opacity: geo.ribOpacity }} />
      <path className="v2-fan__outline" d={geo.outline} />
      <circle className="v2-fan__rivet" cx={CX} cy={CY} r="1.5" />
    </svg>
  )
}

const KANJI = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九']

/** 1 → 一, 10 → 十, 12 → 十二, 20 → 二十 (eras never exceed 99). */
export function kanjiNumber(n) {
  if (n < 10) return KANJI[n]
  const tens = Math.floor(n / 10), ones = n % 10
  return `${tens > 1 ? KANJI[tens] : ''}十${ones ? KANJI[ones] : ''}`
}

/** Era number: kanji in a hairline square in Japanese, two digits in English. */
export function EraNumber({ n, lang, className = '' }) {
  return lang === 'ja'
    ? <span className={`v2-num v2-num--kanji ${className}`}>{kanjiNumber(n)}</span>
    : <span className={`v2-num ${className}`}>{String(n).padStart(2, '0')}</span>
}


/**
 * PrintStack: the mark for "more prints from this era" — three sheets of paper, one on top of the
 * others (24px box, 2px line like every outline). Closed: the sheets lie close; open: the two
 * behind slide out a little, as if the pile were being spread to look through (CSS, v2.css).
 */
export function PrintStack({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter">
      <path className="v2-stack__back" d="M10 2H21V15" />
      <path className="v2-stack__mid" d="M7 5H18V18" />
      <rect className="v2-stack__front" x="3" y="8" width="11" height="14" />
    </svg>
  )
}
