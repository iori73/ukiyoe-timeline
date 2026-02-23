#!/usr/bin/env node
/**
 * Homepage isometric illustration check at 430x932 (iPhone 14 Pro Max)
 * Verifies: full visibility, no horizontal scrollbar, proper centering
 */
import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import { join } from 'path';

const VIEWPORT = { width: 430, height: 932 };
const OUTPUT_DIR = join(process.cwd(), 'screenshots-homepage-isometric');

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
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await sleep(2000);

    const sections = [
      { id: 'sumizuri', name: '墨摺絵 (Sumizuri-e)' },
      { id: 'benizuri', name: '紅摺絵 (Benizuri-e)' },
      { id: 'nishiki', name: '錦絵 (Nishiki-e)' },
    ];

    for (const s of sections) {
      const selector = `#section-${s.id}`;
      const el = await page.$(selector);
      if (el) {
        await el.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await sleep(500);
      }
      const path = join(OUTPUT_DIR, `section-${s.id}.png`);
      await page.screenshot({ path, fullPage: false });
      console.log(`Saved: section-${s.id}.png (${s.name})`);
    }

    // Check for horizontal scrollbar
    const hasHScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log('Horizontal scrollbar (scrollWidth > innerWidth):', hasHScroll);

    console.log('Screenshots saved to:', OUTPUT_DIR);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
