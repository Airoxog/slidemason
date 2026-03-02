const SIZES = {
  md: 'clamp(1.25rem, 3.5cqi, 2.5rem)',
  lg: 'clamp(2rem, 6cqi, 5rem)',
  hero: 'clamp(2rem, 7cqi, 5rem)',
  stat: 'clamp(3rem, 10cqi, 9rem)',
} as const;

interface GradientTextProps {
  children: React.ReactNode;
  size?: keyof typeof SIZES;
  as?: 'h1' | 'h2' | 'span' | 'div';
  style?: React.CSSProperties;
  className?: string;
}

export function GradientText({
  children,
  size = 'hero',
  as: Tag = 'h1',
  style,
  className = '',
}: GradientTextProps) {
  return (
    <Tag
      data-pptx-type="gradient-text"
      data-pptx-size={size}
      className={`font-extrabold ${className}`}
      style={{
        background: 'linear-gradient(135deg, var(--sm-primary), var(--sm-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: 'var(--sm-heading-font, inherit)',
        fontSize: SIZES[size] ?? SIZES['hero'],
        lineHeight: 1.2,
        paddingBottom: '0.1em',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
