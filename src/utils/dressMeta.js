// src/utils/dressMeta.js
// ثوابت ومحرّكات الخصائص الذكية: حاسبة المقاسات، المزاد، الوساطة الآمنة، والعمولات.

export const COMMISSION_RATES = Object.freeze({ used: 0.01, new: 0.02 });

export const AUCTION_DURATION_HOURS = 48;
export const ESCROW_REVIEW_HOURS = 24;
export const MAX_VIDEO_SECONDS = 5;
export const MAX_VIDEO_BYTES = 8 * 1024 * 1024;

// الحقول المطلوبة لحاسبة المقاسات (بالسنتيمتر)
export const SIZE_FIELDS = Object.freeze([
  { key: 'bust', label: 'الصدر', hint: 'محيط الصدر' },
  { key: 'waist', label: 'الخصر', hint: 'محيط الخصر' },
  { key: 'hip', label: 'الورك', hint: 'محيط الورك' },
  { key: 'length', label: 'الطول', hint: 'طول الفستان' },
]);

export const SIZE_TOLERANCE_CM = 6;

export const COMMISSION_LABEL = (condition) =>
  condition === 'used' ? '1%' : '2%';

export const commissionRateFor = (condition) =>
  condition === 'used' ? COMMISSION_RATES.used : COMMISSION_RATES.new;

export const commissionAmount = (price, condition) => {
  const value = Number(price);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round(value * commissionRateFor(condition));
};

/**
 * نسبة ملاءمة الفستان للمشترية.
 * تُحسب لكل قياس على حدة: كل ما قلّ الفارق بين قياس الفستان وقياس المشترية
 * ارتفعت الملاءمة، مع تسامح مقبول (SIZE_TOLERANCE_CM) يُحتسب كملاءمة كاملة.
 * النتيجة النهائية متوسط القياسات المُدخلة (0–100).
 */
export const computeFitScore = (dress = {}, buyer = {}) => {
  const parts = [];
  for (const field of SIZE_FIELDS) {
    const d = Number(dress[field.key]);
    const b = Number(buyer[field.key]);
    if (!Number.isFinite(d) || !Number.isFinite(b) || d <= 0 || b <= 0) continue;
    const diff = Math.abs(d - b);
    const score = Math.max(0, 100 - (diff / SIZE_TOLERANCE_CM) * 100);
    parts.push(score);
  }
  if (!parts.length) return null;
  return Math.round(parts.reduce((sum, s) => sum + s, 0) / parts.length);
};

export const fitVerdict = (score) => {
  if (score == null) return { label: '', tone: 'neutral' };
  if (score >= 88) return { label: 'ملاءمة ممتازة', tone: 'great' };
  if (score >= 70) return { label: 'ملاءمة جيدة', tone: 'good' };
  if (score >= 50) return { label: 'ملاءمة متوسطة', tone: 'ok' };
  return { label: 'ملاءمة ضعيفة', tone: 'weak' };
};

export const hasAnySize = (dress = {}) =>
  SIZE_FIELDS.some((f) => Number(dress[f.key]) > 0);

export const auctionEndsAt = (startsAtMs = Date.now()) =>
  new Date(startsAtMs + AUCTION_DURATION_HOURS * 3600 * 1000);

export const formatCountdown = (msLeft) => {
  if (!Number.isFinite(msLeft) || msLeft <= 0) return 'انتهى المزاد';
  const totalSeconds = Math.floor(msLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
