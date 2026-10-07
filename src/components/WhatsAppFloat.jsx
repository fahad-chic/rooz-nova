// src/components/WhatsAppFloat.jsx — زر واتساب عائم أسفل يمين الشاشة
// رابط مباشر wa.me بدون أي خدمات خارجية. الموضع: أسفل اليمين حتى لا يتعارض
// مع زر الخروج العائم (أسفل اليسار) ولا مع ودجت علياء (أعلى اليسار).
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WHATSAPP_NUMBER = '966536667222';
const PREFILLED_TEXT = 'السلام عليكم، أتواصل معكم من موقع أناقة ROOZ';

const WhatsAppFloat = () => {
  const [bubbleOpen, setBubbleOpen] = useState(false);

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILLED_TEXT)}`;

  return (
    <div
      dir="rtl"
      style={{
        position: 'fixed',
        bottom: 'max(16px, env(safe-area-inset-bottom, 0px))',
        right: 16,
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 10,
      }}
    >
      {bubbleOpen && (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'linear-gradient(145deg, #fffef9, #f7efdd)',
            border: '1px solid rgba(184, 134, 11, 0.35)',
            borderRadius: 14,
            padding: '10px 14px',
            boxShadow: '0 10px 30px rgba(120, 90, 20, 0.25)',
            textDecoration: 'none',
            maxWidth: 240,
          }}
        >
          <span
            style={{
              fontFamily: 'Tajawal, sans-serif',
              fontSize: 13,
              fontWeight: 700,
              color: '#4a3a12',
              lineHeight: 1.5,
            }}
          >
            تحتاج مساعدة؟
            <br />
            <span style={{ fontWeight: 400, color: '#7c6a3a' }}>
              راسلنا واتساب وسنرد عليك بسرعة
            </span>
          </span>
          <button
            type="button"
            aria-label="إغلاق"
            onClick={(e) => {
              e.preventDefault();
              setBubbleOpen(false);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              color: '#9b8a5a',
            }}
          >
            <X size={14} />
          </button>
        </a>
      )}

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا عبر واتساب"
        onClick={() => setBubbleOpen(false)}
        onMouseEnter={() => setBubbleOpen(true)}
        onFocus={() => setBubbleOpen(true)}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(18, 140, 126, 0.45)',
          textDecoration: 'none',
        }}
      >
        <MessageCircle size={28} color="#fff" fill="#fff" />
      </a>
    </div>
  );
};

export default WhatsAppFloat;