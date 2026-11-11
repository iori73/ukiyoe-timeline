import { Link } from 'react-router-dom'
import { usePeriods, slotsForPeriod, newSlotsForPeriod, getArtworksForPeriod, field, t, sized, CANONICAL_SLOTS } from './v2Data'
import { EraNumber } from './Marks'
import SlotStrip from './SlotStrip'
import './v2.css'

/**
 * v2 additions to the top page. Rendered only on /v2 (LayerAnimationPage variant="v2");
 * the live "/" is untouched.
 */

/** Era doors before the dive (the old flow needed ~25 screens to reach an overview). */
export function EraIndex({ lang }) {
  const periods = usePeriods()
  return (
    <section className="v2-eras" aria-labelledby="v2-eras-title">
      <div className="v2-eras__head">
        <h2 id="v2-eras-title" className="v2-eras__title">{t(lang, '時代から探す', 'Start from an era')}</h2>
        <p className="v2-eras__lead">
          {t(lang, '色の枠は、その時代の作品に使われた色。左から右へ、墨一色から色が多様になっていきます。',
            'The strip shows the colours used in each era. Read left to right: from ink alone to a full palette.')}
        </p>
      </div>
      <ol className="v2-eras__grid">
        {periods.map((p, i) => {
          const art = getArtworksForPeriod(p.year_start)[0]
          return (
            <li key={p.year_start}>
              <Link className="v2-era" to={`/timeline#era-${p.year_start}`}>
                <span className="v2-era__thumb">
                  {art && (
                    <img
                      src={sized(art.url, 500)}
                      alt=""
                      loading="lazy"
                      // the data's focal point keeps faces/figures inside the crop
                      style={art.focalPoint ? { objectPosition: `${art.focalPoint.x * 100}% ${art.focalPoint.y * 100}%` } : undefined}
                    />
                  )}
                </span>
                <span className="v2-era__meta">
                  <EraNumber n={i + 1} lang={lang} className="v2-era__num" />
                  <span className="v2-era__years">{p.year_start}–{p.year_end}</span>
                </span>
                <span className="v2-era__name">{field(p, 'key_event', lang)}</span>
                {/* same swatches as /v2/timeline (owner, 2026-11-09): 24px chips, names under them, lozenge on new colours */}
                <SlotStrip active={slotsForPeriod(p.year_start)} fresh={newSlotsForPeriod(p.year_start)} lang={lang} showLabels
                  label={t(lang,
                    `使われた色: ${slotsForPeriod(p.year_start).length}色${newSlotsForPeriod(p.year_start).length ? `（初登場: ${newSlotsForPeriod(p.year_start).map((id) => CANONICAL_SLOTS.find((x) => x.id === id)?.label_ja).join('・')}）` : ''}`,
                    `Colours used: ${slotsForPeriod(p.year_start).length}${newSlotsForPeriod(p.year_start).length ? ` (new: ${newSlotsForPeriod(p.year_start).map((id) => CANONICAL_SLOTS.find((x) => x.id === id)?.label_en).join(', ')})` : ''}`)} />
              </Link>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
