import React, { useState, useEffect, useRef, useContext } from 'react';
import { db } from '../firebase/config';
import { ensureFirebaseSession } from '../utils/firebaseSession';
import { AuthContext } from '../context/AuthContext';
import { buildChatId, hasAuthenticatedUser, safeDateLabel } from '../utils/guards';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import {
  Send,
  ArrowLeft,
  ShieldCheck,
  Copy,
  Share2
} from 'lucide-react';

const ChatPage = ({ chatPartnerId, adId, setCurrentPage }) => {
  const { user } = useContext(AuthContext);
  const isAuthenticated = hasAuthenticatedUser(user);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [partnerData, setPartnerData] = useState(null);
  const [adData, setAdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportSent, setReportSent] = useState(false);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  const chatId = buildChatId(user, chatPartnerId, adId);
  const hasChatTarget = Boolean(chatPartnerId && adId);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const userSnap = await getDoc(doc(db, 'haraj_users', chatPartnerId));
        const adSnap = await getDoc(doc(db, 'haraj_ads', adId));

        if (!active) return;

        if (userSnap.exists()) setPartnerData(userSnap.data());
        if (adSnap.exists()) setAdData(adSnap.data());
      } catch (error) {
        console.error('chat data error:', error);
        if (active) {
          setPartnerData(null);
          setAdData(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    if (isAuthenticated && chatPartnerId && adId) {
      setLoading(true);
      fetchData();
    } else {
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [isAuthenticated, chatPartnerId, adId]);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return undefined;
    }

    let unsub = null;

    (async () => {
      await ensureFirebaseSession();
      const q = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('createdAt', 'asc')
      );

      unsub = onSnapshot(
        q,
        (snap) => {
          setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        },
        (error) => {
          console.error('chat messages:', error);
          setMessages([]);
        }
      );
    })();

    return () => unsub?.();
  }, [chatId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = message.trim();

    if (!text || !isAuthenticated || !user?.uid || !chatId || sending) return;

    setSending(true);

    try {
      await ensureFirebaseSession();
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text,
        senderId: user.uid,
        senderName: user.displayName || user.email || 'مستخدم',
        createdAt: serverTimestamp(),
        adId: adId
      });

      setMessage('');
    } catch (error) {
      console.error('send message error:', error);
      alert('تعذر إرسال الرسالة — حاول مرة أخرى.');
    } finally {
      setSending(false);
    }
  };

  const handleCopyPhone = async () => {
    const phone = partnerData?.phone || partnerData?.userPhone;
    if (!phone) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(phone);
        alert('تم نسخ رقم البائع');
      } else {
        alert('المتصفح لا يدعم نسخ البيانات مباشرة');
      }
    } catch {
      alert('تعذر نسخ رقم البائع');
    }
  };

  const handleShareAd = async () => {
    const url = `${window.location.origin}/ad/${adId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: adData?.title || 'إعلان',
          text: `محادثة بخصوص إعلان: ${adData?.title || 'إعلان'}`,
          url
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        alert('تم نسخ رابط الإعلان');
      } else {
        alert('المتصفح لا يدعم المشاركة أو نسخ الرابط');
      }
    } catch {
      return;
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: '#6b1d2f' }}>
        يرجى تسجيل الدخول لعرض هذه المحادثة.
      </div>
    );
  }

  if (loading)
    return (
      <p style={{ textAlign: 'center', padding: 40, color: '#6b1d2f' }}>
        جاري تحميل المحادثة...
      </p>
    );

  if (!hasChatTarget) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: '#6b1d2f', fontFamily: 'Tajawal, sans-serif' }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#1f1116' }}>لا توجد محادثة محددة</p>
        <p style={{ fontSize: 14 }}>افتح إعلاناً في حراج واضغط «مراسلة البائع» لبدء محادثة.</p>
        {typeof setCurrentPage === 'function' && (
          <button
            type="button"
            onClick={() => setCurrentPage('dashboard')}
            style={{ marginTop: 16, padding: '10px 22px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6b1d2f,#6b1d2f)', color: '#1f1116', fontWeight: 800, cursor: 'pointer' }}
          >
            العودة للرئيسية
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '0 auto',
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#1f1116',
        borderRadius: 16,
        boxShadow: '0 4px 20px rgb(ffffff,0.08)',
        border: '1px solid rgb(6b1d2f,0.25)',
        overflow: 'hidden',
        fontFamily: 'Tajawal, sans-serif'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 15,
          background: '#111',
          borderBottom: '1px solid rgb(6b1d2f,0.25)'
        }}
      >
        <button
          type="button"
          onClick={() => setCurrentPage('ad-details', adId)}
          style={{
            background: 'none',
            border: 'none',
            color: '#6b1d2f',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <ArrowLeft size={16} /> رجوع
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 16, color: '#6b1d2f' }}>
            محادثة بخصوص: {adData?.title || 'إعلان'}
          </h2>
          <p style={{ margin: 0, fontSize: 12, color: '#aaa' }}>
            مع: {partnerData?.name || partnerData?.displayName || partnerData?.email || 'المعلن'}
          </p>
        </div>

        <button
          type="button"
          onClick={async () => {
            if (reportSent || !user?.uid || !chatId) return;

            try {
              await addDoc(collection(db, 'reports'), {
                type: 'chat',
                chatId,
                adId: adId || null,
                reporterId: user.uid,
                reporterEmail: user.email || '',
                reporterName: user.displayName || user.email || 'مستخدم',
                partnerId: chatPartnerId,
                partnerName: partnerData?.name || partnerData?.displayName || null,
                reason: 'بلاغ من نافذة المحادثة',
                createdAt: serverTimestamp(),
              });
              setReportSent(true);
              alert('تم إرسال البلاغ للإدارة');
            } catch (error) {
              console.error('report error:', error);
              alert('تعذر إرسال البلاغ — حاول مرة أخرى.');
            }
          }}
          title={reportSent ? 'تم إرسال البلاغ' : 'إبلاغ الإدارة عن هذه المحادثة'}
          aria-label={reportSent ? 'تم إرسال البلاغ' : 'إبلاغ الإدارة عن هذه المحادثة'}
          style={{ background: 'none', border: 'none', cursor: reportSent ? 'default' : 'pointer', opacity: reportSent ? 0.4 : 1 }}
        >
          <ShieldCheck size={20} color={reportSent ? '#888' : '#8f2a40'} />
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 20,
          background: '#1f1116'
        }}
      >
        {messages.length === 0 && (
          <p style={{ textAlign: 'center', color: '#777', padding: 30 }}>
            لا توجد رسائل بعد.
          </p>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              justifyContent:
                m.senderId === user.uid ? 'flex-end' : 'flex-start',
              marginBottom: 12
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 12,
                maxWidth: '70%',
                background:
                  m.senderId === user.uid ? '#6b1d2f' : '#1f1116',
                color: m.senderId === user.uid ? '#fff' : '#eee',
                boxShadow:
                  m.senderId === user.uid
                    ? '0 2px 8px rgb(6b1d2f,0.4)'
                    : '0 2px 8px rgb(1f1116,0.3)'
              }}
            >
              <p style={{ margin: 0, fontSize: 14 }}>{m.text || ''}</p>
              <p
                style={{
                  margin: '6px 0 0',
                  fontSize: 10,
                  opacity: 0.7,
                  textAlign: 'right'
                }}
              >
                {safeDateLabel(m.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div
        style={{
          display: 'flex',
          gap: 10,
          padding: 15,
          background: '#111',
          borderTop: '1px solid rgb(6b1d2f,0.25)'
        }}
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="اكتب رسالتك..."
          disabled={sending || !chatId}
          style={{
            flex: 1,
            border: '1px solid rgb(ffffff,0.1)',
            borderRadius: 10,
            padding: '12px',
            background: '#1f1116',
            color: '#fff'
          }}
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !message.trim() || !chatId}
          aria-label="إرسال الرسالة"
          style={{
            background: '#6b1d2f',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '0 18px',
            cursor: sending || !message.trim() || !chatId ? 'not-allowed' : 'pointer',
            opacity: sending || !message.trim() || !chatId ? 0.5 : 1,
            fontWeight: 700
          }}
        >
          <Send size={18} />
        </button>

        <button
          type="button"
          onClick={handleCopyPhone}
          aria-label="نسخ رقم البائع"
          style={{
            background: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '0 14px',
            cursor: 'pointer'
          }}
        >
          <Copy size={18} />
        </button>

        <button
          type="button"
          onClick={handleShareAd}
          aria-label="مشاركة الإعلان"
          style={{
            background: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '0 14px',
            cursor: 'pointer'
          }}
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;