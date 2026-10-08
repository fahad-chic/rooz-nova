import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, ShieldCheck } from 'lucide-react';
import { getAuth } from 'firebase/auth';

export const Broadcaster = () => {
  const { userRole, user } = useAuth();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  // فقط صاحب موقع "أناقة ROOZ"
  if (userRole !== 'owner') return null;

  const getOwnerToken = async () => {
    // 1) التوكن المحفوظ عند تسجيل دخول المالك
    const stored = localStorage.getItem('auth_token');
    if (stored) return stored;
    // 2) أو توليد توكن حي من جلسة Firebase الحالية
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
          message,
          sender: user?.email,
          timestamp: new Date().toISOString()
        })
      });

      if (!res.ok) throw new Error('فشل');

      setStatus('تم إرسال البث لجميع العملاء');
      setMessage('');
    } catch {
      setStatus('فشل الإرسال، حاول مرة أخرى');
    }
  };

  return (
    <div className="glass-morphism-gold p-5 rounded-xl mb-6 border border-luxury-gold/40">

      {/* العنوان */}
      <h3 className="text-luxury-gold font-bold text-lg mb-3">
         بث مباشر للعملاء
      </h3>

      {/* صندوق الرسالة */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        className="w-full p-3 rounded-lg bg-black/40 text-white text-sm outline-none border border-luxury-gold/30 focus:border-luxury-gold transition"
        placeholder="اكتب رسالة البث..."
      />

      {/* زر الإرسال */}
      <button
        onClick={sendBroadcast}
        className="mt-3 w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-2 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.03] transition"
      >
        <Send size={18} />
        إرسال البث الآن
      </button>

      {/* حالة الإرسال */}
      {status && (
        <p className="text-xs text-gray-300 mt-2 text-center">
          {status}
        </p>
      )}

      {/* رسالة الأمان الملكية — أسفل الصندوق */}
      <div className="bg-black/30 p-3 rounded-lg text-[11px] text-red-300 mt-4 flex items-start gap-2">
        <ShieldCheck size={16} className="text-luxury-gold" />
        <p>
          تخضع جميع بيانات المستخدمين والزائرين والرسائل الخاصة والمعاملات الداخلية لحماية صارمة
          وتشفير عالمي متقدم
          <span className="text-luxury-gold font-bold">
            (تشفير بموجب بروتوكولات عالمية محمية وسرية ومتعددة الطبقات)
          </span>.
          <br />
          <span className="text-gray-300 italic">
            All user and visitor data is fully encrypted and cannot be accessed by any unauthorized party.
          </span>
        </p>
      </div>
    </div>
  );
};
