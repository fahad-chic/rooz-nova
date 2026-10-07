// سجل تشخيصي لأحداث "الرجوع المفاجئ لصفحة الدخول" — يُخزَّن في sessionStorage
// (يموت مع إغلاق التبويب) ويُعرض أسفل صفحة الدخول بجانب ختم البناء، حتى يُعرف
// سبب أي طرد صامت فور حدوثه بدل التخمين.
const KEY = 'rooz_kick_log';
const MAX_ENTRIES = 12;

export const recordKick = (reason, extra = {}) => {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push({
      at: new Date().toISOString(),
      reason,
      path: window.location?.pathname || '',
      ...extra,
    });
    while (list.length > MAX_ENTRIES) list.shift();
    window.sessionStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // التخزين قد يكون غير متاح — التشخيص غير حرج
  }
};

export const readKickLog = () => {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

export const clearKickLog = () => {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
};

const REASON_LABELS = {
  'protected-route-no-session': 'البوابة الواقية لم تجد جلسة دخول نشطة',
  'protected-route-unauthorized': 'البوابة الواقية: الدور غير مطابق للصفحة المطلوبة',
  'guest-expired-effect': 'تأثير انتهاء جلسة الزائر حوّل لصفحة الدخول',
  'guest-timer-expired': 'مؤقّت جلسة الزائر انتهى',
  'auth-session-lost': 'جلسة Firebase أُسقطت بعد أن كانت فعّالة',
  'auth-session-restored': 'جلسة Firebase عادت بعد سقوط لحظي (لم يُطرد المستخدم)',
  'store-logout': 'استدعاء خروج من المتجر',
  'context-logout': 'استدعاء خروج من سياق المصادقة',
  'owner-room-gate': 'بوابة غرفة المالك لم تجد مستخدماً مالكاً',
};

export const kickReasonLabel = (reason) => REASON_LABELS[reason] || reason;

// علامة "خروج يدوي مقصود" — تُوضع لحظة استدعاء signOut من زر خروج معروف حتى
// لا يُسجَّل الخروج اليدوي كأنه سقوط جلسة غامض في سجل التشخيص.
const MANUAL_SIGNOUT_KEY = 'rooz_manual_signout';
const MANUAL_SIGNOUT_WINDOW_MS = 5000;

export const markManualSignOut = () => {
  try {
    window.sessionStorage.setItem(MANUAL_SIGNOUT_KEY, String(Date.now()));
  } catch {
    // ignore
  }
};

export const consumeManualSignOut = () => {
  try {
    const raw = window.sessionStorage.getItem(MANUAL_SIGNOUT_KEY);
    if (!raw) return false;
    window.sessionStorage.removeItem(MANUAL_SIGNOUT_KEY);
    return Date.now() - Number(raw) < MANUAL_SIGNOUT_WINDOW_MS;
  } catch {
    return false;
  }
};
