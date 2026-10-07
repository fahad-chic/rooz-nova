// منطق نقيّ لإجراءات المالك على إعلانات الحراج — مفصول عن DOM
// (window.confirm/alert) ليكون قابلاً للاختبار الآلي الفعلي.

// القيم المسموح بحفظها عند رفض/حذف إعلان — تُستخدم من غرفة المالك.
export function buildAdRejectUpdate(reason) {
  return {
    status: 'rejected',
    rejectionReason: String(reason || '').trim(),
  };
}

// يُعيد النتيجة الصحيحة لحذف إعلان بحسب الرد:
// - لم يؤكّد المالك (no/إلغاء) => { proceed: false }
// - أكّد ووجود السبب => { proceed: true }
// - أكّد بلا سبب => يعتبر مستندان (فارغ) لكنه يسمح مع تحذير نصي.
export function resolveDelete(confirmed, reason) {
  if (!confirmed) return { proceed: false };
  return { proceed: true, reason: String(reason || '').trim() };
}

// التحقق أن القيمة الجديدة للحالة (status) صالحة ضمن دورة حياة إعلان الحراج.
export const AD_STATUSES = ['active', 'pending', 'rejected', 'archived'];
export function isValidAdStatus(status) {
  return AD_STATUSES.includes(status);
}