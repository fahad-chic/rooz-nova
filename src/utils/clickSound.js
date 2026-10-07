// src/utils/clickSound.js — صوت ضغطة خفيف لكل أزرار وخيارات الموقع
// يُولَّد الصوت عبر Web Audio API (نقرة قصيرة ناعمة) فلا نحتاج ملفاً صوتياً،
// ويحترم تفضيل الزائر في صفحة الإعدادات (clickSound) وكتم الصوت العام.
import usePrefs from '../store/usePrefs';

let audioCtx = null;

const getContext = () => {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  return audioCtx;
};

export const playClickSound = () => {
  try {
    if (!usePrefs.getState().clickSound) return;
    const ctx = getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // نغمة رسمية أنيقة (مثل نقرة معدنية ناعمة فاخرة)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';               // أنعم من sine وأكثر فخامة
    osc.frequency.setValueAtTime(1250, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.055);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // الصوت ميزة شكلية — أي فشل (حظر متصفح مثلاً) يُتجاهل بصمت
  }
};

// يُركَّب مرة واحدة على مستوى التطبيق: يلتقط الضغط على أي عنصر تفاعلي
// (زر، رابط، خيار قائمة، مربع اختيار…) في طور الالتقاط قبل معالجات الصفحات.
export const installGlobalClickSound = () => {
  if (typeof document === 'undefined') return () => {};
  const SELECTOR =
    'button, a[href], [role="button"], select, label, summary, ' +
    'input[type="checkbox"], input[type="radio"], input[type="submit"], input[type="range"]';

  const handler = (e) => {
    const target = e.target?.closest?.(SELECTOR);
    if (!target || target.disabled) return;
    playClickSound();
  };

  document.addEventListener('click', handler, true);
  return () => document.removeEventListener('click', handler, true);
};