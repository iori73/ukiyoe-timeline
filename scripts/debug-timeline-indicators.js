#!/usr/bin/env node
/**
 * Debug timeline indicators at mobile viewport
 * Runs the user's diagnostic JavaScript and outputs results
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

    // Set mobile viewport
    await page.setViewport({ width: 430, height: 932 })
    await page.goto(URL, { waitUntil: 'load', timeout: 10000 })
    await new Promise(r => setTimeout(r, 1500))

    // Screenshot
    await mkdir(OUTPUT_DIR, { recursive: true })
    const screenshotPath = join(OUTPUT_DIR, 'timeline-mobile-debug.png')
    await page.screenshot({ path: screenshotPath, type: 'png' })
    console.log('Screenshot saved:', screenshotPath)
    console.log('')

    // Script 1: Controls element
    const result1 = await page.evaluate(() => {
      const controls = document.querySelector('.timeline-gallery-controls')
      if (controls) {
        const style = window.getComputedStyle(controls)
        return JSON.stringify({
          exists: true,
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          position: style.position,
          bottom: style.bottom,
          left: style.left,
          top: style.top,
          right: style.right,
          zIndex: style.zIndex,
          transform: style.transform,
          width: style.width,
          height: style.height,
          overflow: style.overflow,
          pointerEvents: style.pointerEvents,
          childCount: controls.children.length,
          innerHTML: controls.innerHTML.substring(0, 500),
          boundingRect: JSON.stringify(controls.getBoundingClientRect())
        })
      } else {
        return JSON.stringify({ exists: false, message: 'timeline-gallery-controls not found in DOM' })
      }
    })
    console.log('=== RESULT 1: .timeline-gallery-controls ===')
    console.log(JSON.stringify(JSON.parse(result1), null, 2))
    console.log('')

    // Script 2: Ancestor elements
    const result2 = await page.evaluate(() => {
      const controls = document.querySelector('.timeline-gallery-controls')
      if (!controls) return 'NOT FOUND'
      let el = controls.parentElement
      const ancestors = []
      while (el) {
        const s = window.getComputedStyle(el)
        if (s.transform !== 'none' || s.contain !== 'none' || s.willChange !== 'auto' || s.filter !== 'none') {
          ancestors.push({
            tag: el.tagName,
            class: el.className.substring(0, 100),
            transform: s.transform,
            contain: s.contain,
            willChange: s.willChange,
            filter: s.filter
          })
        }
        el = el.parentElement
      }
      return JSON.stringify(ancestors)
    })
    console.log('=== RESULT 2: Ancestor elements (transform/contain/will-change/filter) ===')
    console.log(typeof result2 === 'string' && result2 === 'NOT FOUND' ? result2 : JSON.stringify(JSON.parse(result2), null, 2))
    console.log('')

    // Script 3: Individual indicator buttons
    const result3 = await page.evaluate(() => {
      const buttons = document.querySelectorAll('.timeline-gallery-indicator')
      const results = []
      buttons.forEach((btn, i) => {
        const s = window.getComputedStyle(btn)
        const rect = btn.getBoundingClientRect()
        results.push({
          index: i,
          class: btn.className,
          display: s.display,
          width: s.width,
          height: s.height,
          padding: s.padding,
          bgColor: s.backgroundColor,
          bgClip: s.backgroundClip,
          opacity: s.opacity,
          visibility: s.visibility,
          rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height, bottom: rect.bottom }
        })
      })
      return JSON.stringify(results)
    })
    console.log('=== RESULT 3: Individual .timeline-gallery-indicator buttons ===')
    console.log(JSON.stringify(JSON.parse(result3), null, 2))

  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  if (err.message?.includes('ERR_CONNECTION_REFUSED')) {
    console.error(`Port ${PORT} refused. Is the dev server running? Try: pnpm dev`)
  }
  console.error(err)
  process.exit(1)
})
