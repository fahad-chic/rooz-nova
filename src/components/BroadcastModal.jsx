// نافذة «رسالة البث» — تظهر من خيار صاحب الموقع في الترويسة.

import React, { useState } from 'react';
import { X, Send, Megaphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';

const BroadcastModal = ({ onClose }) => {
  const { userRole, user } = useAuth();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  if (userRole !== 'owner') return null;

  const getOwnerToken = async () => {
    const stored = localStorage.getItem('auth_token');
    if (stored) return stored;
    const authInstance = getAuth();
    if (authInstance?.currentUser) {
      return authInstance.currentUser.getIdToken();
    }
    return null;
  };

  const sendBroadcast = async () => {
    if (!message.trim()) return;
    setStatus('جاري الإرسال...');
    try {
      const token = await getOwnerToken();
      if (!token) {
        setStatus('يتطلب تسجيل دخول صاحب الموقع أولاً');
        return;
      }
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: message.trim(),
          sender: user?.email,
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'تعذر حفظ البث');
      }
      setStatus('تم إرسال البث لجميع الزوار');
      setMessage('');
    } catch (err) {
      console.error('broadcast error:', err);
      setStatus('فشل الإرسال، حاول مرة أخرى');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgb(9, 6, 27, 0.72)',
        backdropFilter: 'blur(8px)',
        padding: '1rem',
        fontFamily: 'Cairo, sans-serif',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          background: 'linear-gradient(145deg, #e1d8f5 0%, #cebef4 100%)',
          borderRadius: 20,
          border: '1px solid rgb(75, 31, 181,0.35)',
          boxShadow: '0 24px 60px rgb(9, 6, 27, 0.45)',
          padding: '1.4rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <strong
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#0b0822',
              fontSize: '1.05rem',
              fontWeight: 800,
            }}
          >
            <Megaphone size={20} color="#1d4ed8" />
            رسالة البث
          </strong>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            style={{
              background: 'rgb(75, 31, 181,0.12)',
              border: 'none',
              borderRadius: 10,
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} color="#0b0822" />
          </button>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب رسالة البث التي ستظهر في الصفحة الرئيسية فقط"
          rows={4}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: 'rgb(255, 255, 255,0.7)',
            border: '1px solid rgb(75, 31, 181,0.35)',
            borderRadius: 12,
            padding: '0.85rem',
            fontSize: '0.95rem',
            lineHeight: '1.7',
            color: '#0c0926',
            fontFamily: 'inherit',
            outline: 'none',
            resize: 'vertical',
          }}
        />

        <button
          type="button"
          onClick={sendBroadcast}
          disabled={!message.trim()}
          style={{
            width: '100%',
            marginTop: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#0b0821',
            border: 'none',
            borderRadius: 12,
            padding: '0.8rem',
            fontSize: '0.95rem',
            fontWeight: 800,
            cursor: message.trim() ? 'pointer' : 'not-allowed',
            opacity: message.trim() ? 1 : 0.55,
          }}
        >
          <Send size={17} />
          إرسال البث
        </button>

        {status && (
          <p
            style={{
              marginTop: '0.7rem',
              textAlign: 'center',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: status.includes('تم') ? '#178081' : '#5e0eaf',
            }}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default BroadcastModal;