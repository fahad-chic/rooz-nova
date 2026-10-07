// src/context/AdminContext.jsx — إدارة الفروع والموظفين والإعلانات والشكاوى عبر Firestore بربط حقيقي 100%
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback
} from 'react';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db as firebaseDb } from '../firebase/config';
import { useAuth } from './AuthContext';

export const AdminContext = createContext(null);

// اشتراك لحظي آمن في مجموعة Firestore، مع حالة تحميل/خطأ وقيم افتراضية
const useCollection = (db, collectionName, { orderField = 'createdAt', constraints = [] } = {}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!db) {
      setItems([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    setError(null);

    let q;
    try {
      const parts = [collection(db, collectionName)];
      if (orderField) parts.push(orderBy(orderField, 'desc'));
      constraints.forEach((c) => parts.push(c));
      q = query(...parts);
    } catch (e) {
      console.error(`${collectionName} query setup error:`, e);
      setItems([]);
      setError('تعذر تهيئة الاشتراك');
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        const message =
          err?.code === 'permission-denied' || err?.message?.includes('permission')
            ? 'التخزين غير متاح في هذه البيئة'
            : err?.message || `خطأ في جلب ${collectionName}`;
        setItems([]);
        setError(message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, collectionName, orderField]);

  return [items, loading, error];
};

export const AdminProvider = ({ children }) => {
  const db = firebaseDb;

  const {
    user,
    isAuthenticated,
    isOwnerLoggedIn,
    logAction // نستخدم نفس نظام التسجيل من AuthContext
  } = useAuth();

  // بيانات لحظية من Firestore
  const [branches, loadingBranches, branchesError] = useCollection(db, 'branches');
  const [employees, loadingEmployees, employeesError] = useCollection(db, 'employees');
  const [advertisements, loadingAdvertisements, advertisementsError] = useCollection(db, 'advertisements');
  const [complaints, loadingComplaints, complaintsError] = useCollection(db, 'complaints');

  // تسجيل الأحداث (سقوط احتياطي إذا لم يتوفر logAction لسبب ما)
  const log = useCallback(
    async (action, target, extra = {}) => {
      try {
        if (typeof logAction === 'function') {
          await logAction(action, target, extra);
          return;
        }
        if (!db) return;
        await addDoc(collection(db, 'logs'), {
          action,
          target,
          by: user?.uid || 'system',
          byEmail: user?.email || 'system',
          time: serverTimestamp(),
          ...extra
        });
      } catch (e) {
        console.error('AdminContext Log Error', e);
      }
    },
    [db, logAction, user]
  );

  // حماية عمليات الكتابة لتكون للمالك فقط
  const ensureOwner = useCallback(() => {
    if (!isAuthenticated || !isOwnerLoggedIn) {
      throw new Error('غير مصرح لك بتنفيذ هذه العملية');
    }
  }, [isAuthenticated, isOwnerLoggedIn]);

  const requireDb = useCallback(() => {
    if (!db) throw new Error('قاعدة البيانات غير متاحة في هذه البيئة');
  }, [db]);

  /* ══════════════ الفروع ══════════════ */
  const validateBranch = (data) => {
    const name = data?.name?.toString().trim();
    const location = data?.location?.toString().trim();
    const manager = data?.manager?.toString().trim();
    if (!name) throw new Error('اسم الفرع مطلوب');
    if (!location) throw new Error('الموقع مطلوب');
    if (!manager) throw new Error('اسم المدير مطلوب');
  };

  const addBranch = useCallback(
    async (data) => {
      ensureOwner();
      requireDb();
      validateBranch(data);

      const payload = {
        name: data.name.trim(),
        type: data.type || 'عام',
        location: data.location.trim(),
        manager: data.manager.trim(),
        status: data.status || 'نشط',
        completionPercentage: Number(data.completionPercentage) || 0,
        rating: Number(data.rating) || 0,
        createdAt: serverTimestamp(),
        createdBy: user?.uid || 'system',
        createdByEmail: user?.email || 'system'
      };

      const ref = await addDoc(collection(db, 'branches'), payload);
      await log('BRANCH_ADD', ref.id, { ...payload, id: ref.id });
      return ref.id;
    },
    [db, user, ensureOwner, requireDb, log]
  );

  const updateBranch = useCallback(
    async (id, data) => {
      ensureOwner();
      requireDb();
      if (!id) throw new Error('معرّف الفرع مفقود');

      const payload = {
        ...(data.name !== undefined ? { name: data.name.toString().trim() } : {}),
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.location !== undefined ? { location: data.location.toString().trim() } : {}),
        ...(data.manager !== undefined ? { manager: data.manager.toString().trim() } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.completionPercentage !== undefined ? { completionPercentage: Number(data.completionPercentage) || 0 } : {}),
        ...(data.rating !== undefined ? { rating: Number(data.rating) || 0 } : {}),
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || 'system',
        updatedByEmail: user?.email || 'system'
      };

      await updateDoc(doc(db, 'branches', id), payload);
      await log('BRANCH_UPDATE', id, payload);
      return true;
    },
    [db, user, ensureOwner, requireDb, log]
  );

  const deleteBranch = useCallback(
    async (id) => {
      ensureOwner();
      requireDb();
      if (!id) throw new Error('معرّف الفرع مفقود');

      await deleteDoc(doc(db, 'branches', id));
      await log('BRANCH_DELETE', id);
      return true;
    },
    [db, ensureOwner, requireDb, log]
  );

  const getBranchById = useCallback(
    async (id) => {
      if (!id) throw new Error('معرّف الفرع مفقود');
      if (!db) return null;
      const snap = await getDoc(doc(db, 'branches', id));
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() };
    },
    [db]
  );

  /* ══════════════ الموظفون ══════════════ */
  const validateEmployee = (data) => {
    const name = data?.name?.toString().trim();
    const email = data?.email?.toString().trim();
    if (!name) throw new Error('اسم الموظف مطلوب');
    if (!email) throw new Error('بريد الموظف مطلوب');
  };

  const addEmployee = useCallback(
    async (data) => {
      ensureOwner();
      requireDb();
      validateEmployee(data);

      const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
        role: data.role || 'موظف',
        branch: data.branch ?? null,
        status: 'active',
        createdAt: serverTimestamp(),
        createdBy: user?.uid || 'system',
        createdByEmail: user?.email || 'system'
      };

      const ref = await addDoc(collection(db, 'employees'), payload);
      await log('EMPLOYEE_ADD', ref.id, { ...payload, id: ref.id });
      return ref.id;
    },
    [db, user, ensureOwner, requireDb, log]
  );

  const updateEmployee = useCallback(
    async (id, data) => {
      ensureOwner();
      requireDb();
      if (!id) throw new Error('معرّف الموظف مفقود');

      const payload = {
        ...(data.name !== undefined ? { name: data.name.toString().trim() } : {}),
        ...(data.email !== undefined ? { email: data.email.toString().trim() } : {}),
        ...(data.role !== undefined ? { role: data.role } : {}),
        ...(data.branch !== undefined ? { branch: data.branch } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || 'system'
      };

      await updateDoc(doc(db, 'employees', id), payload);
      await log('EMPLOYEE_UPDATE', id, payload);
      return true;
    },
    [db, user, ensureOwner, requireDb, log]
  );

  const banEmployee = useCallback(
    async (id) => {
      ensureOwner();
      requireDb();
      if (!id) throw new Error('معرّف الموظف مفقود');
      await updateDoc(doc(db, 'employees', id), { status: 'banned', updatedAt: serverTimestamp() });
      await log('EMPLOYEE_BAN', id);
      return true;
    },
    [db, ensureOwner, requireDb, log]
  );

  const restoreEmployee = useCallback(
    async (id) => {
      ensureOwner();
      requireDb();
      if (!id) throw new Error('معرّف الموظف مفقود');
      await updateDoc(doc(db, 'employees', id), { status: 'active', updatedAt: serverTimestamp() });
      await log('EMPLOYEE_RESTORE', id);
      return true;
    },
    [db, ensureOwner, requireDb, log]
  );

  const deleteEmployee = useCallback(
    async (id) => {
      ensureOwner();
      requireDb();
      if (!id) throw new Error('معرّف الموظف مفقود');
      await deleteDoc(doc(db, 'employees', id));
      await log('EMPLOYEE_DELETE', id);
      return true;
    },
    [db, ensureOwner, requireDb, log]
  );

  const bannedEmployees = useMemo(
    () => employees.filter((e) => e.status === 'banned'),
    [employees]
  );

  /* ══════════════ الإعلانات ══════════════ */
  const validateAdvertisement = (data) => {
    const title = data?.title?.toString().trim();
    const description = data?.description?.toString().trim();
    if (!title) throw new Error('عنوان الإعلان مطلوب');
    if (!description) throw new Error('نص الإعلان مطلوب');
  };

  const addAdvertisement = useCallback(
    async (data) => {
      ensureOwner();
      requireDb();
      validateAdvertisement(data);

      const payload = {
        title: data.title.trim(),
        description: data.description.trim(),
        imageUrl: data.imageUrl || '',
        expiryDate: data.expiryDate || null,
        isActive: data.isActive !== false,
        createdAt: serverTimestamp(),
        createdBy: user?.uid || 'system',
        createdByEmail: user?.email || 'system'
      };

      const ref = await addDoc(collection(db, 'advertisements'), payload);
      await log('ADVERTISEMENT_ADD', ref.id, { ...payload, id: ref.id });
      return ref.id;
    },
    [db, user, ensureOwner, requireDb, log]
  );

  const updateAdvertisement = useCallback(
    async (id, data) => {
      ensureOwner();
      requireDb();
      if (!id) throw new Error('معرّف الإعلان مفقود');

      const payload = {
        ...(data.title !== undefined ? { title: data.title.toString().trim() } : {}),
        ...(data.description !== undefined ? { description: data.description.toString().trim() } : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
        ...(data.expiryDate !== undefined ? { expiryDate: data.expiryDate } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || 'system'
      };

      await updateDoc(doc(db, 'advertisements', id), payload);
      await log('ADVERTISEMENT_UPDATE', id, payload);
      return true;
    },
    [db, user, ensureOwner, requireDb, log]
  );

  const deleteAdvertisement = useCallback(
    async (id) => {
      ensureOwner();
      requireDb();
      if (!id) throw new Error('معرّف الإعلان مفقود');
      await deleteDoc(doc(db, 'advertisements', id));
      await log('ADVERTISEMENT_DELETE', id);
      return true;
    },
    [db, ensureOwner, requireDb, log]
  );

  const toggleAdvertisement = useCallback(
    async (id) => {
      ensureOwner();
      requireDb();
      if (!id) throw new Error('معرّف الإعلان مفقود');
      const current = advertisements.find((a) => a.id === id);
      const nextActive = current ? !current.isActive : true;
      await updateDoc(doc(db, 'advertisements', id), {
        isActive: nextActive,
        updatedAt: serverTimestamp()
      });
      await log('ADVERTISEMENT_TOGGLE', id, { isActive: nextActive });
      return true;
    },
    [db, advertisements, ensureOwner, requireDb, log]
  );

  /* ══════════════ الشكاوى ══════════════ */
  // تقديم شكوى متاح لكل المستخدمين المُصادَق عليهم
  const addComplaint = useCallback(
    async (data) => {
      requireDb();
      if (!isAuthenticated) throw new Error('يجب تسجيل الدخول لتقديم شكوى');
      const description = data?.description?.toString().trim();
      const title = data?.title?.toString().trim() || 'شكوى';
      if (!description) throw new Error('نص الشكوى مطلوب');

      const payload = {
        title,
        description,
        status: 'pending',
        resolved: false,
        submittedBy: user?.uid || 'anonymous',
        submittedByEmail: user?.email || 'anonymous',
        createdAt: serverTimestamp()
      };

      const ref = await addDoc(collection(db, 'complaints'), payload);
      await log('COMPLAINT_ADD', ref.id, { ...payload, id: ref.id });
      return ref.id;
    },
    [db, user, isAuthenticated, requireDb, log]
  );

  const updateComplaint = useCallback(
    async (id, data) => {
      ensureOwner();
      requireDb();
      if (!id) throw new Error('معرّف الشكوى مفقود');

      const payload = {
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.resolved !== undefined ? { resolved: data.resolved } : {}),
        ...(data.response !== undefined ? { response: data.response } : {}),
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || 'system'
      };

      await updateDoc(doc(db, 'complaints', id), payload);
      await log('COMPLAINT_UPDATE', id, payload);
      return true;
    },
    [db, user, ensureOwner, requireDb, log]
  );

  const resolveComplaint = useCallback(
    async (id) => {
      ensureOwner();
      requireDb();
      if (!id) throw new Error('معرّف الشكوى مفقود');
      await updateDoc(doc(db, 'complaints', id), {
        status: 'معالجة',
        resolved: true,
        updatedAt: serverTimestamp()
      });
      await log('COMPLAINT_RESOLVE', id);
      return true;
    },
    [db, ensureOwner, requireDb, log]
  );

  const value = useMemo(
    () => ({
      // بيانات الفروع
      branches,
      loadingBranches,
      branchesError,
      addBranch,
      updateBranch,
      deleteBranch,
      getBranchById,

      // بيانات الموظفين
      employees,
      bannedEmployees,
      loadingEmployees,
      employeesError,
      addEmployee,
      updateEmployee,
      banEmployee,
      restoreEmployee,
      deleteEmployee,

      // بيانات الإعلانات
      advertisements,
      loadingAdvertisements,
      advertisementsError,
      addAdvertisement,
      updateAdvertisement,
      deleteAdvertisement,
      toggleAdvertisement,

      // بيانات الشكاوى
      complaints,
      loadingComplaints,
      complaintsError,
      addComplaint,
      updateComplaint,
      resolveComplaint
    }),
    [
      branches, loadingBranches, branchesError, addBranch, updateBranch, deleteBranch, getBranchById,
      employees, bannedEmployees, loadingEmployees, employeesError, addEmployee, updateEmployee, banEmployee, restoreEmployee, deleteEmployee,
      advertisements, loadingAdvertisements, advertisementsError, addAdvertisement, updateAdvertisement, deleteAdvertisement, toggleAdvertisement,
      complaints, loadingComplaints, complaintsError, addComplaint, updateComplaint, resolveComplaint
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => useContext(AdminContext);