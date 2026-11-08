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
 * Folding fan (sensu) for the open/close control, modelled on how a real one moves
 * (owner's drawing, Figma 168:65: 120° open, paper starting away from the rivet):
 * - all ribs (中骨) turn on one rivet (要); the pleated paper (地紙) is glued to them;
 * - the two thicker guard sticks (親骨) lie on top;
 * - opening = the gap between the guard sticks widens and the paper drags every rib along,
 *   so at every moment the ribs stay EVENLY spaced between the guards. One opening amount t
 *   drives everything (no per-rib delays — those made it look two-staged and misaligned);
 * - the paper shows alternating mountain/valley facets (pleats).
 * Geometry is recomputed every frame from t, so the motion stays smooth.
 */
const CX = 20, CY = 21, R = 20, RI = 6, PLEATS = 12, SPAN = 120, T_CLOSED = 0.1
const pt = (rad, deg) => {
  const a = (deg * Math.PI) / 180
  return `${(CX + rad * Math.sin(a)).toFixed(2)} ${(CY - rad * Math.cos(a)).toFixed(2)}`
}
function fanGeometry(t) {
  const S = SPAN * t
  const angle = (k) => (k / PLEATS - 0.5) * S
  const pleats = []
  for (let k = 0; k < PLEATS; k++) {
    const a0 = angle(k), a1 = angle(k + 1)
    pleats.push(`M${pt(R, a0)} A${R} ${R} 0 0 1 ${pt(R, a1)} L${pt(RI, a1)} A${RI} ${RI} 0 0 0 ${pt(RI, a0)} Z`)
  }
  const ribs = Array.from({ length: PLEATS + 1 }, (_, k) => `M${CX} ${CY} L${pt(RI, angle(k))}`).join(' ')
  const guards = `M${CX} ${CY} L${pt(R, -S / 2)} M${CX} ${CY} L${pt(R, S / 2)}`
  return { pleats, ribs, guards }
}
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2)

export function Fan({ className = '' }) {
  const svgRef = useRef(null)
  const tRef = useRef(T_CLOSED)
  const geo = fanGeometry(T_CLOSED)

  useEffect(() => {
    const svg = svgRef.current
    const details = svg?.closest('details')
    if (!svg || !details) return undefined
    const pleatEls = [...svg.querySelectorAll('.v2-fan__pleat')]
    const ribsEl = svg.querySelector('.v2-fan__ribs')
    const guardsEl = svg.querySelector('.v2-fan__guards')
    const draw = (t) => {
      const g = fanGeometry(t)
      pleatEls.forEach((el, k) => el.setAttribute('d', g.pleats[k]))
      ribsEl.setAttribute('d', g.ribs)
      guardsEl.setAttribute('d', g.guards)
      tRef.current = t
    }
    let raf = 0
    const animate = () => {
      cancelAnimationFrame(raf)
      const to = details.open ? 1 : T_CLOSED
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(to); return }
      const from = tRef.current, dur = details.open ? 1200 : 1000, t0 = performance.now()
      const frame = (now) => {
        const p = Math.min(1, (now - t0) / dur)
        draw(from + (to - from) * easeInOut(p))
        if (p < 1) raf = requestAnimationFrame(frame)
      }
      raf = requestAnimationFrame(frame)
    }
    draw(details.open ? 1 : T_CLOSED)
    details.addEventListener('toggle', animate)
    return () => { details.removeEventListener('toggle', animate); cancelAnimationFrame(raf) }
  }, [])

  return (
    <svg ref={svgRef} className={`v2-fan ${className}`} viewBox="0 0 40 23" width="40" height="23" aria-hidden="true" focusable="false">
      <path className="v2-fan__ribs" d={geo.ribs} />
      {geo.pleats.map((d, k) => <path key={k} className={`v2-fan__pleat ${k % 2 ? 'is-valley' : 'is-mountain'}`} d={d} />)}
      <path className="v2-fan__guards" d={geo.guards} />
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
