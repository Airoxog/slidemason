import { chromium } from 'playwright';
import { execFileSync, spawn, type ChildProcess } from 'node:child_process';
import { mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const STUDIO_URL = 'http://localhost:4200';
const DECK = process.argv[2] || 'napceo';
const FRAME_DIR = resolve('docs/.frames');
const OUTPUT = resolve(`docs/${DECK}.gif`);
const VIEWPORT = { width: 1280, height: 720 };

async function waitForServer(url: string, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch { /* server not ready yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server not ready at ${url} after ${timeoutMs}ms`);
}

function startDevServer(): ChildProcess {
  const child = spawn('pnpm', ['dev'], {
    stdio: 'ignore',
    detached: true,
    cwd: resolve('.'),
  });
  return child;
}

function killServer(child: ChildProcess) {
  if (child.pid) {
    try {
      process.kill(-child.pid, 'SIGTERM');
    } catch {
      try { child.kill('SIGTERM'); } catch { /* already dead */ }
    }
  }
}

async function main() {
  let devServer: ChildProcess | null = null;

  // Check if server is already running
  let serverAlreadyRunning = false;
  try {
    const res = await fetch(`${STUDIO_URL}/__api/decks`);
    if (res.ok) serverAlreadyRunning = true;
  } catch { /* not running */ }

  try {
    if (!serverAlreadyRunning) {
      console.log('Starting dev server...');
      devServer = startDevServer();
      await waitForServer(`${STUDIO_URL}/__api/decks`);
    }
    console.log('Dev server ready.');

    // Prepare frame directory
    await rm(FRAME_DIR, { recursive: true, force: true });
    await mkdir(FRAME_DIR, { recursive: true });

    // Launch Playwright
    console.log('Launching browser...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize(VIEWPORT);

    // Get slide count from validation API
    const validateRes = await fetch(`${STUDIO_URL}/__api/decks/${DECK}/validate`);
    const validateData = await validateRes.json() as { slideCount?: number };
    const slideCount = validateData.slideCount ?? 15;
    console.log(`Deck "${DECK}" has ${slideCount} slides.`);

    // Load the deck first to warm up fonts/images
    await page.goto(`${STUDIO_URL}/?slide=0#${DECK}`, {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(3000);

    // Close the sidebar so screenshots show only slide content
    const collapseBtn = page.getByRole('button', { name: 'Collapse sidebar' });
    if (await collapseBtn.isVisible()) {
      await collapseBtn.click();
      await page.waitForTimeout(500);
      console.log('Sidebar collapsed.');
    }

    // Screenshot each slide
    for (let i = 0; i < slideCount; i++) {
      await page.goto(`${STUDIO_URL}/?slide=${i}#${DECK}`, {
        waitUntil: 'networkidle',
      });
      // Wait for framer-motion animations to settle
      await page.waitForTimeout(1500);

      const padded = String(i).padStart(3, '0');
      await page.screenshot({
        path: resolve(FRAME_DIR, `frame-${padded}.png`),
        type: 'png',
      });
      console.log(`  Captured slide ${i + 1}/${slideCount}`);
    }

    await browser.close();
    console.log('All slides captured.');

    // Convert to GIF with ffmpeg
    // -framerate 0.5 = each frame shows for 2 seconds
    // palettegen + paletteuse = high quality GIF with proper dithering
    console.log('Converting to GIF...');
    execFileSync('ffmpeg', [
      '-y',
      '-framerate', '0.5',
      '-i', `${FRAME_DIR}/frame-%03d.png`,
      '-vf', 'scale=1280:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer',
      '-loop', '0',
      OUTPUT,
    ], { stdio: 'inherit' });

    // Cleanup temp frames
    await rm(FRAME_DIR, { recursive: true, force: true });

    console.log(`\nDone! GIF saved to ${OUTPUT}`);
  } finally {
    if (devServer) {
      console.log('Stopping dev server...');
      killServer(devServer);
    }
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
