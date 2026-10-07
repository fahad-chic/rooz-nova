import { describe, it, expect } from 'vitest';
import {
  buildAdRejectUpdate,
  resolveDelete,
  isValidAdStatus,
  AD_STATUSES,
} from './adActions';

describe('buildAdRejectUpdate', () => {
  it('يُحرّك الإعلان إلى حالة rejected مع سبب الرفض وأن الحقل نصّ مُجرّد', () => {
    const update = buildAdRejectUpdate('  مخالف \n');
    expect(update).toEqual({
      status: 'rejected',
      rejectionReason: 'مخالف',
    });
  });

  it('يعيد سبب رفض فارغاً إن لم يُقدَّم سبب', () => {
    const update = buildAdRejectUpdate();
    expect(update.status).toBe('rejected');
    expect(update.rejectionReason).toBe('');
  });

  it('يتعامل مع null و undefined بشكل آمن', () => {
    expect(buildAdRejectUpdate(null).rejectionReason).toBe('');
    expect(buildAdRejectUpdate(undefined).rejectionReason).toBe('');
  });

  it('يُزيل المسافات الزائدة والأسطر الجديدة من السبب', () => {
    const update = buildAdRejectUpdate('   \n  إعلان مكرر  \t  ');
    expect(update.rejectionReason).toBe('إعلان مكرر');
  });

  it('يحافظ على النص الطويل بدون تقطيع', () => {
    const longReason = 'أ'.repeat(500);
    const update = buildAdRejectUpdate(longReason);
    expect(update.rejectionReason).toBe(longReason);
    expect(update.status).toBe('rejected');
  });
});

describe('resolveDelete', () => {
  it('لا يحذف الإعلان إذا لم يؤكّد المالك', () => {
    const result = resolveDelete(false, 'سبب');
    expect(result.proceed).toBe(false);
    expect(result.reason).toBeUndefined();
  });

  it('يحذف الإعلان إذا أكّد المالك ويُمرّر السبب', () => {
    const r = resolveDelete(true, 'إعلان مخالف');
    expect(r).toEqual({
      proceed: true,
      reason: 'إعلان مخالف',
    });
  });

  it('يُجرّد المسافة ويُبقي السبب الفارغ عند الحذف', () => {
    expect(resolveDelete(true, '   ').reason).toBe('');
  });

  it('يتعامل مع سبب null أو undefined عند التأكيد', () => {
    expect(resolveDelete(true, null).reason).toBe('');
    expect(resolveDelete(true, undefined).reason).toBe('');
  });

  it('يرفض الحذف حتى لو وُجد سبب قوي إذا لم يتم التأكيد', () => {
    const result = resolveDelete(false, 'مخالفة خطيرة جداً');
    expect(result.proceed).toBe(false);
  });
});

describe('isValidAdStatus / AD_STATUSES', () => {
  it('يسمح بحالات دورة حياة إعلان الحراج فقط', () => {
    expect(AD_STATUSES).toEqual(['active', 'pending', 'rejected', 'archived']);
    for (const s of AD_STATUSES) {
      expect(isValidAdStatus(s)).toBe(true);
    }
  });

  it('يرفض الحالات غير المعروفة', () => {
    expect(isValidAdStatus('deleted')).toBe(false);
    expect(isValidAdStatus('')).toBe(false);
    expect(isValidAdStatus(undefined)).toBe(false);
    expect(isValidAdStatus(null)).toBe(false);
    expect(isValidAdStatus(123)).toBe(false);
    expect(isValidAdStatus('ACTIVE')).toBe(false); // case-sensitive
  });

  it('لا يقبل حالات إضافية خارج القائمة الرسمية', () => {
    const invalid = ['draft', 'sold', 'hidden', 'banned', 'expired'];
    for (const s of invalid) {
      expect(isValidAdStatus(s)).toBe(false);
    }
  });
});