// src/components/SmartDropdownMenu.jsx
// قائمة منسدلة متقدمة (Accordion / Nested Dropdown) بزر (+) ذكي.
// عند النقر يفتح خيارات أساسية، ويندرج تحت كل خيار فروع وتصنيفات تفصيلية.
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { SMART_MENU, SMART_MENU_LINKS } from '../data/smartMenu';

const SmartDropdownMenu = ({ className = '', variant = 'desktop' }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openRoot, setOpenRoot] = useState(null);
  const [openChild, setOpenChild] = useState(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (catalogId, state) => {
    if (!catalogId) return;
    setOpen(false);
    navigate(`/catalog/${catalogId}`, state ? { state } : undefined);
  };

  return (
    <div className={`rooz-smart-menu rooz-smart-menu--${variant} ${className}`} ref={wrapRef} dir="rtl">
      <button
        type="button"
        className="rooz-smart-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="قائمة الأقسام الذكية"
      >
        {open ? <Minus size={16} /> : <Plus size={16} />}
        <span>الأقسام الذكية</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="rooz-smart-panel" role="menu">
          <div className="rooz-smart-head">
            <Sparkles size={16} />
            <span>تصفح التصنيفات التفصيلية</span>
          </div>

          <ul className="rooz-smart-list">
            {SMART_MENU.map((root) => {
              const rootOpen = openRoot === root.id;
              return (
                <li key={root.id} className="rooz-smart-item">
                  <div className="rooz-smart-row">
                    <button
                      type="button"
                      className="rooz-smart-label"
                      onClick={() => {
                        if (root.catalogId) {
                          go(root.catalogId, { sectionId: root.id, sectionName: root.label });
                        } else {
                          setOpenRoot(rootOpen ? null : root.id);
                          setOpenChild(null);
                        }
                      }}
                    >
                      {root.label}
                    </button>
                    {root.children?.length > 0 && (
                      <button
                        type="button"
                        className="rooz-smart-plus"
                        aria-label={`إظهار فروع ${root.label}`}
                        aria-expanded={rootOpen}
                        onClick={() => {
                          setOpenRoot(rootOpen ? null : root.id);
                          setOpenChild(null);
                        }}
                      >
                        {rootOpen ? <Minus size={14} /> : <Plus size={14} />}
                      </button>
                    )}
                  </div>

                  {rootOpen && root.children?.length > 0 && (
                    <ul className="rooz-smart-sub">
                      {root.children.map((child) => {
                        const childOpen = openChild === child.id;
                        return (
                          <li key={child.id} className="rooz-smart-subitem">
                            <div className="rooz-smart-row">
                              <button
                                type="button"
                                className="rooz-smart-label rooz-smart-label--sub"
                                onClick={() =>
                                  go(child.catalogId, {
                                    sectionId: root.id,
                                    branchId: child.id,
                                    branchName: child.label,
                                    size: child.size,
                                  })
                                }
                              >
                                {child.label}
                              </button>
                              {child.children?.length > 0 && (
                                <button
                                  type="button"
                                  className="rooz-smart-plus"
                                  aria-label={`إظهار تفاصيل ${child.label}`}
                                  aria-expanded={childOpen}
                                  onClick={() => setOpenChild(childOpen ? null : child.id)}
                                >
                                  {childOpen ? <Minus size={13} /> : <Plus size={13} />}
                                </button>
                              )}
                            </div>

                            {childOpen && child.children?.length > 0 && (
                              <ul className="rooz-smart-leaf">
                                {child.children.map((leaf) => (
                                  <li key={leaf.id}>
                                    <button
                                      type="button"
                                      className="rooz-smart-label rooz-smart-label--leaf"
                                      onClick={() =>
                                        go(leaf.catalogId, {
                                          sectionId: root.id,
                                          branchId: child.id,
                                          subId: leaf.id,
                                          subName: leaf.label,
                                          size: leaf.size,
                                        })
                                      }
                                    >
                                      {leaf.label}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="rooz-smart-links">
            {SMART_MENU_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                className="rooz-smart-link"
                onClick={() => {
                  setOpen(false);
                  navigate(link.path);
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartDropdownMenu;
