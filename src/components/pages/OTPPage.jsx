// src/components/pages/OTPPage.jsx — سجلات عمليات التحقق والدخول
// صفحة المالك لمراقبة سجلات الدخول (تُقرأ من مجموعة logs المقيّدة بالمالك).
// كانت سابقاً مكون OTP مكسوراً (email-link بلا بريد — يستدعي Firebase API
// بخطأ كل تحميل، ومنطقه لا يطابق نظام OTP الفعلي في OtpModal)، فأُعيدت
// كتابتها لتطابق غرض رابط «سجلات التحقق» في بوابة المالك.
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { isAdminEmail } from '../../firebase';
import { ShieldCheck, ShieldX, ScrollText } from 'lucide-react';

const OTPPage = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [forbidden, setForbidden] = useState(false);
  const isOwner = isAdminEmail(user?.email);

  useEffect(() => {
    if (!isOwner) return undefined;
    const q = query(collection(db, 'logs'), orderBy('time', 'desc'), limit(100));
    const unsub = onSnapshot(
      q,
      (snap) => setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      () => setForbidden(true)
    );
    return () => unsub();
  }, [isOwner]);

  if (!isOwner || forbidden) {
    return (
      <div className="min-h-screen w-full marble-bg flex items-center justify-center p-4">
        <div style={{ textAlign: 'center', color: '#3b82f6' }}>
          <ShieldX size={48} style={{ margin: '0 auto 12px' }} />
          <p>سجلات التحقق متاحة لصاحب الموقع فقط</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full marble-bg p-4 font-Tajawal" dir="rtl">
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h1
          style={{
            color: '#3b82f6',
            fontSize: 22,
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <ScrollText size={24} /> سجلات التحقق والدخول
        </h1>

        <div
          className="glass-morphism-gold"
          style={{ padding: 12, borderRadius: 10, fontSize: 12, color: '#c7dbfe', marginBottom: 16 }}
        >
          <ShieldCheck size={14} style={{ verticalAlign: 'middle', marginLeft: 6 }} />
          تعرض هذه الصفحة آخر 100 عملية مسجّلة في سجل الموقع — للمالك فقط.
        </div>

        {logs.length === 0 && (
          <p style={{ color: '#a8bce0', textAlign: 'center', padding: 24 }}>
            لا توجد سجلات بعد
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {logs.map((log) => (
            <div
              key={log.id}
              className="glass-morphism-gold"
              style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13 }}
            >
              <div style={{ color: '#3b82f6', fontWeight: 700 }}>{log.action || 'حدث'}</div>
              <div style={{ color: '#c7dbfe', marginTop: 2 }}>{log.target || '—'}</div>
              <div style={{ color: '#72768a', fontSize: 11, marginTop: 4 }}>
                {log.by ? `بواسطة: ${log.by} — ` : ''}
                {log.time?.toDate
                  ? log.time.toDate().toLocaleString('ar-SA')
                  : '—'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
