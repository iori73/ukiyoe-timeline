import { CANONICAL_SLOTS, t } from './v2Data'
import { Hishi } from './Marks'

/**
 * The colour slots (10 in v2: 墨 → 丹 → … → 紙) as a strip: used slots are filled, unused ones stay as a
 * hairline ghost. Same order everywhere, so "colours being added
 * over time" reads left-to-right on both pages. A colour that appears for the
 * first time carries the owner's flat lozenge (Hishi) above it.
 */
export default function SlotStrip({ active = [], fresh = [], lang, size = 'md', showLabels = false, label }) {
  return (
    <div className={`v2-slots v2-slots--${size}${showLabels ? ' v2-slots--labels' : ''}`} role="img" aria-label={label ?? t(lang, `使われた色: ${active.length} / ${CANONICAL_SLOTS.length}`, `Colours in use: ${active.length} of ${CANONICAL_SLOTS.length}`)}>
      {CANONICAL_SLOTS.map((s) => {
        const on = active.includes(s.id)
        const isNew = fresh.includes(s.id)
        return (
          <span key={s.id} className={`v2-slot${on ? ' is-on' : ''}${isNew ? ' is-new' : ''}`}>
            {isNew && <Hishi className="v2-slot__new" />}
            <span className="v2-slot__chip" style={on ? { background: s.hex } : undefined} />
            {showLabels && <span className="v2-slot__label">{t(lang, s.label_ja, s.label_en)}</span>}
          </span>
        )
      })}
    </div>
  )
}
