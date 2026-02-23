#!/usr/bin/env node
/**
 * Viewport test for Layer Animation page timeline section.
 * Captures screenshots at 785px, 600px, and 500px widths.
 * Run: node scripts/timeline-viewport-test.mjs
 */
import puppeteer from 'puppeteer'
import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '../screenshots-viewport-test')
const BASE_URL = process.env.BASE_URL || 'http://localhost:5177'
const VIEWPORTS = [
  { width: 1200, height: 900 },
  { width: 700, height: 900 },
  { width: 450, height: 900 },
]
const ANIMATION_WAIT_MS = 5000

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.setCacheEnabled(false) // Hard refresh: bypass cache

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height })
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' })

    // Scroll to description/timeline section (浮世絵 text + technique timeline)
    await page.evaluate(() => {
      const desc = document.querySelector('.layer-anim__description')
      if (desc) desc.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
    await new Promise((r) => setTimeout(r, 500))
    // Wait for all timeline animations to complete
    await new Promise((r) => setTimeout(r, ANIMATION_WAIT_MS))

    const path = join(OUT_DIR, `timeline-${vp.width}px.png`)
    await page.screenshot({ path, fullPage: false })
    console.log(`Saved: ${path}`)
  }

  await browser.close()
  console.log('Done.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
