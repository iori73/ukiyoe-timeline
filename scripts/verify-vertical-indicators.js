#!/usr/bin/env node
/**
 * Verify timeline indicators appear as vertical column on right at mobile
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

    // Scroll down ~30-40%
    await page.evaluate(() => {
      const h = document.documentElement.scrollHeight
      window.scrollTo(0, h * 0.35)
    })
    await new Promise(r => setTimeout(r, 600))

    await page.screenshot({
      path: join(OUTPUT_DIR, 'verify-mobile-vertical.png'),
      type: 'png'
    })
    console.log('Saved: screenshots/verify-mobile-vertical.png')

    // --- DESKTOP 1440x900 ---
    await page.setViewport({ width: 1440, height: 900 })
    await page.goto(URL, { waitUntil: 'load', timeout: 10000 })
    await new Promise(r => setTimeout(r, 1000))

    await page.screenshot({
      path: join(OUTPUT_DIR, 'verify-desktop-vertical.png'),
      type: 'png'
    })
    console.log('Saved: screenshots/verify-desktop-vertical.png')

  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  if (err.message?.includes('ERR_CONNECTION_REFUSED')) {
    console.error(`Port ${PORT} refused. Try: node scripts/verify-vertical-indicators.js 5173`)
  }
  console.error(err)
  process.exit(1)
})
