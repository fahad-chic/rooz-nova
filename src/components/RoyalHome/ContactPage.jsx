// src/components/RoyalHome/ContactPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  Mail,
  MessageCircle,
  Camera,
  CreditCard,
  Copy,
  Check,
  ArrowRight,
  Crown,
  Landmark,
} from 'lucide-react';

const CONTACT_INFO = {
  phones: ['00966536667222', '00966507882771'],
  whatsapp: '966536667222',
  email: 'kal6667222@gmail.com',
  snapchat: {
    username: 'pmp.u',
    url: 'https://snapchat.com/t/HPkkIfUp',
  },
};

const BANK_ACCOUNTS = [
  {
    id: 'alrajhi',
    name: 'بنك الراجحي',
    icon: Landmark,
    color: '#00a651',
    iban: 'SA0980000509608010069017',
    account: '09608010069017',
  },
  {
    id: 'arabank',
    name: 'بنك العربي',
    icon: Landmark,
    color: '#0066b2',
    iban: 'SA9830400108088851870011',
    account: '0108088851870011',
  },
];

const GOLD = '#c47a3a';
const GOLD_LIGHT = '#f8e9bb';
const DARK = '#0a0a0f';

const buttonBaseStyle = {
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Tajawal, Arial, sans-serif',
  WebkitTapHighlightColor: 'transparent',
};

const ContactPage = () => {
  const navigate = useNavigate();

  const [copied, setCopied] = useState(null);

  const copyToClipboard = async (text, id) => {
    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
      ) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');

        textArea.value = text;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.pointerEvents = 'none';

        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, textArea.value.length);

        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(id);

      window.setTimeout(() => {
        setCopied((current) => (current === id ? null : current));
      }, 2000);
    } catch (error) {
      console.error('تعذر نسخ النص:', error);
    }
  };

  const openExternalLink = (url) => {
    if (!url) {
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openWhatsApp = (phoneNumber) => {
    const cleanNumber = String(phoneNumber || '').replace(/\D/g, '');

    if (!cleanNumber) {
      return;
    }

    openExternalLink(`https://wa.me/${cleanNumber}`);
  };

  const callPhone = (phoneNumber) => {
    const cleanNumber = String(phoneNumber || '').replace(/\D/g, '');

    if (!cleanNumber) {
      return;
    }

    window.location.href = `tel:+${cleanNumber}`;
  };

  const openSnapchat = () => {
    openExternalLink(CONTACT_INFO.snapchat.url);
  };

  const sectionTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: GOLD_LIGHT,
    margin: '0 0 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'Tajawal, Arial, sans-serif',
  };

  const cardStyle = {
    background:
      'linear-gradient(145deg, rgba(20, 20, 35, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%)',
    border: '1px solid rgba(214, 177, 95, 0.2)',
    borderRadius: 16,
  };

  return (
    <main
      dir="rtl"
      style={{
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        background:
          'linear-gradient(180deg, #0a0a0f 0%, #12121f 30%, #1a1a2e 50%, #0f0f1a 100%)',
        padding: 'clamp(1rem, 4vw, 1.5rem)',
        fontFamily: 'Tajawal, Arial, sans-serif',
        color: GOLD_LIGHT,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 900,
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="العودة إلى الصفحة السابقة"
            style={{
              ...buttonBaseStyle,
              width: 46,
              height: 46,
              flexShrink: 0,
              background: 'rgba(214, 177, 95, 0.15)',
              border: '1px solid rgba(214, 177, 95, 0.3)',
              borderRadius: 12,
              color: GOLD,
            }}
          >
            <ArrowRight size={20} aria-hidden="true" />
          </button>

          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(1.3rem, 4vw, 1.5rem)',
              fontWeight: 800,
              color: GOLD_LIGHT,
              lineHeight: 1.4,
            }}
          >
            اتصل بنا
          </h1>
        </header>

        {/* Welcome Section */}
        <section
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            padding: 'clamp(1.25rem, 4vw, 1.5rem)',
            background:
              'linear-gradient(145deg, rgba(214, 177, 95, 0.08) 0%, transparent 100%)',
            borderRadius: 20,
            border: '1px solid rgba(214, 177, 95, 0.15)',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              background:
                'linear-gradient(135deg, #c47a3a 0%, #b8860b 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 24px rgba(214, 177, 95, 0.3)',
            }}
          >
            <Crown size={32} color={DARK} aria-hidden="true" />
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: 800,
              color: GOLD_LIGHT,
              lineHeight: 1.5,
            }}
          >
            أنـاقـة ROOZ
          </h2>

          <p
            style={{
              margin: '0.5rem 0 0',
              fontSize: '0.9rem',
              color: '#a0a0b0',
              lineHeight: 1.7,
            }}
          >
            نحن هنا لخدمتكم والتواصل معكم
          </p>
        </section>

        {/* Phone Numbers */}
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={sectionTitleStyle}>
            <Phone size={20} color={GOLD} aria-hidden="true" />
            أرقام الهاتف
          </h3>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {CONTACT_INFO.phones.map((phone, index) => {
              const copyId = `phone-${index}`;

              return (
                <div
                  key={phone}
                  style={{
                    ...cardStyle,
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
                      fontWeight: 700,
                      color: GOLD_LIGHT,
                      direction: 'ltr',
                      textAlign: 'right',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {phone}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      flexShrink: 0,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => copyToClipboard(phone, copyId)}
                      aria-label={`نسخ الرقم ${phone}`}
                      style={{
                        ...buttonBaseStyle,
                        width: 42,
                        height: 42,
                        background: 'rgba(214, 177, 95, 0.15)',
                        border: '1px solid rgba(214, 177, 95, 0.3)',
                        borderRadius: 10,
                        color: GOLD,
                      }}
                    >
                      {copied === copyId ? (
                        <Check size={18} color="#22c55e" aria-hidden="true" />
                      ) : (
                        <Copy size={18} color={GOLD} aria-hidden="true" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => callPhone(phone)}
                      aria-label={`اتصل بالرقم ${phone}`}
                      style={{
                        ...buttonBaseStyle,
                        minHeight: 42,
                        padding: '0.6rem 1rem',
                        background:
                          'linear-gradient(135deg, #c47a3a 0%, #b8860b 100%)',
                        borderRadius: 10,
                        gap: '0.5rem',
                        color: '#1a1205',
                      }}
                    >
                      <Phone size={18} aria-hidden="true" />

                      <span
                        style={{
                          color: '#1a1205',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                        }}
                      >
                        اتصال
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openWhatsApp(phone)}
                      style={{
                        ...buttonBaseStyle,
                        minHeight: 42,
                        padding: '0.6rem 1rem',
                        background:
                          'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                        borderRadius: 10,
                        gap: '0.5rem',
                        color: '#fff',
                      }}
                    >
                      <MessageCircle size={18} aria-hidden="true" />

                      <span
                        style={{
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                        }}
                      >
                        واتساب
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* WhatsApp */}
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={sectionTitleStyle}>
            <MessageCircle size={20} color="#25D366" aria-hidden="true" />
            تواصل عبر واتساب
          </h3>

          <button
            type="button"
            onClick={() => openWhatsApp(CONTACT_INFO.whatsapp)}
            style={{
              ...buttonBaseStyle,
              width: '100%',
              minHeight: 88,
              background:
                'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              borderRadius: 16,
              padding: '1.25rem',
              gap: '1rem',
              color: '#fff',
              boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)',
            }}
          >
            <MessageCircle
              size={34}
              color="#fff"
              aria-hidden="true"
            />

            <div
              style={{
                textAlign: 'right',
                minWidth: 0,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: '#fff',
                  lineHeight: 1.5,
                }}
              >
                تواصل الآن عبر واتساب
              </p>

              <p
                style={{
                  margin: '0.25rem 0 0',
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.8)',
                  direction: 'ltr',
                  overflowWrap: 'anywhere',
                }}
              >
                {CONTACT_INFO.phones[0]}
              </p>
            </div>
          </button>
        </section>

        {/* Snapchat */}
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={sectionTitleStyle}>
            <Camera size={20} color="#FFFC00" aria-hidden="true" />
            سناب شات
          </h3>

          <button
            type="button"
            onClick={openSnapchat}
            style={{
              ...buttonBaseStyle,
              width: '100%',
              minHeight: 88,
              background:
                'linear-gradient(135deg, #FFFC00 0%, #E6E600 100%)',
              borderRadius: 16,
              padding: '1.25rem',
              gap: '1rem',
              color: '#000',
              boxShadow: '0 8px 24px rgba(255, 252, 0, 0.3)',
            }}
          >
            <Camera
              size={34}
              color="#000"
              aria-hidden="true"
            />

            <div
              style={{
                textAlign: 'right',
                minWidth: 0,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: '#000',
                  lineHeight: 1.5,
                }}
              >
                تابعنا على سناب شات
              </p>

              <p
                style={{
                  margin: '0.25rem 0 0',
                  fontSize: '0.85rem',
                  color: 'rgba(0,0,0,0.7)',
                }}
              >
                @{CONTACT_INFO.snapchat.username}
              </p>
            </div>
          </button>
        </section>

        {/* Email */}
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={sectionTitleStyle}>
            <Mail size={20} color={GOLD} aria-hidden="true" />
            البريد الإلكتروني
          </h3>

          <div
            style={{
              ...cardStyle,
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 'clamp(0.85rem, 3vw, 1rem)',
                fontWeight: 600,
                color: GOLD_LIGHT,
                direction: 'ltr',
                textAlign: 'right',
                overflowWrap: 'anywhere',
              }}
            >
              {CONTACT_INFO.email}
            </p>

            <button
              type="button"
              onClick={() =>
                copyToClipboard(CONTACT_INFO.email, 'email')
              }
              aria-label="نسخ البريد الإلكتروني"
              style={{
                ...buttonBaseStyle,
                width: 42,
                height: 42,
                flexShrink: 0,
                background: 'rgba(214, 177, 95, 0.15)',
                border: '1px solid rgba(214, 177, 95, 0.3)',
                borderRadius: 10,
              }}
            >
              {copied === 'email' ? (
                <Check size={18} color="#22c55e" aria-hidden="true" />
              ) : (
                <Copy size={18} color={GOLD} aria-hidden="true" />
              )}
            </button>
          </div>
        </section>

        {/* Bank Accounts */}
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={sectionTitleStyle}>
            <CreditCard size={20} color={GOLD} aria-hidden="true" />
            الحسابات البنكية
          </h3>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {BANK_ACCOUNTS.map((bank) => (
              <article
                key={bank.id}
                style={{
                  ...cardStyle,
                  borderColor: `${bank.color}40`,
                  padding: '1.25rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative Circle */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    background: `${bank.color}10`,
                    borderRadius: '50%',
                    pointerEvents: 'none',
                  }}
                />

                {/* Bank Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      flexShrink: 0,
                      background: `${bank.color}20`,
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}
                  >
                    {(() => {
                      const Icon = bank.icon;
                      return Icon ? <Icon size={24} color={bank.color} /> : null;
                    })()}
                  </div>

                  <h4
                    style={{
                      margin: 0,
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: GOLD_LIGHT,
                    }}
                  >
                    {bank.name}
                  </h4>
                </div>

                {/* IBAN */}
                <div
                  style={{
                    marginBottom: '0.75rem',
                    position: 'relative',
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 0.25rem',
                      fontSize: '0.75rem',
                      color: '#e9d9a8',
                      fontWeight: 700,
                    }}
                  >
                    IBAN
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      background: 'linear-gradient(145deg, rgba(214, 177, 95, 0.16), rgba(168, 132, 44, 0.26))',
                      borderRadius: 10,
                      padding: '0.6rem 0.85rem',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        minWidth: 0,
                        fontSize: 'clamp(0.72rem, 2.8vw, 0.9rem)',
                        fontWeight: 600,
                        color: GOLD_LIGHT,
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        direction: 'ltr',
                        letterSpacing: '0.03em',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {bank.iban}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          bank.iban,
                          `iban-${bank.id}`,
                        )
                      }
                      aria-label={`نسخ IBAN الخاص بـ ${bank.name}`}
                      style={{
                        ...buttonBaseStyle,
                        width: 32,
                        height: 32,
                        flexShrink: 0,
                        background: 'transparent',
                        color: bank.color,
                      }}
                    >
                      {copied === `iban-${bank.id}` ? (
                        <Check
                          size={16}
                          color="#22c55e"
                          aria-hidden="true"
                        />
                      ) : (
                        <Copy
                          size={16}
                          color={bank.color}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Account Number */}
                <div style={{ position: 'relative' }}>
                  <p
                    style={{
                      margin: '0 0 0.25rem',
                      fontSize: '0.75rem',
                      color: '#e9d9a8',
                      fontWeight: 700,
                    }}
                  >
                    رقم الحساب (تحويل محلي)
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      background: 'linear-gradient(145deg, rgba(214, 177, 95, 0.16), rgba(168, 132, 44, 0.26))',
                      borderRadius: 10,
                      padding: '0.6rem 0.85rem',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        minWidth: 0,
                        fontSize: 'clamp(0.72rem, 2.8vw, 0.9rem)',
                        fontWeight: 600,
                        color: GOLD_LIGHT,
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        direction: 'ltr',
                        letterSpacing: '0.03em',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {bank.account}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          bank.account,
                          `acc-${bank.id}`,
                        )
                      }
                      aria-label={`نسخ رقم الحساب الخاص بـ ${bank.name}`}
                      style={{
                        ...buttonBaseStyle,
                        width: 32,
                        height: 32,
                        flexShrink: 0,
                        background: 'transparent',
                        color: bank.color,
                      }}
                    >
                      {copied === `acc-${bank.id}` ? (
                        <Check
                          size={16}
                          color="#22c55e"
                          aria-hidden="true"
                        />
                      ) : (
                        <Copy
                          size={16}
                          color={bank.color}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ملخص بيانات التواصل كتابياً — بضغطة نسخ واحدة */}
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={sectionTitleStyle}>
            <Copy size={20} color={GOLD} aria-hidden="true" />
            بيانات التواصل كتابياً
          </h3>

          <div
            style={{
              ...cardStyle,
              padding: '1.25rem',
            }}
          >
            <pre
              dir="rtl"
              style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'Tajawal, Arial, sans-serif',
                fontSize: '0.88rem',
                lineHeight: 2,
                color: GOLD_LIGHT,
              }}
            >
{`أرقام التواصل: 00966536667222 / 00966507882771
البريد الإلكتروني: kal6667222@gmail.com
سناب شات: pmp.u
مصرف الراجحي — آيبان: SA0980000509608010069017 — حساب محلي: 09608010069017
البنك العربي — آيبان: SA9830400108088851870011 — حساب محلي: 0108088851870011`}
            </pre>

            <button
              type="button"
              onClick={() =>
                copyToClipboard(
                  'أرقام التواصل: 00966536667222 / 00966507882771\nالبريد الإلكتروني: kal6667222@gmail.com\nسناب شات: pmp.u\nمصرف الراجحي — آيبان: SA0980000509608010069017 — حساب محلي: 09608010069017\nالبنك العربي — آيبان: SA9830400108088851870011 — حساب محلي: 0108088851870011',
                  'contact-summary'
                )
              }
              style={{
                ...buttonBaseStyle,
                marginTop: '0.75rem',
                width: '100%',
                minHeight: 44,
                background: 'rgba(214, 177, 95, 0.15)',
                border: '1px solid rgba(214, 177, 95, 0.3)',
                borderRadius: 10,
                color: GOLD,
                gap: '0.5rem',
              }}
            >
              {copied === 'contact-summary' ? (
                <Check size={18} color="#22c55e" aria-hidden="true" />
              ) : (
                <Copy size={18} color={GOLD} aria-hidden="true" />
              )}
              <span style={{ fontWeight: 700 }}>
                {copied === 'contact-summary' ? 'تم النسخ' : 'نسخ كل البيانات'}
              </span>
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            padding: '1.5rem 0.5rem',
            borderTop: '1px solid rgba(214, 177, 95, 0.15)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.85rem',
              color: '#e9d9a8',
                      fontWeight: 700,
              lineHeight: 1.7,
            }}
          >
            جميع الحقوق محفوظة © أناقة ROOZ 2026
          </p>
        </footer>
      </div>
    </main>
  );
};

export default ContactPage;