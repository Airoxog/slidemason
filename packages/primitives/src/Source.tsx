interface SourceProps {
  /** Display text — e.g., "Gartner, 2025" or "McKinsey AI Report" */
  children: React.ReactNode;
  /** URL to the source — rendered as a hyperlink */
  href?: string;
  style?: React.CSSProperties;
}

export function Source({ children, href, style }: SourceProps) {
  const inner = href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' }}
    >
      {children}
    </a>
  ) : (
    children
  );

  return (
    <cite
      style={{
        fontSize: 'clamp(0.875rem, 1.2cqi, 1rem)',
        color: 'var(--sm-muted)',
        opacity: 0.6,
        fontStyle: 'normal',
        letterSpacing: '0.01em',
        lineHeight: 1.4,
        display: 'block',
        ...style,
      }}
    >
      {inner}
    </cite>
  );
}
