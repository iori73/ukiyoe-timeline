#!/usr/bin/env node
/**
 * Verify all Ukiyoe pages at mobile width (430x932)
 */

import puppeteer from 'puppeteer'
import { mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUTPUT_DIR = join(ROOT, 'screenshots')

const PORT = parseInt(process.argv[2] || '5183', 10)
const BASE = `http://localhost:${PORT}`

async function capture(page, path, filename, options = {}) {
  const { waitMs = 2000, scrollPct, waitForAnimation } = options
  const url = `${BASE}${path}`
  await page.goto(url, { waitUntil: 'load', timeout: 15000 })
  if (waitForAnimation) {
    await new Promise(r => setTimeout(r, waitForAnimation))
  } else {
    await new Promise(r => setTimeout(r, waitMs))
  }
  if (scrollPct != null) {
    await page.evaluate((pct) => {
      const h = document.documentElement.scrollHeight
      window.scrollTo(0, h * pct)
    }, scrollPct)
    await new Promise(r => setTimeout(r, 500))
  }
  const filepath = join(OUTPUT_DIR, filename)
  await page.screenshot({ path: filepath, type: 'png' })
  return filepath
}

async function main() {
  const browser = await puppeteer.launch({ headless: 'new' })
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 430, height: 932 })
    await mkdir(OUTPUT_DIR, { recursive: true })

    console.log('1. Home (/) - waiting for loading animation (~5s)...')
    await capture(page, '/', 'mobile-home.png', { waitForAnimation: 5000 })
    console.log('   Saved: screenshots/mobile-home.png')

    console.log('2. Dawn (/dawn)...')
    await capture(page, '/dawn', 'mobile-dawn.png', { waitMs: 2000 })
    console.log('   Saved: screenshots/mobile-dawn.png')

    console.log('3. Timeline (/timeline) - scrolling 30%...')
    await capture(page, '/timeline', 'mobile-timeline.png', { waitMs: 1500, scrollPct: 0.3 })
    console.log('   Saved: screenshots/mobile-timeline.png')

    console.log('4. 404 page...')
    await capture(page, '/this-page-does-not-exist', 'mobile-404.png', { waitMs: 1000 })
    console.log('   Saved: screenshots/mobile-404.png')

    console.log('\nDone.')
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  if (err.message?.includes('ERR_CONNECTION_REFUSED')) {
    console.error(`Port ${PORT} refused. Try: node scripts/verify-mobile-pages.js 5173`)
  }
  console.error(err)
  process.exit(1)
})
