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
        background: 'color-mix(in srgb, var(--sm-primary) 10%, transparent)',
        border: '1px solid color-mix(in srgb, var(--sm-primary) 20%, transparent)',
        borderRadius: '9999px',
        padding: 'clamp(0.1rem, 0.2cqi, 0.15rem) clamp(0.4rem, 0.7cqi, 0.6rem)',
        fontSize: 'clamp(0.65rem, 0.9cqi, 0.75rem)',
        color: 'var(--sm-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontWeight: 500,
        display: 'inline-block',
        lineHeight: 1.4,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
