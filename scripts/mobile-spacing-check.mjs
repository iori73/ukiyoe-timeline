#!/usr/bin/env node
/**
 * Mobile vertical spacing check — captures each isometric section
 * showing illustration + text below for spacing assessment.
 * Viewport: 430×932 (iPhone)
 */

import puppeteer from 'puppeteer'
import { mkdir } from 'fs/promises'
import { join } from 'path'

const BASE_URL = 'http://localhost:5173'
const VIEWPORT = { width: 430, height: 932 }
const OUTPUT_DIR = join(process.cwd(), 'test-screenshots-mobile')

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

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

  await page.goto(BASE_URL + '/', { waitUntil: 'networkidle0', timeout: 15000 })
  await delay(1000)

  const sections = [
    { id: 'section-sumizuri', name: 'sumizuri' },
    { id: 'section-benizuri', name: 'benizuri' },
    { id: 'section-nishiki', name: 'nishiki' },
  ]

  for (const { id, name } of sections) {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel)
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'center' })
      }
    }, `#${id}`)
    await delay(500)
    const fname = `tight-${name}.png`
    await page.screenshot({ path: join(OUTPUT_DIR, fname), fullPage: false })
    console.log('Saved:', fname)
  }

  await browser.close()
  console.log('Done. Screenshots in', OUTPUT_DIR)
}

main().catch(console.error)
