import { useEffect, useState } from 'react';

interface NextStepsModalProps {
  slug: string;
  dataFiles: string[];
  onClose: () => void;
}

function getPromptText(slug: string, dataFiles: string[]) {
  const fileList = dataFiles.length > 0
    ? dataFiles.map(f => `decks/${slug}/data/${f}`).join(', ')
    : `decks/${slug}/data/ (list and read every file)`;
  return `Read CLAUDE.md first. Then read decks/${slug}/generated/brief.json. Then read these source files: ${fileList}. Following CLAUDE.md, write slides to decks/${slug}/slides.tsx. Validate: curl http://localhost:4200/__api/decks/${slug}/validate`;
}

export function NextStepsModal({ slug, dataFiles, onClose }: NextStepsModalProps) {
  const [copied, setCopied] = useState(false);

  const promptText = getPromptText(slug, dataFiles);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Next steps"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#1a1a2e', borderRadius: '12px', padding: '28px',
          border: '1px solid rgba(255,255,255,0.1)', maxWidth: '480px', width: '100%',
          color: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px' }}>
          Brief saved! Now build your deck.
        </h2>
        <p style={{ color: '#888', fontSize: '0.75rem', margin: '0 0 20px' }}>
          Use your AI coding agent to generate slides from your brief and source files.
        </p>

        {/* Step 1 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={stepHeaderStyle}>
            <span style={stepNumberStyle}>1</span>
            <span style={stepTitleStyle}>Open your AI coding tool</span>
          </div>
          <p style={stepBodyStyle}>
            Open a terminal with <strong>Claude Code</strong>, or use an AI-enabled IDE like <strong>Cursor</strong>, <strong>Windsurf</strong>, or <strong>VS Code with Copilot</strong>.
          </p>
        </div>

        {/* Step 2 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={stepHeaderStyle}>
            <span style={stepNumberStyle}>2</span>
            <span style={stepTitleStyle}>Navigate to your project</span>
          </div>
          <div style={{
            backgroundColor: '#0f0f1a', borderRadius: '6px', padding: '8px 12px',
            fontFamily: 'monospace', fontSize: '0.75rem', color: '#a78bfa',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            cd /path/to/slidemason
          </div>
        </div>

        {/* Step 3 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={stepHeaderStyle}>
            <span style={stepNumberStyle}>3</span>
            <span style={stepTitleStyle}>Paste this prompt</span>
          </div>
          <div style={{
            backgroundColor: '#0f0f1a', borderRadius: '6px', padding: '12px',
            fontSize: '0.7rem', color: '#ccc', lineHeight: 1.5,
            border: '1px solid rgba(255,255,255,0.06)', position: 'relative',
          }}>
            <div style={{ paddingRight: '60px' }}>{promptText}</div>
            <button
              onClick={handleCopy}
              style={{
                position: 'absolute', top: '8px', right: '8px',
                backgroundColor: copied ? 'rgba(34,197,94,0.3)' : 'rgba(139,92,246,0.3)',
                color: copied ? '#86efac' : '#c4b5fd',
                border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(139,92,246,0.4)'}`,
                borderRadius: '4px', padding: '4px 10px', fontSize: '0.65rem',
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '10px', fontSize: '0.85rem', fontWeight: 600,
            backgroundColor: 'rgba(139,92,246,0.3)', color: '#c4b5fd',
            border: '1px solid rgba(139,92,246,0.4)', borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}

const stepHeaderStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px',
};

const stepNumberStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
  backgroundColor: 'rgba(139,92,246,0.2)', color: '#a78bfa',
  fontSize: '0.7rem', fontWeight: 700,
};

const stepTitleStyle: React.CSSProperties = {
  fontSize: '0.8rem', fontWeight: 600, color: '#fff',
};

const stepBodyStyle: React.CSSProperties = {
  fontSize: '0.7rem', color: '#999', lineHeight: 1.5, margin: '0 0 0 30px',
};
