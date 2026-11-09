import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

/**
 * Language toggle (redesigned 2026-11-07, Figma portfolio_v6 node 104:4168).
 *
 * ON  = filled washi circle with the coloured mark.   OFF = empty square, 2px line
 * (sumi on washi pages, washi on the dark timeline). Revised 2026-11-07.
 * The state is carried by SHAPE as well as colour (WCAG 1.4.1), so it reads
 * without colour vision.
 *
 * 日: the hinomaru.
 * EN: what the British and American flags share, reduced to three moves —
 *   a blue canton in the top-left (US canton / the Union Jack's upper hoist),
 *   a white diagonal through it (the saltire), and a red horizontal band
 *   (US stripes / St George's cross bar), separated from the blue by a white
 *   gap as both flags do (fimbriation).
 *
 * Colours come from the site's logo (藍 #1B3E5B / 紅 #C33433) and washi, not
 * flag-spec primaries, so the toggle sits in the same palette as the mark beside it.
 * Motion lives in App.css (.lang-tile / .lang-mark): the shape morphs first,
 * then the colour fades in; switching off reverses the order.
 */

function JapaneseMark() {
  return (
    <svg className="lang-mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="10" fill="var(--lang-red)" />
    </svg>
  )
}

function EnglishMark() {
  return (
    <svg className="lang-mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="20" height="20" fill="var(--lang-blue)" />
      <path d="M0 0L20 20" stroke="var(--lang-ground)" strokeWidth="2" />
      <rect x="0" y="22" width="40" height="4" fill="var(--lang-red)" />
    </svg>
  )
}


/* ----------------------------------------------------------------------------
 * variant="rain" (v2 only, 2026-11-09, Figma 235:27 "②' 雨の線の対・幾何学版").
 * JA = ukiyo-e as Japanese eyes saw it: Hiroshige's rain ("大はしあたけの夕立", 1857) as a regular
 *      rain stripe — equal dashes in parallel columns at 76°, every other column half a step down.
 * EN = ukiyo-e as foreign eyes saw it: Van Gogh's copy ("Bridge in the Rain", 1887) — a vertical
 *      stroke crossed at its midpoint by an equal stroke at 60° (not a symmetrical X).
 * The meaning is carried by the letters (あ / EN); the history lives in the pattern.
 * Lines are long dashed strokes, so the pattern can "fall": on switching, the newly chosen tile
 * runs its dash offset down two periods and eases to a stop (rain stopping), then — for EN — the
 * 60° strokes fade in to make the crosses. Keyframes in App.css (.language-toggle--rain).
 * -------------------------------------------------------------------------- */
// The pattern is drawn in the 40-unit box below and scaled up around the centre (owner, 2026-11-09:
// "模様が小さすぎる"). Lines scale with it (1.2 → 1.8 units), so the whole pattern reads larger.
const RAIN_SCALE = 1.5
const RAIN_T = `translate(20 20) scale(${RAIN_SCALE}) translate(-20 -20)`
const RAIN_A = 76 * Math.PI / 180
const UX = -Math.cos(RAIN_A), UY = Math.sin(RAIN_A)
const JA_COLS = Array.from({ length: 13 }, (_, i) => {
  const c = i - 3, px = c * 5.5 + 8, py = -2
  return { x1: px - UX * 21, y1: py - UY * 21, x2: px + UX * 60, y2: py + UY * 60, o: c % 2 ? 3.5 : 0 }
})
const EN_COLS = Array.from({ length: 14 }, (_, k) => ({ x: -1 + k * 3.5, o: k % 2 ? 7 : 0 }))
const EN_CROSS = []
for (let row = 0; row < 7; row++) for (let c = 0; c < 7; c++) {
  const cx = c * 7 + (row % 2 ? 3.5 : 0) - 1, cy = row * 7 + 1.5
  EN_CROSS.push(`M${(cx + 1.25).toFixed(2)} ${(cy - 2.165).toFixed(2)}L${(cx - 1.25).toFixed(2)} ${(cy + 2.165).toFixed(2)}`)
}

function RainJapanese() {
  return (
    <svg className="lang-mark lang-mark--rain" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <g className="lang-rain" transform={RAIN_T}>
        {JA_COLS.map((l, i) => (
          <line key={i} className="lang-rain__col" x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            strokeDasharray="4.5 2.5" style={{ '--o': l.o, '--run': 21, strokeDashoffset: l.o }} />
        ))}
      </g>
      <text className="lang-rain__label lang-rain__label--ja" x="20" y="21">あ</text>
    </svg>
  )
}

function RainEnglish() {
  return (
    <svg className="lang-mark lang-mark--rain" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <g className="lang-rain" transform={RAIN_T}>
        {EN_COLS.map((l, i) => (
          <line key={i} className="lang-rain__col" x1={l.x} y1={-29} x2={l.x} y2={55}
            strokeDasharray="5 9" style={{ '--o': l.o, '--run': 28, strokeDashoffset: l.o }} />
        ))}
        <path className="lang-rain__cross" d={EN_CROSS.join('')} />
      </g>
      <text className="lang-rain__label lang-rain__label--en" x="20" y="21">EN</text>
    </svg>
  )
}

const OPTIONS = [
  { code: 'ja', label: '日本語', htmlLang: 'ja', Mark: JapaneseMark },
  { code: 'en', label: 'English', htmlLang: 'en', Mark: EnglishMark },
]
const RAIN_MARKS = { ja: RainJapanese, en: RainEnglish }
const RAIN_MS = 1700

/** variant: 'mark' (live pages: flags reduced to marks) | 'rain' (v2: あ / EN with the rain pattern) */

export default function LanguageToggle({ variant = 'mark' }) {
  const { language, setLanguage } = useLanguage()
  const rain = variant === 'rain'
  // Rain plays only when the language actually changes (not on first render / page load).
  const prev = useRef(language)
  const [raining, setRaining] = useState(null)
  useEffect(() => {
    if (!rain || prev.current === language) return undefined
    prev.current = language
    setRaining(language)
    const id = setTimeout(() => setRaining(null), RAIN_MS)
    return () => clearTimeout(id)
  }, [language, rain])

  return (
    <div className={`language-toggle${rain ? ' language-toggle--rain' : ''}`} role="group" aria-label="Language / 言語">
      {OPTIONS.map(({ code, label, htmlLang, Mark: FlagMark }) => {
        const active = language === code
        const Mark = rain ? RAIN_MARKS[code] : FlagMark
        return (
          <button
            key={code}
            type="button"
            lang={htmlLang}
            className={`language-button language-button--mark ${active ? 'active' : ''}${raining === code ? ' is-raining' : ''}`}
            onClick={() => setLanguage(code)}
            aria-label={label}
            aria-pressed={active}
            title={label}
          >
            <span className="lang-tile">
              <Mark />
            </span>
          </button>
        )
      })}
    </div>
  )
}
