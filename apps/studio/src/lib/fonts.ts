export interface FontPairing {
  name: string;
  heading: string;
  body: string;
  vibe: string;
}

export const FONT_PAIRINGS: FontPairing[] = [
  { name: 'Clean & Modern', heading: 'Inter', body: 'Inter', vibe: 'Versatile, no-nonsense' },
  { name: 'Bold Impact', heading: 'Oswald', body: 'DM Sans', vibe: 'Strong headlines, smooth body' },
  { name: 'Startup Vibes', heading: 'Space Grotesk', body: 'DM Sans', vibe: 'Techy, approachable' },
  { name: 'Executive Suite', heading: 'Playfair Display', body: 'Source Sans 3', vibe: 'Elegant serif + clean sans' },
  { name: 'Tech Forward', heading: 'Plus Jakarta Sans', body: 'IBM Plex Sans', vibe: 'Geometric, professional' },
];

const loaded = new Set<string>();

export function loadGoogleFont(fontName: string) {
  if (loaded.has(fontName) || fontName === 'Inter') return;
  loaded.add(fontName);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
}

export function applyFonts(heading: string, body: string) {
  loadGoogleFont(heading);
  loadGoogleFont(body);
  document.documentElement.style.setProperty('--sm-heading-font', `'${heading}', system-ui, sans-serif`);
  document.documentElement.style.setProperty('--sm-body-font', `'${body}', system-ui, sans-serif`);
}
