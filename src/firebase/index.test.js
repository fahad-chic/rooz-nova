import { describe, it, expect } from 'vitest';
import { isAdminEmail } from './index';

// يتحقق من أن الإيميلات المالكة الاحتياطية تعمل حتى بدون متغيرات البيئة —
// غيابها سابقاً كان يطرد المالك من صفحاته ويعيده إلى /login.
describe('isAdminEmail', () => {
  it('يقبل إيميلات المالك الاحتياطية بدون متغيرات بيئة', () => {
    expect(isAdminEmail('f882771f@gmail.com')).toBe(true);
    expect(isAdminEmail('kal6667222@gmail.com')).toBe(true);
  });

  it('يجاهل حالة الأحرف والفراغات', () => {
    expect(isAdminEmail('  KAL6667222@GMAIL.COM ')).toBe(true);
  });

  it('يرفض غير المالكين', () => {
    expect(isAdminEmail('random@example.com')).toBe(false);
    expect(isAdminEmail('')).toBe(false);
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
  });
});
