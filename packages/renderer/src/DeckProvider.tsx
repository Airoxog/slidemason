import { createContext, useContext, type ReactNode } from 'react';
import { useNavigation } from './useNavigation';

export interface Branding {
  logoUrl?: string;
  logoPlacement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'none';
  footerText?: string;
  footerPlacement?: 'top' | 'bottom';
}

export interface Fonts {
  heading?: string;
  body?: string;
}

interface DeckContextValue {
  currentSlide: number;
  slideCount: number;
  direction: 1 | -1;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  theme: string;
  branding?: Branding;
  fonts?: Fonts;
}

const DeckContext = createContext<DeckContextValue | null>(null);

export function useDeck() {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error('useDeck must be used within DeckProvider');
  return ctx;
}

interface DeckProviderProps {
  children: ReactNode;
  slideCount: number;
  theme?: string;
  branding?: Branding;
  fonts?: Fonts;
}

export function DeckProvider({ children, slideCount, theme = 'slate', branding, fonts }: DeckProviderProps) {
  const nav = useNavigation(slideCount);
  return (
    <DeckContext.Provider value={{ ...nav, slideCount, theme, branding, fonts }}>
      {children}
    </DeckContext.Provider>
  );
}
