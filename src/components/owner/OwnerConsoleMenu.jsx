// src/components/owner/OwnerConsoleMenu.jsx — قائمة امتيازات المالك
//
// بديل عن زر «العين» القديم الذي كان يفتح قائمة بلا ملامح (خلفية بيضاء وحدود
// شبه معدومة). الزر الجديد يرمز لامتياز المالك (تاج داخل درع)، والقائمة لوحة
// عاجية بحدود ذهبية واضحة، ولكل خيار أيقونة عصرية خاصة به وزر «✕» للإغلاق.
// الخيار المحدد يظهر كأيقونة مميزة على الزر نفسه بدلاً من نص.
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Crown, X } from 'lucide-react'

// لوحة الألوان: عاجي/ذهب — بلا أي خلفية زرقاء أو كحلية.
const C = {
  ivory: '#f7f6fb',
  ivoryDeep: '#e2d9f5',
  line: 'rgb(37, 99, 235, 0.45)',
  lineSoft: 'rgb(37, 99, 235, 0.22)',
  gold: '#2563eb',
  goldDeep: '#321473',
  ink: '#0c0926',
  inkSoft: '#3e247a',
}

const OwnerConsoleMenu = ({ tabs = [], activeId, onSelect, triggerLabel = 'أدوات المالك' }) => {
  const [open, setOpen] = useState(false)
  const [dismissedId, setDismissedId] = useState(null)
  const rootRef = useRef(null)
  const panelRef = useRef(null)
  const titleId = useId()

  const active = tabs.find((tab) => tab.id === activeId) || tabs[0]
  const ActiveIcon = active?.icon || Crown

  useEffect(() => {
    if (!open) return undefined
    // خيار مُستبعد مؤقتاً (بعد ضغط ✕) ثم أُعيد تفعيله — تُرفع علامة الاستبعاد
    // حتى لا يبقى الزر معطلاً للإغلاق.
    if (dismissedId && activeId !== dismissedId) setDismissedId(null)

    const onPointerDown = (event) => {
      if (rootRef.current?.contains(event.target)) return
      if (panelRef.current?.contains(event.target)) return
      setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown, { passive: true })
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, dismissedId, activeId])

  const markDismissed = (id) => {
    setDismissedId(id)
    setOpen(false)
  }

  return (
    <div className="ocm-root" ref={rootRef}>
      <style>{`
        .ocm-root { position: relative; flex-shrink: 0; }

        /* زر الامتياز — تاج داخل حلقة ذهبية، يرمز لصلاحيات المالك */
        .ocm-trigger {
          position: relative;
          display: grid;
          place-items: center;
          width: 46px;
          height: 46px;
          padding: 0;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          color: ${C.goldDeep};
          background:
            radial-gradient(120% 120% at 30% 15%, #f7f6fb, ${C.ivoryDeep} 70%);
          box-shadow:
            inset 0 0 0 1.5px ${C.line},
            0 6px 18px rgb(50, 20, 115, 0.22);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .ocm-trigger:hover,
        .ocm-trigger:focus-visible {
          transform: translateY(-1px);
          box-shadow:
            inset 0 0 0 1.5px ${C.gold},
            0 9px 22px rgb(50, 20, 115, 0.3);
          outline: none;
        }
        .ocm-trigger:active { transform: scale(0.96); }
        .ocm-trigger[aria-expanded="true"] {
          color: #fff;
          background: linear-gradient(150deg, #2563eb, ${C.gold} 65%, #1e40af);
          box-shadow:
            inset 0 0 0 1.5px rgb(255, 255, 255, 0.5),
            0 8px 20px rgb(50, 20, 115, 0.32);
        }
        /* التاج الصغير أعلى الأيقونة — وسم «امتياز المالك» */
        .ocm-trigger-mark {
          position: absolute;
          top: -5px;
          inset-inline-end: -5px;
          display: grid;
          place-items: center;
          width: 19px;
          height: 19px;
          border-radius: 50%;
          color: ${C.ink};
          background: linear-gradient(140deg, #b295f4, #2563eb 60%, #2563eb);
          box-shadow: 0 2px 6px rgb(50, 20, 115, 0.35);
        }

        /* لوحة الخيارات — عاجية بحدود ذهبية واضحة ومحددة */
        .ocm-panel {
          position: fixed;
          z-index: 1000;
          width: min(330px, calc(100vw - 24px));
          max-height: min(72vh, 560px);
          overflow-y: auto;
          padding: 12px;
          border-radius: 20px;
          direction: rtl;
          background: linear-gradient(170deg, ${C.ivory}, ${C.ivoryDeep});
          border: 1.5px solid ${C.line};
          box-shadow:
            0 22px 54px rgb(15, 11, 46, 0.28),
            0 2px 0 rgb(255, 255, 255, 0.9) inset;
          color: ${C.ink};
        }
        .ocm-head {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 2px 4px 10px;
          margin-bottom: 8px;
          border-bottom: 1.5px solid ${C.lineSoft};
        }
        .ocm-head-icon {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          flex: 0 0 32px;
          border-radius: 11px;
          color: ${C.ink};
          background: linear-gradient(140deg, #b295f4, #2563eb 60%, #2563eb);
        }
        .ocm-head-text { margin-inline-end: auto; min-width: 0; }
        .ocm-head-title {
          display: block;
          font-size: 0.92rem;
          font-weight: 800;
          letter-spacing: 0.1px;
        }
        .ocm-head-sub {
          display: block;
          font-size: 0.68rem;
          font-weight: 600;
          color: ${C.inkSoft};
          margin-top: 2px;
        }
        .ocm-close {
          display: grid;
          place-items: center;
          width: 30px;
          height: 30px;
          flex: 0 0 30px;
          border-radius: 50%;
          border: 1.5px solid ${C.line};
          background: #fff;
          color: ${C.goldDeep};
          cursor: pointer;
          transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
        }
        .ocm-close:hover {
          background: ${C.goldDeep};
          border-color: ${C.goldDeep};
          color: #fff;
          transform: rotate(90deg);
        }

        .ocm-list { display: grid; gap: 6px; }
        .ocm-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 11px;
          border-radius: 14px;
          border: 1px solid transparent;
          background: transparent;
          color: ${C.ink};
          cursor: pointer;
          text-align: start;
          transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
        }
        .ocm-item:hover,
        .ocm-item:focus-visible {
          background: rgb(127, 83, 226, 0.16);
          border-color: ${C.line};
          outline: none;
          transform: translateX(-2px);
        }
        .ocm-item-icon {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          border-radius: 12px;
          color: ${C.goldDeep};
          background: linear-gradient(150deg, #f7f6fb, #d8ccf3);
          border: 1px solid ${C.lineSoft};
          transition: color 0.18s ease, background 0.18s ease;
        }
        .ocm-item-label {
          flex: 1 1 auto;
          font-size: 0.86rem;
          font-weight: 700;
          line-height: 1.35;
        }
        .ocm-item-x {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          border-radius: 50%;
          border: 1.5px solid ${C.line};
          background: #fff;
          color: ${C.goldDeep};
          cursor: pointer;
          transition: background 0.18s ease, color 0.18s ease;
        }
        .ocm-item-x:hover { background: #95142c; border-color: #95142c; color: #fff; }

        /* الخيار المحدد — خلفية ذهبية وأيقونة معاكسة بارزة */
        .ocm-item.is-active {
          background: linear-gradient(140deg, #b295f4, #2563eb 60%, #2563eb);
          border-color: ${C.gold};
          box-shadow: 0 8px 20px rgb(50, 20, 115, 0.22);
        }
        .ocm-item.is-active .ocm-item-icon {
          color: #fff;
          background: ${C.goldDeep};
          border-color: ${C.goldDeep};
        }
        .ocm-item.is-active .ocm-item-label { font-weight: 800; }
        .ocm-item.is-active .ocm-item-x { background: ${C.goldDeep}; border-color: ${C.goldDeep}; color: #fff; }
        .ocm-item.is-active .ocm-item-x:hover { background: #95142c; border-color: #95142c; }
        .ocm-item.is-excluded { opacity: 0.5; }
      `}</style>

      <button
        type="button"
        className="ocm-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${triggerLabel} — الحالي: ${active?.label || ''}`}
        title={triggerLabel}
      >
        <ActiveIcon size={22} strokeWidth={2.1} aria-hidden="true" />
        <span className="ocm-trigger-mark" aria-hidden="true">
          <Crown size={11} strokeWidth={2.6} />
        </span>
      </button>

      {open &&
        createPortal(
          <div
            className="ocm-panel"
            role="menu"
            aria-labelledby={titleId}
            ref={panelRef}
            style={(() => {
              const rect = rootRef.current?.getBoundingClientRect()
              if (!rect) return { top: 70, right: 12 }
              const right = Math.max(12, window.innerWidth - rect.right)
              const below = rect.bottom + 8
              const fitsBelow = below + 300 < window.innerHeight
              return fitsBelow
                ? { top: below, right }
                : { bottom: window.innerHeight - rect.top + 8, right }
            })()}
          >
            <div className="ocm-head">
              <span className="ocm-head-icon" aria-hidden="true">
                <Crown size={17} strokeWidth={2.3} />
              </span>
              <span className="ocm-head-text">
                <span className="ocm-head-title" id={titleId}>
                  امتيازات المالك
                </span>
                <span className="ocm-head-sub">اختر قسم التحكم المطلوب</span>
              </span>
              <button
                type="button"
                className="ocm-close"
                onClick={() => setOpen(false)}
                aria-label="إغلاق القائمة"
              >
                <X size={15} strokeWidth={2.6} />
              </button>
            </div>

            <div className="ocm-list" role="none">
              {tabs.map((tab) => {
                const Icon = tab.icon || Crown
                const isActive = tab.id === activeId
                return (
                  <div
                    key={tab.id}
                    role="menuitem"
                    tabIndex={0}
                    className={[
                      'ocm-item',
                      isActive ? 'is-active' : '',
                      tab.id === dismissedId ? 'is-excluded' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      onSelect?.(tab)
                      setOpen(false)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onSelect?.(tab)
                        setOpen(false)
                      }
                    }}
                    aria-label={tab.label}
                  >
                    <span className="ocm-item-icon" aria-hidden="true">
                      <Icon size={18} strokeWidth={2.1} />
                    </span>
                    <span className="ocm-item-label">{tab.label}</span>
                    <button
                      type="button"
                      className="ocm-item-x"
                      onClick={(event) => {
                        event.stopPropagation()
                        markDismissed(tab.id)
                      }}
                      aria-label={`إغلاق القائمة (${tab.label})`}
                      title="إغلاق"
                    >
                      <X size={14} strokeWidth={2.8} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

export default OwnerConsoleMenu