import type { ComponentType } from 'react';

interface ListItem {
  text: React.ReactNode;
  sub?: React.ReactNode;
}

interface ListProps {
  items: ListItem[];
  ordered?: boolean;
  icon?: ComponentType<{ size?: number; style?: React.CSSProperties }>;
  size?: 'sm' | 'md';
  gap?: 'xs' | 'sm' | 'md';
  style?: React.CSSProperties;
  className?: string;
}

const gapMap = { xs: 'clamp(0.2rem, 0.4cqb, 0.35rem)', sm: 'clamp(0.35rem, 0.7cqb, 0.55rem)', md: 'clamp(0.5rem, 1cqb, 0.75rem)' };
const textMap = { sm: 'clamp(0.7rem, 1.2cqi, 0.9rem)', md: 'clamp(0.8rem, 1.5cqi, 1.05rem)' };
const subMap = { sm: 'clamp(0.65rem, 1cqi, 0.75rem)', md: 'clamp(0.65rem, 1.1cqi, 0.85rem)' };

export function List({
  items = [],
  ordered = false,
  icon: Icon,
  size = 'md',
  gap = 'sm',
  style,
  className = '',
}: ListProps) {
  return (
    <div
      data-pptx-type="list"
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: gapMap[gap] ?? gapMap.sm,
        ...style,
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'clamp(0.4rem, 0.8cqi, 0.65rem)',
          }}
        >
          {/* Marker */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 'clamp(0.15rem, 0.3cqi, 0.25rem)',
            }}
          >
            {Icon ? (
              <Icon
                size={14}
                style={{ color: 'var(--sm-primary)' }}
              />
            ) : ordered ? (
              <span
                style={{
                  fontSize: 'clamp(0.6rem, 1cqi, 0.8rem)',
                  fontWeight: 700,
                  color: 'var(--sm-primary)',
                  minWidth: 'clamp(14px, 2cqi, 20px)',
                  textAlign: 'right',
                }}
              >
                {i + 1}.
              </span>
            ) : (
              <span
                style={{
                  width: 'clamp(5px, 0.7cqi, 7px)',
                  height: 'clamp(5px, 0.7cqi, 7px)',
                  borderRadius: '50%',
                  background: 'var(--sm-primary)',
                  display: 'block',
                }}
              />
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: textMap[size] ?? textMap.md,
                color: 'var(--sm-text)',
                lineHeight: 1.4,
              }}
            >
              {item.text}
            </div>
            {item.sub && (
              <div
                style={{
                  fontSize: subMap[size] ?? subMap.md,
                  color: 'var(--sm-muted)',
                  lineHeight: 1.4,
                  marginTop: '0.1rem',
                }}
              >
                {item.sub}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
