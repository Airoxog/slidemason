import React from 'react';

interface DataTableProps {
  headers: string[];
  rows: string[][];
  highlight?: number[];
  compact?: boolean;
  style?: React.CSSProperties;
}

export function DataTable({
  headers = [],
  rows = [],
  highlight = [],
  compact = false,
  style,
}: DataTableProps) {
  const cellPad = compact
    ? 'clamp(0.25rem, 0.5cqi, 0.4rem) clamp(0.4rem, 0.8cqi, 0.6rem)'
    : 'clamp(0.4rem, 0.8cqi, 0.6rem) clamp(0.5rem, 1.2cqi, 1rem)';

  return (
    <div
      data-pptx-type="table"
      style={{
        overflowX: 'auto',
        overflowY: 'hidden',
        borderRadius: 'var(--sm-radius)',
        border: '1px solid var(--sm-border)',
        background: 'var(--sm-glass-bg)',
        backdropFilter: 'blur(12px)',
        ...style,
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: compact ? 'clamp(0.65rem, 1cqi, 0.8rem)' : 'clamp(0.7rem, 1.2cqi, 0.9rem)',
        }}
      >
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: cellPad,
                  textAlign: 'left',
                  color: 'var(--sm-muted)',
                  fontWeight: 600,
                  fontSize: 'clamp(0.65rem, 0.9cqi, 0.7rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  borderBottom: '1px solid var(--sm-border)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const isHighlighted = highlight.includes(ri);
            return (
              <tr
                key={ri}
                style={{
                  borderBottom: ri < rows.length - 1 ? '1px solid var(--sm-border)' : undefined,
                  background: isHighlighted
                    ? 'color-mix(in srgb, var(--sm-primary) 10%, transparent)'
                    : ri % 2 === 1
                      ? 'color-mix(in srgb, var(--sm-text) 3%, transparent)'
                      : undefined,
                }}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: cellPad,
                      color: isHighlighted ? 'var(--sm-text)' : ci === 0 ? 'var(--sm-text)' : 'var(--sm-muted)',
                      fontWeight: ci === 0 || isHighlighted ? 500 : 400,
                      borderLeft: isHighlighted && ci === 0
                        ? '3px solid var(--sm-primary)'
                        : undefined,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
