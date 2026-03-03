interface StepProps {
  n: number;
  children: React.ReactNode;
  active?: boolean;
  style?: React.CSSProperties;
}

export function Step({ n, children, active = false, style }: StepProps) {
  return (
    <div
      data-pptx-type="step"
      data-pptx-n={n}
      {...(active ? { 'data-pptx-active': '' } : {})}
      className="flex items-center"
      style={{ gap: 'clamp(0.5rem, 1.2cqi, 1rem)', position: 'relative', zIndex: 1, ...style }}
    >
      <div
        style={{
          width: 'clamp(24px, 3.5cqi, 36px)',
          height: 'clamp(24px, 3.5cqi, 36px)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: active ? 'var(--sm-primary)' : 'var(--sm-surface)',
          border: `2px solid ${active ? 'var(--sm-primary)' : 'var(--sm-border)'}`,
          fontSize: 'clamp(0.875rem, 1.2cqi, 1rem)',
          fontWeight: 700,
          color: active ? 'var(--sm-bg)' : 'var(--sm-muted)',
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      <span
        style={{
          fontSize: 'clamp(0.875rem, 1.7cqi, 1.2rem)',
          color: 'var(--sm-text)',
          lineHeight: 1.4,
          fontWeight: active ? 600 : 400,
        }}
      >
        {children}
      </span>
    </div>
  );
}
