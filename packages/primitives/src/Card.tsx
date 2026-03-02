const PADS = {
  sm: 'clamp(0.5rem, 1.2cqi, 1rem)',
  md: 'clamp(0.75rem, 2cqi, 1.5rem)',
  lg: 'clamp(1rem, 2.5cqi, 2rem)',
} as const;

interface CardProps {
  children: React.ReactNode;
  glass?: boolean;
  pad?: keyof typeof PADS;
  style?: React.CSSProperties;
  className?: string;
}

export function Card({
  children,
  glass = true,
  pad = 'md',
  style,
  className = '',
}: CardProps) {
  return (
    <div
      data-pptx-type="card"
      className={className}
      style={{
        ...(glass
          ? {
              background: 'var(--sm-glass-bg)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--sm-border)',
              borderRadius: 'var(--sm-radius)',
            }
          : {}),
        color: 'var(--sm-text)',
        padding: PADS[pad] ?? PADS['md'],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
