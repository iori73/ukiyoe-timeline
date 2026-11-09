/**
 * Shared data helpers for the v2 timeline.
 * Since 2026-11-09 v2 reads its own data (the live pages keep the old CSV / ukiyoe.js / periodColors.js):
 *  - eras: src/data/v2/eras.js (7 eras split by technique, texts, colours used, 10 colour slots)
 *  - artworks: src/data/v2/artworks.json, built by scripts/build_artworks_v2.py from the verified
 *    candidate list (year, holding museum, accession, licence, source page for every work)
 */
import { useEffect } from 'react'
import { ERAS, SLOTS } from '../../data/v2/eras'
import ARTWORKS from '../../data/v2/artworks.json'

/** The colour slots, in order (kept under the old name so the components stay unchanged). */
export const CANONICAL_SLOTS = SLOTS

/** Eras shaped like the old period rows, so field(p, 'key_event', lang) etc. keep working. */
const PERIODS = ERAS.map((e) => ({
  ...e,
  key_event_ja: e.name_ja, key_event_en: e.name_en,
  lead_ja: e.key_ja, lead_en: e.key_en,
}))
export function usePeriods() { return PERIODS }

const byEra = (yearStart) => ERAS.find((e) => e.year_start === Number(yearStart))

/** The era's featured works (shown first; the first is the era's entry work). */
export function getArtworksForPeriod(yearStart) {
  const e = byEra(yearStart)
  return e ? ARTWORKS.filter((w) => w.era === e.id && w.featured) : []
}

/** The rest of the era's works ("この時代の作品をもっと見る"). */
export function getMoreArtworksForPeriod(yearStart) {
  const e = byEra(yearStart)
  return e ? ARTWORKS.filter((w) => w.era === e.id && !w.featured) : []
}

export function slotsForPeriod(yearStart) {
  return byEra(yearStart)?.activeSlots ?? []
}

/** Slots that appear for the first time in this period (shown as "初登場 / new"). */
export function newSlotsForPeriod(yearStart) {
  const y = Number(yearStart)
  const earlier = new Set(ERAS.filter((e) => e.year_start < y).flatMap((e) => e.activeSlots))
  return slotsForPeriod(y).filter((s) => !earlier.has(s))
}

export const t = (lang, ja, en) => (lang === 'ja' ? ja : en)

export const field = (row, base, lang) => row?.[`${base}_${lang === 'ja' ? 'ja' : 'en'}`] || row?.[`${base}_en`] || ''

/**
 * Wikimedia originals are often several MB each; 45 of them made the later eras miss their
 * load (and drag the page's performance). Commons serves resized copies at
 * /thumb/<a>/<ab>/<File>/<width>px-<File>; other hosts are returned unchanged.
 */
export function sized(url, width) {
  try {
    const u = new URL(url)
    if (u.hostname !== 'upload.wikimedia.org' || u.pathname.includes('/thumb/') || /\.svg$/i.test(u.pathname)) return url
    const parts = u.pathname.split('/') // ['', 'wikipedia', 'commons', 'a', 'a5', 'File.jpg']
    const file = parts[parts.length - 1]
    parts.splice(3, 0, 'thumb')
    return `${u.origin}${parts.join('/')}/${width}px-${file}`
  } catch {
    return url
  }
}

/** Where an artwork image comes from, for the credit line (mirrors ArtworkDetailModal). */
export function sourceOf(imageUrl) {
  try {
    const u = new URL(imageUrl)
    if (u.hostname === 'upload.wikimedia.org') {
      const file = decodeURIComponent(u.pathname.split('/').pop())
      return { url: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`, name: 'Wikimedia Commons' }
    }
    if (u.hostname === 'data.ukiyo-e.org') {
      const parts = u.pathname.split('/')
      const id = parts[parts.length - 1].replace(/\.[^.]+$/, '')
      return { url: `https://ukiyo-e.org/image/${parts[1]}/${id}`, name: 'Ukiyo-e.org' }
    }
    return { url: imageUrl, name: u.hostname }
  } catch {
    return null
  }
}

/**
 * Prototype routes (/v2, /v2/timeline) are public but must not compete with the live pages in
 * search results: add <meta name="robots" content="noindex"> while mounted.
 */
export function useNoindex(active = true) {
  useEffect(() => {
    if (!active) return undefined
    const m = document.createElement('meta')
    m.name = 'robots'; m.content = 'noindex'
    document.head.appendChild(m)
    return () => m.remove()
  }, [active])
}

