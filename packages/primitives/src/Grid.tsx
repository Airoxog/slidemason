interface GridProps {
  cols?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  /** Columns auto-collapse on narrow containers. Default: true */
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}

const colGap = {
  sm: 'clamp(0.3rem, 0.8cqi, 0.6rem)',
  md: 'clamp(0.5rem, 1.2cqi, 1rem)',
  lg: 'clamp(0.75rem, 2cqi, 1.5rem)',
};

const rowGap = {
  sm: 'clamp(0.4rem, 1.2cqb, 1rem)',
  md: 'clamp(0.5rem, 1.5cqb, 1.5rem)',
  lg: 'clamp(0.75rem, 2cqb, 2rem)',
};

// Responsive: use auto-fit with cqi-based minmax to prevent extra columns
// The clamp ensures: collapse on narrow containers, respect cols on wide ones
const responsiveColumns: Record<number, string> = {
  2: 'repeat(auto-fit, minmax(min(100%, clamp(240px, 40cqi, 800px)), 1fr))',
  3: 'repeat(auto-fit, minmax(min(100%, clamp(200px, 28cqi, 500px)), 1fr))',
  4: 'repeat(auto-fit, minmax(min(100%, clamp(180px, 21cqi, 400px)), 1fr))',
};

export function Grid({ cols = 2, gap = 'md', responsive = true, style, className = '', children }: GridProps) {
  const columns = responsive
    ? responsiveColumns[cols] ?? responsiveColumns[2]
    : `repeat(${cols}, 1fr)`;

  return (
    <div
      data-pptx-type="grid"
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: columns,
        columnGap: colGap[gap] ?? colGap['md'],
        rowGap: rowGap[gap] ?? rowGap['md'],
        flex: '1 1 auto',
        minHeight: 0,
        alignContent: 'stretch',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
