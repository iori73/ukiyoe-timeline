#!/usr/bin/env node
/**
 * Verify timeline indicators visibility after CSS fix
 * - Mobile: 430x932, screenshot at top and after scroll
 * - Desktop: 1440x900, screenshot
 * - JS: content box sizes for indicator buttons
 */

import puppeteer from 'puppeteer'
import { mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUTPUT_DIR = join(ROOT, 'screenshots')

const PORT = parseInt(process.argv[2] || '5183', 10)
const URL = `http://localhost:${PORT}/timeline`

async function main() {
  const browser = await puppeteer.launch({ headless: 'new' })
  try {
    const page = await browser.newPage()
    await mkdir(OUTPUT_DIR, { recursive: true })

    // --- MOBILE 430x932 ---
    await page.setViewport({ width: 430, height: 932 })
    await page.goto(URL, { waitUntil: 'load', timeout: 10000 })
    await new Promise(r => setTimeout(r, 1500))

    // Screenshot 1: Initial load
    await page.screenshot({ path: join(OUTPUT_DIR, 'verify-mobile-initial.png'), type: 'png' })
    console.log('Saved: screenshots/verify-mobile-initial.png')

    // Scroll to middle section
    await page.evaluate(() => {
      const h = document.documentElement.scrollHeight
      window.scrollTo(0, h * 0.4)
    })
    await new Promise(r => setTimeout(r, 600))

    // Screenshot 2: After scroll
    await page.screenshot({ path: join(OUTPUT_DIR, 'verify-mobile-scrolled.png'), type: 'png' })
    console.log('Saved: screenshots/verify-mobile-scrolled.png')

    // JS: Content box sizes (run at mobile viewport)
    const jsResults = await page.evaluate(() => {
      const buttons = document.querySelectorAll('.timeline-gallery-indicator')
      const results = []
      buttons.forEach((btn, i) => {
        const s = window.getComputedStyle(btn)
        const rect = btn.getBoundingClientRect()
        results.push({
          index: i,
          boxSizing: s.boxSizing,
          width: s.width,
          height: s.height,
          padding: s.padding,
          bgClip: s.backgroundClip,
          bgColor: s.backgroundColor,
          opacity: s.opacity,
          rect: {
            top: Math.round(rect.top),
            left: Math.round(rect.left),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          }
        })
      })
      return JSON.stringify(results, null, 2)
    })
    console.log('\n=== JavaScript: Content box sizes (mobile viewport) ===')
    console.log(jsResults)

    // --- DESKTOP 1440x900 ---
    await page.setViewport({ width: 1440, height: 900 })
    await page.goto(URL, { waitUntil: 'load', timeout: 10000 })
    await new Promise(r => setTimeout(r, 1000))

    await page.screenshot({ path: join(OUTPUT_DIR, 'verify-desktop.png'), type: 'png' })
    console.log('\nSaved: screenshots/verify-desktop.png')

  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  if (err.message?.includes('ERR_CONNECTION_REFUSED')) {
    console.error(`Port ${PORT} refused. Try: node scripts/verify-timeline-indicators.js 5173`)
  }
  console.error(err)
  process.exit(1)
})
