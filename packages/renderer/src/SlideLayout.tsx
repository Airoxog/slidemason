import { type ReactNode } from 'react';
import { useDeck } from './DeckProvider';

interface SlideLayoutProps {
  children: ReactNode;
  theme?: string;
  fullWidth?: boolean;
}

export function SlideLayout({ children, theme = 'slate', fullWidth = false }: SlideLayoutProps) {
  const { fonts } = useDeck();

  // Resolve actual font strings from context (bypasses CSS variable cascade issues)
  const headingFontValue = fonts?.heading
    ? `'${fonts.heading}', system-ui, sans-serif`
    : "'Inter', system-ui, sans-serif";
  const bodyFontValue = fonts?.body
    ? `'${fonts.body}', system-ui, sans-serif`
    : "'Inter', system-ui, sans-serif";

  return (
    <div
      data-theme={theme}
      className={`relative flex flex-col ${fullWidth ? 'w-screen h-screen' : 'w-full h-full'} overflow-hidden`}
      style={{
        containerType: 'size',
        backgroundColor: 'var(--sm-bg)',
        padding: 'clamp(2rem, 5cqb, 6rem) clamp(1rem, 3cqi, 3rem)',
        fontFamily: bodyFontValue,
        // Set CSS custom properties so primitives (<Heading>, <GradientText>, etc.)
        // can reference var(--sm-heading-font) and var(--sm-body-font) from this ancestor
        '--sm-heading-font': headingFontValue,
        '--sm-body-font': bodyFontValue,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
