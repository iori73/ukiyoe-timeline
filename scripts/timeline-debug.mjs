#!/usr/bin/env node
/**
 * Debug script for timeline section - checks DOM, computed styles, and wrapper dimensions.
 * Run: node scripts/timeline-debug.mjs
 */
import puppeteer from 'puppeteer'
import { mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '../screenshots-viewport-test')
const BASE_URL = process.env.BASE_URL || 'http://localhost:5177'

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.setCacheEnabled(false)

  await page.setViewport({ width: 700, height: 900 })
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' })

  // Scroll to timeline section
  await page.evaluate(() => {
    const desc = document.querySelector('.layer-anim__description')
    if (desc) desc.scrollIntoView({ behavior: 'instant', block: 'start' })
  })
  await new Promise((r) => setTimeout(r, 500))

  // Get DOM info and computed styles
  const debugInfo = await page.evaluate(() => {
    const wrap = document.querySelector('.layer-anim__timeline-wrap')
    const timeline = document.querySelector('.layer-anim__timeline')
    const result = {
      wrapExists: !!wrap,
      timelineExists: !!timeline,
      wrapInfo: null,
      timelineInfo: null,
    }
    if (wrap) {
      const cs = getComputedStyle(wrap)
      result.wrapInfo = {
        className: wrap.className,
        clientWidth: wrap.clientWidth,
        clientHeight: wrap.clientHeight,
        offsetWidth: wrap.offsetWidth,
        offsetHeight: wrap.offsetHeight,
        getBoundingClientRect: wrap.getBoundingClientRect().toJSON(),
        transform: cs.transform,
        width: cs.width,
        height: cs.height,
        overflow: cs.overflow,
        overflowX: cs.overflowX,
        overflowY: cs.overflowY,
        display: cs.display,
        innerHTML: wrap.innerHTML.substring(0, 200) + '...',
      }
    }
    if (timeline) {
      const cs = getComputedStyle(timeline)
      result.timelineInfo = {
        className: timeline.className,
        clientWidth: timeline.clientWidth,
        clientHeight: timeline.clientHeight,
        offsetWidth: timeline.offsetWidth,
        offsetHeight: timeline.offsetHeight,
        getBoundingClientRect: timeline.getBoundingClientRect().toJSON(),
        transform: cs.transform,
        width: cs.width,
        height: cs.height,
      }
    }
    return result
  })

  // Screenshot
  const path = join(OUT_DIR, 'timeline-debug-700px.png')
  await page.screenshot({ path, fullPage: false })
  console.log(`Screenshot saved: ${path}`)

  await browser.close()

  // Report
  console.log('\n=== TIMELINE DEBUG REPORT (700px viewport) ===\n')
  console.log('1. layer-anim__timeline-wrap exists?', debugInfo.wrapExists)
  console.log('2. layer-anim__timeline exists?', debugInfo.timelineExists)
  if (debugInfo.wrapInfo) {
    console.log('\n3. WRAPPER (.layer-anim__timeline-wrap) computed styles:')
    console.log(JSON.stringify(debugInfo.wrapInfo, null, 2))
  }
  if (debugInfo.timelineInfo) {
    console.log('\n4. TIMELINE (.layer-anim__timeline) computed styles:')
    console.log(JSON.stringify(debugInfo.timelineInfo, null, 2))
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
