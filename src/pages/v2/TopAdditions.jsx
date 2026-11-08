import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePeriods, slotsForPeriod, getArtworksForPeriod, field, t, sized, CANONICAL_SLOTS } from './v2Data'
import { TECHNIQUES } from '../../data/techniques'
import SlotStrip from './SlotStrip'
import './v2.css'

/**
 * v2 additions to the top page. Rendered only on /v2 (LayerAnimationPage variant="v2");
 * the live "/" is untouched.
 */

/** Two ways in, said up front (the case study notes first-time visitors were lost without context). */
export function EntryPoints({ lang }) {
  // Counts come from the data so the copy stays true when eras or works change.
  const periods = usePeriods()
  const works = periods.reduce((n, p) => n + getArtworksForPeriod(p.year_start).length, 0)
  const span = periods.length ? `${periods[0].year_start}–${periods[periods.length - 1].year_end || periods[periods.length - 1].year_start}` : ''
  return (
    <section className="v2-entry" aria-label={t(lang, 'このサイトの見方', 'How to use this site')}>
      <a className="v2-entry__card" href="#v2-techniques">
        <span className="v2-entry__num">01</span>
        <span className="v2-entry__title">{t(lang, '版木の重なりを見る', 'Watch the blocks stack up')}</span>
        <span className="v2-entry__text">
          {t(lang, '墨摺絵・紅摺絵・錦絵。手で色を分けた版木が、一枚ずつ重なって絵になります。',
            'Sumizuri-e, benizuri-e, nishiki-e: hand-separated colour blocks stack, one at a time, into a print.')}
        </span>
        <span className="v2-entry__go" aria-hidden="true">↓</span>
      </a>
      <Link className="v2-entry__card" to="/v2/timeline">
        <span className="v2-entry__num">02</span>
        <span className="v2-entry__title">{t(lang, '時代ごとに作品を見る', 'Browse prints by era')}</span>
        <span className="v2-entry__text">
          {t(lang, `${span}年の${periods.length}つの時代、${works}点。色が一つずつ増えていく流れを追えます。`,
            `${periods.length} eras, ${span}, ${works} prints. Follow how the palette grows, one colour at a time.`)}
        </span>
        <span className="v2-entry__go" aria-hidden="true">→</span>
      </Link>
    </section>
  )
}

/**
 * Sticky palette rail beside the three technique scenes. It ties the top page's
 * story (one colour per block) to the timeline's 9-slot colour system.
 */
// Derived from src/data/techniques.js (each technique lists the colours it ADDS),
// mapped onto the 9 canonical slots and accumulated: each block is printed over the previous ones.
const hexToSlot = Object.fromEntries(CANONICAL_SLOTS.map((s) => [s.hex.toLowerCase(), s.id]))
const MAJOR = ['sumizuri', 'benizuri', 'nishiki']
const TECHNIQUE_SLOTS = MAJOR.reduce((acc, id) => {
  const tech = TECHNIQUES.find((x) => x.id === id)
  const added = (tech?.colors ?? []).map((h) => hexToSlot[h.toLowerCase()]).filter(Boolean)
  const prev = acc.length ? acc[acc.length - 1].slots : []
  acc.push({ id, ja: tech?.name_ja, en: tech?.name_en, added, slots: [...new Set([...prev, ...added])] })
  return acc
}, [])

export function PaletteRail({ lang, current }) {
  const tech = TECHNIQUE_SLOTS[current] ?? TECHNIQUE_SLOTS[0]
  return (
    <aside className="v2-rail" aria-live="polite">
      <span className="v2-rail__label">{t(lang, '版に加わった色', 'Colours added so far')}</span>
      <span className="v2-rail__tech">{t(lang, tech.ja, tech.en)}</span>
      <SlotStrip active={tech.slots} fresh={tech.added} lang={lang} size="sm" />
      <span className="v2-rail__count">{t(lang, `${tech.slots.length} / 9 色（新しく ${tech.added.length} 色）`, `${tech.slots.length} of 9 (${tech.added.length} new)`)}</span>
    </aside>
  )
}

/**
 * Wraps the three existing (hand-painted) technique scenes and follows which one is
 * on screen, so the palette rail can show the colours that block adds.
 */
export function TechniqueStage({ lang, children }) {
  const ref = useRef(null)
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const scenes = [...(ref.current?.querySelectorAll('.layer-anim__scene') ?? [])]
    if (!scenes.length) return undefined
    // The scene crossing the middle of the viewport is "current". A ratio threshold failed on
    // phones, where a scene is taller than the screen and never reaches 35% visible.
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting)
        if (hit) setCurrent(scenes.indexOf(hit.target))
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )
    scenes.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])
  return (
    <div id="v2-techniques" className="v2-stage" ref={ref}>
      <div className="v2-stage__scenes">{children}</div>
      <PaletteRail lang={lang} current={current} />
    </div>
  )
}

/** Nine era doors before the dive (the old flow needed ~25 screens to reach an overview). */
export function EraIndex({ lang }) {
  const periods = usePeriods()
  return (
    <section className="v2-eras" aria-labelledby="v2-eras-title">
      <div className="v2-eras__head">
        <h2 id="v2-eras-title" className="v2-eras__title">{t(lang, '時代から探す', 'Start from an era')}</h2>
        <p className="v2-eras__lead">
          {t(lang, '色の枠は、その時代の作品に使われた色。左から右へ、墨一色から色が増えていきます。',
            'The strip shows the colours used in each era. Read left to right: from ink alone to a full palette.')}
        </p>
      </div>
      <ol className="v2-eras__grid">
        {periods.map((p, i) => {
          const art = getArtworksForPeriod(p.year_start)[0]
          return (
            <li key={p.year_start}>
              <Link className="v2-era" to={`/v2/timeline#era-${p.year_start}`}>
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
                  <span className="v2-era__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="v2-era__years">{p.year_start}–{p.year_end}</span>
                </span>
                <span className="v2-era__name">{field(p, 'key_event', lang)}</span>
                <SlotStrip active={slotsForPeriod(p.year_start)} lang={lang} size="sm" />
              </Link>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
