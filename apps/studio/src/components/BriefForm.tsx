import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Brief } from '../hooks/useBrief';

interface BriefFormProps {
  brief: Brief;
  onChange: (brief: Brief) => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', fontSize: '0.8rem',
  backgroundColor: '#2a2a3e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px', outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  color: '#aaa', fontSize: '0.75rem', fontWeight: 500, display: 'flex',
  alignItems: 'center', gap: '4px', marginBottom: '4px',
};

const tooltipStyle: React.CSSProperties = {
  position: 'absolute', top: '100%', left: 0,
  backgroundColor: '#1a1a2e', color: '#ccc', fontSize: '0.7rem', lineHeight: 1.3,
  padding: '6px 10px', borderRadius: '6px', width: '200px', textAlign: 'left',
  border: '1px solid rgba(255,255,255,0.15)', marginTop: '4px',
  pointerEvents: 'none', zIndex: 50,
  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
};

const charCountStyle: React.CSSProperties = {
  color: '#555', fontSize: '0.65rem', textAlign: 'right', marginTop: '2px',
};

// Dropdown presets
const AUDIENCES = [
  'Executive leadership (C-suite)',
  'Your direct team',
  'Investors / VCs',
  'Clients / customers',
  'Conference attendees',
];

const GOALS = [
  'Get approval (budget / resources / proposal)',
  'Share progress, results, or metrics',
  'Pitch for investment',
  'Align team on strategy or direction',
  'Educate or train the audience',
];

const SLIDE_COUNTS = [
  '5 slides', '10 slides', '15 slides', '20 slides', '25+ slides',
];

const DURATIONS = [
  '5 minutes', '10 minutes', '15 minutes', '30 minutes', '60 minutes',
];

const DATA_STYLES = [
  'Data-heavy — lots of charts & numbers',
  'Balanced — mix of data and narrative',
  'Light on data — mostly concepts & ideas',
  'No data — pure narrative / storytelling',
  'Case-study driven — examples over raw data',
];

const VISUAL_STYLES = [
  'Minimal & clean — lots of whitespace',
  'Diagram-focused — flows and architecture',
  'Icon-driven — icons illustrate each point',
  'Text-forward — content-dense slides',
  'Infographic style — visual data storytelling',
];

const CONTENT_FOCUSES = [
  'Strategic — high-level direction & vision',
  'Tactical — specific plans & action items',
  'Educational — teach concepts step by step',
  'Persuasive — build a compelling argument',
  'Status update — progress & metrics',
  'Evaluation — structured assessment of tools, options, or decisions',
];

const AGENT_LATITUDES = [
  'Faithful — organize my content as-is, minimal interpretation',
  'Collaborative — synthesize and fill gaps, suggest stronger framing',
  'Expert — take creative ownership, reframe for maximum impact',
];

// Field config
const FIELDS: {
  key: keyof Brief;
  label: string;
  tooltip: string;
  placeholder: string;
  maxLength: number;
  type: 'text' | 'select' | 'dropdown-or-text' | 'date';
  options?: string[];
}[] = [
  {
    key: 'title', label: 'Title', type: 'text', maxLength: 120,
    tooltip: 'Leave blank and the AI will generate a title from your content.',
    placeholder: 'Optional — AI will generate',
  },
  {
    key: 'subtitle', label: 'Subtitle', type: 'text', maxLength: 200,
    tooltip: 'A secondary line shown below the title on the cover slide.',
    placeholder: 'Optional — AI will generate',
  },
  {
    key: 'presenter', label: 'Presented by', type: 'text', maxLength: 100,
    tooltip: 'Name and title shown on the cover or closing slide.',
    placeholder: 'e.g. Jane Smith, VP of Product',
  },
  {
    key: 'audience', label: 'Audience *', type: 'dropdown-or-text', maxLength: 100,
    tooltip: 'Who will see this? Helps the AI choose the right tone and depth.',
    placeholder: 'e.g. Marketing team',
    options: AUDIENCES,
  },
  {
    key: 'goal', label: 'Goal *', type: 'dropdown-or-text', maxLength: 150,
    tooltip: 'What should the audience do or feel after? Drives the narrative arc.',
    placeholder: 'e.g. Approve the proposed budget',
    options: GOALS,
  },
  {
    key: 'tone', label: 'Tone', type: 'select', maxLength: 0,
    tooltip: 'Sets the writing style — from buttoned-up boardroom to casual all-hands.',
    placeholder: '',
    options: ['professional', 'casual', 'inspirational', 'technical', 'storytelling', 'data-driven'],
  },
  {
    key: 'slideCount', label: 'Slide count', type: 'select', maxLength: 0,
    tooltip: 'Target number of slides. The AI will structure content to fit.',
    placeholder: '',
    options: SLIDE_COUNTS,
  },
  {
    key: 'duration', label: 'Duration', type: 'select', maxLength: 0,
    tooltip: 'How long is the presentation? Affects pacing and detail level.',
    placeholder: '',
    options: DURATIONS,
  },
  {
    key: 'dataStyle', label: 'Data density', type: 'select', maxLength: 0,
    tooltip: 'How much data, charts, and numbers should appear vs. narrative.',
    placeholder: '',
    options: DATA_STYLES,
  },
  {
    key: 'visualStyle', label: 'Visual style', type: 'select', maxLength: 0,
    tooltip: 'Guides the layout and visual approach for each slide.',
    placeholder: '',
    options: VISUAL_STYLES,
  },
  {
    key: 'contentFocus', label: 'Content focus', type: 'select', maxLength: 0,
    tooltip: 'The overall narrative approach — strategic, tactical, persuasive, etc.',
    placeholder: '',
    options: CONTENT_FOCUSES,
  },
  {
    key: 'agentLatitude', label: 'Creative license', type: 'select', maxLength: 0,
    tooltip: 'Controls how much creative freedom the AI takes when interpreting your source material and building the narrative.',
    placeholder: '',
    options: AGENT_LATITUDES,
  },
  {
    key: 'infoCutoff', label: 'Information cutoff', type: 'date', maxLength: 0,
    tooltip: 'Latest date the data should cover. Helps the AI avoid outdated info.',
    placeholder: '',
  },
];

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const handleEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
    setShow(true);
  };

  return (
    <span
      ref={ref}
      style={{ cursor: 'help', display: 'inline-flex' }}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setShow(false)}
      onFocus={handleEnter}
      onBlur={() => setShow(false)}
      tabIndex={0}
      role="img"
      aria-label={text}
    >
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '14px', height: '14px', borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.08)', color: '#888',
        fontSize: '0.6rem', fontWeight: 700, lineHeight: 1,
      }}>
        ?
      </span>
      {show && pos && createPortal(
        <span style={{
          ...tooltipStyle,
          position: 'fixed',
          top: pos.top,
          left: pos.left,
        }}>{text}</span>,
        document.body,
      )}
    </span>
  );
}

function DropdownOrText({
  value, onChange, options, placeholder, maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  maxLength: number;
}) {
  const isCustom = value !== '' && !options.includes(value);
  const [showCustom, setShowCustom] = useState(isCustom);

  return (
    <div>
      {!showCustom ? (
        <select
          style={inputStyle}
          value={options.includes(value) ? value : ''}
          onChange={e => {
            if (e.target.value === '__custom__') {
              setShowCustom(true);
              onChange('');
            } else {
              onChange(e.target.value);
            }
          }}
        >
          <option value="">Select...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
          <option value="__custom__">Other (type your own)</option>
        </select>
      ) : (
        <div style={{ display: 'flex', gap: '4px' }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            value={value}
            onChange={e => onChange(e.target.value.slice(0, maxLength))}
            placeholder={placeholder}
            maxLength={maxLength}
          />
          <button
            onClick={() => { setShowCustom(false); onChange(''); }}
            style={{
              backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px', color: '#888', fontSize: '0.7rem', padding: '4px 8px',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            List
          </button>
        </div>
      )}
    </div>
  );
}

export function BriefForm({ brief, onChange }: BriefFormProps) {
  const update = (field: keyof Brief, value: string) => {
    onChange({ ...brief, [field]: value });
  };

  return (
    <div>
      {FIELDS.map((f, i) => (
        <div key={f.key} style={{ marginBottom: '8px', position: 'relative', zIndex: FIELDS.length - i }}>
          <label htmlFor={`brief-${f.key}`} style={labelStyle}>
            {f.label}
            <Tooltip text={f.tooltip} />
          </label>

          {f.type === 'text' && (
            <>
              <input
                id={`brief-${f.key}`}
                style={inputStyle}
                value={(brief[f.key] as string) ?? ''}
                onChange={e => update(f.key, e.target.value.slice(0, f.maxLength))}
                placeholder={f.placeholder}
                maxLength={f.maxLength}
              />
              {f.maxLength > 0 && (
                <div style={charCountStyle}>
                  {((brief[f.key] as string) ?? '').length}/{f.maxLength}
                </div>
              )}
            </>
          )}

          {f.type === 'select' && f.options && (
            <select
              id={`brief-${f.key}`}
              style={inputStyle}
              value={(brief[f.key] as string) ?? ''}
              onChange={e => update(f.key, e.target.value)}
            >
              {f.key !== 'tone' && <option value="">Select...</option>}
              {f.options.map(o => (
                <option key={o} value={o}>
                  {o.charAt(0).toUpperCase() + o.slice(1)}
                </option>
              ))}
            </select>
          )}

          {f.type === 'dropdown-or-text' && f.options && (
            <>
              <DropdownOrText
                value={(brief[f.key] as string) ?? ''}
                onChange={v => update(f.key, v)}
                options={f.options}
                placeholder={f.placeholder}
                maxLength={f.maxLength}
              />
              {f.maxLength > 0 && (brief[f.key] as string)?.length > 0 && (
                <div style={charCountStyle}>
                  {((brief[f.key] as string) ?? '').length}/{f.maxLength}
                </div>
              )}
            </>
          )}

          {f.type === 'date' && (
            <input
              id={`brief-${f.key}`}
              type="date"
              style={inputStyle}
              value={(brief[f.key] as string) ?? ''}
              onChange={e => update(f.key, e.target.value)}
            />
          )}
        </div>
      ))}

    </div>
  );
}
