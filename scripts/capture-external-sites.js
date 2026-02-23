#!/usr/bin/env node
/**
 * Full-page screenshot capture for external reference sites
 *
 * Usage: node scripts/capture-external-sites.js
 * Output: screenshots/reference-sites/01-abemamoru-shouten.png, etc.
 */

import puppeteer from 'puppeteer'
import { mkdir } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUTPUT_DIR = join(ROOT, 'screenshots', 'reference-sites')

const URLS = [
  { num: '01', url: 'https://abemamoru-shouten.com/', name: 'abemamoru-shouten' },
  { num: '02', url: 'https://sawataya.jp/', name: 'sawataya' },
  { num: '03', url: 'https://nihonkusakilab.com/', name: 'nihonkusakilab' },
  { num: '04', url: 'https://maneru-design-lab.net/2587', name: 'maneru-design-lab' },
  { num: '05', url: 'https://www.tsunagi-art.jp/', name: 'tsunagi-art' },
  { num: '06', url: 'https://fukuda-art-museum.jp/', name: 'fukuda-art-museum' },
  { num: '07', url: 'https://the-tawaraya.jp/', name: 'the-tawaraya' },
  { num: '08', url: 'https://www.notion.so/2bf33d06cce380f78e16ce38fa79abab?pvs=21', name: 'notion' },
  { num: '09', url: 'https://www.kimonoichiba.com/media/column/826/', name: 'kimonoichiba-1' },
  { num: '10', url: 'https://yubisha.co.jp/column/138/', name: 'yubisha' },
  { num: '11', url: 'https://www.adachi-hanga.com/hokusai/page/enjoy_113', name: 'adachi-hanga' },
  { num: '12', url: 'https://kanazawabunko.net/fukkoku', name: 'kanazawabunko' },
  { num: '13', url: 'https://www.touken-world-ukiyoe.jp/learn/ukiyoe-nishikie-chigai/', name: 'touken-world-ukiyoe' },
  { num: '14', url: 'https://daruma3.jp/ukiyoe/245', name: 'daruma3' },
  { num: '15', url: 'https://hokusai-museum.jp/Edocalendar/', name: 'hokusai-museum' },
  { num: '16', url: 'https://dl.ndl.go.jp/pid/2532557/1/11', name: 'ndl-go-jp' },
  { num: '17', url: 'https://bunka.nii.ac.jp/heritages/search/artist:%E8%91%9B%E9%A3%BE%E5%8C%97%E6%96%8E', name: 'bunka-nii-1' },
  { num: '18', url: 'https://bunka.nii.ac.jp/heritages/time_machine?creatorName=%E9%88%B4%E6%9C%A8%E6%98%A5%E4%BF%A1&language=ja', name: 'bunka-nii-2' },
  { num: '19', url: 'https://colbase.nich.go.jp/collection_items/tnm/A-10569-137?locale=ja', name: 'colbase-nich' },
  { num: '20', url: 'https://www.photo-make.jp/hm-2/sokuryou-2.html', name: 'photo-make-sokuryou' },
  { num: '21', url: 'https://www.photo-make.jp/hm-2/sugoroku-2.html', name: 'photo-make-sugoroku' },
  { num: '22', url: 'https://edotokyokirari.jp/column/life/kyogen-05/', name: 'edotokyokirari' },
  { num: '23', url: 'https://saas.actibookone.com/content/detail?param=eyJjb250ZW50TnVtIjo1ODI0ODh9&detailFlg=0&pNo=16', name: 'actibookone' },
  { num: '24', url: 'https://www.ne.jp/asahi/kato/yoshio/', name: 'kato-yoshio' },
  { num: '25', url: 'https://www.ne.jp/asahi/kato/yoshio/tyojutu/ukiyoe-no-sekai/ukiyoe-saisiki-hensen.html', name: 'kato-yoshio-ukiyoe' },
  { num: '26', url: 'https://www.kimonoichiba.com/media/column/826/', name: 'kimonoichiba-2' },
]

async function waitForImages(page, timeoutMs = 10000) {
  try {
    await Promise.race([
      page.evaluate(() => {
        return Promise.all(
          Array.from(document.images)
            .filter((img) => !img.complete)
            .map(
              (img) =>
                new Promise((resolve) => {
                  img.onload = img.onerror = resolve
                })
            )
        )
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('waitForImages timeout')), timeoutMs))
    ])
  } catch {
    // Timeout or error - continue anyway
  }
}

async function slowScrollToBottom(page) {
  const scrollStep = 800
  const scrollDelay = 200
  const maxScrolls = 40
  for (let i = 0; i < maxScrolls; i++) {
    try {
      const { scrolled, atBottom } = await Promise.race([
        page.evaluate((step) => {
          const scrollHeight = document.documentElement.scrollHeight
          const current = window.scrollY
          const next = Math.min(current + step, scrollHeight)
          window.scrollTo(0, next)
          return { scrolled: next > current, atBottom: next >= scrollHeight - 10 }
        }, scrollStep),
        new Promise((_, reject) => setTimeout(() => reject(new Error('scroll timeout')), 5000))
      ])
      if (!scrolled || atBottom) break
    } catch {
      break
    }
    await new Promise((r) => setTimeout(r, scrollDelay))
  }
}

async function scrollToTop(page) {
  await page.evaluate(() => window.scrollTo(0, 0))
  await new Promise((r) => setTimeout(r, 500))
}

async function captureSite(browser, item, results) {
  const page = await browser.newPage()
  try {
    await page.setViewport({ width: 1440, height: 900 })
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
    await page.setDefaultTimeout(60000)
    await page.goto(item.url, { waitUntil: 'load', timeout: 45000 })
    await new Promise((r) => setTimeout(r, 2000))
    await waitForImages(page)
    await slowScrollToBottom(page)
    await scrollToTop(page)
    const filename = `${item.num}-${item.name}.png`
    await page.screenshot({ path: join(OUTPUT_DIR, filename), type: 'png', fullPage: true })
    results.push({ ...item, success: true, filename })
    console.log(`✓ ${item.num} ${item.name}`)
  } catch (err) {
    results.push({ ...item, success: false, error: err.message })
    console.log(`✗ ${item.num} ${item.name}: ${err.message}`)
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
  const results = []
  try {
    for (const item of URLS) {
      await captureSite(browser, item, results)
      await new Promise((r) => setTimeout(r, 1000))
    }
  } finally {
    await browser.close()
  }
  console.log('\n--- Results ---')
  results.forEach((r) => {
    if (r.success) console.log(`OK: ${r.filename}`)
    else console.log(`FAIL: ${r.name} - ${r.error}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
