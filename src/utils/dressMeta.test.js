import { describe, it, expect } from 'vitest';
import {
  commissionAmount,
  commissionRateFor,
  computeFitScore,
  fitVerdict,
  hasAnySize,
  formatCountdown,
  AUCTION_DURATION_HOURS,
} from './dressMeta';

describe('عمولات الموقع', () => {
  it('نسبة السلع المستخدمة 1% والجديدة 2%', () => {
    expect(commissionRateFor('used')).toBe(0.01);
    expect(commissionRateFor('new')).toBe(0.02);
    expect(commissionRateFor(undefined)).toBe(0.02);
  });

  it('تحسب مبلغ العمولة ويقرّبه', () => {
    expect(commissionAmount(1000, 'used')).toBe(10);
    expect(commissionAmount(1000, 'new')).toBe(20);
    expect(commissionAmount(0, 'new')).toBe(0);
    expect(commissionAmount('abc', 'new')).toBe(0);
  });
});

describe('حاسبة المقاسات الذكية', () => {
  it('تعيد null عند غياب أي قياس', () => {
    expect(computeFitScore({}, { bust: 90 })).toBeNull();
    expect(computeFitScore({ bust: 90 }, {})).toBeNull();
  });

  it('تصل إلى 100% عند تطابق القياسات', () => {
    const dress = { bust: 90, waist: 70, hip: 95, length: 150 };
    expect(computeFitScore(dress, { ...dress })).toBe(100);
  });

  it('تنخفض الملاءمة كلما زاد الفارق', () => {
    const dress = { bust: 90 };
    const close = computeFitScore(dress, { bust: 92 });
    const far = computeFitScore(dress, { bust: 110 });
    expect(close).toBeGreaterThan(far);
    expect(far).toBeLessThan(close);
  });

  it('تحدد الوصف المناسب للنسبة', () => {
    expect(fitVerdict(95).label).toBe('ملاءمة ممتازة');
    expect(fitVerdict(75).label).toBe('ملاءمة جيدة');
    expect(fitVerdict(55).label).toBe('ملاءمة متوسطة');
    expect(fitVerdict(20).label).toBe('ملاءمة ضعيفة');
    expect(fitVerdict(null).label).toBe('');
  });

  it('hasAnySize تكتشف وجود قياس واحد على الأقل', () => {
    expect(hasAnySize({ bust: 0, waist: 0 })).toBe(false);
    expect(hasAnySize({ bust: 0, waist: 80 })).toBe(true);
  });
});

describe('عدّاد المزاد', () => {
  it('مدة المزاد 48 ساعة', () => {
    expect(AUCTION_DURATION_HOURS).toBe(48);
  });

  it('تنسيق الوقت المتبقي', () => {
    expect(formatCountdown(0)).toBe('انتهى المزاد');
    expect(formatCountdown(3661000)).toBe('01:01:01');
  });
});
