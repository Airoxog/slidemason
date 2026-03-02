interface BadgeProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function Badge({ children, style, className = '' }: BadgeProps) {
  return (
    <div
      data-pptx-type="badge"
      className={className}
      style={{
        background: 'var(--sm-glass-bg)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        padding: 'clamp(0.15rem, 0.3cqi, 0.3rem) clamp(0.5rem, 1cqi, 1rem)',
        fontSize: 'clamp(0.65rem, 1cqi, 0.8rem)',
        color: 'var(--sm-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        fontWeight: 500,
        display: 'inline-block',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
