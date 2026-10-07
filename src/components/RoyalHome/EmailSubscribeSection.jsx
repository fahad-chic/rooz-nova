// src/components/RoyalHome/EmailSubscribeSection.jsx
import React, { useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { db } from '../../firebase/config';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EmailSubscribeSection = () => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!EMAIL_RE.test(cleanEmail)) {
      setState('error');
      setMessage('يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }

    setState('loading');
    setMessage('');

    try {
      const ref = doc(db, 'subscribers', cleanEmail);
      const existing = await getDoc(ref);

      if (existing.exists()) {
        setState('duplicate');
        setMessage('بريدك مسجل مسبقاً — ستصلك عروضنا الجديدة.');
        return;
      }

      await setDoc(ref, {
        email: cleanEmail,
        subscribedAt: serverTimestamp(),
        source: 'home-page',
      });

      setState('success');
      setMessage('تم الاشتراك بنجاح! ستصلك أحدث العروض والخصومات.');
      setEmail('');
    } catch (error) {
      console.error('subscribe error:', error);
      setState('error');
      setMessage('تعذر الاشتراك حالياً — تحقق من اتصالك وحاول مرة أخرى.');
    }
  };

  const isSuccess = state === 'success' || state === 'duplicate';

  return (
    <section
      dir="rtl"
      aria-labelledby="subscribe-title"
      style={{
        width: '100%',
        marginTop: '0.55rem',
        padding: '0.75rem 0.85rem',
        boxSizing: 'border-box',
        background: 'linear-gradient(145deg, #f8f6fb 0%, #e3dbf5 55%, #d7caf3 100%)',
        border: '1px solid rgb(64, 15, 180, 0.3)',
        borderRadius: 14,
        boxShadow: '0 4px 14px rgb(57, 17, 148, 0.08)',
        textAlign: 'center',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      <Mail
        size={22}
        color="#400fb4"
        style={{ margin: '0 auto 0.3rem', display: 'block' }}
      />
      <h2
        id="subscribe-title"
        style={{
          margin: '0 0 0.2rem',
          fontSize: '0.95rem',
          fontWeight: 800,
          color: '#200d4f',
        }}
      >
        عروضنا توصلك أول بأول
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
        سجّل بريدك الإلكتروني ليصلك جديد التشكيلات والخصومات الحصرية قبل الجميع.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 6,
          maxWidth: 420,
          margin: '0 auto',
        }}
      >
        <input
          type="email"
          dir="ltr"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== 'idle') {
              setState('idle');
              setMessage('');
            }
          }}
          placeholder="example@email.com"
          aria-label="البريد الإلكتروني"
          disabled={state === 'loading'}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '0.45rem 0.75rem',
            borderRadius: 10,
            border: '1px solid rgb(64, 15, 180, 0.35)',
            background: '#f7f6fb',
            fontSize: '0.8rem',
            fontFamily: 'Cairo, sans-serif',
            color: '#200d4f',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          style={{
            padding: '0.45rem 0.95rem',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #7b29d5 0%, #4b1fb5 100%)',
            color: '#0b0822',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: state === 'loading' ? 'default' : 'pointer',
            fontFamily: 'Cairo, sans-serif',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            boxShadow: '0 3px 10px rgb(75, 31, 181, 0.3)',
          }}
        >
          {state === 'loading' ? (
            <Loader2 size={14} className="spin" />
          ) : (
            <Mail size={14} />
          )}
          اشترك
        </button>
      </form>

      {message && (
        <p
          role="status"
          style={{
            margin: '0.5rem auto 0',
            maxWidth: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            fontSize: '0.78rem',
            fontWeight: 700,
            color: isSuccess ? '#247e87' : '#c1203e',
          }}
        >
          {isSuccess && <CheckCircle2 size={13} />}
          {message}
        </p>
      )}
    </section>
  );
};

export default EmailSubscribeSection;