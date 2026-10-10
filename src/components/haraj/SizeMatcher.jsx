// src/components/haraj/SizeMatcher.jsx
// حاسبة المقاسات الذكية — تُدخل المشترية مقاساتها فيعرض الموقع نسبة الملاءمة.
import { useMemo, useState } from 'react';
import { Ruler, Sparkles } from 'lucide-react';
import {
  SIZE_FIELDS,
  computeFitScore,
  fitVerdict,
  hasAnySize,
} from '../../utils/dressMeta';

const TONE_COLORS = {
  great: '#404040',
  good: '#1E293B',
  ok: '#404040',
  weak: '#1E293B',
  neutral: '#404040',
};

export default function SizeMatcher({ dress = {} }) {
  const [buyer, setBuyer] = useState({});
  const available = useMemo(() => hasAnySize(dress), [dress]);
  const score = useMemo(() => computeFitScore(dress, buyer), [dress, buyer]);
  const verdict = fitVerdict(score);

  if (!available) return null;

  return (
    <div
      className="rooz-size-matcher"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E8E2D6',
        borderRadius: 20,
        padding: 20,
        marginTop: 14,
        boxShadow: '0 8px 30px rgba(32,42,58, 0.08)',
      }}
    >
      <h3
        style={{
          margin: '0 0 6px',
          fontSize: 18,
          fontWeight: 800,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <Ruler size={20} color="#1E293B" /> حاسبة المقاسات الذكية
      </h3>
      <p style={{ margin: '0 0 14px', textAlign: 'center', fontSize: 12, color: '#404040' }}>
        أدخلي مقاساتك بالسنتيمتر لتعرفي نسبة ملاءمة الفستان لكِ.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 10,
        }}
      >
        {SIZE_FIELDS.map((field) => (
          <label key={field.key} style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#202A3A' }}>
              {field.label} <span style={{ color: '#404040', fontWeight: 500 }}>(سم)</span>
            </span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              value={buyer[field.key] ?? ''}
              onChange={(e) =>
                setBuyer((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              placeholder={dress[field.key] ? `مقاس الفستان: ${dress[field.key]}` : '0'}
              style={{
                border: '1px solid rgba(30,41,59, 0.22)',
                borderRadius: 12,
                padding: '0.7rem 0.85rem',
                fontSize: 15,
                fontFamily: 'inherit',
                color: '#202A3A',
                background: '#E8E2D6',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </label>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
          background: 'rgba(30,41,59, 0.06)',
          borderRadius: 14,
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 800 }}>
          <Sparkles size={18} color="#1E293B" />
          {score == null ? 'أدخلي قياساً واحداً على الأقل' : verdict.label}
        </span>
        {score != null && (
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: TONE_COLORS[verdict.tone],
            }}
          >
            {score}%
          </span>
        )}
      </div>
    </div>
  );
}
