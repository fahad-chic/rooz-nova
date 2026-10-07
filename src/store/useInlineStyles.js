// src/store/useInlineStyles.js — أنماط العناصر المضمّنة (صلاحيات INLINE_*)
// يحفظ تعديلات المالك/المفوَّضين على العناصر (ألوان، خطوط، حواف، إخفاء)
// في Firestore (settings/inlineStyles) — قراءة عامة للجميع حتى تنطبق على
// الزوار، وكتابة للمخوَّلين فقط عبر القواعد.
import { create } from 'zustand';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const useInlineStyles = create((set) => ({
  styles: {},
  loaded: false,
  setStyles: (styles) => set({ styles, loaded: true }),
}));

let started = false;
export const startInlineStylesSync = () => {
  if (started || !db) return;
  started = true;
  const ref = doc(db, 'settings', 'inlineStyles');
  onSnapshot(ref, (snap) => {
    useInlineStyles.getState().setStyles(
      snap.exists() ? snap.data().styles || {} : {}
    );
  }, () => useInlineStyles.getState().setStyles({}));
};

// يحفظ نمط عنصر (مفتاحه elementId) — قيمة النمط كائن CSS محدود الحقول
// المسموح بها فقط حتى لا تتحول الميزة إلى حقن CSS حر.
const ALLOWED_PROPS = [
  'color', 'backgroundColor', 'fontSize', 'fontWeight', 'fontStyle',
  'textDecoration', 'borderRadius', 'boxShadow', 'filter', 'display'
];

export const sanitizeInlineStyle = (input) => {
  const out = {};
  const raw = input && typeof input === 'object' ? input : {};
  for (const prop of ALLOWED_PROPS) {
    const v = raw[prop];
    if (typeof v === 'string' && v.length <= 120 && !/[<>]/.test(v)) out[prop] = v;
  }
  return out;
};

export const saveInlineStyle = async (elementId, styleInput) => {
  const ref = doc(db, 'settings', 'inlineStyles');
  const snap = await getDoc(ref);
  const styles = { ...(snap.exists() ? snap.data().styles || {} : {}) };
  const clean = sanitizeInlineStyle(styleInput);
  if (Object.keys(clean).length === 0) delete styles[elementId];
  else styles[elementId] = clean;
  await setDoc(ref, { styles, updatedAt: new Date().toISOString() }, { merge: true });
  useInlineStyles.getState().setStyles(styles);
};

export const isElementHidden = (styles, elementId) =>
  styles?.[elementId]?.display === 'none';

export default useInlineStyles;