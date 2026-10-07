import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/config";
import { Mail, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail) {
      setError('يرجى إدخال بريدك الإلكتروني');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
      setSuccess('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
    } catch (err) {
      setError('خطأ: تأكد من صحة البريد أو أن الحساب غير موجود');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <div style={brandMark}>
          <Mail size={25} />
        </div>

        <h1 style={title}>استعادة كلمة المرور</h1>

        <p style={subtitle}>
          أدخل بريدك الإلكتروني وسنرسل لك رابط لتعيين كلمة مرور جديدة
        </p>

        {error && (
          <div style={alertError} role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={alertSuccess} role="status">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleReset}>
          <label style={label}>البريد الإلكتروني</label>

          <div style={inputWrapper}>
            <Mail size={18} style={inputIcon} />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
              inputMode="email"
              placeholder="example@email.com"
              style={input}
            />
          </div>

          <button
            type="submit"
            style={{
              ...submitBtn,
              ...(loading ? submitBtnDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
          </button>
        </form>

        <button
          type="button"
          style={backBtn}
          onClick={() => navigate('/login')}
        >
          <ArrowRight size={16} />
          الرجوع لتسجيل الدخول
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;

const page = {
  minHeight: '100vh',
  background:
    'radial-gradient(circle at 50% 20%, rgba(201,169,97,0.10), transparent 35%), linear-gradient(135deg, #0b0b0b, #181818)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  fontFamily: 'Tajawal, sans-serif',
  direction: 'rtl',
  boxSizing: 'border-box'
};

const card = {
  background: 'linear-gradient(145deg, #151515, #0d0d0d)',
  padding: '2rem',
  borderRadius: 20,
  width: '100%',
  maxWidth: 420,
  border: '1px solid rgba(201,169,97,0.28)',
  boxShadow: '0 20px 55px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
  textAlign: 'center',
  boxSizing: 'border-box'
};

const brandMark = {
  width: 54,
  height: 54,
  margin: '0 auto 14px',
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#e2c477',
  background: 'rgba(201,169,97,0.10)',
  border: '1px solid rgba(201,169,97,0.28)',
  boxShadow: '0 8px 24px rgba(201,169,97,0.08)'
};

const title = {
  color: '#c47a3a',
  fontSize: 26,
  fontWeight: 800,
  margin: '0 0 10px'
};

const subtitle = {
  color: '#aaa',
  fontSize: 14,
  lineHeight: 1.8,
  margin: '0 0 20px'
};

const label = {
  color: '#f8e9bb',
  fontSize: 14,
  fontWeight: 600,
  textAlign: 'right',
  display: 'block',
  marginBottom: 6
};

const inputWrapper = {
  position: 'relative',
  marginBottom: 20
};

const inputIcon = {
  position: 'absolute',
  top: '50%',
  left: 12,
  transform: 'translateY(-50%)',
  color: '#c9a961',
  pointerEvents: 'none'
};

const input = {
  width: '100%',
  padding: '12px 12px 12px 40px',
  borderRadius: 10,
  border: '1px solid rgba(201,169,97,0.22)',
  background: '#1a1a1a',
  color: '#fff',
  fontSize: 15,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box'
};

const submitBtn = {
  width: '100%',
  padding: 14,
  background: 'linear-gradient(135deg, #c47a3a, #8d6d1d)',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  fontWeight: 700,
  cursor: 'pointer',
  marginTop: 10,
  fontSize: 15,
  fontFamily: 'inherit',
  transition: 'opacity 0.2s ease, transform 0.2s ease'
};

const submitBtnDisabled = {
  opacity: 0.6,
  cursor: 'not-allowed'
};

const backBtn = {
  margin: '20px auto 0',
  background: 'none',
  border: 'none',
  color: '#c9a961',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  fontSize: 14,
  fontFamily: 'inherit'
};

const alertError = {
  background: 'rgba(239,68,68,0.12)',
  border: '1px solid rgba(239,68,68,0.22)',
  color: '#ffb3b3',
  padding: '10px 12px',
  borderRadius: 10,
  marginBottom: 15,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 14,
  textAlign: 'right'
};

const alertSuccess = {
  background: 'rgba(16,185,129,0.12)',
  border: '1px solid rgba(16,185,129,0.22)',
  color: '#b6f5d8',
  padding: '10px 12px',
  borderRadius: 10,
  marginBottom: 15,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 14,
  textAlign: 'right'
};