// src/pages/WantedDressPage.jsx
// ميزة "طلب فستان" — تنشر المشترية مواصفاتها ليرسل النظام تنبيهاً للمعلنين.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Send, Loader2, CircleCheck, Sparkles } from 'lucide-react';
import { db, auth } from '../firebase/config';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { ensureFirebaseSession } from '../utils/firebaseSession';
import { notifyOwner } from '../utils/visitorNotify';
import { SIZE_FIELDS } from '../utils/dressMeta';

const COLORS = ['أبيض', 'أحمر', 'أسود', 'ذهبي', 'وردي', 'أزرق', 'أخضر', 'بنفسجي', 'بيج', 'أخرى'];

const emptyForm = {
  title: '',
  color: '',
  budget: '',
  eventDate: '',
  bust: '',
  waist: '',
  hip: '',
  length: '',
  notes: '',
};

export default function WantedDressPage() {
  const navigate = useNavigate();
  const [harajUser, setHarajUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('harajUser');
      if (stored) setHarajUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem('harajUser');
    }
  }, []);

  useEffect(() => {
    if (!db) return undefined;
    let unsub = null;
    (async () => {
      try {
        await ensureFirebaseSession();
        unsub = onSnapshot(
          query(collection(db, 'wanted_dresses'), orderBy('createdAt', 'desc'), limit(12)),
          (snap) => setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
          () => {}
        );
      } catch {
        /* العرض العام غير حرج */
      }
    })();
    return () => unsub && unsub();
  }, []);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'اكتبي وصفاً موجزاً للفستان المطلوب';
    if (!form.color) next.color = 'اختاري اللون';
    if (!(Number(form.budget) > 0)) next.budget = 'أدخلي ميزانية تقديرية';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    if (!harajUser) {
      navigate('/haraj');
      return;
    }
    setSubmitting(true);
    try {
      await ensureFirebaseSession();
      const payload = {
        title: form.title.trim(),
        color: form.color,
        budget: Number(form.budget),
        eventDate: form.eventDate || '',
        bust: form.bust ? Number(form.bust) : null,
        waist: form.waist ? Number(form.waist) : null,
        hip: form.hip ? Number(form.hip) : null,
        length: form.length ? Number(form.length) : null,
        notes: form.notes.trim(),
        status: 'open',
        userName: harajUser.name || harajUser.userName || 'مشترية',
        userPhone: harajUser.phone || harajUser.userPhone || '',
        userEmail: harajUser.email || harajUser.userEmail || '',
        userId: harajUser.uid || auth?.currentUser?.uid || '',
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'wanted_dresses'), payload);
      notifyOwner(
        'طلب فستان جديد',
        `${payload.userName} تطلب فستاناً: ${payload.title} — اللون ${payload.color} — الميزانية ${payload.budget.toLocaleString()} ريال`
      );
      setDone(true);
      setForm(emptyForm);
    } catch {
      setErrors({ submit: 'تعذّر نشر الطلب، حاولي مرة أخرى.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fffdf8 0%, #fffdf8 55%, #f7f1e6 100%)',
        fontFamily: 'Tajawal, sans-serif',
        color: '#181316',
        padding: '1.25rem',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: '0 auto 12px',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, #e3c878, #541426)',
              boxShadow: '0 10px 24px rgba(84, 20, 38, 0.28)',
            }}
          >
            <Heart size={30} color="#fffdf8" />
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', fontWeight: 900, color: '#2a0b15' }}>
            طلب فستان
          </h1>
          <p style={{ margin: 0, color: '#766d72', fontWeight: 600 }}>
            انشري مواصفات الفستان الذي تبحثين عنه، وسيصل تنبيه للمعلنين الذين يملكون فساتين مطابقة.
          </p>
        </header>

        {done && (
          <div
            style={{
              background: 'rgba(47, 125, 91, 0.10)',
              border: '1px solid rgba(47, 125, 91, 0.35)',
              color: '#2f7d5b',
              borderRadius: 14,
              padding: '12px 16px',
              marginBottom: 14,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <CircleCheck size={18} /> تم نشر طلبك بنجاح، وسيصل تنبيه للمعلنين المطابقين.
          </div>
        )}

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #f7f1e6',
            borderRadius: 22,
            padding: '1.5rem',
            boxShadow: '0 10px 34px rgba(24, 19, 22, 0.07)',
            display: 'grid',
            gap: 14,
          }}
        >
          <Field label="وصف الفستان المطلوب *" error={errors.title}>
            <input
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="مثال: فستان زفاف أبيض مطرز بالدانتيل"
              style={inputStyle(!!errors.title)}
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="اللون *" error={errors.color}>
              <select
                value={form.color}
                onChange={(e) => setField('color', e.target.value)}
                style={inputStyle(!!errors.color)}
              >
                <option value="">اختاري اللون</option>
                {COLORS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="الميزانية (ريال) *" error={errors.budget}>
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={form.budget}
                onChange={(e) => setField('budget', e.target.value)}
                placeholder="0"
                style={inputStyle(!!errors.budget)}
              />
            </Field>
          </div>

          <Field label="تاريخ المناسبة (اختياري)">
            <input
              type="date"
              value={form.eventDate}
              onChange={(e) => setField('eventDate', e.target.value)}
              style={inputStyle(false)}
            />
          </Field>

          <div>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: '#181316' }}>
              المقاسات (سم) — اختياري
            </span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 10,
                marginTop: 8,
              }}
            >
              {SIZE_FIELDS.map((f) => (
                <input
                  key={f.key}
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={form[f.key]}
                  onChange={(e) => setField(f.key, e.target.value)}
                  placeholder={f.label}
                  style={inputStyle(false)}
                />
              ))}
            </div>
          </div>

          <Field label="ملاحظات إضافية (اختياري)">
            <textarea
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
              rows={3}
              placeholder="تفاصيل أخرى تهمك..."
              style={{ ...inputStyle(false), resize: 'vertical' }}
            />
          </Field>

          {errors.submit && (
            <p style={{ margin: 0, color: '#2a0b15', fontWeight: 700, fontSize: 13 }}>{errors.submit}</p>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #541426, #2a0b15)',
              color: '#fffdf8',
              border: 'none',
              borderRadius: 12,
              padding: '0.95rem',
              fontWeight: 800,
              fontSize: 15,
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              opacity: submitting ? 0.7 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {submitting ? <Loader2 size={19} className="spin" /> : <Send size={18} />}
            {submitting ? 'جاري النشر...' : 'نشر الطلب'}
          </button>
        </div>

        {requests.length > 0 && (
          <section style={{ marginTop: 22, marginBottom: 30 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: '#541426',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Sparkles size={18} /> أحدث الطلبات
            </h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {requests.map((r) => (
                <div
                  key={r.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #f7f1e6',
                    borderRadius: 14,
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: 14.5 }}>{r.title}</strong>
                    <span style={{ fontSize: 13, color: '#541426', fontWeight: 800 }}>
                      {Number(r.budget || 0).toLocaleString()} ريال
                    </span>
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12.5, color: '#766d72', fontWeight: 600 }}>
                    {r.color} · {r.userName || 'مشترية'}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const inputStyle = (hasError) => ({
  width: '100%',
  background: '#fffdf8',
  border: hasError ? '1px solid #2a0b15' : '1px solid rgba(84, 20, 38, 0.22)',
  borderRadius: 12,
  padding: '0.8rem 1rem',
  color: '#181316',
  fontSize: 15,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
});

function Field({ label, error, children }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 13.5, fontWeight: 800, color: '#181316' }}>{label}</span>
      {children}
      {error && <span style={{ fontSize: 12, color: '#2a0b15', fontWeight: 700 }}>{error}</span>}
    </label>
  );
}
