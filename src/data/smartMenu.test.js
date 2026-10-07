import { describe, it, expect } from 'vitest';
import { SMART_MENU, SMART_MENU_LINKS, collectCatalogIds } from './smartMenu';
import { ROYAL_SECTIONS } from '../components/RoyalHome/sectionsData';

// يجمع كل معرّفات الفروع الحقيقية المتاحة كمسارات /catalog/:catalogId
const realCatalogIds = new Set();
ROYAL_SECTIONS.forEach((section) => {
  (section.branches || []).forEach((branch) => {
    if (branch.catalogId) realCatalogIds.add(branch.catalogId);
  });
});

describe('القائمة المنسدلة الذكية — صحة المسارات', () => {
  it('كل تصنيف في القائمة يقود إلى مسار كاتالوج حقيقي موجود', () => {
    const ids = collectCatalogIds(SMART_MENU);
    const missing = ids.filter((id) => !realCatalogIds.has(id));
    expect(missing).toEqual([]);
  });

  it('الروابط السريعة تشير إلى مسارات صفحات مستقلة صحيحة', () => {
    SMART_MENU_LINKS.forEach((link) => {
      expect(link.path.startsWith('/')).toBe(true);
    });
    const paths = SMART_MENU_LINKS.map((l) => l.path);
    expect(paths).toContain('/terms');
    expect(paths).toContain('/wanted-dress');
    expect(paths).toContain('/haraj');
  });

  it('الخيارات الرئيسية التي بلا صفحة تجميعية تملك فروعاً', () => {
    SMART_MENU.forEach((root) => {
      if (!root.catalogId) {
        expect(Array.isArray(root.children) && root.children.length > 0).toBe(true);
      }
    });
  });

  it('لا توجد معرّفات مكررة داخل القائمة', () => {
    const ids = collectCatalogIds(SMART_MENU);
    expect(ids.length).toBe(new Set(ids).size);
  });
});
