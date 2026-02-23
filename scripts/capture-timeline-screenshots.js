#!/usr/bin/env node
/**
 * Capture screenshots of the timeline page for verifying gallery controls.
 * Run: node scripts/capture-timeline-screenshots.js
 * Requires: pnpm dev running on localhost:5173
 */

import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:5173/timeline'
const OUTPUT_DIR = 'screenshots-timeline'

async function main() {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  // Desktop viewport (1440x900) to match design
  await page.setViewport({ width: 1440, height: 900 })

  try {
    const response = await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 })
    if (!response.ok) throw new Error(`Failed to load: ${response.status()}`)

    // Wait for page to settle
    await new Promise(r => setTimeout(r, 2000))

    // Screenshot 1: Initial view (top of page)
    await page.screenshot({
      path: `${OUTPUT_DIR}/timeline-initial.png`,
      fullPage: false
    })
    console.log(`Saved: ${OUTPUT_DIR}/timeline-initial.png`)

    // Screenshot 2: Right side of page (crop to show controls)
    const rightSideClip = await page.evaluate(() => {
      const { innerWidth, innerHeight } = window
      return {
        x: innerWidth - 120,
        y: 0,
        width: 120,
        height: innerHeight
      }
    })
    await page.screenshot({
      path: `${OUTPUT_DIR}/timeline-controls-right.png`,
      clip: rightSideClip
    })
    console.log(`Saved: ${OUTPUT_DIR}/timeline-controls-right.png`)

    // Scroll down by ~400px
    await page.evaluate(() => window.scrollBy(0, 400))
    await new Promise(r => setTimeout(r, 800))

    // Screenshot 3: After scroll - full viewport
    await page.screenshot({
      path: `${OUTPUT_DIR}/timeline-scrolled.png`,
      fullPage: false
    })
    console.log(`Saved: ${OUTPUT_DIR}/timeline-scrolled.png`)

    // Screenshot 4: Right side after scroll
    const rightSideClip2 = await page.evaluate(() => {
      const { innerWidth, innerHeight } = window
      return {
        x: innerWidth - 120,
        y: 0,
        width: 120,
        height: innerHeight
      }
    })
    await page.screenshot({
      path: `${OUTPUT_DIR}/timeline-controls-right-scrolled.png`,
      clip: rightSideClip2
    })
    console.log(`Saved: ${OUTPUT_DIR}/timeline-controls-right-scrolled.png`)

    // Scroll down more
    await page.evaluate(() => window.scrollBy(0, 600))
    await new Promise(r => setTimeout(r, 800))

    // Screenshot 5: Further down - right side
    const rightSideClip3 = await page.evaluate(() => {
      const { innerWidth, innerHeight } = window
      return {
        x: innerWidth - 120,
        y: 0,
        width: 120,
        height: innerHeight
      }
    })
    await page.screenshot({
      path: `${OUTPUT_DIR}/timeline-controls-right-further.png`,
      clip: rightSideClip3
    })
    console.log(`Saved: ${OUTPUT_DIR}/timeline-controls-right-further.png`)

    console.log('\nDone! Check the screenshots-timeline/ folder.')
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

main()
