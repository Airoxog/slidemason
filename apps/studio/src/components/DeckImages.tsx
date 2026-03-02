import { useRef, useEffect, type DragEvent } from 'react';
import type { DeckImage } from '../hooks/useBrief';

interface DeckImagesProps {
  slug: string;
  assets: { name: string; ext: string }[];
  images: DeckImage[];
  onImagesChange: (images: DeckImage[]) => void;
  onUpload: (files: FileList) => void;
  onRemove: (name: string) => void;
}

const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];

export function DeckImages({ slug, assets, images, onImagesChange, onUpload, onRemove }: DeckImagesProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter to only image assets (logo is stored separately in data/branding/)
  const imageAssets = assets.filter(
    a => IMAGE_EXTS.includes(a.ext.toLowerCase()),
  );

  // Auto-register new image assets in the brief so the AI agent knows they exist
  useEffect(() => {
    const knownFilenames = new Set(images.map(img => img.filename));
    const newAssets = imageAssets.filter(a => !knownFilenames.has(a.name));
    if (newAssets.length > 0) {
      onImagesChange([
        ...images,
        ...newAssets.map(a => ({ filename: a.name, description: '' })),
      ]);
    }
  }, [imageAssets.map(a => a.name).join(',')]);

  const getDescription = (filename: string): string => {
    return images.find(img => img.filename === filename)?.description ?? '';
  };

  const updateDescription = (filename: string, description: string) => {
    const existing = images.filter(img => img.filename !== filename);
    onImagesChange([...existing, { filename, description }]);
  };

  const handleRemove = (name: string) => {
    onRemove(name);
    onImagesChange(images.filter(img => img.filename !== name));
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) onUpload(e.dataTransfer.files);
  };

  return (
    <div>
      <p style={{
        color: '#888', fontSize: '0.7rem', lineHeight: 1.4, margin: '0 0 8px',
      }}>
        Upload images for the AI to use in slides. Add a description so it knows what each image is and how to use it.
      </p>

      {/* Upload button */}
      <button
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        style={{
          width: '100%', padding: '10px', fontSize: '0.8rem',
          backgroundColor: 'rgba(255,255,255,0.05)', color: '#888',
          border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '6px',
          cursor: 'pointer', marginBottom: '8px',
        }}
      >
        + Upload images
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => e.target.files && onUpload(e.target.files)}
      />

      {/* Image list with descriptions */}
      {imageAssets.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {imageAssets.map(a => (
            <div key={a.name} style={{
              backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
            }}>
              {/* Thumbnail + delete */}
              <div style={{
                position: 'relative', height: '80px',
                backgroundColor: 'rgba(255,255,255,0.05)',
              }}>
                <img
                  src={`/__api/decks/${encodeURIComponent(slug)}/assets/${encodeURIComponent(a.name)}`}
                  alt={a.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
                <button
                  onClick={() => handleRemove(a.name)}
                  style={{
                    position: 'absolute', top: '4px', right: '4px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff',
                    border: 'none', cursor: 'pointer', fontSize: '0.65rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
                <span style={{
                  position: 'absolute', bottom: '2px', left: '4px', right: '4px',
                  fontSize: '0.55rem', color: '#aaa', overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {a.name}
                </span>
              </div>

              {/* Description field */}
              <div style={{ padding: '6px' }}>
                <input
                  style={{
                    width: '100%', padding: '6px 8px', fontSize: '0.75rem',
                    backgroundColor: '#2a2a3e', color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px', outline: 'none', boxSizing: 'border-box',
                  }}
                  value={getDescription(a.name)}
                  onChange={e => updateDescription(a.name, e.target.value)}
                  placeholder="What is this? How should AI use it?"
                  maxLength={200}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
