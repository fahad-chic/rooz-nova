// src/store/useNotifications.js — جرس الإشعارات داخل الموقع (بدون Service Worker)
// القناة: قاعدة D1 عبر /api/broadcast — نفس قناة البث الملكي العاملة، مع دعم
// السجل (?history=1). تُحفظ القراءة محلياً على جهاز الزائر (zustand persist)
// لحساب عدد غير المقروء.
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const MAX_ITEMS = 50;

// يفك رسالة البث إلى {title, body} — إشعارات الموقع (site-notice) تُخزَّن
// رسالتها كـ JSON، والبث الملكي العام يبقى نصاً خاماً كما كان.
export const parseBroadcast = (raw) => {
  const type = raw?.type || 'general';
  const message = typeof raw?.message === 'string' ? raw.message : '';
  let title = null;
  let body = message;

  if (type === 'site-notice') {
    try {
      const parsed = JSON.parse(message);

      if (parsed && typeof parsed === 'object') {
        title = typeof parsed.title === 'string' ? parsed.title : null;
        body = typeof parsed.body === 'string' ? parsed.body : message;
      }
    } catch {
      body = message;
    }
  }

  return {
    id: raw?.id ?? null,
    type,
    title,
    body,
    // created_at من الخادم بالثواني (Unix) — نحوّله إلى مللي ثانية
    at: raw?.created_at ? Number(raw.created_at) * 1000 : Date.now(),
  };
};

const useNotifications = create(
  persist(
    (set, get) => ({
      items: [],
      readIds: new Set(),
      lastSeenAt: 0,
      muted: false,

      // دمج عناصر واردة من الخادم (الأحدث أولاً) مع الحفاظ على الترتيب والحد
      syncFromServer: (list) => {
        if (!Array.isArray(list) || !list.length) return;

        const incoming = list
          .filter((raw) => raw && raw.id != null && raw.message)
          .map(parseBroadcast);

        if (!incoming.length) return;

        const existing = Array.isArray(get().items) ? get().items : [];
        const seen = new Set(existing.map((i) => i.id));
        const fresh = incoming.filter((i) => !seen.has(i.id));

        if (!fresh.length) return;

        const merged = [...fresh, ...existing]
          .sort((a, b) => b.at - a.at)
          .slice(0, MAX_ITEMS);

        set({ items: merged });
      },

      unreadCount: () => {
        const { items, readIds, lastSeenAt, muted } = get();

        if (muted) return 0;

        const safeItems = Array.isArray(items) ? items : [];
        const safeReadIds =
          readIds instanceof Set
            ? readIds
            : new Set(Array.isArray(readIds) ? readIds : []);

        return safeItems.filter(
          (i) => !safeReadIds.has(i.id) && i.at > lastSeenAt
        ).length;
      },

      markAsRead: (itemId) => {
        if (itemId == null) return;

        const current =
          get().readIds instanceof Set
            ? get().readIds
            : new Set(
                Array.isArray(get().readIds) ? get().readIds : []
              );

        if (current.has(itemId)) return;

        const next = new Set(current);
        next.add(itemId);

        set({ readIds: next });
      },

      setReadIds: (ids) => {
        const safeIds = ids instanceof Set
          ? ids
          : new Set(Array.isArray(ids) ? ids : []);

        set({ readIds: safeIds });
      },

      markAllRead: () => {
        const items = Array.isArray(get().items) ? get().items : [];
        const current =
          get().readIds instanceof Set
            ? get().readIds
            : new Set(
                Array.isArray(get().readIds) ? get().readIds : []
              );

        const next = new Set(current);

        items.forEach((item) => {
          if (item?.id != null) {
            next.add(item.id);
          }
        });

        const latest = items[0]?.at || Date.now();

        set({
          readIds: next,
          lastSeenAt: latest,
        });
      },

      toggleMuted: () => set({ muted: !get().muted }),

      clearAll: () =>
        set({
          items: [],
          readIds: new Set(),
          lastSeenAt: Date.now(),
        }),
    }),
    {
      name: 'rooz-site-notifications',
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        items: state.items,
        readIds: Array.from(
          state.readIds instanceof Set
            ? state.readIds
            : Array.isArray(state.readIds)
              ? state.readIds
              : []
        ),
        lastSeenAt: state.lastSeenAt,
        muted: state.muted,
      }),

      merge: (persistedState, currentState) => {
        const persisted =
          persistedState && typeof persistedState === 'object'
            ? persistedState
            : {};

        return {
          ...currentState,
          ...persisted,
          items: Array.isArray(persisted.items)
            ? persisted.items
            : [],
          readIds: new Set(
            Array.isArray(persisted.readIds)
              ? persisted.readIds
              : []
          ),
          lastSeenAt:
            typeof persisted.lastSeenAt === 'number'
              ? persisted.lastSeenAt
              : 0,
          muted:
            typeof persisted.muted === 'boolean'
              ? persisted.muted
              : false,
        };
      },
    }
  )
);

export default useNotifications;