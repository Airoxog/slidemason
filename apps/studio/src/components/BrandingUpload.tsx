import { useRef, type DragEvent } from 'react';
import type { BrandingConfig } from '../hooks/useBrief';

interface BrandingUploadProps {
  slug: string;
  branding: BrandingConfig;
  onChange: (branding: BrandingConfig) => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', fontSize: '0.8rem',
  backgroundColor: '#2a2a3e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px', outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  color: '#aaa', fontSize: '0.75rem', fontWeight: 500,
  display: 'block', marginBottom: '4px',
};

const PLACEMENTS: { value: BrandingConfig['logoPlacement']; label: string }[] = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'none', label: 'No logo on slides' },
];

export function BrandingUpload({ slug, branding, onChange }: BrandingUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFileChange(e.dataTransfer.files);
  };

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '.png';
    const logoFilename = `logo${ext}`;
    // Rename the file to logo.<ext> before uploading
    const renamed = new File([file], logoFilename, { type: file.type });
    const formData = new FormData();
    formData.append('file', renamed);
    await fetch(`/__api/decks/${encodeURIComponent(slug)}/branding`, {
      method: 'POST',
      body: formData,
    });
    onChange({ ...branding, logoFilename });
  };

  const logoUrl = branding.logoFilename
    ? `/__api/decks/${encodeURIComponent(slug)}/branding/${encodeURIComponent(branding.logoFilename)}`
    : '';

  return (
    <div>
      {/* Logo upload */}
      <label style={labelStyle}>Logo</label>
      {branding.logoFilename ? (
        <div style={{
          position: 'relative', marginBottom: '8px', borderRadius: '6px',
          overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)',
          padding: '8px', display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <img
            src={logoUrl}
            alt="Logo"
            style={{ height: '40px', maxWidth: '120px', objectFit: 'contain' }}
          />
          <button
            onClick={() => {
              inputRef.current?.click();
            }}
            style={{
              backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px', color: '#888', fontSize: '0.7rem', padding: '4px 8px',
              cursor: 'pointer',
            }}
          >
            Replace
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          style={{
            width: '100%', padding: '14px', fontSize: '0.8rem',
            backgroundColor: 'rgba(255,255,255,0.05)', color: '#888',
            border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '6px',
            cursor: 'pointer', marginBottom: '8px',
          }}
        >
          + Upload logo
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => handleFileChange(e.target.files)}
      />

      {/* Logo placement */}
      <label style={{ ...labelStyle, marginTop: '8px' }}>Logo placement</label>
      <select
        style={inputStyle}
        value={branding.logoPlacement}
        onChange={e => onChange({ ...branding, logoPlacement: e.target.value as BrandingConfig['logoPlacement'] })}
      >
        {PLACEMENTS.map(p => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      {/* Footer text */}
      <label style={{ ...labelStyle, marginTop: '8px' }}>Footer / banner text</label>
      <input
        style={inputStyle}
        value={branding.footerText}
        onChange={e => onChange({ ...branding, footerText: e.target.value })}
        placeholder="e.g. Confidential — Acme Corp 2026"
        maxLength={120}
      />

      {/* Footer placement */}
      {branding.footerText && (
        <>
          <label style={{ ...labelStyle, marginTop: '8px' }}>Banner placement</label>
          <select
            style={inputStyle}
            value={branding.footerPlacement || 'bottom'}
            onChange={e => onChange({ ...branding, footerPlacement: e.target.value as 'top' | 'bottom' })}
          >
            <option value="bottom">Bottom</option>
            <option value="top">Top</option>
          </select>
        </>
      )}
    </div>
  );
}
