#!/usr/bin/env node
/**
 * Check if timeline label TOP edges are aligned at the same height.
 * Run: node scripts/timeline-label-alignment.mjs
 */
import puppeteer from 'puppeteer'

const BASE_URL = process.env.BASE_URL || 'http://localhost:5177'
const VIEWPORTS = [
  { width: 1200, height: 900 },
  { width: 700, height: 900 },
  { width: 450, height: 900 },
]

async function main() {
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.setCacheEnabled(false)

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height })
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' })
    await page.evaluate(() => {
      const desc = document.querySelector('.layer-anim__description')
      if (desc) desc.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
    await new Promise((r) => setTimeout(r, 5500))

    const labelTops = await page.evaluate(() => {
      const labels = document.querySelectorAll('.layer-anim__timeline-label')
      return Array.from(labels).map((el, i) => {
        const r = el.getBoundingClientRect()
        return { index: i, top: r.top, left: r.left, text: el.textContent?.trim() }
      })
    })

    const tops = labelTops.map((l) => l.top)
    const minTop = Math.min(...tops)
    const maxTop = Math.max(...tops)
    const maxDiff = maxTop - minTop

    console.log(`\n=== ${vp.width}px viewport ===`)
    labelTops.forEach((l) => console.log(`  ${l.text}: top=${l.top.toFixed(2)}px`))
    console.log(`  Top range: ${minTop.toFixed(2)} - ${maxTop.toFixed(2)} (max diff: ${maxDiff.toFixed(2)}px)`)
    console.log(`  Aligned? ${maxDiff < 1 ? 'YES' : maxDiff < 2 ? 'NEARLY' : 'NO'}`)
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
