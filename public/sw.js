// Service Worker — وضع "التنظيف الذاتي" (kill switch).
// الغرض: الأجهزة التي علقت عندها نسخة قديمة من الموقع بسبب الكاش العدواني
// في الإصدارات السابقة ستحصل على هذا الملف عند فحص التحديث التلقائي،
// فيمسح كل الكاشات ويلغي تسجيل نفسه ويعيد تحميل الصفحات المفتوحة —
// فيعود الموقع ليعمل من الشبكة مباشرة بأحدث نسخة دائماً.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const names = await caches.keys();
        await Promise.all(names.map((name) => caches.delete(name)));
      } catch {
        // تجاهل — المهم إلغاء التسجيل
      }
      try {
        await self.registration.unregister();
      } catch {
        // تجاهل
      }
      try {
        const clients = await self.clients.matchAll({ type: 'window' });
        clients.forEach((client) => client.navigate(client.url));
      } catch {
        // تجاهل
      }
    })()
  );
});

// بلا fetch handler إطلاقاً — كل الطلبات تذهب للشبكة مباشرة.
