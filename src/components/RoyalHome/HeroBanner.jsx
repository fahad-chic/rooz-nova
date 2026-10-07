// src/components/RoyalHome/HeroBanner.jsx

import React, { useEffect, useRef } from 'react';
import OwnerTextEdit from '../OwnerTextEdit';
import useSiteTexts from '../../store/useSiteTexts';
import {
  MessageCircle,
  ArrowLeft,
  Tag,
  Sparkles,
} from 'lucide-react';

const BANNER_TEXT =
  'هل لديك فستان أو عباية أو حقيبة أو أي قطعة مستخدمة ونظيفة؟ تواصل معنا لإضافتها إلى قسم المنتجات المستخدمة في أناقة ROOZ.';

const WHATSAPP_NUMBER = '966536667222';

// حركة مستمرة بلا توقف (حلقة لا نهائية سلسة) — مثل شريط اللافتات الرئيسي
const MARQUEE_SPEED = 0.012;

const HeroBanner = () => {
  const siteTexts = useSiteTexts((s) => s.texts);
  const bannerText = siteTexts.heroBanner || BANNER_TEXT;
  const trackRef = useRef(null);
  const animationFrameRef = useRef(null);
  const positionRef = useRef(0);
  const lastTimeRef = useRef(null);
  const loopsRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    const stopAnimation = () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      lastTimeRef.current = null;
      positionRef.current = 0;
      loopsRef.current = 0;

      track.style.transform = 'translate3d(0, 0, 0)';
    };

    const animate = (time) => {
      if (mediaQuery.matches) {
        stopAnimation();
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const delta = Math.min(
        time - lastTimeRef.current,
        32
      );

      lastTimeRef.current = time;

      // الحركة إلى اليمين (اتجاه موجب) بسرعة هادئة
      positionRef.current += delta * MARQUEE_SPEED;

      /*
       * لدينا نسختان متطابقتان من النص.
       * عند الوصول إلى عرض النسخة الأولى نعيد الموضع
       * إلى البداية بدون أي قفزة مرئية.
       */
      const firstItem = track.firstElementChild;

      if (firstItem) {
        const firstItemWidth = firstItem.getBoundingClientRect().width;

        if (
          firstItemWidth > 0 &&
          positionRef.current >= firstItemWidth
        ) {
          positionRef.current -= firstItemWidth;
          loopsRef.current += 1;
        }
      }

      track.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;

      animationFrameRef.current =
        window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (mediaQuery.matches) {
        stopAnimation();
        return;
      }

      if (animationFrameRef.current !== null) {
        return;
      }

      lastTimeRef.current = null;

      animationFrameRef.current =
        window.requestAnimationFrame(animate);
    };

    const handleMotionChange = () => {
      if (mediaQuery.matches) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    startAnimation();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener(
        'change',
        handleMotionChange
      );
    } else {
      mediaQuery.addListener(handleMotionChange);
    }

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      animationFrameRef.current = null;
      lastTimeRef.current = null;
      positionRef.current = 0;

      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener(
          'change',
          handleMotionChange
        );
      } else {
        mediaQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <section
      dir="rtl"
      aria-label="خدمة إضافة المنتجات المستخدمة"
      style={{
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        background:
          'linear-gradient(135deg, #e2d8f4 0%, #b6ccf0 48%, #eae4f5 100%)',
        borderTop:
          '1px solid rgb(255, 255, 255,0.85)',
        borderBottom:
          '1px solid rgb(33, 81, 157,0.22)',
        boxShadow:
          '0 6px 22px rgb(57, 73, 100,0.09), inset 0 1px 0 rgb(255, 255, 255,0.9)',
      }}
    >
      {/* الخط العلوي */}
      <div
        aria-hidden="true"
        style={{
          height: 2,
          width: '100%',
          background:
            'linear-gradient(90deg, transparent, #2960b8 25%, #5e90e1 50%, #2960b8 75%, transparent)',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: 1600,
          minHeight: 68,
          margin: '0 auto',
          padding: '8px 18px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        {/* أيقونة الخدمة */}
        <div
          aria-hidden="true"
          style={{
            position: 'relative',
            width: 46,
            height: 46,
            minWidth: 46,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'linear-gradient(145deg, #f7f5fb 0%, #8db1eb 100%)',
            border:
              '1px solid rgb(33, 81, 157,0.28)',
            color: '#21509c',
            boxShadow:
              '0 6px 16px rgb(57, 73, 100,0.13), inset 0 1px 0 rgb(255, 255, 255,0.95)',
            flexShrink: 0,
          }}
        >
          <Tag
            size={21}
            strokeWidth={1.7}
          />

          <span
            style={{
              position: 'absolute',
              top: -4,
              left: -4,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#2563eb',
              border: '2px solid #e2d8f4',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* العنوان */}
        <div
          className="hero-banner-title"
          style={{
            width: 175,
            minWidth: 175,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#1f447f',
              fontFamily:
                'Tajawal, Tajawal, Arial, sans-serif',
            }}
          >
            <Sparkles
              size={14}
              strokeWidth={1.8}
            />

            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
              }}
            >
              خدمة ROOZ
            </span>
          </div>

          <strong
            style={{
              color: '#2b3342',
              fontFamily:
                'Tajawal, Tajawal, Arial, sans-serif',
              fontSize: '0.88rem',
              lineHeight: 1.5,
              fontWeight: 800,
            }}
          >
            حوّل القطع غير المستخدمة إلى فرصة
          </strong>
          <OwnerTextEdit textKey="heroBanner" defaultValue={BANNER_TEXT} />
        </div>

        {/* منطقة النص المتحرك */}
        <div
          className="hero-banner-marquee"
          style={{
            position: 'relative',
            flex: 1,
            minWidth: 0,
            height: 48,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 12,
          }}
        >
          {/* تدرج الجهة اليمنى */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: 55,
              zIndex: 2,
              pointerEvents: 'none',
              background:
                'linear-gradient(90deg, transparent, #d9cbf2)',
            }}
          />

          {/* تدرج الجهة اليسرى */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: 55,
              zIndex: 2,
              pointerEvents: 'none',
              background:
                'linear-gradient(270deg, transparent, #d9cbf2)',
            }}
          />

          <div
            ref={trackRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: 'max-content',
              minWidth: 'max-content',
              direction: 'ltr',
              whiteSpace: 'nowrap',
              willChange: 'transform',
              transform:
                'translate3d(0, 0, 0)',
            }}
          >
            {[0, 1].map((item) => (
              <span
                key={item}
                aria-hidden={item === 1}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  direction: 'rtl',
                  flexShrink: 0,
                  width: 'max-content',
                  boxSizing: 'border-box',
                  padding:
                    '0 55px',
                  color: '#27416a',
                  fontFamily:
                    'Tajawal, Tajawal, Arial, sans-serif',
                  fontSize: '0.82rem',
                  lineHeight: 1.7,
                  fontWeight: 600,
                }}
              >
                {bannerText}
              </span>
            ))}
          </div>
        </div>

        {/* زر واتساب */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="التواصل مع أناقة ROOZ عبر واتساب"
          className="hero-banner-whatsapp"
          style={{
            flexShrink: 0,
            minHeight: 44,
            padding: '0 15px',
            borderRadius: 13,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            textDecoration: 'none',
            background:
              'linear-gradient(135deg, #2f8e89 0%, #1f6c68 100%)',
            border:
              '1px solid rgb(25, 89, 86,0.28)',
            color: '#ffffff',
            fontFamily:
              'Tajawal, Tajawal, Arial, sans-serif',
            fontSize: '0.78rem',
            fontWeight: 800,
            boxShadow:
              '0 6px 16px rgb(31, 108, 104,0.20)',
            transition:
              'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform =
              'translateY(-2px)';

            event.currentTarget.style.boxShadow =
              '0 9px 20px rgb(31, 108, 104,0.26)';
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform =
              'translateY(0)';

            event.currentTarget.style.boxShadow =
              '0 6px 16px rgb(31, 108, 104,0.20)';
          }}
          onFocus={(event) => {
            event.currentTarget.style.outline =
              '3px solid rgb(31, 108, 104,0.22)';
            event.currentTarget.style.outlineOffset =
              '2px';
          }}
          onBlur={(event) => {
            event.currentTarget.style.outline =
              'none';
          }}
        >
          <MessageCircle
            size={18}
            strokeWidth={1.9}
          />

          <span className="hero-banner-whatsapp-text">
            تواصل عبر واتساب
          </span>

          <ArrowLeft
            size={15}
            strokeWidth={2}
          />
        </a>
      </div>

      {/* الخط السفلي */}
      <div
        aria-hidden="true"
        style={{
          height: 1,
          background:
            'linear-gradient(90deg, transparent, rgb(41, 96, 184,0.42), transparent)',
        }}
      />

      <style>{`
        .hero-banner-whatsapp:hover {
          transform: translateY(-2px);
          box-shadow: 0 9px 20px rgb(31, 108, 104,0.26) !important;
        }

        .hero-banner-whatsapp:active {
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-banner-marquee > div:last-child {
            transform: none !important;
          }

          .hero-banner-whatsapp {
            transition: none !important;
          }
        }

        @media (max-width: 900px) {
          .hero-banner-title {
            width: auto !important;
            min-width: 0 !important;
            flex: 1 1 auto !important;
          }

          .hero-banner-marquee {
            flex: 1 1 100% !important;
            order: 4;
            width: 100%;
          }

          .hero-banner-title {
            max-width: 360px;
          }

          [aria-label="خدمة إضافة المنتجات المستخدمة"] > div:nth-child(2) {
            flex-wrap: wrap !important;
          }
        }

        @media (max-width: 640px) {
          [aria-label="خدمة إضافة المنتجات المستخدمة"] > div:nth-child(2) {
            min-height: 60px !important;
            padding: 8px 12px !important;
            gap: 10px !important;
          }

          [aria-label="خدمة إضافة المنتجات المستخدمة"] > div:nth-child(2) > div:first-child {
            width: 40px !important;
            min-width: 40px !important;
            height: 40px !important;
            border-radius: 12px !important;
          }

          .hero-banner-title {
            display: none !important;
          }

          .hero-banner-marquee {
            order: 2;
            flex: 1 1 0 !important;
            width: auto !important;
            height: 42px !important;
          }

          .hero-banner-whatsapp {
            order: 3;
            min-height: 40px !important;
            width: 42px !important;
            min-width: 42px !important;
            padding: 0 !important;
            border-radius: 12px !important;
            gap: 0 !important;
          }

          .hero-banner-whatsapp-text {
            display: none !important;
          }

          .hero-banner-whatsapp svg:last-child {
            display: none !important;
          }
        }

        @media (max-width: 380px) {
          [aria-label="خدمة إضافة المنتجات المستخدمة"] > div:nth-child(2) {
            padding-left: 8px !important;
            padding-right: 8px !important;
            gap: 7px !important;
          }

          [aria-label="خدمة إضافة المنتجات المستخدمة"] > div:nth-child(2) > div:first-child {
            width: 38px !important;
            min-width: 38px !important;
            height: 38px !important;
          }

          .hero-banner-whatsapp {
            width: 40px !important;
            min-width: 40px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;