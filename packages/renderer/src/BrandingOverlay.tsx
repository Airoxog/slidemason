import { useDeck } from './DeckProvider';

const PLACEMENT_STYLES: Record<string, React.CSSProperties> = {
  'top-left': { top: '20px', left: '24px' },
  'top-right': { top: '20px', right: '24px' },
  'bottom-left': { bottom: '40px', left: '24px' },
  'bottom-right': { bottom: '40px', right: '24px' },
};

export function BrandingOverlay() {
  const { branding } = useDeck();
  if (!branding) return null;

  const { logoUrl, logoPlacement = 'none', footerText } = branding;
  const showLogo = logoUrl && logoPlacement !== 'none';
  const showFooter = !!footerText;

  if (!showLogo && !showFooter) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      {showLogo && (
        <img
          src={logoUrl}
          alt=""
          style={{
            position: 'absolute',
            ...PLACEMENT_STYLES[logoPlacement],
            height: 'clamp(24px, 3.5cqi, 48px)',
            width: 'auto',
            objectFit: 'contain',
            opacity: 0.9,
          }}
        />
      )}
      {showFooter && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 'clamp(0.55rem, 1cqi, 0.75rem)',
            color: 'var(--sm-muted)',
            opacity: 0.5,
            letterSpacing: '0.02em',
          }}
        >
          {footerText}
        </div>
      )}
    </div>
  );
}
