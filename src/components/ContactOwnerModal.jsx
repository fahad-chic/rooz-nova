import { useState } from 'react';
import { Mail, X, Send, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import useStore from '../store/useStore';

// نموذج «مراسلة صاحب الموقع» — يكتب في مجموعة messages (receiverId = 'owner')
// وتُعرض الرسالة في غرفة صاحب الموقع ← تبويب الرسائل.
const ContactOwnerModal = ({ onClose }) => {
  const { user } = useAuth();
  const storeUser = useStore((s) => s.user);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  // هوية المرسل موحَّدة على الـ uid (مطابق للقواعد ومحاورات المالك):
  // messages تُقرأ لعضو بما يطابق senderId/receiverId == uid.
  // الزائر المؤقت (بلا Firebase uid) يتحول للبريد/جوال.
  const uid = user?.uid || storeUser?.uid;
  const senderId = uid
    ? uid
    : (user?.email || storeUser?.phone || storeUser?.email || 'guest');

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || status === 'sending') return;
    setStatus('sending');
    try {
      await addDoc(collection(db, 'messages'), {
        senderId,
        uid: uid || null,
        senderEmail: user?.email || storeUser?.email || null,
        senderPhone: storeUser?.phone || null,
        senderName:
          user?.displayName || storeUser?.name || storeUser?.displayName || '',
        receiverId: 'owner',
        text: trimmed,
        read: false,
        createdAt: serverTimestamp(),
        timestamp: serverTimestamp(),
      });
      setStatus('sent');
      setText('');
      setTimeout(onClose, 1600);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1600,
        background: 'rgb(11, 8, 34,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        direction: 'rtl',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="مراسلة صاحب الموقع"
        style={{
          width: 'min(440px, 100%)',
          background: 'linear-gradient(160deg, #f7f6fb, #e3dbf5)',
          border: '2px solid #7b29d5',
          borderRadius: 20,
          boxShadow: '0 24px 60px rgb(15, 11, 48,0.35)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(120deg, #110c35, #320e73)',
            color: '#a382f5',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 900, fontSize: '1.05rem' }}>
            <Mail size={19} aria-hidden="true" />
            مراسلة صاحب الموقع
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            style={{ background: 'none', border: 'none', color: '#a382f5', cursor: 'pointer', display: 'flex', padding: 4 }}
          >
            <X size={19} />
          </button>
        </div>

        <div style={{ padding: '18px' }}>
          {status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: '1.2rem 0', color: '#0b477a', fontWeight: 800 }}>
              <CheckCircle2 size={40} style={{ margin: '0 auto 8px' }} aria-hidden="true" />
              وصلت رسالتك لصاحب الموقع — سيتم الرد عليك قريباً بإذن الله
            </div>
          ) : (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                maxLength={1000}
                placeholder="اكتب رسالتك لصاحب الموقع هنا — اقتراح، ملاحظة، شكوى، أو أي استفسار..."
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  borderRadius: 12,
                  border: '1.5px solid #8f6bdc',
                  background: '#f7f6fb',
                  padding: '12px 14px',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0a071e',
                  outline: 'none',
                  lineHeight: 1.8,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <span style={{ fontSize: '0.75rem', color: '#5834a0', fontWeight: 700 }}>{text.length}/1000</span>
                {status === 'error' && (
                  <span style={{ fontSize: '0.78rem', color: '#a7132e', fontWeight: 800 }}>
                    تعذر الإرسال — حاول مرة أخرى
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleSend}
                disabled={!text.trim() || status === 'sending'}
                style={{
                  marginTop: 12,
                  width: '100%',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 900,
                  fontSize: '0.98rem',
                  cursor: text.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  color: text.trim() ? '#fff' : '#513883',
                  background: text.trim()
                    ? 'linear-gradient(135deg, #0b477a, #0f6fbd)'
                    : '#a58fd9',
                  boxShadow: text.trim() ? '0 8px 20px rgb(11, 71, 122,0.35)' : 'none',
                }}
              >
                <Send size={17} aria-hidden="true" />
                {status === 'sending' ? 'جاري الإرسال...' : 'إرسال الرسالة'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactOwnerModal;
