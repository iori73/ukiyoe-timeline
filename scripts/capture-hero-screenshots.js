/**
 * Captures hero section screenshots for verification.
 * Run: node scripts/capture-hero-screenshots.js
 * Requires: pnpm dev running on localhost:5173
 */
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..');

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Desktop: default viewport
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 15000 });

    // Wait for hero annotations to animate in
    await page.waitForSelector('.layer-anim__hero-annotation', { timeout: 5000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1500));

    const heroEl = await page.$('.layer-anim__hero');
    const desktopPath = join(OUT_DIR, 'hero-desktop.png');
    if (heroEl) {
      await heroEl.screenshot({ path: desktopPath });
    } else {
      await page.screenshot({ path: desktopPath, fullPage: false });
    }
    console.log('Saved:', desktopPath);

    // Mobile: 375px viewport
    await page.setViewport({ width: 375, height: 812 });
    await page.reload({ waitUntil: 'networkidle0', timeout: 15000 });
    await page.waitForSelector('.layer-anim__hero-annotations-list', { timeout: 5000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1500));

    const mobilePath = join(OUT_DIR, 'hero-mobile.png');
    const heroMobile = await page.$('.layer-anim__hero');
    if (heroMobile) {
      await heroMobile.screenshot({ path: mobilePath });
    } else {
      await page.screenshot({ path: mobilePath, fullPage: false });
    }
    console.log('Saved:', mobilePath);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
