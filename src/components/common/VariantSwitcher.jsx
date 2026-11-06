import { useEffect, useState } from 'react'
import './VariantSwitcher.css'

/**
 * Design-review switcher (2026-11-06).
 *
 * Shows only when a variant was requested via `?v=a|b|c` (or chosen earlier in this tab),
 * so the production site looks unchanged for normal visitors.
 * The choice is kept in sessionStorage because react-router <Link>s drop the query string
 * when moving from / to /timeline.
 *
 * Styles live in src/styles/variants.css, scoped by <html data-variant="...">.
 * Delete this component and that file once a direction is chosen.
 */

const KEY = 'ukiyoe-design-variant'
const VARIANTS = [
  { id: 'off', label: '本番', note: '今の公開版' },
  { id: 'a', label: 'A', note: '間を詰める（明→暗の橋渡し）' },
  { id: 'b', label: 'B', note: '和紙で通す（全体を明るく）' },
  { id: 'c', label: 'C', note: '墨で通す（全体を暗く）' },
]

function readInitial() {
  try {
    const q = new URLSearchParams(window.location.search).get('v')
    if (q && VARIANTS.some(v => v.id === q)) {
      sessionStorage.setItem(KEY, q)
      return q
    }
    return sessionStorage.getItem(KEY)
  } catch {
    return null
  }
}

export default function VariantSwitcher() {
  const [variant, setVariant] = useState(readInitial)

  useEffect(() => {
    const root = document.documentElement
    if (variant && variant !== 'off') root.dataset.variant = variant
    else delete root.dataset.variant
    try { if (variant) sessionStorage.setItem(KEY, variant) } catch { /* private mode */ }
  }, [variant])

  if (!variant) return null
  const current = VARIANTS.find(v => v.id === variant) ?? VARIANTS[0]

  return (
    <div className="variant-switcher" role="group" aria-label="デザイン案の切り替え">
      <span className="variant-switcher__status" aria-live="polite">
        表示中: <strong>{current.label}</strong> {current.note}
      </span>
      <div className="variant-switcher__buttons">
        {VARIANTS.map(v => (
          <button
            key={v.id}
            type="button"
            className="variant-switcher__btn"
            aria-pressed={v.id === variant}
            title={v.note}
            onClick={() => setVariant(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  )
}
