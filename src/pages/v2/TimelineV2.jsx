import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { usePeriods, slotsForPeriod, newSlotsForPeriod, getArtworksForPeriod, field, t, sourceOf, sized, CANONICAL_SLOTS } from './v2Data'
import SlotStrip from './SlotStrip'
import LanguageToggle from '../../components/LanguageToggle'
import { Hishi, Fan, EraNumber } from './Marks'
import './v2.css'

/**
 * /v2/timeline — redesign prototype (2026-11-07).
 *
 * Why it is shaped this way (see docs/specs/redesign-v2.md):
 * - Keep the project's own argument: ukiyo-e were everyday, mass-produced prints, so the
 *   works sit at their own proportions in a loose, slightly staggered run (a print seller's
 *   front, not a museum grid). Museum sites lend only their *findability*: a time ruler to jump,
 *   a title/artist under every work, and a detail sheet.
 * - The palette stays the protagonist: every era carries the same 9-slot strip, with colours
 *   that appear for the first time marked, so "the palette grows" reads across the page.
 * - No fixed panel over the art (it overlapped works in 6 of 8 sampled positions): era context
 *   sits above each run, and the long background text only opens on request.
 */

/**
 * Time ruler. PC: a vertical column on the left (time runs down, the same way the page scrolls).
 * Phone: a horizontal strip stuck right under the header that scrolls itself so the current era
 * sits in the middle. Positions come from the data (first era start → last era end).
 */
function EraRuler({ periods, active, lang, onJump }) {
  const navRef = useRef(null)
  const first = Math.min(...periods.map((p) => +p.year_start))
  const last = Math.max(...periods.map((p) => +(p.year_end || p.year_start)))
  // Eras only a few years apart (1750 / 1765 / 1770) would print their years on top of each
  // other; every other one in a close run moves its label to the other side of the line.
  const stops = periods.reduce((acc, p) => {
    const pos = ((+p.year_start - first) / (last - first)) * 100
    const prev = acc[acc.length - 1]
    const close = prev && pos - prev.pos < 8
    acc.push({ p, pos, alt: Boolean(close && !prev.alt) })
    return acc
  }, [])

  // Phone (horizontal, scrollable): keep the current era centred in the strip.
  useEffect(() => {
    const nav = navRef.current
    if (!nav || nav.scrollWidth <= nav.clientWidth) return
    const btn = nav.querySelector('.v2-ruler__stop.is-active')
    if (!btn) return
    const track = btn.offsetParent
    const target = Math.max(0, Math.min(nav.scrollWidth - nav.clientWidth,
      (track?.offsetLeft ?? 0) + btn.offsetLeft + btn.offsetWidth / 2 - nav.clientWidth / 2))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { nav.scrollLeft = target; return undefined }
    // An unhurried glide (owner: the browser's smooth scroll felt abrupt): 900ms, ease-in-out.
    const from = nav.scrollLeft, dist = target - from, dur = 900, t0 = performance.now()
    const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2)
    let raf = requestAnimationFrame(function stepFrame(now) {
      const p = Math.min(1, (now - t0) / dur)
      nav.scrollLeft = from + dist * ease(p)
      if (p < 1) raf = requestAnimationFrame(stepFrame)
    })
    return () => cancelAnimationFrame(raf)
  }, [active])

  return (
    <nav className="v2-ruler" ref={navRef} aria-label={t(lang, '時代へ移動', 'Jump to an era')}>
      <div className="v2-ruler__track">
        <span className="v2-ruler__line" aria-hidden="true" />
        {stops.map(({ p, pos, alt }, i) => {
          const on = active === p.year_start
          return (
            <button
              key={p.year_start}
              type="button"
              className={`v2-ruler__stop${on ? ' is-active' : ''}${alt ? ' is-alt' : ''}`}
              style={{ '--pos': `${pos}%` }}
              aria-current={on ? 'true' : undefined}
              onClick={() => onJump(p.year_start)}
            >
              <span className="v2-ruler__dango" aria-hidden="true" />
              <span className="v2-ruler__year">{p.year_start}</span>
              <span className="v2-ruler__sr">{i + 1} {field(p, 'key_event', lang)}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/** Same header as the live /timeline (logo → top, language toggle); its height feeds the sticky offsets. */
function TimelineHeader() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const set = () => document.documentElement.style.setProperty('--v2-header-h', `${el.offsetHeight}px`)
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => { ro.disconnect(); document.documentElement.style.removeProperty('--v2-header-h') }
  }, [])
  return (
    <header className="header v2-tl__header" ref={ref}>
      <div className="header-content">
        <Link to="/v2" className="logo" style={{ textDecoration: 'none' }}>
          <span className="logo-kanji">
            <img src="/images/logo-square-white.svg?v=20260707" alt="浮世絵" className="logo-kanji-image" width="48" height="48" />
          </span>
        </Link>
        <LanguageToggle />
      </div>
    </header>
  )
}

function ArtworkCard({ art, lang, onOpen, index }) {
  return (
    <li className="v2-work" style={{ '--stagger': `${[0, 28, 12, 40, 6][index % 5]}px` }}>
      <button type="button" className="v2-work__btn" onClick={onOpen}>
        <span className="v2-work__img">
          <img src={sized(art.url, 500)} alt={t(lang, art.title_ja, art.title_en)} loading="lazy" onError={(e) => { if (e.currentTarget.src !== art.url) e.currentTarget.src = art.url }} />
        </span>
        <span className="v2-work__title">{t(lang, art.title_ja, art.title_en)}</span>
        <span className="v2-work__artist">{t(lang, art.artist_ja, art.artist_en)}</span>
        {art.year && <span className="v2-work__year">{art.year}</span>}
      </button>
    </li>
  )
}

function ArtworkSheet({ item, lang, onClose, onStep, eraLabel }) {
  const closeRef = useRef(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose, onStep])
  if (!item) return null
  const { art, pos, total } = item
  const src = sourceOf(art.url)
  return (
    <div className="v2-sheet" role="dialog" aria-modal="true" aria-label={t(lang, art.title_ja, art.title_en)}>
      <button type="button" className="v2-sheet__scrim" aria-label={t(lang, '閉じる', 'Close')} onClick={onClose} />
      <div className="v2-sheet__panel">
        <div className="v2-sheet__bar">
          <span className="v2-sheet__era">{eraLabel}</span>
          <button ref={closeRef} type="button" className="v2-sheet__close" onClick={onClose} aria-label={t(lang, '閉じる', 'Close')}>×</button>
        </div>
        <div className="v2-sheet__img"><img src={sized(art.url, 1280)} alt={t(lang, art.title_ja, art.title_en)} onError={(e) => { if (e.currentTarget.src !== art.url) e.currentTarget.src = art.url }} /></div>
        <h3 className="v2-sheet__title">{t(lang, art.title_ja, art.title_en)}</h3>
        <p className="v2-sheet__artist">
          {t(lang, art.artist_ja, art.artist_en)}
          {art.year && <span className="v2-sheet__year">{art.year}</span>}
        </p>
        <p className="v2-sheet__desc">{t(lang, art.description_ja, art.description_en)}</p>
        {art.collection ? (
          // New-format records carry the holding museum, accession number and licence.
          <p className="v2-sheet__credit">
            {art.source_url
              ? <a href={art.source_url} target="_blank" rel="noopener noreferrer">{art.collection}</a>
              : art.collection}
            {art.accession && ` ${art.accession}`}
            {art.license && ` · ${art.license}`}
          </p>
        ) : src && (
          <p className="v2-sheet__credit">
            {t(lang, '画像: ', 'Image: ')}
            <a href={src.url} target="_blank" rel="noopener noreferrer">{src.name}</a>
          </p>
        )}
        <div className="v2-sheet__nav">
          <button type="button" onClick={() => onStep(-1)}>{t(lang, '← 前の作品', '← Previous')}</button>
          <span>{pos} / {total}</span>
          <button type="button" onClick={() => onStep(1)}>{t(lang, '次の作品 →', 'Next →')}</button>
        </div>
      </div>
    </div>
  )
}

export default function TimelineV2() {
  const { language: lang } = useLanguage()
  const periods = usePeriods()
  const location = useLocation()
  const [active, setActive] = useState(null)
  const [open, setOpen] = useState(null) // { era, index }

  useEffect(() => {
    document.body.classList.add('v2-dark')
    return () => document.body.classList.remove('v2-dark')
  }, [])

  const flat = useMemo(() => periods.flatMap((p) => getArtworksForPeriod(p.year_start).map((art) => ({ art, era: p }))), [periods])

  useEffect(() => {
    if (!periods.length) return undefined
    const els = periods.map((p) => document.getElementById(`era-${p.year_start}`)).filter(Boolean)
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting)[0]
      if (hit) setActive(hit.target.dataset.year)
    }, { rootMargin: '-40% 0px -55% 0px' })
    els.forEach((el) => io.observe(el))
    const timers = []
    if (location.hash) {
      // Images above the target load after the first jump and push it down; re-align a few times.
      const align = () => document.getElementById(location.hash.slice(1))?.scrollIntoView()
      align()
      timers.push(setTimeout(align, 600), setTimeout(align, 1600))
    } else setActive(periods[0].year_start)
    return () => { io.disconnect(); timers.forEach(clearTimeout) }
  }, [periods, location.hash])

  const jump = (year) => document.getElementById(`era-${year}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const openAt = (flatIndex) => setOpen(flatIndex)
  const step = useCallback((d) => setOpen((i) => (i === null ? null : (i + d + flat.length) % flat.length)), [flat.length])
  const close = useCallback(() => setOpen(null), [])

  let counter = 0
  return (
    <div className="v2-tl">
      <TimelineHeader />
      <header className="v2-tl__intro">
        <p className="v2-tl__kicker">{periods.length ? `${periods[0].year_start} — ${periods[periods.length - 1].year_end || periods[periods.length - 1].year_start}` : ''}</p>
        <h1 className="v2-tl__title">{t(lang, '時代ごとの作品', 'Prints by era')}</h1>
        <p className="v2-tl__lead">
          {t(lang, `浮世絵の多くは、町の人が気軽に買った刷り物でした。${periods.length}つの時代の${flat.length}点を、色が一つずつ増えていく順に並べています。`,
            `Most ukiyo-e were prints that townspeople bought casually. Here are ${flat.length} works across ${periods.length} eras, in the order the palette grew.`)}
        </p>
        <div className="v2-tl__legend">
          <SlotStrip active={CANONICAL_SLOTS.map((s) => s.id)} lang={lang} size="sm" showLabels label={t(lang, '9色の枠', 'The nine colour slots')} />
          <span>
            {t(lang, '色の枠は、その時代の作品に使われた色。', 'Each strip shows the colours used in that era. ')}
            <Hishi className="v2-hishi--inline" />
            {t(lang, ' は初めて登場した色です。', ' marks a colour appearing for the first time.')}
          </span>
        </div>
      </header>

      <div className="v2-tl__body">
      {periods.length > 0 && <EraRuler periods={periods} active={active} lang={lang} onJump={jump} />}

      <div className="v2-tl__eras">
      {periods.map((p, i) => {
        const arts = getArtworksForPeriod(p.year_start)
        const fresh = newSlotsForPeriod(p.year_start)
        const freshNames = fresh.map((id) => t(lang, CANONICAL_SLOTS.find((s) => s.id === id)?.label_ja, CANONICAL_SLOTS.find((s) => s.id === id)?.label_en)).join(t(lang, '・', ', '))
        return (
          <section key={p.year_start} id={`era-${p.year_start}`} data-year={p.year_start} className="v2-era-sec" aria-labelledby={`era-title-${p.year_start}`}>
            <div className="v2-era-sec__head">
              <EraNumber n={i + 1} lang={lang} className="v2-era-sec__num" />
              <span className="v2-era-sec__years">{p.year_start} — {p.year_end}</span>
              <h2 id={`era-title-${p.year_start}`} className="v2-era-sec__title">{field(p, 'key_event', lang)}</h2>
              <p className="v2-era-sec__artists">{field(p, 'artists', lang)}</p>
              <div className="v2-era-sec__palette">
                <SlotStrip active={slotsForPeriod(p.year_start)} fresh={fresh} lang={lang} />
                {fresh.length > 0 && <span className="v2-era-sec__fresh"><Hishi className="v2-hishi--inline" /> {t(lang, `初登場: ${freshNames}`, `New: ${freshNames}`)}</span>}
              </div>
              <details className="v2-era-sec__more">
                <summary>
                  {t(lang, 'この時代の背景を読む', 'Read the background')}
                  {/* folded fan while shut, spread fan while open (the owner's drawing, Figma 168:65) */}
                  <Fan className="v2-fanmark" />
                </summary>
                <dl>
                  <dt>{t(lang, '背景', 'Background')}</dt><dd>{field(p, 'background', lang)}</dd>
                  <dt>{t(lang, '技法', 'Technique')}</dt><dd>{field(p, 'technique', lang)}</dd>
                  <dt>{t(lang, '売られ方', 'How they were sold')}</dt><dd>{field(p, 'market', lang)}</dd>
                </dl>
              </details>
            </div>
            <ol className="v2-works">
              {arts.map((art, k) => {
                const idx = counter++
                return <ArtworkCard key={art.id} art={art} lang={lang} index={k} onOpen={() => openAt(idx)} />
              })}
            </ol>
          </section>
        )
      })}
      </div>
      </div>

      {periods.length > 0 && (
        <section className="v2-summary" aria-labelledby="v2-summary-title">
          <h2 id="v2-summary-title" className="v2-summary__title">{t(lang, '色が増えていく', 'How the palette grew')}</h2>
          <ol className="v2-summary__rows">
            {periods.map((p) => (
              <li key={p.year_start}>
                <a href={`#era-${p.year_start}`} onClick={(e) => { e.preventDefault(); jump(p.year_start) }}>
                  <span className="v2-summary__years">{p.year_start}–{p.year_end}</span>
                  <SlotStrip active={slotsForPeriod(p.year_start)} fresh={newSlotsForPeriod(p.year_start)} lang={lang} />
                </a>
              </li>
            ))}
          </ol>
          <Link to="/v2" className="v2-summary__back">{t(lang, '← 版木の重なりに戻る', '← Back to the layered blocks')}</Link>
        </section>
      )}

      {open !== null && flat[open] && (
        <ArtworkSheet
          lang={lang}
          item={{ art: flat[open].art, pos: open + 1, total: flat.length }}
          eraLabel={`${flat[open].era.year_start}–${flat[open].era.year_end} · ${field(flat[open].era, 'key_event', lang)}`}
          onClose={close}
          onStep={step}
        />
      )}
    </div>
  )
}
