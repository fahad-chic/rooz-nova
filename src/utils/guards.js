/**
 * يبني معرّف محادثة ثابت بين مستخدمين + إعلان.
 * يستخدم الإعلان ثم الشريك ثم المستخدم لضمان نفس الـ ID
 * وفق الصيغة التي يعتمدها اختبار guards وباقي النظام.
 */
export const buildChatId = (user, chatPartnerId, adId) => {
  const uid = typeof user?.uid === 'string' ? user.uid.trim() : '';
  const partner = typeof chatPartnerId === 'string' ? chatPartnerId.trim() : '';
  const ad = typeof adId === 'string' ? adId.trim() : '';

  if (!uid || !partner || !ad) return null;

  return `${ad}_${partner}_${uid}`;
};

/**
 * يتحقق إن المستخدم مصادق عليه ولديه uid صالح.
 */
export const hasAuthenticatedUser = (user) => {
  return typeof user?.uid === 'string' && user.uid.trim().length > 0;
};

/**
 * يحوّل قيمة تاريخ (Firestore Timestamp أو Date أو رقم) إلى نص عربي بأمان.
 * يرجع "—" في حال فشل التحويل.
 */
export const safeDateLabel = (value) => {
  if (value == null) return '—';

  try {
    let date;

    // Firestore Timestamp
    if (typeof value?.toDate === 'function') {
      date = value.toDate();
    }
    // تاريخ عادي
    else if (value instanceof Date) {
      date = value;
    }
    // رقم (milliseconds)
    else if (typeof value === 'number' && !Number.isNaN(value)) {
      date = new Date(value);
    }
    // نص تاريخ
    else if (typeof value === 'string' && value.trim()) {
      date = new Date(value);
    }
    else {
      return '—';
    }

    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return '—';
    }

    return date.toLocaleString('ar-SA', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return '—';
  }
};