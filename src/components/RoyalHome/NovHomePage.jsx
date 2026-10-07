// src/components/RoyalHome/NovHomePage.jsx
// ROOZ NOVA — الصفحة الرئيسية بالتصميم الجديد كلياً
// نفس المسارات/الربط/البيانات، لكن بهيكل وتخطيط مختلف تماماً:
// هيرو عريض + شريط مزايا + شبكة أقسام تفاعلية + شريط حراج.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  Gem,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  Plus,
  X,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Store,
  Home,
  Store as StoreIcon,
  Flame,
} from 'lucide-react';

import MarqueeBanner from './MarqueeBanner';
import CommentsSection from './CommentsSection';
import { MARQUEE_BANNERS, MARQUEE_BANNERS_2, ROYAL_SECTIONS } from './sectionsData';
import { CONTACT_INFO } from '../../utils/constants';
import '../../styles/NovHome.css';

const LOGO_SRC = '/assets/logo-v2.webp';

const SECTION_ICONS = {
  dresses: Sparkles,
  'wedding-dresses': Crown,
  'girls-dresses': Sparkles,
  abayas: Store,
  bags: ShoppingBag,
  shoes: Sparkles,
  'used-dresses': Sparkles,
  perfumes: Sparkles,
  'golden-mothers': Crown,
  jewelry: Gem,
  'home-products': Home,
  haraj: ShoppingBag,
};

const TILE_GRADIENTS = [
  'linear-gradient(140deg,#6b1d2f,#4a3a3f)',
  'linear-gradient(140deg,#6b1d2f,#6b1d2f)',
  'linear-gradient(140deg,#4a3a3f,#6b1d2f)',
  'linear-gradient(140deg,#6b1d2f,#6b1d2f)',
  'linear-gradient(140deg,#6b1d2f,#6b1d2f)',
  'linear-gradient(140deg,#6b1d2f,#6b1d2f)',
];

const NovHomePage = () => {
  const navigate = useNavigate();
  const [showAddHelp, setShowAddHelp] = useState(false);
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [openId, setOpenId] = useState(null);

  const catalogSections = ROYAL_SECTIONS.filter((s) => !s.isAction);
  const openSection = catalogSections.find((s) => s.id === openId) || null;

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailStatus('يرجى إدخال بريد صحيح');
      return;
    }
    setEmailStatus('تم الاشتراك بنجاح');
    setEmail('');
  };

  const openBranch = (branch) => {
    if (branch?.catalogId) {
      navigate(`/catalog/${branch.catalogId}`, {
        state: { branchId: branch.id, branchName: branch.name },
      });
    }
  };

  return (
    <div className="ch-root" dir="rtl">
      <div className="home-marquees-sticky">
        <MarqueeBanner
          banners={MARQUEE_BANNERS}
          editableKeys={['marquee1', 'marquee2', 'marquee3']}
        />
        <MarqueeBanner
          banners={MARQUEE_BANNERS_2}
          editableKeys={['marquee4', 'marquee5', 'marquee6']}
          label="عروض ROOZ"
          barBg="linear-gradient(90deg, #1f1116 0%, #1f1116 50%, #1f1116 100%)"
        />
      </div>

      <div className="nov-home">
        {/* ===== الهيرو العريض الجديد ===== */}
        <section className="nov-hero">
          <div className="nov-hero-grid">
            <img
              fetchPriority="high"
              src={LOGO_SRC}
              alt="شعار أناقة ROOZ"
              className="nov-hero-logo"
            />
            <div>
              <span className="nov-hero-kicker">
                <Gem size={13} strokeWidth={2} />
                هوية جديدة · تجربة أرقى
              </span>
              <h1 className="nov-hero-title">أناقة تليق بكم</h1>
              <p className="nov-hero-sub">
                فساتين وعبايات وإكسسوارات فاخرة في المملكة العربية السعودية —
                فخامة، ثقة، وتفاصيل تُعتنى بها.
              </p>
              <div className="nov-hero-cta">
                <button
                  type="button"
                  className="nov-btn nov-btn-primary"
                  onClick={() => navigate('/advertisements')}
                >
                  <ShoppingBag size={16} />
                  تصفّح المتجر
                </button>
                <button
                  type="button"
                  className="nov-btn nov-btn-ghost"
                  onClick={() => navigate('/haraj')}
                >
                  <Flame size={16} />
                  موقع الحراج
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== شريط المزايا ===== */}
        <section className="nov-features">
          <div className="nov-feature">
            <span className="nov-feature-ico">
              <Crown size={18} strokeWidth={1.9} />
            </span>
            <h4>لأنكم تستاهلون</h4>
            <p>مسابقة ذهب عيار 21 قريباً</p>
          </div>

          <div className="nov-feature">
            <span className="nov-feature-ico">
              <Smartphone size={18} strokeWidth={1.9} />
            </span>
            <h4>أضف للمتجر</h4>
            <p>ثبّته كتطبيق على هاتفك</p>
            <button
              type="button"
              className="nov-mini-btn"
              onClick={() => setShowAddHelp(true)}
            >
              <Plus size={12} />
              كيف؟
            </button>
          </div>

          <div className="nov-feature">
            <span className="nov-feature-ico">
              <Mail size={18} strokeWidth={1.9} />
            </span>
            <h4>عروضنا توصلك</h4>
            <p>اشترك ليصلك الجديد</p>
            <form onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك"
              />
              <button type="submit" className="nov-mini-btn">
                اشترك
              </button>
            </form>
            {emailStatus && (
              <span
                className="nov-feature-status"
                style={{ color: emailStatus.includes('نجاح') ? '#6b1d2f' : '#8f2a40' }}
              >
                {emailStatus}
              </span>
            )}
          </div>
        </section>

        {/* ===== شبكة الأقسام الجديدة ===== */}
        <div className="nov-sec-head">
          <h2>أقسام متجر أناقة ROOZ</h2>
          <span className="nov-sec-count">{catalogSections.length} قسم</span>
        </div>

        <section className="nov-tiles">
          {catalogSections.map((section, idx) => {
            const Icon = SECTION_ICONS[section.id] || StoreIcon;
            const isOpen = openId === section.id;
            const branches = Array.isArray(section.branches) ? section.branches : [];
            return (
              <button
                type="button"
                key={section.id}
                className="nov-tile"
                data-open={isOpen}
                onClick={() => setOpenId(isOpen ? null : section.id)}
                aria-expanded={isOpen}
              >
                <span
                  className="nov-tile-ico"
                  style={{
                    background:
                      section.color
                        ? `linear-gradient(140deg, ${section.color}, #6b1d2f)`
                        : TILE_GRADIENTS[idx % TILE_GRADIENTS.length],
                  }}
                >
                  <Icon size={20} />
                </span>
                <span className="nov-tile-body">
                  <h3>{section.title}</h3>
                  <span>{branches.length} فرع</span>
                </span>
              </button>
            );
          })}
        </section>

        {openSection && (
          <div className="nov-branch-panel">
            <div className="nov-branch-panel-head">
              <h3>{openSection.title}</h3>
              <button
                type="button"
                className="nov-branch-close"
                onClick={() => setOpenId(null)}
                aria-label="إغلاق"
              >
                <X size={16} />
              </button>
            </div>
            <div className="nov-branch-chips">
              {(openSection.branches || []).map((branch) => (
                <button
                  type="button"
                  key={branch.id}
                  className="nov-branch-chip"
                  onClick={() => openBranch(branch)}
                >
                  <span>{branch.name}</span>
                  <ArrowLeft size={14} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== شريط حراج ===== */}
        <section className="nov-haraj">
          <div>
            <h3>موقع الحراج الرسمي</h3>
            <p>بيع واشترِ بثقة داخل منصة أناقة ROOZ</p>
          </div>
          <button
            type="button"
            className="nov-btn nov-btn-primary"
            onClick={() => navigate('/haraj')}
          >
            <Flame size={16} />
            دخول الحراج
          </button>
        </section>

        <CommentsSection />

        {/* ===== الفوتر الجديد ===== */}
        <footer className="ch-footer" style={{ borderRadius: 22, marginTop: '0.5rem' }}>
          <div className="ch-footer-in" style={{ gap: '0.55rem' }}>
            <div>
              <div className="ch-footer-brand" style={{ marginBottom: '0.2rem' }}>
                <img
                  src={LOGO_SRC}
                  alt="شعار أناقة ROOZ"
                  className="ch-footer-logo"
                  loading="lazy"
                  style={{ width: '32px' }}
                />
                <h3 className="ch-footer-name ch-ink-gloss" style={{ fontSize: '0.82rem' }}>
                  أناقة ROOZ
                </h3>
              </div>
              <p className="ch-footer-text" style={{ fontSize: '0.68rem', lineHeight: 1.35, marginBottom: '0.25rem' }}>
                منصة راقية للإعلانات المميزة في المملكة — فخامة وثقة.
              </p>
            </div>

            <div>
              <h4 className="ch-footer-head" style={{ fontSize: '0.75rem', marginBottom: '0.15rem' }}>
                تواصل معنا
              </h4>
              <div className="ch-footer-contact" style={{ fontSize: '0.68rem', gap: '0.15rem' }}>
                <a href={`mailto:${CONTACT_INFO.EMAIL}`}>
                  {CONTACT_INFO.EMAIL}
                  <Mail size={10} className="ch-ci" />
                </a>
                <a href={`tel:+${CONTACT_INFO.PHONE_1}`}>
                  +{CONTACT_INFO.PHONE_1}
                  <Phone size={10} className="ch-ci" />
                </a>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
                  المملكة العربية السعودية
                  <MapPin size={10} className="ch-ci" />
                </span>
              </div>
            </div>
          </div>
          <div className="ch-footer-bottom" style={{ fontSize: '0.62rem', marginTop: '0.4rem' }}>
            جميع الحقوق محفوظة © 2026 أناقة ROOZ
          </div>
        </footer>
      </div>

      {showAddHelp && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowAddHelp(false)}
          className="nov-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(31, 17, 22,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 6000,
            padding: 14,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(145deg,#ffffff,#fdfbf7)',
              border: '1px solid rgba(61, 15, 24,0.4)',
              borderRadius: 18,
              padding: '1.2rem 1rem',
              maxWidth: 340,
              width: '100%',
              textAlign: 'right',
              boxShadow: '0 18px 45px rgba(31, 17, 22,0.35)',
              fontFamily: 'Tajawal,sans-serif',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: '0.6rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1f1116' }}>
                كيف تضيف المتجر لشاشة هاتفك؟
              </h3>
              <button
                type="button"
                onClick={() => setShowAddHelp(false)}
                aria-label="إغلاق"
                style={{
                  background: 'rgba(31, 17, 22,0.06)',
                  border: 'none',
                  borderRadius: 8,
                  width: 30,
                  height: 30,
                  flex: '0 0 30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#6b1d2f',
                }}
              >
                <X size={16} />
              </button>
            </div>
            <ol style={{ margin: 0, paddingRight: '1.1rem', fontSize: '0.82rem', color: '#1f1116', lineHeight: 1.7 }}>
              <li>افتح الموقع في المتصفح</li>
              <li>اضغط قائمة المشاركة أو القائمة</li>
              <li>اختر «إضافة إلى الشاشة الرئيسية»</li>
              <li>أكد الإضافة</li>
            </ol>
            <button
              type="button"
              onClick={() => setShowAddHelp(false)}
              className="nov-btn nov-btn-primary"
              style={{ marginTop: '0.9rem', width: '100%', justifyContent: 'center' }}
            >
              فهمت
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NovHomePage;
