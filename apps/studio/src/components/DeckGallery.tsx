import { useState, useRef, useEffect } from 'react';
import type { DeckEntry } from '../hooks/useDecks';

interface DeckGalleryProps {
  decks: DeckEntry[];
  loading: boolean;
  onOpen: (slug: string) => void;
  onCreate: (name: string) => void;
  onDelete: (slug: string) => void;
}

const themeColors: Record<string, string> = {
  midnight: '#6366f1',
  slate: '#64748b',
  canvas: '#f59e0b',
  signal: '#ef4444',
  noir: '#a1a1aa',
  dawn: '#f97316',
  boardroom: '#0ea5e9',
  neon: '#22d3ee',
  forest: '#22c55e',
  glacier: '#38bdf8',
  sunset: '#f43f5e',
  paper: '#d4d4d8',
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}

export function DeckGallery({ decks, loading, onOpen, onCreate, onDelete }: DeckGalleryProps) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (creating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [creating]);

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (trimmed) {
      onCreate(trimmed);
      setNewName('');
      setCreating(false);
    }
  };

  const handleCreateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate();
    if (e.key === 'Escape') { setCreating(false); setNewName(''); }
  };

  const handleDeleteConfirm = (slug: string) => {
    onDelete(slug);
    setConfirmDelete(null);
    setMenuOpen(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#09090b',
      color: '#fafafa',
      padding: '48px 40px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '36px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(63,63,70,0.3)',
      }}>
        <h1 style={{
          fontSize: '1.6rem',
          fontWeight: 700,
          margin: 0,
          color: '#fafafa',
          letterSpacing: '-0.02em',
        }}>
          Slidemason
        </h1>
        {!loading && (
          <span style={{
            fontSize: '0.75rem', fontWeight: 500, color: '#a1a1aa',
            backgroundColor: 'rgba(63,63,70,0.35)',
            padding: '3px 10px', borderRadius: '10px',
          }}>
            {decks.length} {decks.length === 1 ? 'deck' : 'decks'}
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ color: '#71717a', fontSize: '0.9rem', padding: '40px 0' }}>
          Loading decks...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {/* Deck cards */}
          {decks.map((deck) => {
            const isHovered = hoveredCard === deck.slug;
            const isDeleting = confirmDelete === deck.slug;
            const dotColor = themeColors[deck.theme] || '#6366f1';

            return (
              <div
                key={deck.slug}
                onMouseEnter={() => setHoveredCard(deck.slug)}
                onMouseLeave={() => { setHoveredCard(null); if (menuOpen === deck.slug) setMenuOpen(null); }}
                onClick={() => { if (!isDeleting && menuOpen !== deck.slug) onOpen(deck.slug); }}
                style={{
                  position: 'relative',
                  backgroundColor: '#18181b',
                  border: `1px solid ${isHovered ? 'rgba(139,92,246,0.5)' : 'rgba(63,63,70,0.4)'}`,
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: isDeleting ? 'default' : 'pointer',
                  transition: 'transform 0.15s ease, border-color 0.15s ease',
                  transform: isHovered && !isDeleting ? 'translateY(-2px)' : 'none',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Delete confirmation overlay */}
                {isDeleting && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(9,9,11,0.92)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    zIndex: 10,
                  }}>
                    <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                      Delete "{deck.title}"?
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteConfirm(deck.slug); }}
                        style={{
                          padding: '6px 16px', fontSize: '0.8rem', fontWeight: 600,
                          backgroundColor: 'rgba(239,68,68,0.3)', color: '#fca5a5',
                          border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(null); }}
                        style={{
                          padding: '6px 16px', fontSize: '0.8rem',
                          backgroundColor: 'transparent', color: '#a1a1aa',
                          border: '1px solid rgba(63,63,70,0.4)', borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Card content */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        backgroundColor: dotColor, flexShrink: 0,
                      }} />
                      <h3 style={{
                        margin: 0, fontSize: '0.95rem', fontWeight: 600,
                        color: '#fafafa', lineHeight: 1.3,
                      }}>
                        {deck.title}
                      </h3>
                    </div>

                    {/* Three-dot menu */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === deck.slug ? null : deck.slug);
                        }}
                        aria-label={`Menu for ${deck.slug}`}
                        style={{
                          background: 'none', border: 'none', color: '#71717a',
                          cursor: 'pointer', padding: '2px 4px', fontSize: '1.1rem',
                          lineHeight: 1, borderRadius: '4px',
                        }}
                      >
                        &#x22EE;
                      </button>
                      {menuOpen === deck.slug && (
                        <div style={{
                          position: 'absolute', right: 0, top: '100%',
                          backgroundColor: '#27272a', border: '1px solid rgba(63,63,70,0.5)',
                          borderRadius: '6px', padding: '4px 0', zIndex: 20,
                          minWidth: '100px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDelete(deck.slug);
                              setMenuOpen(null);
                            }}
                            style={{
                              display: 'block', width: '100%', textAlign: 'left',
                              background: 'none', border: 'none', color: '#fca5a5',
                              padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#71717a', fontSize: '0.75rem' }}>
                  <span>{deck.slideCount} {deck.slideCount === 1 ? 'slide' : 'slides'}</span>
                  <span>{formatDate(deck.lastModified)}</span>
                </div>
              </div>
            );
          })}

          {/* New Deck card */}
          <div
            style={{
              backgroundColor: 'transparent',
              border: '2px dashed rgba(63,63,70,0.5)',
              borderRadius: '12px',
              padding: '20px',
              minHeight: '120px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: creating ? 'default' : 'pointer',
              transition: 'border-color 0.15s ease',
            }}
            onClick={() => { if (!creating) setCreating(true); }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(139,92,246,0.5)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(63,63,70,0.5)'; }}
          >
            {creating ? (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Deck name..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleCreateKeyDown}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: '0.85rem',
                    backgroundColor: '#27272a',
                    border: '1px solid rgba(63,63,70,0.5)',
                    borderRadius: '6px',
                    color: '#fafafa',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCreate(); }}
                    style={{
                      padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600,
                      backgroundColor: 'rgba(139,92,246,0.3)', color: '#c4b5fd',
                      border: '1px solid rgba(139,92,246,0.4)', borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    Create
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCreating(false); setNewName(''); }}
                    style={{
                      padding: '6px 14px', fontSize: '0.8rem',
                      backgroundColor: 'transparent', color: '#a1a1aa',
                      border: '1px solid rgba(63,63,70,0.4)', borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <span style={{ fontSize: '0.9rem', color: '#71717a' }}>+ New Deck</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
