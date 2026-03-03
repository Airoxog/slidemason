import type { ReactNode } from 'react';

type Layout = 'center' | 'split' | 'grid' | 'statement' | 'free';
type Bg = 'none' | 'mesh';

const PAD = 'clamp(1rem, 3cqi, 3rem)';

const layoutClasses: Record<Layout, string> = {
  center: 'flex flex-1 flex-col items-center justify-center text-center',
  split: 'flex flex-1 items-center',
  grid: 'flex flex-1 flex-col justify-center',
  statement: 'flex flex-1 flex-col items-center justify-center text-center',
  free: 'flex flex-1 flex-col justify-start',
};

interface SlideProps {
  children: ReactNode;
  layout?: Layout;
  bg?: Bg;
  className?: string;
  style?: React.CSSProperties;
}

export function Slide({
  children,
  layout = 'free',
  bg = 'none',
  className = '',
  style,
}: SlideProps) {
  return (
    <div
      data-pptx-type="slide"
      data-pptx-layout={layout}
      data-pptx-bg={bg}
      className={`${layoutClasses[layout] ?? layoutClasses['free']} relative overflow-auto ${className}`}
      style={{ padding: PAD, gap: 'clamp(0.5rem, 1.5cqb, 2rem)', ...style }}
    >
      {bg === 'mesh' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 55%, var(--sm-gradient-mesh-1), transparent)',
            opacity: 0.12,
          }}
        />
      )}
      {children}
    </div>
  );
}
