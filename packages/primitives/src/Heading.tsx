const SIZES = {
  md: 'clamp(1.1rem, 3cqi, 2rem)',
  lg: 'clamp(1.5rem, 5cqi, 3rem)',
  hero: 'clamp(2rem, 7cqi, 5rem)',
} as const;

interface HeadingProps {
  children: React.ReactNode;
  size?: keyof typeof SIZES;
  as?: 'h1' | 'h2' | 'h3';
  style?: React.CSSProperties;
  className?: string;
}

export function Heading({
  children,
  size = 'lg',
  as: Tag = size === 'hero' ? 'h1' : 'h2',
  style,
  className = '',
}: HeadingProps) {
  return (
    <Tag
      data-pptx-type="heading"
      data-pptx-size={size}
      className={`font-bold ${className}`}
      style={{
        fontSize: SIZES[size] ?? SIZES['lg'],
        fontFamily: 'var(--sm-heading-font, inherit)',
        color: 'var(--sm-text)',
        lineHeight: size === 'hero' ? 1.15 : 1.2,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
