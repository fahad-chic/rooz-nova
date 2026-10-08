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
    'radial-gradient(circle at 50% 20%, rgba(42, 11, 21,0.10), transparent 40%), linear-gradient(135deg, #fffdf8, #fffdf8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  fontFamily: 'Tajawal, sans-serif',
  direction: 'rtl',
  boxSizing: 'border-box'
};

const card = {
  background: '#ffffff',
  padding: '2rem',
  borderRadius: 20,
  width: '100%',
  maxWidth: 420,
  border: '1px solid rgba(24, 19, 22,0.08)',
  boxShadow: '0 20px 55px rgba(24, 19, 22,0.12), inset 0 1px 0 rgba(255, 255, 255,0.6)',
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
  color: '#541426',
  background: 'rgba(42, 11, 21,0.10)',
  border: '1px solid rgba(42, 11, 21,0.25)',
  boxShadow: '0 8px 24px rgba(42, 11, 21,0.08)'
};

const title = {
  color: '#181316',
  fontSize: 26,
  fontWeight: 900,
  margin: '0 0 10px'
};

const subtitle = {
  color: '#766d72',
  fontSize: 14,
  lineHeight: 1.8,
  margin: '0 0 20px'
};

const label = {
  color: '#181316',
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
  color: '#541426',
  pointerEvents: 'none'
};

const input = {
  width: '100%',
  padding: '12px 12px 12px 40px',
  borderRadius: 10,
  border: '1px solid rgba(24, 19, 22,0.14)',
  background: '#fffdf8',
  color: '#181316',
  fontSize: 15,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box'
};

const submitBtn = {
  width: '100%',
  padding: 14,
  background: 'linear-gradient(135deg, #541426, #541426)',
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
  color: '#541426',
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
  background: '#fef2f2',
  border: '1px solid rgba(42, 11, 21,0.25)',
  color: '#541426',
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
  background: '#f7f1e6',
  border: '1px solid rgba(24, 19, 22,0.25)',
  color: '#766d72',
  padding: '10px 12px',
  borderRadius: 10,
  marginBottom: 15,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 14,
  textAlign: 'right'
};