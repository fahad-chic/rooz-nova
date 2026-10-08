import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings2, X } from 'lucide-react';
import usePrefs, { FONT_SCALES } from '../store/usePrefs';
import useNotifications from '../store/useNotifications';

// لوحة تحكم الزائر السريعة — زر عائم ثابت في الصفحة الرئيسية فقط
// (يُركَّب من App.jsx عند pathname === '/')، فوق زر واتساب أسفل يمين الشاشة.
// يتحكم بنفس متجر usePrefs المستخدم في صفحة الإعدادات فتبقى الخيارات متزامنة.
const HomePrefsFloat = () => {
  const [open, setOpen] = useState(false);
  const {
    clickSound, toggleClickSound,
    fontSize, setFontSize,
    highContrast, toggleHighContrast,
    reduceMotion, toggleReduceMotion,
  } = usePrefs();
  const muted = useNotifications((s) => s.muted);
  const toggleMuted = useNotifications((s) => s.toggleMuted);

  const toggles = [
    { label: 'صوت الضغط على الأزرار', value: clickSound, action: toggleClickSound },
    { label: 'التباين العالي', value: highContrast, action: toggleHighContrast },
    { label: 'تقليل الحركة', value: reduceMotion, action: toggleReduceMotion },
    { label: 'الإشعارات المباشرة', value: !muted, action: toggleMuted },
  ];

  return (
    <>
      <style>{`
        .hpf-btn {
          position: fixed;
          /* فوق زر واتساب مباشرةً (واتساب أسفل + 62px) — بلا تداخل */
          bottom: calc(max(16px, env(safe-area-inset-bottom, 0px)) + 78px);
          right: 16px;
          z-index: 80;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1f1116, #6b1d2f);
          color: #fff;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(31, 17, 22,0.4);
          transition: transform 0.2s ease;
        }
        .hpf-btn:hover { transform: scale(1.08); }
        .hpf-panel {
          position: fixed;
          bottom: calc(max(16px, env(safe-area-inset-bottom, 0px)) + 140px);
          right: 16px;
          z-index: 80;
          width: min(280px, calc(100vw - 32px));
          background: #fdfbf7;
          border: 1.5px solid #6b1d2f;
          border-radius: 16px;
          box-shadow: 0 14px 40px rgba(31, 17, 22,0.25);
          padding: 14px;
          direction: rtl;
          font-family: Cairo, sans-serif;
        }
        .hpf-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 900;
          font-size: 0.95rem;
          color: #1f1116;
          margin-bottom: 10px;
        }
        .hpf-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b1d2f;
          display: flex;
          padding: 2px;
        }
        .hpf-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 7px 0;
          border-top: 1px dashed rgba(61, 15, 24,0.3);
          font-size: 0.85rem;
          font-weight: 700;
          color: #1f1116;
        }
        .hpf-switch {
          flex-shrink: 0;
          width: 40px;
          height: 22px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          position: relative;
          background: #d4a5a5;
          transition: background 0.2s ease;
        }
        .hpf-switch.on { background: #1f1116; }
        .hpf-switch::after {
          content: '';
          position: absolute;
          top: 3px;
          inset-inline-start: 3px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.2s ease;
        }
        .hpf-switch.on::after { transform: translateX(-18px); }
        .hpf-fonts { display: flex; gap: 6px; }
        .hpf-font {
          flex: 1;
          border: 1.5px solid #6b1d2f;
          background: #fff;
          color: #6b1d2f;
          border-radius: 10px;
          padding: 5px 0;
          font-size: 0.78rem;
          font-weight: 800;
          cursor: pointer;
          font-family: Cairo, sans-serif;
        }
        .hpf-font.active { background: #6b1d2f; color: #fff; }
        .hpf-more {
          display: block;
          text-align: center;
          margin-top: 10px;
          font-size: 0.8rem;
          font-weight: 800;
          color: #1f1116;
          text-decoration: none;
        }
      `}</style>

      {open && (
        <div className="hpf-panel" role="dialog" aria-label="إعدادات العرض السريعة">
          <div className="hpf-title">
            <span>إعدادات العرض</span>
            <button type="button" className="hpf-close" onClick={() => setOpen(false)} aria-label="إغلاق الإعدادات">
              <X size={17} />
            </button>
          </div>

          <div className="hpf-row" style={{ borderTop: 'none' }}>
            <span>حجم الخط</span>
            <div className="hpf-fonts" role="group" aria-label="حجم الخط">
              {FONT_SCALES.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`hpf-font${fontSize === f.key ? ' active' : ''}`}
                  onClick={() => setFontSize(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {toggles.map((t) => (
            <div className="hpf-row" key={t.label}>
              <span>{t.label}</span>
              <button
                type="button"
                className={`hpf-switch${t.value ? ' on' : ''}`}
                onClick={t.action}
                role="switch"
                aria-checked={t.value}
                aria-label={t.label}
              />
            </div>
          ))}

          <Link to="/settings" className="hpf-more" onClick={() => setOpen(false)}>
            كل الإعدادات ←
          </Link>
        </div>
      )}

      <button
        type="button"
        className="hpf-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'إغلاق إعدادات العرض' : 'فتح إعدادات العرض'}
        aria-expanded={open}
      >
        <Settings2 size={21} strokeWidth={2.2} />
      </button>
    </>
  );
};

export default HomePrefsFloat;