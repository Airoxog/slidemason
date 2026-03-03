const SIZES = {
  xs: 'clamp(0.875rem, 1.5cqi, 1.1rem)',
  sm: 'clamp(0.875rem, 1.8cqi, 1.3rem)',
  md: 'clamp(1rem, 2.2cqi, 1.5rem)',
} as const;

interface TextProps {
  children: React.ReactNode;
  size?: keyof typeof SIZES;
  muted?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function Text({
  children,
  size = 'md',
  muted = false,
  style,
  className = '',
}: TextProps) {
  return (
    <p
      data-pptx-type="text"
      {...(muted ? { 'data-pptx-muted': '' } : {})}
      className={className}
      style={{
        fontSize: SIZES[size],
        color: muted ? 'var(--sm-muted)' : 'var(--sm-text)',
        lineHeight: 1.5,
        ...style,
      }}
    >
      {children}
    </p>
  );
}
