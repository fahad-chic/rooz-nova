// src/permissions/PermissionGate.jsx — بوابة عرض مشروطة بالصلاحيات
// <PermissionGate perm="HARAJ_POST_APPROVE">…أزرار…</PermissionGate>
// لا تعرض المحتوى إلا لمن يملك الصلاحية. التحقق التنفيذي الحقيقي في قواعد
// Firestore — هذه البوابة للواجهة فقط (تمنع إرباك المستخدم بأزرار ستُرفض).
import usePermissions from './usePermissions';

const PermissionGate = ({ perm, anyOf, children, fallback = null }) => {
  const { can, canAny } = usePermissions();
  const allowed = perm ? can(perm) : anyOf ? canAny(...anyOf) : false;
  return allowed ? children : fallback;
};

export default PermissionGate;
