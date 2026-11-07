/**
 * Shared data helpers for the v2 redesign prototype (2026-11-07).
 * Everything here is derived from the existing sources of truth:
 *  - periods: public/ukiyoe_for_figma_with_images_rows_duplicate_rows.csv (via loadUkiyoeData)
 *  - artworks: src/data/ukiyoe.js PERIOD_ARTWORKS (45 = 9 periods × 5)
 *  - colours: src/data/periodColors.js CANONICAL_SLOTS / PERIOD_COLORS (the 9-slot palette)
 */
import { useEffect, useState } from 'react'
import { loadUkiyoeData, getArtworksForPeriod } from '../../data/ukiyoe'
import { CANONICAL_SLOTS, PERIOD_COLORS } from '../../data/periodColors'

export { CANONICAL_SLOTS, getArtworksForPeriod }

/** One row per period, de-duplicated by year_start (the CSV contains duplicate rows). */
export function usePeriods() {
  const [periods, setPeriods] = useState([])
  useEffect(() => {
    let alive = true
    loadUkiyoeData().then((rows) => {
      const seen = new Map()
      for (const r of rows) if (!seen.has(r.year_start)) seen.set(r.year_start, r)
      if (alive) setPeriods([...seen.values()].sort((a, b) => +a.year_start - +b.year_start))
    })
    return () => { alive = false }
  }, [])
  return periods
}

export function slotsForPeriod(yearStart) {
  return PERIOD_COLORS.find((p) => p.year_start === Number(yearStart))?.activeSlots ?? []
}

/** Slots that appear for the first time in this period (shown as "初登場 / new"). */
export function newSlotsForPeriod(yearStart) {
  const y = Number(yearStart)
  const earlier = new Set(PERIOD_COLORS.filter((p) => p.year_start < y).flatMap((p) => p.activeSlots))
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
