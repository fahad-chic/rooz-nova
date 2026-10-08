// src/components/owner/PermissionsPanel.jsx — مصفوفة الصلاحيات المجهرية
// تبويب داخل غرفة صاحب الموقع: حسابات المالك فقط (البريدان المعتمدان)
// ثم 7 أقسام، كل صلاحية بمفتاح تفعيل/تعطيل (Toggle) مع زر تعديل/حفظ.
// الكتابة على rbac/{uid} مقيّدة بالقواعد للمالك فقط — أي تلاعب من حساب آخر يرفضه الخادم ويُسجَّل.
import { useEffect, useMemo, useState } from 'react';
import {
  Crown, Users, ShoppingBag, Database, UserCheck, Eye, Pencil,
  Shield, Snowflake, Sun, Check, X, Info,
  Settings, Wrench, LockOpen, ListChecks, Code, RefreshCw,
  Timer, Ban, Unlock, UserX, LogOut, BadgeCheck, Fingerprint,
  Trash2, RotateCcw, PencilLine, CheckCircle2, Star, MessageSquareOff,
  PenLine, ArrowLeftRight, FolderUp, FolderX, BadgeDollarSign, LayoutGrid, Tags,
  UserPlus, UserCog, KeyRound, Wallet, ScrollText, Radio, Archive,
  ShieldAlert, ScanEye, Palette, CaseSensitive, Image, SlidersHorizontal,
  Box, Repeat, EyeOff, MessageSquare, Edit3
} from 'lucide-react';
import {
  PERMISSION_CATEGORIES,
  PERMISSIONS,
  permissionsByCategory
} from '../../permissions/catalog';
import { computeEffectiveGrants, countGranted, sanitizeGrants } from '../../permissions/logic';
import {
  getUserRbac,
  setUserGrants,
  setSuspended,
  toggleGrant,
  logPermissionAudit
} from '../../permissions/rbacService';

// أيقونة مميزة لكل صلاحية على حدة — «لغة بصرية» تُميّز كل صندوق في المصفوفة
const PERMISSION_ICONS = {
  // master
  SUPER_ADMIN_FULL_ACCESS: Crown,
  UPDATE_GLOBAL_SETTINGS: Settings,
  TOGGLE_MAINTENANCE_MODE: Wrench,
  BYPASS_FIREBASE_RULES: LockOpen,
  MANAGE_NAVIGATION_MENU: ListChecks,
  CODE_SNIPPET_INJECTION: Code,
  FLUSH_SYSTEM_CACHE: RefreshCw,
  // users
  BAN_USER_TEMPORARY: Timer,
  BAN_USER_PERMANENT: Ban,
  UNBAN_USER_RESTORE: Unlock,
  BLOCK_USER_REGISTRATION: UserX,
  FORCE_LOGOUT_SESSION: LogOut,
  MANAGE_USER_VERIFICATION: BadgeCheck,
  VIEW_USER_IP_HISTORY: Fingerprint,
  // haraj
  HARAJ_POST_DELETE: Trash2,
  HARAJ_POST_RESTORE: RotateCcw,
  HARAJ_POST_FORCE_EDIT: PencilLine,
  HARAJ_POST_APPROVE: CheckCircle2,
  HARAJ_POST_FEATURE: Star,
  HARAJ_COMMENT_DELETE: MessageSquareOff,
  HARAJ_COMMENT_EDIT: PenLine,
  TRANSFER_POST_OWNERSHIP: ArrowLeftRight,
  // catalog
  CREATE_NEW_CATALOG: FolderUp,
  DELETE_MAIN_CATALOG: FolderX,
  EDIT_CATALOG_PRICING: BadgeDollarSign,
  CUSTOMIZE_CATALOG_LAYOUT: LayoutGrid,
  MANAGE_CATALOG_TAGS: Tags,
  // staff
  ADD_NEW_EMPLOYEE: UserPlus,
  EDIT_EMPLOYEE_PROFILE: UserCog,
  GRANT_SUB_ADMIN_PERMISSIONS: KeyRound,
  SUSPEND_SUB_ADMIN_ACCOUNT: Snowflake,
  VIEW_EMPLOYEE_SALARIES: Wallet,
  // spy
  MONITOR_PRIVATE_MESSAGES: MessageSquare,
  VIEW_SYSTEM_AUDIT_LOGS: ScrollText,
  TRACK_EMPLOYEE_LIVE_SESSIONS: Radio,
  FIREBASE_MUTATION_LOGS: Database,
  RECOVER_DELETED_ITEMS_ARCHIVE: Archive,
  TRACK_FAILED_LOGINS: ShieldAlert,
  MONITOR_USER_TRAFFIC_LIVE: ScanEye,
  // inline
  INLINE_TEXT_EDIT: Pencil,
  INLINE_STYLE_COLOR: Palette,
  INLINE_FONT_CUSTOMIZE: CaseSensitive,
  INLINE_IMAGE_REPLACE: Image,
  INLINE_IMAGE_DESIGN_MOD: SlidersHorizontal,
  INLINE_BOX_SHAPE_MOD: Box,
  INLINE_TICKER_CONTROL: Repeat,
  INLINE_ELEMENT_DELETE: EyeOff,
};

// لون هدية الأيقونة حسب القسم — درجات بيج وذهبي دافئة متناسقة مع خلفية #fffdf8
const CATEGORY_CHIP = {
  master: 'bg-[#541426]/15 text-[#541426] border-[#541426]/35',
  users: 'bg-[#541426]/12 text-[#541426] border-[#541426]/30',
  haraj: 'bg-[#766d72]/12 text-[#766d72] border-[#766d72]/30',
  catalog: 'bg-[#766d72]/12 text-[#766d72] border-[#766d72]/30',
  staff: 'bg-[#541426]/12 text-[#541426] border-[#541426]/30',
  spy: 'bg-[#541426]/12 text-[#541426] border-[#541426]/30',
  inline: 'bg-[#766d72]/12 text-[#766d72] border-[#766d72]/30',
};

// يطابق شكل الكتالوج الأصلي: cat.icon قد يكون اسم الأيقونة أو المعرف
const CATEGORY_ICONS = {
  Crown, Users, ShoppingBag, Database, UserCheck, Eye, Pencil,
  master: Crown,
  users: Users,
  haraj: ShoppingBag,
  catalog: Database,
  staff: UserCheck,
  spy: Eye,
  inline: Pencil,
};

// البريدان المعتمدان فقط — لا يظهر أي بريد آخر في النظام
const OWNER_ONLY_EMAILS = [
  'f882771f@gmail.com',
  'kal6667222@gmail.com',
];

const PermissionsPanel = ({ users = [], ownerEmail: _ownerEmail, darkMode = false }) => {
  const [target, setTarget] = useState(null);
  const [rbac, setRbac] = useState(null);
  const [loadingRbac, setLoadingRbac] = useState(false);
  const [activeCategory, setActiveCategory] = useState('master');
  const [savingKey, setSavingKey] = useState('');
  const [notice, setNotice] = useState('');
  const [editingKey, setEditingKey] = useState(null);

  // ألوان حسب الوضع (نهاري / ليلي)
  const cardBg = darkMode
    ? { background: 'linear-gradient(165deg, rgba(24, 19, 22,.96), rgba(24, 19, 22,.96))', borderColor: 'rgba(42, 11, 21,.32)' }
    : { background: 'linear-gradient(165deg, rgba(253, 251, 247,.98), rgba(251, 240, 240,.96))', borderColor: 'rgba(42, 11, 21,.30)' };
  const textMain = darkMode ? 'text-[#fffdf8]' : 'text-[#181316]';
  const textSub = darkMode ? 'text-[#541426]' : 'text-[#181316]';
  const textMuted = darkMode ? 'text-[#541426]' : 'text-[#181316]';
  const chipInactive = darkMode
    ? 'bg-[#181316] text-[#fffdf8] border-[#541426]/35 hover:bg-[#541426]/15'
    : 'bg-[#fffdf8] text-[#181316] border-[#541426]/30 hover:bg-[#541426]/10';
  const rowBgOn = darkMode
    ? 'bg-[#181316] border-[#541426]/45 shadow-sm shadow-black/20'
    : 'bg-[#fffdf8] border-[#541426]/45 shadow-sm shadow-[#541426]/10';
  const rowBgOff = darkMode
    ? 'bg-[#181316] border-[#541426]/20 hover:border-[#541426]/40'
    : 'bg-[#fffdf8] border-[#541426]/20 hover:border-[#541426]/35';
  const noticeBg = darkMode
    ? 'text-[#fffdf8] bg-[#541426]/20 border-[#541426]/40'
    : 'text-[#181316] bg-[#541426]/15 border-[#541426]/35';

  // فقط حسابات المالك المعتمدة — تنقية كاملة لأي بريد آخر
  const ownerCandidates = useMemo(() => {
    const allowed = new Set(OWNER_ONLY_EMAILS.map((e) => e.toLowerCase()));
    return (Array.isArray(users) ? users : [])
      .filter((u) => allowed.has(String(u.email || '').trim().toLowerCase()))
      .slice(0, 2);
  }, [users]);

  useEffect(() => {
    if (!target) {
      setRbac(null);
      return;
    }
    let alive = true;
    setLoadingRbac(true);
    getUserRbac(target.id)
      .then((docData) => {
        if (alive) setRbac(docData);
      })
      .catch(() => {
        if (alive) setRbac(null);
      })
      .finally(() => {
        if (alive) setLoadingRbac(false);
      });
    return () => {
      alive = false;
    };
  }, [target]);

  const effective = useMemo(
    () => computeEffectiveGrants({ role: target?.role, rbacDoc: rbac }),
    [target, rbac]
  );
  const grantedCount = countGranted(effective.grants);
  const rawGrants = sanitizeGrants(rbac?.grants || {});
  const suspended = rbac?.suspended === true;

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3500);
  };

  const handleToggle = async (key, enabled) => {
    if (!target || savingKey) return;
    setSavingKey(key);
    try {
      const next = await toggleGrant(target.id, key, enabled, rawGrants);
      setRbac((prev) => ({ ...(prev || {}), grants: next }));
      flash('تم حفظ التعديل بنجاح');
      setEditingKey(null);
    } catch {
      flash('رفض الخادم العملية — هذه العملية للمالك فقط');
    } finally {
      setSavingKey('');
    }
  };

  const handleCategoryAll = async (categoryId, enable) => {
    if (!target || savingKey) return;
    setSavingKey('bulk');
    try {
      const next = { ...rawGrants };
      for (const p of permissionsByCategory(categoryId)) {
        if (enable) next[p.key] = true;
        else delete next[p.key];
      }
      const saved = await setUserGrants(target.id, next);
      setRbac((prev) => ({ ...(prev || {}), grants: saved }));
      await logPermissionAudit(
        enable ? 'permissions_bulk_grant' : 'permissions_bulk_revoke',
        `${enable ? 'منح' : 'سحب'} كل صلاحيات قسم ${categoryId} ${enable ? 'إلى' : 'من'} ${target.email || target.id}`
      );
      flash('تم حفظ التعديل بنجاح');
    } catch {
      flash('رفض الخادم العملية');
    } finally {
      setSavingKey('');
    }
  };

  const handleSuspend = async (suspend) => {
    if (!target || savingKey) return;
    if (suspend && !window.confirm(`تجميد حساب ${target.email || target.id} فوراً وسحب كل صلاحياته؟`)) return;
    setSavingKey('suspend');
    try {
      await setSuspended(target.id, suspend);
      setRbac((prev) => ({ ...(prev || {}), suspended: suspend }));
      flash(suspend ? 'تم تجميد الحساب وسحب صلاحياته' : 'تم إعادة تفعيل الحساب');
    } catch {
      flash('رفض الخادم العملية');
    } finally {
      setSavingKey('');
    }
  };

  const categoryPerms = permissionsByCategory(activeCategory);

  return (
    <div className="space-y-5" dir="rtl" lang="ar">
      {/* ترويسة التبويب */}
      <div className="rounded-2xl p-5 border shadow-lg" style={cardBg}>
        <h3 className={`font-bold flex items-center gap-2 mb-2 ${textMain} text-base md:text-lg`}>
          <Shield size={20} className="text-[#541426]" />
          مصفوفة الصلاحيات المجهرية{' '}
          <span className="text-[#541426]">(47 صلاحية)</span>
        </h3>
        <p className={`text-sm ${textSub} leading-6 font-medium`}>
          اختر حساب مالك ثم فعّل أو عطّل كل صلاحية على حدة عبر زر التعديل ثم الحفظ.
          المنح تُحفظ في قاعدة البيانات وتُفرض من الخادم. المالك يملك كل الصلاحيات دائماً.
        </p>
      </div>

      {/* مشاهدة حسابات المالك والتحكم المطلق — فقط البريدان المعتمدان */}
      <div className="rounded-2xl p-5 border shadow-lg" style={cardBg}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#541426]/15 border border-[#541426]/30 flex items-center justify-center text-[#541426]">
            <Crown size={20} />
          </div>
          <div>
            <h4 className={`font-bold ${textMain} text-sm md:text-base`}>
              مشاهدة حسابات المالك والتحكم المطلق
            </h4>
            <p className={`text-xs ${textMuted} font-medium`}>
              يظهر هنا فقط البريدان المعتمدان لصاحب الموقع
            </p>
          </div>
        </div>

        <div className="max-h-56 overflow-y-auto divide-y divide-[#541426]/15 rounded-xl border border-[#541426]/25">
          {ownerCandidates.length === 0 && (
            <p className={`p-4 text-sm ${textMuted} text-center font-medium`}>
              لا توجد حسابات مالك مطابقة حالياً
            </p>
          )}
          {ownerCandidates.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => setTarget(u)}
              className={`w-full text-right px-4 py-3.5 flex items-center justify-between gap-3 transition-colors ${
                target?.id === u.id
                  ? 'bg-[#541426]/15 border-r-4 border-[#541426]'
                  : 'hover:bg-[#541426]/08'
              }`}
            >
              <span className="min-w-0">
                <span className={`block font-bold text-sm truncate ${textMain}`}>
                  {u.displayName || u.email || u.id}
                </span>
                <span className={`block text-xs ${textMuted} font-medium truncate`}>
                  {u.email} — {u.role || 'owner'}
                </span>
              </span>
              {target?.id === u.id && (
                <Check size={18} className="text-[#541426] flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* لوحة المنح للحساب المختار */}
      {target && (
        <div
          className="rounded-2xl p-5 border shadow-lg space-y-4"
          style={cardBg}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className={`font-bold text-sm md:text-base ${textMain}`}>
                {target.displayName || target.email}
              </p>
              <p
                className={`text-xs font-bold ${
                  suspended ? 'text-[#541426]' : 'text-[#541426]'
                }`}
              >
                {suspended
                  ? 'الحساب مجمّد — كل الصلاحيات مسحوبة فعلياً'
                  : `${grantedCount} من ${PERMISSIONS.length} صلاحية فعّالة`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSuspend(!suspended)}
              disabled={savingKey === 'suspend'}
              className={`flex items-center justify-center gap-2 w-full md:w-auto px-4 py-3 rounded-xl text-sm font-bold border transition-all duration-200 ${
                suspended
                  ? 'bg-[#766d72]/15 text-[#766d72] border-[#766d72]/40 hover:bg-[#766d72]/25'
                  : 'bg-[#541426]/15 text-[#541426] border-[#541426]/40 hover:bg-[#541426]/25'
              }`}
            >
              {suspended ? <Sun size={16} /> : <Snowflake size={16} />}
              {suspended ? 'إعادة تفعيل الحساب' : 'تجميد فوري وسحب الصلاحيات'}
            </button>
          </div>

          {notice && (
            <p className={`text-sm font-bold border rounded-xl px-4 py-2.5 ${noticeBg}`}>
              {notice}
            </p>
          )}

          {loadingRbac ? (
            <p className={`text-sm ${textMuted} text-center py-6 font-medium`}>
              جاري تحميل مصفوفة الحساب…
            </p>
          ) : (
            <>
              {/* تبويبات الأقسام السبعة */}
              <div className="flex flex-wrap gap-2 w-full overflow-x-auto pb-1">
                {PERMISSION_CATEGORIES.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.icon] || CATEGORY_ICONS[cat.id] || Shield;
                  const active = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold border shrink-0 transition-all duration-200 ${
                        active
                          ? 'bg-[#541426] text-[#181316] border-[#541426] shadow-md shadow-[#541426]/25'
                          : chipInactive
                      }`}
                    >
                      <Icon size={15} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* أدوات القسم */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className={`text-xs ${textMuted} font-bold`}>
                  {categoryPerms.length} صلاحيات في هذا القسم
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCategoryAll(activeCategory, true)}
                    className="text-xs px-3.5 py-2 rounded-xl bg-[#766d72]/15 text-[#766d72] border border-[#766d72]/40 hover:bg-[#766d72]/25 font-bold transition-all duration-200"
                  >
                    تفعيل القسم كله
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategoryAll(activeCategory, false)}
                    className="text-xs px-3.5 py-2 rounded-xl bg-[#541426]/12 text-[#541426] border border-[#541426]/35 hover:bg-[#541426]/20 font-bold transition-all duration-200"
                  >
                    تعطيل القسم كله
                  </button>
                </div>
              </div>

              {/* مفاتيح الصلاحيات — مع زر تعديل/حفظ */}
              <div className="space-y-3">
                {categoryPerms.map((p) => {
                  const on = effective.grants[p.key] === true;
                  const saving = savingKey === p.key;
                  const isEditing = editingKey === p.key;
                  const ChipIcon = PERMISSION_ICONS[p.key] || Shield;
                  const chipColor =
                    CATEGORY_CHIP[activeCategory] ||
                    'bg-[#541426]/12 text-[#541426] border-[#541426]/30';
                  return (
                    <div
                      key={p.key}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 transition-all duration-200 ${
                        on ? rowBgOn : rowBgOff
                      } ${suspended ? 'opacity-50' : ''}`}
                    >
                      <div className="min-w-0 flex items-start gap-3">
                        <span
                          className={`flex-shrink-0 mt-0.5 w-10 h-10 rounded-xl border flex items-center justify-center ${chipColor}`}
                          title={p.key}
                        >
                          <ChipIcon size={18} />
                        </span>
                        <div>
                          <p className={`font-bold text-sm ${textMain} flex items-center gap-2 flex-wrap`}>
                            {p.label}
                            <code
                              className={`text-[10px] font-mono bg-[#541426]/10 px-1.5 py-0.5 rounded ${darkMode ? 'text-[#541426]' : 'text-[#766d72]'}`}
                              dir="ltr"
                            >
                              {p.key}
                            </code>
                          </p>
                          <p className={`text-xs ${textSub} leading-5 mt-0.5 font-medium`}>
                            {p.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={on}
                              aria-label={`${on ? 'تعطيل' : 'تفعيل'} ${p.label}`}
                              disabled={suspended || savingKey === 'bulk' || saving}
                              onClick={() => handleToggle(p.key, !on)}
                              className={`relative w-12 h-7 rounded-full transition-colors ${
                                on ? 'bg-[#541426]' : 'bg-[#541426]'
                              } ${suspended ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <span
                                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all flex items-center justify-center ${
                                  on ? 'right-1' : 'right-6'
                                }`}
                              >
                                {saving ? (
                                  <span className="w-3 h-3 border-2 border-[#541426] border-t-transparent rounded-full animate-spin" />
                                ) : on ? (
                                  <Check size={11} className="text-[#541426]" />
                                ) : (
                                  <X size={11} className="text-[#541426]" />
                                )}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingKey(null)}
                              className="p-2 rounded-lg bg-[#541426]/10 text-[#541426] hover:bg-[#541426]/20"
                              title="إلغاء"
                              aria-label="إلغاء التعديل"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingKey(p.key)}
                            disabled={suspended || savingKey === 'bulk'}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#541426]/12 text-[#541426] border border-[#541426]/30 hover:bg-[#541426]/20 transition-all disabled:opacity-50"
                            title="تعديل الصلاحية"
                            aria-label={`تعديل ${p.label}`}
                          >
                            <Edit3 size={14} />
                            تعديل
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {activeCategory === 'inline' && (
                <p className={`text-xs ${textSub} leading-6 flex items-start gap-2 border border-[#541426]/25 rounded-xl px-3.5 py-2.5 font-medium ${darkMode ? 'bg-[#181316]' : 'bg-[#fffdf8]'}`}>
                  <Info size={15} className="flex-shrink-0 mt-0.5 text-[#541426]" />
                  صلاحيات هذا القسم لا تظهر كأزرار ثابتة في الغرفة — بل كأدوات تحكم منبثقة
                  بجانب العناصر نفسها في الموقع (نصوص، صور، شريط متحرك) لمن يملكها فقط.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PermissionsPanel;
