// src/components/RoyalHome/AddToHomeSection.jsx
import React, { useState } from 'react';
import { Smartphone, X, Share, PlusSquare, MoreVertical } from 'lucide-react';

const STEPS = [
  {
    os: 'آيفون / آيباد (Safari)',
    icon: Share,
    steps: [
      'افتح الموقع في متصفح Safari.',
      'اضغط زر المشاركة (مربع بداخله سهم) أسفل الشاشة.',
      'اختر «إضافة إلى الشاشة الرئيسية» ثم اضغط «إضافة».',
    ],
  },
  {
    os: 'أندرويد (Chrome)',
    icon: MoreVertical,
    steps: [
      'افتح الموقع في متصفح Chrome.',
      'اضغط قائمة النقاط الثلاث أعلى الشاشة.',
      'اختر «إضافة إلى الشاشة الرئيسية» ثم اضغط «تثبيت».',
    ],
  },
];

const AddToHomeSection = () => {
  const [open, setOpen] = useState(false);

  return (
    <section
      dir="rtl"
      aria-labelledby="a2hs-title"
      style={{
        width: '100%',
        marginTop: '0.6rem',
        padding: '0.75rem 0.85rem',
        boxSizing: 'border-box',
        background: 'linear-gradient(145deg, #f8f6fb 0%, #e6dff5 55%, #dacff3 100%)',
        border: '1px solid rgb(64, 15, 180, 0.3)',
        borderRadius: 14,
        boxShadow: '0 4px 14px rgb(57, 17, 148, 0.08)',
        textAlign: 'center',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      <Smartphone
        size={22}
        color="#400fb4"
        style={{ margin: '0 auto 0.3rem', display: 'block' }}
      />
      <h2
        id="a2hs-title"
        style={{
          margin: '0 0 0.2rem',
          fontSize: '0.95rem',
          fontWeight: 800,
          color: '#200d4f',
        }}
      >
        أضف المتجر لشاشة هاتفك
      </h2>
      <p
        style={{
          margin: '0 auto 0.55rem',
          maxWidth: 400,
          fontSize: '0.78rem',
          color: '#45298d',
          lineHeight: 1.5,
        }}
      >
        ثبّت أناقة ROOZ كأيقونة على شاشة هاتفك — تفتح مباشرة كتطبيق مستقل بملء الشاشة وبدون شريط المتصفح.
      </p>

      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          padding: '0.45rem 1.1rem',
          borderRadius: 10,
          border: 'none',
          background: 'linear-gradient(135deg, #7b29d5 0%, #4b1fb5 100%)',
          color: '#0b0822',
          fontWeight: 800,
          fontSize: '0.8rem',
          cursor: 'pointer',
          fontFamily: 'Cairo, sans-serif',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 3px 10px rgb(75, 31, 181, 0.3)',
        }}
      >
        <PlusSquare size={14} />
        كيف أضيف المتجر؟
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="خطوات إضافة المتجر للشاشة الرئيسية"
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgb(13, 9, 39, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5000,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(145deg, #f4f1f9, #e0d7f5)',
              border: '1px solid rgb(64, 15, 180, 0.45)',
              borderRadius: 18,
              padding: '1.2rem 1.1rem',
              maxWidth: 400,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              textAlign: 'right',
              boxShadow: '0 20px 50px rgb(15, 11, 46, 0.35)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.8rem',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#200d4f',
                }}
              >
                خطوات التثبيت
              </h3>
              <button
                type="button"
                aria-label="إغلاق"
                onClick={() => setOpen(false)}
                style={{
                  background: 'rgb(64, 15, 180, 0.12)',
                  border: '1px solid rgb(64, 15, 180, 0.35)',
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#290d71',
                }}
              >
                <X size={15} />
              </button>
            </div>

            {STEPS.map(({ os, icon: Icon, steps }) => (
              <div
                key={os}
                style={{
                  background: 'rgb(255, 255, 255, 0.65)',
                  border: '1px solid rgb(64, 15, 180, 0.25)',
                  borderRadius: 12,
                  padding: '0.7rem 0.85rem',
                  marginBottom: '0.55rem',
                }}
              >
                <p
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    margin: '0 0 0.35rem',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: '#3a1496',
                  }}
                >
                  <Icon size={14} />
                  {os}
                </p>
                <ol
                  style={{
                    margin: 0,
                    paddingInlineStart: '1.1rem',
                    color: '#2e1666',
                    fontSize: '0.8rem',
                    lineHeight: 1.7,
                  }}
                >
                  {steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}

            <p
              style={{
                margin: '0.55rem 0 0',
                fontSize: '0.75rem',
                color: '#5839a3',
                textAlign: 'center',
              }}
            >
              بعد التثبيت ستجد أيقونة «أناقة ROOZ» على شاشتك الرئيسية.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default AddToHomeSection;