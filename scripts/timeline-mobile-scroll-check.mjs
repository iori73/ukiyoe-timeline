#!/usr/bin/env node
/**
 * Timeline page mobile scroll check - captures screenshots at multiple scroll positions
 * Viewport: 430x932 (iPhone 14 Pro Max)
 */
import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import { join } from 'path';

const VIEWPORT = { width: 430, height: 932 };
const OUTPUT_DIR = join(process.cwd(), 'screenshots-timeline-scroll');
const SCROLL_STEPS = [0, 550, 1100, 1650, 2200, 2750, 3300, 3850, 4400, 5000];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport(VIEWPORT);
  await page.setUserAgent(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
  );

  try {
    await page.goto('http://localhost:5173/timeline', { waitUntil: 'networkidle0' });
    await sleep(2500);

    for (let i = 0; i < SCROLL_STEPS.length; i++) {
      const scrollY = SCROLL_STEPS[i];
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await sleep(400);
      const path = join(OUTPUT_DIR, `timeline-scroll-${scrollY}px.png`);
      await page.screenshot({ path, fullPage: false });
      console.log(`Saved: timeline-scroll-${scrollY}px.png (scrollY=${scrollY})`);
    }

    // Also capture full page height and a few more strategic positions
    const docHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log(`Document height: ${docHeight}px`);

    // Scroll to 25%, 50%, 75% of page
    const pctScrolls = [
      Math.floor(docHeight * 0.25),
      Math.floor(docHeight * 0.5),
      Math.floor(docHeight * 0.75),
    ];
    for (const scrollY of pctScrolls) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await sleep(400);
      const path = join(OUTPUT_DIR, `timeline-scroll-${scrollY}px-pct.png`);
      await page.screenshot({ path, fullPage: false });
      console.log(`Saved: timeline-scroll-${scrollY}px-pct.png`);
    }

    console.log('Screenshots saved to:', OUTPUT_DIR);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
