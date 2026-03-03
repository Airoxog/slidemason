import { useRef } from 'react';
import { motion, useInView, type Easing } from 'framer-motion';
import { isPptxMode } from './pptxMode';

interface ProgressRevealProps {
  value: number;
  label?: string;
  color?: string;
  height?: number;
  duration?: number;
  style?: React.CSSProperties;
  className?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ProgressReveal({
  value,
  label,
  color = 'var(--sm-primary)',
  height = 8,
  duration = 1.2,
  style,
  className = '',
}: ProgressRevealProps) {
  const pptx = isPptxMode();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  if (pptx) {
    return (
      <div className={className} style={style} data-pptx-type="progress" data-pptx-value={value} data-pptx-label={label || ''}>
        {label && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 'clamp(0.875rem, 1.4cqi, 1.1rem)' }}>
            <span style={{ color: 'var(--sm-text)' }}>{label}</span>
            <span style={{ color: 'var(--sm-muted)' }}>{value}%</span>
          </div>
        )}
        <div style={{ width: '100%', height, borderRadius: height / 2, background: 'var(--sm-surface)', overflow: 'hidden' }}>
          <div style={{ width: `${value}%`, height: '100%', borderRadius: height / 2, background: color }} />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={className} style={style} data-pptx-type="progress" data-pptx-value={value} data-pptx-label={label || ''}>
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 6,
            fontSize: 'clamp(0.875rem, 1.4cqi, 1.1rem)',
          }}
        >
          <span style={{ color: 'var(--sm-text)' }}>{label}</span>
          <span style={{ color: 'var(--sm-muted)' }}>{value}%</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height,
          borderRadius: height / 2,
          background: 'var(--sm-surface)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration, ease: EASE as Easing }}
          style={{
            height: '100%',
            borderRadius: height / 2,
            background: color,
          }}
        />
      </div>
    </div>
  );
}
