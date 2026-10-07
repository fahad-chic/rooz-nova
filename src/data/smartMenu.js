// src/data/smartMenu.js
// هيكلة القوائم المنسدلة المتقدمة (Nested Dropdown): خيارات رئيسية،
// وتحت كل خيار فروع وتصنيفات تفصيلية، ولكل تصنيف مسار حقيقي في الموقع.
//
// ملاحظة: catalogId هنا مطابق تماماً للمعرّفات المستخدمة في sectionsData.js
// وفي مسار /catalog/:catalogId — حتى لا يحدث أي تحويل خاطئ للمسار.
// بعض الخيارات الرئيسية (مثل العبايات والشنط) لا تملك صفحة تجميعية خاصة،
// فتُفتح فروعها فقط عند النقر على زر (+).

export const SMART_MENU = [
  {
    id: 'wedding-dresses',
    label: 'فساتين الأعراس',
    catalogId: 'wedding-dresses',
    children: [
      {
        id: 'wedding-new',
        label: 'جديدة',
        catalogId: 'wedding-dresses-new',
        children: [
          { id: 'wedding-new-s', label: 'مقاس S', catalogId: 'wedding-dresses-new', size: 'S' },
          { id: 'wedding-new-m', label: 'مقاس M', catalogId: 'wedding-dresses-new', size: 'M' },
          { id: 'wedding-new-l', label: 'مقاس L', catalogId: 'wedding-dresses-new', size: 'L' },
          { id: 'wedding-new-xl', label: 'مقاس XL', catalogId: 'wedding-dresses-new', size: 'XL' },
          { id: 'wedding-new-custom', label: 'مقاسات خاصة', catalogId: 'wedding-dresses-new', size: 'خاص' },
        ],
      },
      {
        id: 'wedding-used',
        label: 'مستعملة',
        catalogId: 'wedding-dresses-used',
        children: [
          { id: 'wedding-used-s', label: 'مقاس S', catalogId: 'wedding-dresses-used', size: 'S' },
          { id: 'wedding-used-m', label: 'مقاس M', catalogId: 'wedding-dresses-used', size: 'M' },
          { id: 'wedding-used-l', label: 'مقاس L', catalogId: 'wedding-dresses-used', size: 'L' },
          { id: 'wedding-used-xl', label: 'مقاس XL', catalogId: 'wedding-dresses-used', size: 'XL' },
          { id: 'wedding-used-custom', label: 'مقاسات خاصة', catalogId: 'wedding-dresses-used', size: 'خاص' },
        ],
      },
      { id: 'wedding-luxury', label: 'أعراس فخمة', catalogId: 'luxury-wedding' },
      { id: 'wedding-simple', label: 'أعراس بسيطة', catalogId: 'simple-wedding' },
      { id: 'wedding-white', label: 'فساتين بيضاء', catalogId: 'white-wedding' },
      { id: 'wedding-red', label: 'فساتين حمراء', catalogId: 'red-wedding' },
    ],
  },
  {
    id: 'party-dresses',
    label: 'فساتين السهرات والحفلات',
    catalogId: 'party-dresses',
    children: [
      { id: 'party-graduation', label: 'فساتين تخرج', catalogId: 'graduation-dresses' },
      { id: 'party-engagement', label: 'فساتين خطوبة', catalogId: 'engagement-dresses' },
      { id: 'party-casual', label: 'فساتين مناسبات عادية', catalogId: 'casual-dresses' },
    ],
  },
  {
    id: 'girls-dresses',
    label: 'فساتين البنات',
    catalogId: null,
    children: [
      { id: 'girls-party', label: 'فساتين حفلات', catalogId: 'girls-party' },
      { id: 'girls-wedding', label: 'فساتين أعراس', catalogId: 'girls-wedding' },
      { id: 'girls-casual', label: 'فساتين يومية', catalogId: 'girls-casual' },
      { id: 'girls-graduation', label: 'فساتين تخرج', catalogId: 'girls-graduation' },
    ],
  },
  {
    id: 'used-dresses',
    label: 'فساتين فاخرة مستعملة',
    catalogId: null,
    children: [
      { id: 'used-wedding', label: 'فساتين أعراس', catalogId: 'used-wedding-dresses' },
      { id: 'used-party', label: 'فساتين سهرة', catalogId: 'used-party-dresses' },
      { id: 'used-abayas', label: 'عبايات فاخرة', catalogId: 'used-formal-abayas' },
      { id: 'used-new', label: 'جديد بدون استخدام', catalogId: 'used-new-items' },
    ],
  },
  {
    id: 'abayas',
    label: 'العبايات',
    catalogId: null,
    children: [
      { id: 'luxury-abayas', label: 'عبايات فخمة', catalogId: 'luxury-abayas' },
      { id: 'daily-abayas', label: 'عبايات يومية', catalogId: 'daily-abayas' },
      { id: 'used-abayas', label: 'عبايات مستخدمة', catalogId: 'used-abayas' },
      { id: 'black-abayas', label: 'عبايات سوداء', catalogId: 'black-abayas' },
      { id: 'emerald-abayas', label: 'عبايات ملونة', catalogId: 'emerald-abayas' },
    ],
  },
  {
    id: 'bags',
    label: 'الشنط والحقائب',
    catalogId: null,
    children: [
      { id: 'brand-bags', label: 'شنط ماركات عالمية', catalogId: 'brand-bags' },
      { id: 'evening-bags', label: 'شنط سهرة', catalogId: 'evening-bags' },
      { id: 'daily-bags', label: 'شنط يومية', catalogId: 'daily-bags' },
      { id: 'travel-bags', label: 'شنط سفر', catalogId: 'travel-bags' },
      { id: 'used-bags', label: 'شنط مستعملة', catalogId: 'used-bags' },
    ],
  },
  {
    id: 'shoes',
    label: 'الأحذية',
    catalogId: null,
    children: [
      { id: 'heels-shoes', label: 'أحذية كعب', catalogId: 'heels-shoes' },
      { id: 'flat-shoes', label: 'أحذية مسطحة', catalogId: 'flat-shoes' },
      { id: 'sandals-shoes', label: 'صنادل', catalogId: 'sandals-shoes' },
      { id: 'boots-shoes', label: 'أحذية طويلة', catalogId: 'boots-shoes' },
      { id: 'used-shoes', label: 'أحذية مستعملة', catalogId: 'used-shoes' },
    ],
  },
  {
    id: 'perfumes',
    label: 'العطورات والبخور',
    catalogId: null,
    children: [
      { id: 'women-perfumes', label: 'عطور نسائية', catalogId: 'women-perfumes' },
      { id: 'men-perfumes', label: 'عطور رجالية', catalogId: 'men-perfumes' },
      { id: 'arabic-perfumes', label: 'عطور عربية', catalogId: 'arabic-perfumes' },
      { id: 'all-incense', label: 'بخور', catalogId: 'all-incense' },
      { id: 'mix-perfumes', label: 'خلطات ومزيج', catalogId: 'mix-perfumes' },
    ],
  },
  {
    id: 'jewelry',
    label: 'المجوهرات والإكسسوارات',
    catalogId: null,
    children: [
      { id: 'gold-jewelry', label: 'مجوهرات ذهب', catalogId: 'gold-jewelry' },
      { id: 'silver-jewelry', label: 'مجوهرات فضة', catalogId: 'silver-jewelry' },
      { id: 'costume-jewelry', label: 'إكسسوارات', catalogId: 'costume-jewelry' },
      { id: 'watches-jewelry', label: 'ساعات', catalogId: 'watches-jewelry' },
    ],
  },
  {
    id: 'golden-mothers',
    label: 'أمهاتنا — الجيل الذهبي',
    catalogId: null,
    children: [
      { id: 'golden-jalabiyas', label: 'جلابيات', catalogId: 'golden-jalabiyas' },
      { id: 'golden-ashiyal', label: 'أشيال (نقابات)', catalogId: 'golden-ashiyal' },
      { id: 'golden-shoes', label: 'أحذية مريحة', catalogId: 'golden-shoes' },
      { id: 'golden-abayas', label: 'عبايات مخصصة', catalogId: 'golden-abayas' },
    ],
  },
  {
    id: 'home-products',
    label: 'الأسر المنتجة',
    catalogId: null,
    children: [
      { id: 'home-food', label: 'مأكولات شعبية', catalogId: 'home-food' },
      { id: 'home-crafts', label: 'حرف يدوية', catalogId: 'home-crafts' },
      { id: 'home-accessories', label: 'إكسسوارات يدوية', catalogId: 'home-accessories' },
      { id: 'home-decor', label: 'ديكور منزلي', catalogId: 'home-decor' },
      { id: 'home-bakery', label: 'حلويات ومخبوزات', catalogId: 'home-bakery' },
    ],
  },
];

// روابط سريعة ذات صفحات مستقلة (تُدرج في القائمة الذكية)
export const SMART_MENU_LINKS = [
  { id: 'haraj', label: 'موقع حراج الرسمي', path: '/haraj' },
  { id: 'wanted', label: 'طلب فستان', path: '/wanted-dress' },
  { id: 'terms', label: 'شروط وأحكام الاستخدام', path: '/terms' },
  { id: 'faq', label: 'الأسئلة الشائعة', path: '/faq' },
  { id: 'contact', label: 'تواصل معنا', path: '/contact' },
];

// يجمع كل معرّفات التصنيفات في القائمة (لاختبار صحة المسارات).
export const collectCatalogIds = (menu = SMART_MENU) => {
  const ids = new Set();
  const walk = (nodes) => {
    nodes.forEach((node) => {
      if (node.catalogId) ids.add(node.catalogId);
      if (node.children?.length) walk(node.children);
    });
  };
  walk(menu);
  return [...ids];
};
