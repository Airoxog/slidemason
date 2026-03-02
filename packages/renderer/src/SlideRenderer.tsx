import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toBlob } from 'html-to-image';
import { SlideLayout } from './SlideLayout';
import { BrandingOverlay } from './BrandingOverlay';
import { useDeck } from './DeckProvider';

/* ── SVG Icons ── */

const ChevronUp = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 14l5-5 5 5" />
  </svg>
);

const ChevronDown = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8l5 5 5-5" />
  </svg>
);

const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6a1 1 0 011-1h1.5l1.2-1.8h4.6l1.2 1.8H14a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
    <circle cx="9" cy="9.5" r="2.5" />
  </svg>
);

const ExpandIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 7V2h5M16 7V2h-5M2 11v5h5M16 11v5h-5" />
  </svg>
);

const ShrinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 2v5H2M11 2v5h5M7 16v-5H2M11 16v-5h5" />
  </svg>
);

/* ── Animation variants (direction-aware vertical) ── */

const slideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? 80 : -80,
  }),
  center: {
    opacity: 1,
    y: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? -80 : 80,
  }),
};

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const slideTransition = prefersReducedMotion
  ? { duration: 0 }
  : { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };

/* ── Glass button style helper ── */

const glassButton: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  transition: 'opacity 0.15s ease',
};

/* ── Main Component ── */

interface SlideRendererProps {
  slides: ReactNode[];
  fullWidth?: boolean;
}

export function SlideRenderer({
  slides,
  fullWidth = true,
}: SlideRendererProps) {
  const { currentSlide, slideCount, direction, next, prev, theme, branding } = useDeck();
  const logoAt = branding?.logoUrl ? (branding.logoPlacement ?? 'none') : 'none';

  const slideRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const screenshotTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [screenshotDone, setScreenshotDone] = useState(false);

  const isPrintMode =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('print');

  // Cleanup screenshot timer on unmount
  useEffect(() => () => clearTimeout(screenshotTimerRef.current), []);

  const isFirst = currentSlide === 0;
  const isLast = currentSlide === slideCount - 1;
  const progress = slideCount > 1 ? (currentSlide / (slideCount - 1)) * 100 : 0;

  // ── Screenshot ──
  const captureScreenshot = useCallback(async () => {
    const target = contentRef.current ?? slideRef.current;
    if (!target) return;
    try {
      const blob = await toBlob(target, {
        pixelRatio: 2,
        skipFonts: true,
      });
      if (!blob) throw new Error('toBlob returned null');

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);

      setScreenshotDone(true);
      clearTimeout(screenshotTimerRef.current);
      screenshotTimerRef.current = setTimeout(() => setScreenshotDone(false), 1500);
    } catch (err) {
      console.error('Screenshot failed:', err);
    }
  }, []);

  // ── Fullscreen ──
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  // ── Render ──
  return (
    <div
      ref={slideRef}
      data-theme={theme}
      className={`relative ${fullWidth ? 'w-screen h-screen' : 'w-full h-full'} overflow-hidden`}
      style={{ backgroundColor: 'var(--sm-bg)' }}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          className="w-full h-full"
        >
          <div ref={contentRef} className="w-full h-full">
            <SlideLayout theme={theme} fullWidth={false}>
              {slides[currentSlide]}
            </SlideLayout>
          </div>
        </motion.div>
      </AnimatePresence>

      <BrandingOverlay />

      {!isPrintMode && (
        <nav aria-label="Slide controls">
          {/* ── Fullscreen — dodge logo corner ── */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-5"
            style={{
              ...glassButton,
              ...(logoAt === 'top-right' ? { left: '24px' } : { right: '24px' }),
              color: 'var(--sm-muted)',
              opacity: 0.5,
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              zIndex: 10,
            }}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <ShrinkIcon /> : <ExpandIcon />}
          </button>

          {/* ── Slide counter + screenshot — dodge logo corner ── */}
          <div
            className="absolute bottom-5 flex items-center gap-3"
            style={{ zIndex: 10, left: logoAt === 'bottom-left' ? '80px' : '24px' }}
          >
            <span
              className="font-mono text-sm tracking-wider"
              style={{ color: 'var(--sm-muted)', opacity: 0.6 }}
              aria-live="polite"
              aria-atomic="true"
            >
              {String(currentSlide + 1).padStart(2, '0')}{' '}
              <span style={{ opacity: 0.4 }}>/</span>{' '}
              {String(slideCount).padStart(2, '0')}
            </span>
            <button
              onClick={captureScreenshot}
              style={{
                ...glassButton,
                color: screenshotDone ? 'var(--sm-success)' : 'var(--sm-muted)',
                opacity: screenshotDone ? 1 : 0.5,
                width: '32px',
                height: '32px',
                borderRadius: '6px',
              }}
              aria-label="Copy slide screenshot to clipboard"
              title="Copy slide screenshot to clipboard"
            >
              {screenshotDone ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 9l3.5 3.5L14 5" />
                </svg>
              ) : (
                <CameraIcon />
              )}
            </button>
          </div>

          {/* ── Nav arrows — dodge logo corner ── */}
          <div
            className="absolute bottom-5 flex flex-col items-center gap-1 rounded-full backdrop-blur-md"
            style={{
              right: logoAt === 'bottom-right' ? '80px' : '24px',
              backgroundColor: 'var(--sm-glass-bg)',
              border: '1px solid var(--sm-border)',
              boxShadow: 'var(--sm-shadow-lg)',
              padding: '6px',
              zIndex: 10,
            }}
          >
            <button
              onClick={prev}
              disabled={isFirst}
              style={{
                ...glassButton,
                color: 'var(--sm-muted)',
                opacity: isFirst ? 0.2 : 0.8,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
              }}
              aria-label="Previous slide"
            >
              <ChevronUp />
            </button>
            <div
              style={{
                width: '20px',
                height: '1px',
                backgroundColor: 'var(--sm-border)',
                opacity: 0.5,
              }}
            />
            <button
              onClick={next}
              disabled={isLast}
              style={{
                ...glassButton,
                color: 'var(--sm-muted)',
                opacity: isLast ? 0.2 : 0.8,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
              }}
              aria-label="Next slide"
            >
              <ChevronDown />
            </button>
          </div>

          {/* ── Progress bar — bottom edge ── */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ height: '2px', backgroundColor: 'var(--sm-border)', zIndex: 10 }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(to right, var(--sm-primary), var(--sm-accent))',
                transition: 'width 500ms ease-out',
              }}
            />
          </div>
        </nav>
      )}
    </div>
  );
}
