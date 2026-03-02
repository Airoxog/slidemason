import { chromium } from 'playwright';
import { resolve } from 'node:path';

const HTML = resolve(import.meta.dirname, 'social-preview.html');
const OUTPUT = resolve('docs/social-preview.png');

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 640 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  await page.goto(`file://${HTML}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  await page.screenshot({ path: OUTPUT, type: 'png' });
  await browser.close();

  console.log(`Social preview saved to ${OUTPUT}`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
