import type { ComponentType } from 'react';

interface StatBoxProps {
  value: string;
  label: string;
  icon?: ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color?: string;
  style?: React.CSSProperties;
}

export function StatBox({ value, label, icon: Icon, color, style }: StatBoxProps) {
  return (
    <div
      data-pptx-type="statbox"
      data-pptx-value={value}
      data-pptx-label={label}
      style={{
        background: 'var(--sm-glass-bg)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        padding: 'clamp(0.75rem, 2cqi, 2rem)',
        textAlign: 'center',
        ...style,
      }}
    >
      {Icon && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'clamp(0.5rem, 1cqb, 0.75rem)' }}>
          <div style={{
            width: 'clamp(36px, 5cqi, 56px)',
            height: 'clamp(36px, 5cqi, 56px)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--sm-surface)',
            border: '2px solid var(--sm-border)',
          }}>
            <Icon size={20} style={{ color: color || 'var(--sm-primary)' }} />
          </div>
        </div>
      )}
      <div
        className="font-extrabold"
        style={{
          fontSize: 'clamp(1.25rem, 4cqi, 2.5rem)',
          color: color || 'var(--sm-text)',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 'clamp(0.875rem, 1.3cqi, 1.05rem)',
          color: 'var(--sm-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginTop: '0.25rem',
        }}
      >
        {label}
      </div>
    </div>
  );
}
