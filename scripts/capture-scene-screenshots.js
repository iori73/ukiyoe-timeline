#!/usr/bin/env node
/**
 * Viewport-sized scene-by-scene screenshot capture
 * ビューポート1440x900で、各スクロール位置のシーンを撮影
 *
 * Usage: node scripts/capture-scene-screenshots.js
 * Output: screenshots/reference-sites/02-sawataya-scene-*.png, 07-the-tawaraya-scene-*.png
 */

import puppeteer from 'puppeteer'
import { mkdir } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUTPUT_DIR = join(ROOT, 'screenshots', 'reference-sites')

const VIEWPORT = { width: 1440, height: 900 }

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function scrollBy(page, px) {
  await page.evaluate((p) => {
    window.scrollBy(0, p)
  }, px)
}

async function scrollToBottom(page) {
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight)
  })
}

async function captureSawataya(browser) {
  const page = await browser.newPage()
  const results = []

  try {
    await page.setViewport(VIEWPORT)
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
    await page.setDefaultTimeout(60000)

    console.log('--- 澤田屋 (sawataya.jp) ---')
    await page.goto('https://sawataya.jp/', { waitUntil: 'load', timeout: 45000 })
    await sleep(10000)

    // Scene 01: 初期表示
    await page.screenshot({ path: join(OUTPUT_DIR, '02-sawataya-scene-01.png'), type: 'png' })
    results.push('02-sawataya-scene-01.png')
    console.log('  ✓ 02-sawataya-scene-01.png')

    // Scene 02-06: 500pxずつスクロール
    for (let i = 2; i <= 6; i++) {
      await scrollBy(page, 500)
      await sleep(3000)
      await page.screenshot({ path: join(OUTPUT_DIR, `02-sawataya-scene-0${i}.png`), type: 'png' })
      results.push(`02-sawataya-scene-0${i}.png`)
      console.log(`  ✓ 02-sawataya-scene-0${i}.png`)
    }

    // Scene 07: 末尾まで
    await scrollToBottom(page)
    await sleep(3000)
    await page.screenshot({ path: join(OUTPUT_DIR, '02-sawataya-scene-07.png'), type: 'png' })
    results.push('02-sawataya-scene-07.png')
    console.log('  ✓ 02-sawataya-scene-07.png')

    return { site: 'sawataya', results }
  } catch (err) {
    console.error('  ✗ Sawataya error:', err.message)
    return { site: 'sawataya', results: [], error: err.message }
  } finally {
    await page.close()
  }
}

async function captureTawaraya(browser) {
  const page = await browser.newPage()
  const results = []

  try {
    await page.setViewport(VIEWPORT)
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
    await page.setDefaultTimeout(60000)

    console.log('--- 俵屋旅館 (the-tawaraya.jp) ---')
    await page.goto('https://the-tawaraya.jp/', { waitUntil: 'load', timeout: 45000 })
    await sleep(8000)

    // Scene 01: 初期表示
    await page.screenshot({ path: join(OUTPUT_DIR, '07-the-tawaraya-scene-01.png'), type: 'png' })
    results.push('07-the-tawaraya-scene-01.png')
    console.log('  ✓ 07-the-tawaraya-scene-01.png')

    // Scene 02: +300px
    await scrollBy(page, 300)
    await sleep(4000)
    await page.screenshot({ path: join(OUTPUT_DIR, '07-the-tawaraya-scene-02.png'), type: 'png' })
    results.push('07-the-tawaraya-scene-02.png')
    console.log('  ✓ 07-the-tawaraya-scene-02.png')

    // Scene 03: +300px (累計600)
    await scrollBy(page, 300)
    await sleep(4000)
    await page.screenshot({ path: join(OUTPUT_DIR, '07-the-tawaraya-scene-03.png'), type: 'png' })
    results.push('07-the-tawaraya-scene-03.png')
    console.log('  ✓ 07-the-tawaraya-scene-03.png')

    // Scene 04: +400px (累計1000)
    await scrollBy(page, 400)
    await sleep(4000)
    await page.screenshot({ path: join(OUTPUT_DIR, '07-the-tawaraya-scene-04.png'), type: 'png' })
    results.push('07-the-tawaraya-scene-04.png')
    console.log('  ✓ 07-the-tawaraya-scene-04.png')

    // Scene 05: +400px (累計1400)
    await scrollBy(page, 400)
    await sleep(4000)
    await page.screenshot({ path: join(OUTPUT_DIR, '07-the-tawaraya-scene-05.png'), type: 'png' })
    results.push('07-the-tawaraya-scene-05.png')
    console.log('  ✓ 07-the-tawaraya-scene-05.png')

    // Scene 06: +400px (累計1800)
    await scrollBy(page, 400)
    await sleep(4000)
    await page.screenshot({ path: join(OUTPUT_DIR, '07-the-tawaraya-scene-06.png'), type: 'png' })
    results.push('07-the-tawaraya-scene-06.png')
    console.log('  ✓ 07-the-tawaraya-scene-06.png')

    // Scene 07: +500px (累計2300)
    await scrollBy(page, 500)
    await sleep(4000)
    await page.screenshot({ path: join(OUTPUT_DIR, '07-the-tawaraya-scene-07.png'), type: 'png' })
    results.push('07-the-tawaraya-scene-07.png')
    console.log('  ✓ 07-the-tawaraya-scene-07.png')

    // Scene 08: +500px (累計2800)
    await scrollBy(page, 500)
    await sleep(4000)
    await page.screenshot({ path: join(OUTPUT_DIR, '07-the-tawaraya-scene-08.png'), type: 'png' })
    results.push('07-the-tawaraya-scene-08.png')
    console.log('  ✓ 07-the-tawaraya-scene-08.png')

    // Scene 09: 末尾まで
    await scrollToBottom(page)
    await sleep(4000)
    await page.screenshot({ path: join(OUTPUT_DIR, '07-the-tawaraya-scene-09.png'), type: 'png' })
    results.push('07-the-tawaraya-scene-09.png')
    console.log('  ✓ 07-the-tawaraya-scene-09.png')

    return { site: 'tawaraya', results }
  } catch (err) {
    console.error('  ✗ Tawaraya error:', err.message)
    return { site: 'tawaraya', results: [], error: err.message }
  } finally {
    await page.close()
  }
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true })

  const browser = await puppeteer.launch({
    headless: 'new',
    protocolTimeout: 120000,
  })

  try {
    const sawatayaResult = await captureSawataya(browser)
    await sleep(2000)
    const tawarayaResult = await captureTawaraya(browser)

    console.log('\n--- 完了 ---')
    console.log(`澤田屋: ${sawatayaResult.results.length} シーン`)
    console.log(`俵屋旅館: ${tawarayaResult.results.length} シーン`)
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
