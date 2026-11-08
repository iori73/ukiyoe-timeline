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
 * Folding fan for the open/close control (owner's drawing, Figma 168:65: a 120° fan with the
 * paper starting away from the pivot). Six ribs; closed = gathered into a narrow ~50° fan so it
 * still reads as a fan (the 5px sliver of the first version did not), open = spread to 120°.
 * The spread is CSS (v2.css .v2-fan__rib), slow and one rib after another.
 */
const RIBS = [-50, -30, -10, 10, 30, 50]
export function Fan({ className = '' }) {
  return (
    <svg className={`v2-fan ${className}`} viewBox="0 0 40 23" width="40" height="23" aria-hidden="true" focusable="false">
      {RIBS.map((deg, i) => (
        <g key={deg} className="v2-fan__rib" style={{ '--i': i, '--open': `${deg}deg`, '--closed': `${deg * 0.3}deg` }}>
          <line x1="20" y1="21" x2="19.4" y2="15.2" stroke="currentColor" strokeWidth="0.8" />
          <path d="M16.527 1.304 A20 20 0 0 1 23.473 1.304 L21.042 15.091 A6 6 0 0 0 18.958 15.091 Z" />
        </g>
      ))}
      <circle cx="20" cy="21" r="1.6" fill="currentColor" />
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
