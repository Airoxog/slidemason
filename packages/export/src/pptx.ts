import { chromium } from 'playwright';
import PptxGenJS from 'pptxgenjs';
import { getTheme, type ThemeConfig } from '@slidemason/themes';

/* ── Types ── */

interface ExtractedElement {
  type: string;
  text: string;
  x: number;  // percentage of slide width (0-100)
  y: number;  // percentage of slide height (0-100)
  w: number;  // percentage width
  h: number;  // percentage height
  attrs: Record<string, string>;
}

interface ExtractedSlide {
  layout: string;
  bg: string;
  elements: ExtractedElement[];
}

interface ExportPptxOptions {
  url: string;
  slug: string;
  themeName: string;
  slideCount: number;
  /** Override fonts from the deck brief (takes priority over theme fonts). */
  fonts?: { heading?: string; body?: string };
}

/* ── Helpers ── */

function hex(color: string): string {
  return color.replace('#', '');
}

function pctToInchesX(pct: number): number {
  return (pct / 100) * 10;
}

function pctToInchesY(pct: number): number {
  return (pct / 100) * 5.625;
}

/* ── Font size mapping ── */

const HEADING_SIZES: Record<string, number> = {
  hero: 44,
  lg: 28,
  md: 20,
};

const TEXT_SIZES: Record<string, number> = {
  md: 14,
  sm: 12,
  xs: 10,
};

/* ── Extraction (runs inside browser) ── */

async function extractSlide(page: import('playwright').Page): Promise<ExtractedSlide> {
  return page.evaluate(() => {
    const slideEl = document.querySelector('[data-pptx-type="slide"]');
    const layout = slideEl?.getAttribute('data-pptx-layout') || 'free';
    const bg = slideEl?.getAttribute('data-pptx-bg') || 'none';

    const slideRect = slideEl?.getBoundingClientRect() || { left: 0, top: 0, width: 1920, height: 1080 };

    const elements: {
      type: string;
      text: string;
      x: number;
      y: number;
      w: number;
      h: number;
      attrs: Record<string, string>;
    }[] = [];

    const tagged = document.querySelectorAll('[data-pptx-type]');

    for (const el of tagged) {
      const type = el.getAttribute('data-pptx-type') || '';

      // Skip wrappers and decorative elements — their children are extracted separately
      if (['slide', 'passthrough', 'spacer', 'ghost', 'grid', 'split', 'stack', 'row'].includes(type)) continue;

      const rect = el.getBoundingClientRect();

      // Collect all data-pptx-* attributes
      const attrs: Record<string, string> = {};
      for (const attr of el.attributes) {
        if (attr.name.startsWith('data-pptx-')) {
          attrs[attr.name.replace('data-pptx-', '')] = attr.value;
        }
      }

      elements.push({
        type,
        text: (el as HTMLElement).innerText || '',
        x: ((rect.left - slideRect.left) / slideRect.width) * 100,
        y: ((rect.top - slideRect.top) / slideRect.height) * 100,
        w: (rect.width / slideRect.width) * 100,
        h: (rect.height / slideRect.height) * 100,
        attrs,
      });
    }

    return { layout, bg, elements };
  });
}

/* ── PPTX Generation ── */

function fontName(fontString: string): string {
  return fontString.split(',')[0].replace(/'/g, '').trim();
}

function addElementToSlide(
  slide: PptxGenJS.Slide,
  el: ExtractedElement,
  theme: ThemeConfig,
  fonts: { heading: string; body: string },
) {
  const x = pctToInchesX(el.x);
  const y = pctToInchesY(el.y);
  const w = pctToInchesX(el.w);
  const h = pctToInchesY(el.h);

  switch (el.type) {
    case 'heading': {
      const size = HEADING_SIZES[el.attrs.size || 'lg'] || 28;
      slide.addText(el.text, {
        x, y, w, h,
        fontSize: size,
        fontFace: fonts.heading,
        color: hex(theme.colors.text),
        bold: true,
        valign: 'middle',
        wrap: true,
      });
      break;
    }

    case 'gradient-text': {
      const size = HEADING_SIZES[el.attrs.size || 'hero'] || 44;
      slide.addText(el.text, {
        x, y, w, h,
        fontSize: size,
        fontFace: fonts.heading,
        color: hex(theme.colors.primary),
        bold: true,
        valign: 'middle',
        wrap: true,
      });
      break;
    }

    case 'text': {
      const isMuted = 'muted' in el.attrs;
      slide.addText(el.text, {
        x, y, w, h,
        fontSize: TEXT_SIZES[el.attrs.size || 'md'] || 14,
        fontFace: fonts.body,
        color: hex(isMuted ? theme.colors.muted : theme.colors.text),
        valign: 'top',
        wrap: true,
      });
      break;
    }

    case 'badge': {
      slide.addText(el.text.toUpperCase(), {
        x, y, w, h,
        fontSize: 9,
        fontFace: fonts.body,
        color: hex(theme.colors.muted),
        fill: { color: hex(theme.colors.surface) },
        line: { color: hex(theme.colors.border), width: 0.5 },
        rectRadius: 0.1,
        valign: 'middle',
        align: 'center',
      });
      break;
    }

    case 'card': {
      slide.addShape('roundRect' as PptxGenJS.ShapeType, {
        x, y, w, h,
        fill: { color: hex(theme.colors.surface) },
        line: { color: hex(theme.colors.border), width: 0.5 },
        rectRadius: 0.15,
      });
      break;
    }

    case 'statbox': {
      slide.addShape('roundRect' as PptxGenJS.ShapeType, {
        x, y, w, h,
        fill: { color: hex(theme.colors.surface) },
        line: { color: hex(theme.colors.border), width: 0.5 },
        rectRadius: 0.15,
      });
      const val = el.attrs.value || el.text;
      slide.addText(val, {
        x, y: y + h * 0.15, w, h: h * 0.5,
        fontSize: 28,
        fontFace: fonts.heading,
        color: hex(theme.colors.text),
        bold: true,
        align: 'center',
        valign: 'middle',
      });
      if (el.attrs.label) {
        slide.addText(el.attrs.label.toUpperCase(), {
          x, y: y + h * 0.65, w, h: h * 0.25,
          fontSize: 9,
          fontFace: fonts.body,
          color: hex(theme.colors.muted),
          align: 'center',
          valign: 'top',
        });
      }
      break;
    }

    case 'divider': {
      slide.addShape('line' as PptxGenJS.ShapeType, {
        x, y: y + h / 2, w, h: 0,
        line: { color: hex(theme.colors.primary), width: 1.5 },
      });
      break;
    }

    case 'icon': {
      slide.addShape('ellipse' as PptxGenJS.ShapeType, {
        x, y, w: Math.min(w, h), h: Math.min(w, h),
        fill: { color: hex(theme.colors.surface) },
        line: { color: hex(theme.colors.border), width: 0.75 },
      });
      break;
    }

    case 'step': {
      const circleSize = 0.3;
      const isActive = 'active' in el.attrs;
      slide.addShape('ellipse' as PptxGenJS.ShapeType, {
        x, y, w: circleSize, h: circleSize,
        fill: { color: hex(isActive ? theme.colors.primary : theme.colors.surface) },
        line: { color: hex(isActive ? theme.colors.primary : theme.colors.border), width: 0.75 },
      });
      slide.addText(el.attrs.n || '', {
        x, y, w: circleSize, h: circleSize,
        fontSize: 9,
        color: hex(isActive ? theme.colors.background : theme.colors.muted),
        bold: true,
        align: 'center',
        valign: 'middle',
      });
      slide.addText(el.text, {
        x: x + circleSize + 0.1, y, w: w - circleSize - 0.1, h,
        fontSize: 12,
        fontFace: fonts.body,
        color: hex(theme.colors.text),
        bold: isActive,
        valign: 'middle',
        wrap: true,
      });
      break;
    }

    case 'colorbar': {
      slide.addShape('rect' as PptxGenJS.ShapeType, {
        x, y, w, h,
        fill: { color: hex(theme.colors.primary) },
      });
      break;
    }

    case 'progress': {
      if (el.attrs.label) {
        slide.addText(`${el.attrs.label}  ${el.attrs.value || ''}%`, {
          x, y, w, h: h * 0.4,
          fontSize: 10,
          fontFace: fonts.body,
          color: hex(theme.colors.text),
        });
      }
      const barY = y + h * 0.6;
      const barH = 0.08;
      slide.addShape('roundRect' as PptxGenJS.ShapeType, {
        x, y: barY, w, h: barH,
        fill: { color: hex(theme.colors.surface) },
        rectRadius: 0.04,
      });
      const pct = parseInt(el.attrs.value || '0', 10);
      slide.addShape('roundRect' as PptxGenJS.ShapeType, {
        x, y: barY, w: w * (pct / 100), h: barH,
        fill: { color: hex(theme.colors.primary) },
        rectRadius: 0.04,
      });
      break;
    }

    case 'pipeline': {
      slide.addShape('line' as PptxGenJS.ShapeType, {
        x: x + w * 0.1, y: y + h * 0.35, w: w * 0.8, h: 0,
        line: { color: hex(theme.colors.primary), width: 1 },
      });
      break;
    }

    case 'tabs': {
      // Tabs container — children extracted separately
      break;
    }

    default:
      break;
  }
}

/* ── Main export function ── */

export async function exportPptx({
  url,
  slug,
  themeName,
  slideCount,
  fonts: fontOverrides,
}: ExportPptxOptions): Promise<Buffer> {
  const theme = getTheme(themeName);

  // Brief fonts take priority over theme fonts
  const resolvedFonts = {
    heading: fontOverrides?.heading || fontName(theme.typography.headingFont),
    body: fontOverrides?.body || fontName(theme.typography.bodyFont),
  };

  const pptx = new PptxGenJS();

  pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 });
  pptx.layout = 'CUSTOM';
  pptx.title = slug;
  pptx.author = 'Slidemason';

  let browser;
  try {
    browser = await chromium.launch();
  } catch (e: any) {
    if (e.message?.includes("Executable doesn't exist") || e.message?.includes('playwright install')) {
      throw new Error(
        'Playwright browsers are not installed. Run `pnpm exec playwright install chromium` to enable PPTX export.',
        { cause: e },
      );
    }
    throw e;
  }
  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    for (let i = 0; i < slideCount; i++) {
      await page.goto(`${url}?print&pptx&slide=${i}#${slug}`, {
        waitUntil: 'networkidle',
      });
      await page.waitForTimeout(500);

      const extracted = await extractSlide(page);

      const slide = pptx.addSlide();
      slide.background = { color: hex(theme.colors.background) };

      for (const el of extracted.elements) {
        // Skip empty/invisible elements (zero-size or no content)
        if (el.w < 0.5 && el.h < 0.5) continue;
        if (!el.text.trim() && !['card', 'divider', 'icon', 'colorbar', 'progress', 'pipeline'].includes(el.type)) continue;

        addElementToSlide(slide, el, theme, resolvedFonts);
      }
    }
  } finally {
    await browser.close();
  }

  const output = await pptx.write({ outputType: 'nodebuffer' });
  return Buffer.from(output as Uint8Array);
}
