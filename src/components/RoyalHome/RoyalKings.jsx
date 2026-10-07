// src/components/RoyalHome/RoyalKings.jsx
import React from 'react';
import {
  BadgeCheck,
  LayoutGrid,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Search,
  ShoppingBag,
} from 'lucide-react';

const RoyalKings = () => {
  const features = [
    {
      id: 'organized',
      icon: LayoutGrid,
      title: 'تصفح منظم',
      description:
        'أقسام واضحة وفروع مرتبة تساعدك على الوصول إلى ما تبحث عنه بسرعة.',
    },
    {
      id: 'curated',
      icon: Sparkles,
      title: 'اختيارات أنيقة',
      description:
        'تجربة عرض مصممة لتجعل اكتشاف المنتجات أكثر وضوحاً وأناقة.',
    },
    {
      id: 'direct-contact',
      icon: MessageCircle,
      title: 'تواصل مباشر',
      description:
        'إمكانية التواصل بسهولة عند الحاجة إلى المساعدة أو الاستفسار.',
    },
    {
      id: 'secure',
      icon: ShieldCheck,
      title: 'تجربة موثوقة',
      description:
        'واجهة واضحة ومعلومات منظمة تمنحك تجربة استخدام أكثر راحة وثقة.',
    },
  ];

  const steps = [
    {
      id: 'browse',
      icon: Search,
      number: '01',
      title: 'اكتشف',
      description: 'استعرض الأقسام واختر الفئة المناسبة.',
    },
    {
      id: 'choose',
      icon: BadgeCheck,
      number: '02',
      title: 'اختر',
      description: 'تصفح المنتجات وابحث عن القطعة المناسبة.',
    },
    {
      id: 'contact',
      icon: MessageCircle,
      number: '03',
      title: 'تواصل',
      description: 'تواصل مع البائع أو الجهة المناسبة عند الحاجة.',
    },
    {
      id: 'enjoy',
      icon: ShoppingBag,
      number: '04',
      title: 'استمتع',
      description: 'استكمل تجربتك داخل أناقة ROOZ بكل سهولة.',
    },
  ];

  return (
    <section
      dir="rtl"
      aria-labelledby="chic-experience-title"
      style={{
        position: 'relative',
        overflow: 'hidden',
        marginTop: '2.25rem',
        padding: 'clamp(1.1rem, 3vw, 2rem)',
        borderRadius: 26,
        background:
          'linear-gradient(145deg, #fdfbf7 0%, #fdfbf7 48%, #f3e0dd 100%)',
        border: '1px solid rgba(61, 15, 24,0.22)',
        boxShadow:
          '0 14px 38px rgba(61, 15, 24,0.10), inset 0 1px 0 rgba(255, 255, 255,0.95)',
      }}
    >
      {/* زخرفة خلفية هادئة */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -120,
          left: -90,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(61, 15, 24,0.13) 0%, rgba(61, 15, 24,0.04) 42%, transparent 72%)',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: -120,
          bottom: -150,
          width: 340,
          height: 340,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(61, 15, 24,0.10) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          paddingBottom: 18,
          marginBottom: 18,
          borderBottom: '1px solid rgba(61, 15, 24,0.16)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              minWidth: 48,
              borderRadius: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(145deg, #fdfbf7 0%, #d4a5a5 100%)',
              color: '#6b1d2f',
              border: '1px solid rgba(61, 15, 24,0.28)',
              boxShadow:
                '0 6px 16px rgba(61, 15, 24,0.12), inset 0 1px 0 rgba(255, 255, 255,0.95)',
            }}
          >
            <Sparkles size={23} strokeWidth={1.7} />
          </div>

          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                marginBottom: 2,
                color: '#6b1d2f',
                fontFamily: 'Tajawal, Tajawal, Arial, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.02em',
              }}
            >
              تجربة أناقة ROOZ
            </p>

            <h2
              id="chic-experience-title"
              style={{
                margin: 0,
                color: '#1f1116',
                fontFamily: 'Tajawal, Tajawal, Arial, sans-serif',
                fontSize: 'clamp(1.08rem, 2.5vw, 1.4rem)',
                lineHeight: 1.55,
                fontWeight: 900,
              }}
            >
              تفاصيل صغيرة تصنع تجربة أكبر
            </h2>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            flexShrink: 0,
            padding: '7px 11px',
            borderRadius: 999,
            background: 'rgba(255, 255, 255,0.58)',
            border: '1px solid rgba(61, 15, 24,0.18)',
            color: '#6b1d2f',
            fontFamily: 'Tajawal, Tajawal, Arial, sans-serif',
            fontSize: '0.72rem',
            fontWeight: 800,
          }}
        >
          <BadgeCheck size={15} strokeWidth={1.8} />
          <span>مصمم بعناية</span>
        </div>
      </div>

      {/* Feature Cards */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: 12,
        }}
      >
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.id}
              style={{
                minWidth: 0,
                padding: '1rem',
                borderRadius: 17,
                background:
                  'rgba(253, 251, 247,0.72)',
                border: '1px solid rgba(61, 15, 24,0.16)',
                boxShadow:
                  '0 5px 16px rgba(61, 15, 24,0.055), inset 0 1px 0 rgba(255, 255, 255,0.85)',
                transition:
                  'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform =
                  'translateY(-3px)';
                event.currentTarget.style.boxShadow =
                  '0 10px 24px rgba(61, 15, 24,0.11), inset 0 1px 0 rgba(255, 255, 255,0.9)';
                event.currentTarget.style.borderColor =
                  'rgba(61, 15, 24,0.30)';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform =
                  'translateY(0)';
                event.currentTarget.style.boxShadow =
                  '0 5px 16px rgba(61, 15, 24,0.055), inset 0 1px 0 rgba(255, 255, 255,0.85)';
                event.currentTarget.style.borderColor =
                  'rgba(61, 15, 24,0.16)';
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  marginBottom: 12,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background:
                    'linear-gradient(145deg, #fdfbf7, #f3e0dd)',
                  color: '#6b1d2f',
                  border: '1px solid rgba(61, 15, 24,0.20)',
                }}
              >
                <Icon size={19} strokeWidth={1.75} />
              </div>

              <h3
                style={{
                  margin: '0 0 5px',
                  color: '#1f1116',
                  fontFamily:
                    'Tajawal, Tajawal, Arial, sans-serif',
                  fontSize: '0.9rem',
                  lineHeight: 1.55,
                  fontWeight: 800,
                }}
              >
                {feature.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: '#6b1d2f',
                  fontFamily:
                    'Tajawal, Tajawal, Arial, sans-serif',
                  fontSize: '0.76rem',
                  lineHeight: 1.85,
                  fontWeight: 500,
                }}
              >
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>

      {/* Shopping Journey */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          marginTop: 18,
          padding: '1rem',
          borderRadius: 18,
          background:
            'linear-gradient(135deg, rgba(61, 15, 24,0.08), rgba(255, 255, 255,0.45))',
          border: '1px solid rgba(61, 15, 24,0.14)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                color: '#1f1116',
                fontFamily:
                  'Tajawal, Tajawal, Arial, sans-serif',
                fontSize: '0.92rem',
                fontWeight: 800,
              }}
            >
              رحلة التسوق في ROOZ
            </h3>

            <p
              style={{
                margin: '3px 0 0',
                color: '#6b1d2f',
                fontFamily:
                  'Tajawal, Tajawal, Arial, sans-serif',
                fontSize: '0.7rem',
                fontWeight: 500,
              }}
            >
              أربع خطوات بسيطة لتجربة أكثر سلاسة
            </p>
          </div>

          <ArrowLeft
            size={19}
            strokeWidth={1.7}
            color="#6b1d2f"
            aria-hidden="true"
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: 8,
          }}
        >
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 9,
                  minWidth: 0,
                  padding: '0.7rem',
                  borderRadius: 13,
                  background: 'rgba(255, 255, 255,0.52)',
                  border:
                    '1px solid rgba(61, 15, 24,0.11)',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    minWidth: 32,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fdfbf7',
                    color: '#6b1d2f',
                    border:
                      '1px solid rgba(61, 15, 24,0.16)',
                  }}
                >
                  <Icon size={15} strokeWidth={1.8} />
                </div>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 2,
                    }}
                  >
                    <span
                      style={{
                        color: '#6b1d2f',
                        fontFamily:
                          'Tajawal, Tajawal, Arial, sans-serif',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                      }}
                    >
                      {step.number}
                    </span>

                    <strong
                      style={{
                        color: '#1f1116',
                        fontFamily:
                          'Tajawal, Tajawal, Arial, sans-serif',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                      }}
                    >
                      {step.title}
                    </strong>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: '#6b1d2f',
                      fontFamily:
                        'Tajawal, Tajawal, Arial, sans-serif',
                      fontSize: '0.65rem',
                      lineHeight: 1.7,
                      fontWeight: 500,
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          [aria-labelledby="chic-experience-title"] {
            border-radius: 20px !important;
            padding: 1rem !important;
          }

          [aria-labelledby="chic-experience-title"] > div:nth-child(4) {
            display: none !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [aria-labelledby="chic-experience-title"] article {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default RoyalKings;