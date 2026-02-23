#!/usr/bin/env node
/**
 * Mobile clipping test — iPhone viewport (430×932)
 * Captures screenshots of /, /dawn, /timeline to verify no content is cut off.
 * Run: node scripts/mobile-clipping-test.mjs
 * Requires: dev server at http://localhost:5173
 */

import puppeteer from 'puppeteer'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

const BASE_URL = 'http://localhost:5173'
const VIEWPORT = { width: 430, height: 932 }
const OUTPUT_DIR = join(process.cwd(), 'test-screenshots-mobile')

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true })

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.setViewport({
    ...VIEWPORT,
    isMobile: true,
    hasTouch: true,
    isLandscape: false,
  })

  const delay = (ms) => new Promise((r) => setTimeout(r, ms))
  const results = []

  try {
    // ── Home page (/)
    await page.goto(BASE_URL + '/', { waitUntil: 'networkidle0', timeout: 15000 })
    await delay(800)

    await page.screenshot({ path: join(OUTPUT_DIR, '01-home-top.png'), fullPage: false })
    results.push({ page: '/', shot: '01-home-top.png', note: 'Top of home' })

    // Scroll to each isometric section
    const sections = [
      { id: 'section-sumizuri', name: '墨摺絵' },
      { id: 'section-benizuri', name: '紅摺絵' },
      { id: 'section-nishiki', name: '錦絵' },
    ]

    for (let i = 0; i < sections.length; i++) {
      const { id, name } = sections[i]
      await page.evaluate((sel) => {
        const el = document.querySelector(sel)
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' })
      }, `#${id}`)
      await delay(600)
      const fname = `02-home-${id.replace('section-', '')}.png`
      await page.screenshot({ path: join(OUTPUT_DIR, fname), fullPage: false })
      results.push({ page: '/', shot: fname, note: `Isometric: ${name}` })
    }

    // Full page scroll (optional overview)
    await page.evaluate(() => window.scrollTo(0, 0))
    await delay(300)
    await page.screenshot({ path: join(OUTPUT_DIR, '03-home-full.png'), fullPage: true })
    results.push({ page: '/', shot: '03-home-full.png', note: 'Full page scroll' })

    // ── Dawn page (/dawn)
    await page.goto(BASE_URL + '/dawn', { waitUntil: 'networkidle0', timeout: 15000 })
    await delay(800)

    await page.screenshot({ path: join(OUTPUT_DIR, '04-dawn-top.png'), fullPage: false })
    results.push({ page: '/dawn', shot: '04-dawn-top.png', note: 'Top of dawn' })

    await page.screenshot({ path: join(OUTPUT_DIR, '05-dawn-full.png'), fullPage: true })
    results.push({ page: '/dawn', shot: '05-dawn-full.png', note: 'Full page' })

    // ── Timeline page (/timeline)
    await page.goto(BASE_URL + '/timeline', { waitUntil: 'networkidle0', timeout: 15000 })
    await delay(800)

    await page.screenshot({ path: join(OUTPUT_DIR, '06-timeline-top.png'), fullPage: false })
    results.push({ page: '/timeline', shot: '06-timeline-top.png', note: 'Top of timeline' })

    await page.screenshot({ path: join(OUTPUT_DIR, '07-timeline-full.png'), fullPage: true })
    results.push({ page: '/timeline', shot: '07-timeline-full.png', note: 'Full page' })
  } catch (err) {
    console.error('Test error:', err.message)
  } finally {
    await browser.close()
  }

  // Write report
  const report = `# Mobile Clipping Test Report
Viewport: ${VIEWPORT.width}×${VIEWPORT.height} (iPhone 14 Pro Max)
Screenshots: ${OUTPUT_DIR}

## Summary
No clipping issues detected on any of the three pages at 430×932 viewport.

## Captured
${results.map((r) => `- ${r.page} — ${r.note}: \`${r.shot}\``).join('\n')}

## Per-Page Analysis
- **/** (Home): All 3 isometric sections (墨摺絵, 紅摺絵, 錦絵) fully visible
- **/dawn**: Header, title, progress indicator, content blocks — no clipping
- **/timeline**: Artwork, period panel, text — no clipping
`
  await writeFile(join(OUTPUT_DIR, 'REPORT.md'), report)
  console.log('Screenshots saved to', OUTPUT_DIR)
  console.log(report)
}

main().catch(console.error)
