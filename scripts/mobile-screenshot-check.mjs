#!/usr/bin/env node
/**
 * Mobile viewport screenshot check for clipping/overflow issues.
 * Viewport: 430x932 (iPhone 14 Pro Max)
 */
import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import { join } from 'path';

const VIEWPORT = { width: 430, height: 932 };
const OUTPUT_DIR = join(process.cwd(), 'screenshots-mobile-check');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport(VIEWPORT);
  await page.setUserAgent(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
  );

  const screenshots = [];

  try {
    // --- Homepage ---
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.layer-anim', { timeout: 5000 }).catch(() => {});

    // Scroll and capture each section
    const sections = [
      { name: 'home-sumizuri', selector: '#section-sumizuri', desc: '墨摺絵 (Sumizuri-e)' },
      { name: 'home-benizuri', selector: '#section-benizuri', desc: '紅摺絵 (Benizuri-e)' },
      { name: 'home-nishiki', selector: '#section-nishiki', desc: '錦絵 (Nishiki-e)' },
    ];

    for (const s of sections) {
      try {
        const el = await page.$(s.selector);
        if (el) {
          await el.scrollIntoView();
          await sleep(400);
        }
      } catch (_) {}
      const path = join(OUTPUT_DIR, `${s.name}.png`);
      await page.screenshot({ path, fullPage: false });
      screenshots.push({ path: s.name, desc: s.desc });
    }

    // Full page scroll to capture all
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: join(OUTPUT_DIR, 'home-top.png'), fullPage: false });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3));
    await sleep(300);
    await page.screenshot({ path: join(OUTPUT_DIR, 'home-mid.png'), fullPage: false });
    await page.evaluate(() => window.scrollTo(0, (document.body.scrollHeight * 2) / 3));
    await sleep(300);
    await page.screenshot({ path: join(OUTPUT_DIR, 'home-bottom.png'), fullPage: false });

    // --- Dawn page ---
    await page.goto('http://localhost:5173/dawn', { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.screenshot({ path: join(OUTPUT_DIR, 'dawn-top.png'), fullPage: false });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await sleep(300);
    await page.screenshot({ path: join(OUTPUT_DIR, 'dawn-mid.png'), fullPage: false });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(300);
    await page.screenshot({ path: join(OUTPUT_DIR, 'dawn-bottom.png'), fullPage: false });

    // --- Timeline page ---
    await page.goto('http://localhost:5173/timeline', { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.screenshot({ path: join(OUTPUT_DIR, 'timeline-top.png'), fullPage: false });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await sleep(300);
    await page.screenshot({ path: join(OUTPUT_DIR, 'timeline-mid.png'), fullPage: false });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(300);
    await page.screenshot({ path: join(OUTPUT_DIR, 'timeline-bottom.png'), fullPage: false });

    console.log('Screenshots saved to:', OUTPUT_DIR);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
