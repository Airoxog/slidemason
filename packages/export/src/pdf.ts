import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';

// Standard 16:9 slide dimensions in points (1 point = 1/72 inch)
// 10 inches wide × 5.625 inches tall = 720pt × 405pt
const SLIDE_WIDTH_PT = 720;
const SLIDE_HEIGHT_PT = 405;

// Render at 2x for high-DPI (Retina) quality → 192 DPI effective
const DEVICE_SCALE = 2;
const VIEWPORT = { width: 1920, height: 1080 };

interface ExportPdfOptions {
  url: string;
  slug: string;
  slideCount: number;
}

export async function exportPdf({ url, slug, slideCount }: ExportPdfOptions): Promise<Buffer> {
  if (slideCount < 1) {
    throw new Error('slideCount must be at least 1');
  }

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: DEVICE_SCALE,
    });
    const page = await context.newPage();

    const pdf = await PDFDocument.create();
    pdf.setTitle(slug);
    pdf.setCreator('Slidemason');

    // Use ?print to enter PDF mode (no sidebar, no controls)
    // Load slide 0 first to warm up fonts/images
    await page.goto(`${url}/?print&slide=0#${slug}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    for (let i = 0; i < slideCount; i++) {
      await page.goto(`${url}/?print&slide=${i}#${slug}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // Take a high-DPI PNG screenshot
      const pngBytes = await page.screenshot({ type: 'png' });

      // Embed the screenshot as a full-page image in the PDF
      const pngImage = await pdf.embedPng(pngBytes);
      const pdfPage = pdf.addPage([SLIDE_WIDTH_PT, SLIDE_HEIGHT_PT]);
      pdfPage.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: SLIDE_WIDTH_PT,
        height: SLIDE_HEIGHT_PT,
      });
    }

    const pdfBytes = await pdf.save();
    return Buffer.from(pdfBytes);
  } finally {
    await browser.close();
  }
}
