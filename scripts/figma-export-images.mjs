#!/usr/bin/env node
/**
 * Figma Image Export Script
 *
 * Figma REST API を使って、指定ノードのレンダリング済み画像を
 * ポートフォリオの public ディレクトリにエクスポートする。
 *
 * Usage:
 *   FIGMA_TOKEN=<your-token> node scripts/figma-export-images.mjs
 *
 * Token の取得方法:
 *   Figma > Settings > Account > Personal access tokens > Generate new token
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
if (!FIGMA_TOKEN) {
  console.error('❌ FIGMA_TOKEN environment variable is required.');
  console.error('   Usage: FIGMA_TOKEN=<your-token> node scripts/figma-export-images.mjs');
  console.error('   Token: Figma > Settings > Account > Personal access tokens');
  process.exit(1);
}

const FILE_KEY = '7MnH47lP4yJOQK5xgpKixk';
const SCALE = 2;

const EXPORTS = [
  { nodeId: '935:18871', filename: 'research-sites.png', label: 'Cultural Immersion (25+ sites grid)' },
  { nodeId: '915:2348',  filename: 'color-analysis.png', label: 'Color Extraction & Analysis' },
  { nodeId: '927:13766', filename: 'process-toppage.png', label: 'Top Page: Layer Animation' },
  { nodeId: '935:19018', filename: 'process-timeline.png', label: 'Timeline: Artwork Gallery' },
  { nodeId: '913:1882',  filename: 'process-logo.png', label: 'Logo Design' },
];

const OUTPUT_DIR = path.resolve(__dirname, '../../portfolio/public/work/ukiyoe');

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.error(`❌ Output directory not found: ${OUTPUT_DIR}`);
    process.exit(1);
  }

  console.log(`\n📁 Output: ${OUTPUT_DIR}`);
  console.log(`📐 Scale: ${SCALE}x\n`);

  const nodeIds = EXPORTS.map((e) => e.nodeId).join(',');
  const apiUrl = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${nodeIds}&scale=${SCALE}&format=png`;

  console.log('🔄 Requesting image exports from Figma API...');
  const response = await fetch(apiUrl, {
    headers: { 'X-FIGMA-TOKEN': FIGMA_TOKEN },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`❌ Figma API error (${response.status}): ${text}`);
    process.exit(1);
  }

  const data = await response.json();

  if (data.err) {
    console.error(`❌ Figma API returned error: ${data.err}`);
    process.exit(1);
  }

  console.log('✅ Export URLs received. Downloading images...\n');

  for (const exp of EXPORTS) {
    const imageUrl = data.images?.[exp.nodeId];
    if (!imageUrl) {
      console.log(`⚠️  [SKIP] ${exp.label} — no image URL returned (placeholder?)`);
      continue;
    }

    try {
      const imgResponse = await fetch(imageUrl);
      if (!imgResponse.ok) {
        console.log(`⚠️  [FAIL] ${exp.label} — download failed (${imgResponse.status})`);
        continue;
      }

      const buffer = Buffer.from(await imgResponse.arrayBuffer());
      const outputPath = path.join(OUTPUT_DIR, exp.filename);
      fs.writeFileSync(outputPath, buffer);

      const sizeKB = Math.round(buffer.length / 1024);
      console.log(`✅ ${exp.filename} (${sizeKB} KB) — ${exp.label}`);
    } catch (err) {
      console.log(`⚠️  [ERROR] ${exp.label} — ${err.message}`);
    }
  }

  console.log('\n🎉 Done!');
}

main().catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
