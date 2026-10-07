// يضمن وجود جلسة Firebase (مجهولة إن لزم) قبل أي عملية Firestore محمية.
// القواعد الجديدة تشترط isSignedIn() على قراءة/كتابة حراج والمستخدمين
// والإشعارات، وجلسة الزائر المجهولة تكفي — بلا حساب ولا كلمة مرور.
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase/config';

let pending = null;

export const ensureFirebaseSession = async () => {
  if (auth?.currentUser) return auth.currentUser;
  if (!auth) return null;

  if (!pending) {
    pending = signInAnonymously(auth)
      .then((cred) => cred.user)
      .catch(() => null)
      .finally(() => {
        pending = null;
      });
  }

  return pending;
};
