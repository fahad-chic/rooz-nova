// src/components/OwnerTextEdit.jsx
import { useState } from 'react';
import { Pencil, X, Check } from 'lucide-react';
import usePermissions from '../permissions/usePermissions';
import useSiteTexts, { saveSiteText } from '../store/useSiteTexts';

const OwnerTextEdit = ({ textKey, defaultValue }) => {
  const { can } = usePermissions();
  const texts = useSiteTexts((s) => s.texts);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);

  if (!can('INLINE_TEXT_EDIT') || !textKey) return null;

  const current = texts[textKey] ?? defaultValue ?? '';

  const openEditor = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setValue(current);
    setOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (saving) return;

    const nextValue = value.trim();

    if (!nextValue) {
      return;
    }

    setSaving(true);

    try {
      await saveSiteText(textKey, nextValue);
      setOpen(false);
    } catch {
      alert('تعذر الحفظ — حاول مرة أخرى');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openEditor}
        aria-label="تعديل النص"
        title="تعديل النص"
        style={{
          position: 'absolute',
          bottom: 4,
          insetInlineEnd: 6,
          zIndex: 14,
          width: 26,
          height: 26,
          borderRadius: 8,
          border: '1.5px solid rgb(37, 99, 235,0.85)',
          background: 'linear-gradient(135deg, #0c0926, #100c31)',
          color: '#8a63ef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 3px 10px rgb(12, 9, 38,0.35)',
        }}
      >
        <Pencil size={12} strokeWidth={2.4} />
      </button>

      {open && (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!saving) setOpen(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1700,
            background: 'rgb(11, 8, 34,0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            direction: 'rtl',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="تعديل النص"
            style={{
              width: 'min(430px, 100%)',
              background: 'linear-gradient(160deg, #f7f6fb, #e3dbf5)',
              border: '2px solid #2563eb',
              borderRadius: 18,
              boxShadow: '0 22px 55px rgb(15, 11, 48,0.35)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(120deg, #110c35, #320e73)',
                color: '#a382f5',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 900,
                fontSize: '0.95rem',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7
                }}
              >
                <Pencil size={16} aria-hidden="true" />
                تعديل النص
              </span>

              <button
                type="button"
                onClick={() => {
                  if (!saving) setOpen(false);
                }}
                disabled={saving}
                aria-label="إغلاق"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a382f5',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  padding: 2,
                  opacity: saving ? 0.5 : 1
                }}
              >
                <X size={17} />
              </button>
            </div>

            <div style={{ padding: '16px' }}>
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={4}
                maxLength={600}
                autoFocus
                disabled={saving}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  borderRadius: 12,
                  border: '1.5px solid #8f6bdc',
                  background: '#f7f6fb',
                  padding: '10px 12px',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: '#0a071e',
                  outline: 'none',
                  lineHeight: 1.8,
                  opacity: saving ? 0.7 : 1
                }}
              />

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !value.trim()}
                style={{
                  marginTop: 10,
                  width: '100%',
                  border: 'none',
                  borderRadius: 12,
                  padding: '11px',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  cursor: saving || !value.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                  boxShadow: '0 6px 16px rgb(37, 99, 235,0.35)',
                  opacity: saving || !value.trim() ? 0.6 : 1,
                }}
              >
                <Check size={16} aria-hidden="true" />
                {saving ? 'جاري الحفظ...' : 'حفظ التعديل'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OwnerTextEdit;