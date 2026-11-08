/**
 * Small marks drawn by the owner in Figma (portfolio_v6, ukiyoe-timeline page):
 * - Hishi: the flat lozenge for "colour appearing for the first time" (168:56 / 168:376)
 * - FanClosed / FanOpened: the open/close mark for the era background (168:65)
 * - eraNumber: era numbers as kanji numerals in Japanese (169:395), 01 in English
 */

export function Hishi({ className = '' }) {
  return (
    <svg className={`v2-hishi ${className}`} viewBox="0 0 12 7" width="12" height="7" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M5.88079 0C6.07071 0.0460597 6.95049 0.585493 7.17727 0.719317L10.2625 2.54152C10.7123 2.80731 11.5481 3.33234 12 3.52926C10.1868 4.64492 7.96455 5.9706 6.10086 7C5.89918 7.00035 0.657347 3.82533 0 3.48048C1.9425 2.30122 3.94073 1.18466 5.88079 0Z" />
    </svg>
  )
}

export function FanClosed({ className = '' }) {
  return (
    <svg className={`v2-fan v2-fan--closed ${className}`} viewBox="100 9 22 92" width="6" height="24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M120.358 10.4528C114.104 9.79557 107.803 9.72958 101.537 10.2557L109.068 99.9401C109.695 99.8875 110.325 99.8941 110.95 99.9598L120.358 10.4528Z" />
    </svg>
  )
}

export function FanOpened({ className = '' }) {
  return (
    <svg className={`v2-fan v2-fan--opened ${className}`} viewBox="13 0 177 87" width="40" height="20" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M189.1 54.601C180.97 38.6441 168.703 25.1633 153.582 15.5673C138.461 5.97121 121.041 0.611946 103.141 0.0494148C85.2407 -0.513117 67.518 3.74172 51.8243 12.3694C36.1306 20.9971 23.0419 33.681 13.9255 49.0959L74.1774 84.7288C76.9123 80.1043 80.839 76.2992 85.5471 73.7109C90.2552 71.1226 95.572 69.8461 100.942 70.0149C106.312 70.1836 111.538 71.7914 116.075 74.6702C120.611 77.549 124.291 81.5933 126.73 86.3803L189.1 54.601Z" />
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
