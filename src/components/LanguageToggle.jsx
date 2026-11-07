import { useLanguage } from '../context/LanguageContext'

/**
 * Language toggle (redesigned 2026-11-07, Figma portfolio_v6 node 104:4168).
 *
 * ON  = circle, coloured mark.   OFF = square, plain washi tile.
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
      <path d="M0 0L20 20" stroke="var(--lang-ground)" strokeWidth="2.5" />
      <rect x="0" y="22" width="40" height="4" fill="var(--lang-red)" />
    </svg>
  )
}

const OPTIONS = [
  { code: 'ja', label: '日本語', htmlLang: 'ja', Mark: JapaneseMark },
  { code: 'en', label: 'English', htmlLang: 'en', Mark: EnglishMark },
]

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="language-toggle" role="group" aria-label="Language / 言語">
      {OPTIONS.map(({ code, label, htmlLang, Mark }) => {
        const active = language === code
        return (
          <button
            key={code}
            type="button"
            lang={htmlLang}
            className={`language-button language-button--mark ${active ? 'active' : ''}`}
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
