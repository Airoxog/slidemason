interface RatingProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function Rating({
  label,
  value,
  max = 5,
  color = 'var(--sm-primary)',
  style,
  className = '',
}: RatingProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div
      data-pptx-type="rating"
      data-pptx-value={value}
      data-pptx-max={max}
      data-pptx-label={label}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(0.4rem, 0.8cqi, 0.65rem)',
        ...style,
      }}
    >
      {/* Label */}
      <span
        style={{
          fontSize: 'clamp(0.65rem, 1.1cqi, 0.8rem)',
          color: 'var(--sm-text)',
          fontWeight: 500,
          flexShrink: 0,
          minWidth: 'clamp(60px, 12cqi, 120px)',
        }}
      >
        {label}
      </span>

      {/* Bar track */}
      <div
        style={{
          flex: 1,
          height: 'clamp(4px, 0.6cqb, 6px)',
          borderRadius: 99,
          background: 'var(--sm-surface)',
          overflow: 'hidden',
          minWidth: 'clamp(40px, 8cqi, 80px)',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 99,
            background: color,
          }}
        />
      </div>

      {/* Score */}
      <span
        style={{
          fontSize: 'clamp(0.65rem, 1cqi, 0.75rem)',
          color: 'var(--sm-muted)',
          fontWeight: 600,
          flexShrink: 0,
          minWidth: 'clamp(24px, 4cqi, 36px)',
          textAlign: 'right',
        }}
      >
        {value}/{max}
      </span>
    </div>
  );
}
