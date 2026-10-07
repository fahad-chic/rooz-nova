// src/components/RoyalHome/sectionsData.js
// بيانات الأقسام والفروع — الهوية البصرية الاحترافية لـ أناقة ROOZ

export const ROYAL_SECTIONS = [
  {
    id: 'dresses',
    title: 'فساتين حفلات أنيقة وفخمة',
    icon: 'dress',
    color: '#2563eb',
    branches: [
      {
        id: 'dresses-wedding',
        name: 'فساتين أعراس فخمة',
        catalogId: 'wedding-dresses',
      },
      {
        id: 'dresses-party',
        name: 'فساتين سهرات',
        catalogId: 'party-dresses',
      },
      {
        id: 'dresses-graduation',
        name: 'فساتين تخرج',
        catalogId: 'graduation-dresses',
      },
      {
        id: 'dresses-engagement',
        name: 'فساتين خطوبة',
        catalogId: 'engagement-dresses',
      },
      {
        id: 'dresses-casual',
        name: 'فساتين مناسبات عادية',
        catalogId: 'casual-dresses',
      },
    ],
  },

  {
    id: 'wedding-dresses',
    title: 'فساتين أعراس',
    icon: 'wedding',
    color: '#2563eb',
    branches: [
      {
        id: 'wedding-luxury',
        name: 'أعراس فخمة',
        catalogId: 'luxury-wedding',
      },
      {
        id: 'wedding-simple',
        name: 'أعراس بسيطة',
        catalogId: 'simple-wedding',
      },
      {
        id: 'wedding-red',
        name: 'فساتين أعراس حمراء',
        catalogId: 'red-wedding',
      },
      {
        id: 'wedding-white',
        name: 'فساتين أعراس بيضاء',
        catalogId: 'white-wedding',
      },
    ],
  },

  {
    id: 'girls-dresses',
    title: 'فساتين بنات صغار',
    icon: 'girls',
    color: '#3b82f6',
    branches: [
      {
        id: 'girls-parties',
        name: 'فساتين حفلات',
        catalogId: 'girls-party',
      },
      {
        id: 'girls-wedding',
        name: 'فساتين أعراس',
        catalogId: 'girls-wedding',
      },
      {
        id: 'girls-casual',
        name: 'فساتين يومية',
        catalogId: 'girls-casual',
      },
      {
        id: 'girls-graduation',
        name: 'فساتين تخرج',
        catalogId: 'girls-graduation',
      },
    ],
  },

  {
    id: 'abayas',
    title: 'العبايات بأنواعها',
    icon: 'abaya',
    color: '#35578e',
    branches: [
      {
        id: 'abayas-luxury',
        name: 'عبايات فخمة',
        catalogId: 'luxury-abayas',
      },
      {
        id: 'abayas-daily',
        name: 'عبايات يومية',
        catalogId: 'daily-abayas',
      },
      {
        id: 'abayas-used',
        name: 'عبايات مستخدمة',
        catalogId: 'used-abayas',
      },
      {
        id: 'abayas-emerald',
        name: 'عبايات زرقاء',
        catalogId: 'emerald-abayas',
      },
      {
        id: 'abayas-black',
        name: 'عبايات سوداء',
        catalogId: 'black-abayas',
      },
    ],
  },

  {
    id: 'bags',
    title: 'الشنط والحقائب',
    icon: 'bag',
    color: '#2960b8',
    branches: [
      {
        id: 'bags-brands',
        name: 'شنط ماركات عالمية',
        catalogId: 'brand-bags',
      },
      {
        id: 'bags-evening',
        name: 'شنط سهرة',
        catalogId: 'evening-bags',
      },
      {
        id: 'bags-daily',
        name: 'شنط يومية',
        catalogId: 'daily-bags',
      },
      {
        id: 'bags-travel',
        name: 'شنط سفر',
        catalogId: 'travel-bags',
      },
      {
        id: 'bags-used',
        name: 'شنط مستعملة',
        catalogId: 'used-bags',
      },
    ],
  },

  {
    id: 'shoes',
    title: 'الأحذية',
    icon: 'shoes',
    color: '#2f5a9f',
    branches: [
      {
        id: 'shoes-heels',
        name: 'أحذية كعب',
        catalogId: 'heels-shoes',
      },
      {
        id: 'shoes-flat',
        name: 'أحذية مسطحة',
        catalogId: 'flat-shoes',
      },
      {
        id: 'shoes-sandals',
        name: 'صنادل',
        catalogId: 'sandals-shoes',
      },
      {
        id: 'shoes-boots',
        name: 'أحذية طويلة',
        catalogId: 'boots-shoes',
      },
      {
        id: 'shoes-used',
        name: 'أحذية مستعملة',
        catalogId: 'used-shoes',
      },
    ],
  },

  {
    id: 'used-dresses',
    title: 'فساتين فاخرة مستعملة',
    icon: 'preowned',
    color: '#3c6ab4',
    branches: [
      {
        id: 'used-dresses-wedding',
        name: 'فساتين أعراس',
        catalogId: 'used-wedding-dresses',
      },
      {
        id: 'used-dresses-party',
        name: 'فساتين سهرة',
        catalogId: 'used-party-dresses',
      },
      {
        id: 'used-dresses-abayas',
        name: 'عبايات فاخرة',
        catalogId: 'used-formal-abayas',
      },
      {
        id: 'used-dresses-new',
        name: 'جديد بدون استخدام',
        catalogId: 'used-new-items',
      },
    ],
  },

  {
    id: 'perfumes',
    title: 'العطورات والبخور',
    icon: 'perfume',
    color: '#3263b2',
    branches: [
      {
        id: 'perfumes-women',
        name: 'عطور نسائية',
        catalogId: 'women-perfumes',
      },
      {
        id: 'perfumes-men',
        name: 'عطور رجالية',
        catalogId: 'men-perfumes',
      },
      {
        id: 'perfumes-arabic',
        name: 'عطور عربية',
        catalogId: 'arabic-perfumes',
      },
      {
        id: 'perfumes-incense',
        name: 'بخور',
        catalogId: 'all-incense',
      },
      {
        id: 'perfumes-mix',
        name: 'خلطات ومزيج',
        catalogId: 'mix-perfumes',
      },
    ],
  },

  {
    id: 'golden-mothers',
    title: 'أمهاتنا — الجيل الذهبي',
    icon: 'heritage',
    color: '#2b5dad',
    branches: [
      {
        id: 'golden-jalabiyas',
        name: 'جلابيات',
        catalogId: 'golden-jalabiyas',
      },
      {
        id: 'golden-ashiyal',
        name: 'أشيال (نقابات)',
        catalogId: 'golden-ashiyal',
      },
      {
        id: 'golden-shoes',
        name: 'أحذية مريحة',
        catalogId: 'golden-shoes',
      },
      {
        id: 'golden-abayas',
        name: 'عبايات مخصصة',
        catalogId: 'golden-abayas',
      },
    ],
  },

  {
    id: 'jewelry',
    title: 'المجوهرات والإكسسوارات',
    icon: 'jewelry',
    color: '#3268bf',
    branches: [
      {
        id: 'jewelry-gold',
        name: 'مجوهرات ذهب',
        catalogId: 'gold-jewelry',
      },
      {
        id: 'jewelry-silver',
        name: 'مجوهرات فضة',
        catalogId: 'silver-jewelry',
      },
      {
        id: 'jewelry-costume',
        name: 'إكسسوارات',
        catalogId: 'costume-jewelry',
      },
      {
        id: 'jewelry-watches',
        name: 'ساعات',
        catalogId: 'watches-jewelry',
      },
    ],
  },

  {
    id: 'home-products',
    title: 'الأسر المنتجة',
    icon: 'home',
    color: '#2b5dad',
    branches: [
      {
        id: 'home-food',
        name: 'مأكولات شعبية',
        catalogId: 'home-food',
      },
      {
        id: 'home-crafts',
        name: 'حرف يدوية',
        catalogId: 'home-crafts',
      },
      {
        id: 'home-accessories',
        name: 'إكسسوارات يدوية',
        catalogId: 'home-accessories',
      },
      {
        id: 'home-decor',
        name: 'ديكور منزلي',
        catalogId: 'home-decor',
      },
      {
        id: 'home-bakery',
        name: 'حلويات ومخبوزات',
        catalogId: 'home-bakery',
      },
    ],
  },

  {
    id: 'haraj',
    title: 'موقع حراج ',
    icon: 'store',
    color: '#1d4ed8',
    isAction: true,
    actionPath: '/haraj',
  },
];

export const MARQUEE_BANNERS = [
  {
    id: 1,
    text: 'أهلاً بكم في موقعكم "أناقة ROOZ" ونحيطكم علماً بأن يوجد خصم 30% على جميع الفساتين الجديدة — لفترة محدودة',
    bgColor: 'linear-gradient(135deg, #a7132e, #700c1f)',
  },
];

export const MARQUEE_BANNERS_2 = [
  {
    id: 1,
    text: 'سوق حراج ROOZ — انشر إعلانك مجاناً ووصّل بضاعتك لآلاف الزوار يومياً',
    bgColor: 'linear-gradient(135deg, #154593, #32415b)',
  },
];

export const HARAJ_BANNERS = [
  {
    id: 1,
    text: 'سوق حراج ROOZ — بضاعتك تصل لآلاف الزوار يومياً، انشر إعلانك الآن',
    bgColor: 'linear-gradient(135deg, #a7132e, #700c1f)',
  },
  {
    id: 2,
    text: 'نسبة الموقع موثقة وواضحة: 2% للجديد و1% للمستعمل — لا رسوم خفية',
    bgColor: 'linear-gradient(135deg, #0b477a, #073257)',
  },
  {
    id: 3,
    text: 'تعامل بثقة — جميع الإعلانات تُراجع قبل النشر حمايةً لك من الاحتيال',
    bgColor: 'linear-gradient(135deg, #0e4caf, #0b367c)',
  },
  {
    id: 4,
    text: 'تواصل مباشر مع البائع عبر واتساب أو الاتصال — بدون وسطاء',
    bgColor: 'linear-gradient(135deg, #286cda, #154593)',
  },
];

export const ROYAL_KINGS = [
  {
    name: 'الملك عبدالعزيز',
    title: 'رحمه الله',
    image: 'royal-founder',
    description: 'المؤسس الأول للمملكة العربية السعودية',
  },
  {
    name: 'الملك سلمان',
    title: 'حفظه الله',
    image: 'royal-king',
    description: 'خادم الحرمين الشريفين',
  },
  {
    name: 'ولي العهد',
    title: 'محمد بن سلمان',
    image: 'royal-crown-prince',
    description: 'رؤية 2030 — نحو مستقبل مشرق',
  },
];

export const PREDEFINED_COMMENTS = [
  'أناقة ROOZ أفضل متجر إلكتروني!',
  'خدمة ممتازة وتوصيل سريع',
  'فساتين راقية جداً وألوان رائعة',
  'أسعار تنافسية وجودة عالية',
  'تجربة تسوق ممتعة جداً',
  'الشنط ماركات أصلية 100%',
  'العبايات فخمة وقماش ممتاز',
  'الذكاء الاصطناعي مفيد جداً',
  'تنوع رائع في المنتجات',
  'تغليف راقي وتوصيل آمن',
  'فريق عمل محترف ومتعاون',
  'أحجام دقيقة ومقاسات صحيحة',
  'ألوان ثابتة حتى بعد الغسيل',
  'تصاميم عصرية تناسب جميع الأذواق',
  'أسرع متجر أتسوق منه',
  'خصومات مميزة في المناسبات',
  'مساعدة في اختيار المقاس ممتازة',
  'إرجاع سهل بدون تعقيد',
  'أقارن الأسعار دائماً وأنتم الأرخص',
  'تحديثات الطلب دقيقة ومفصلة',
  'هديتي وصلت في وقتها',
  'ورقيات عالية الجودة',
  'خدمة VIP للعملاء المميزين',
  'تسوق آمن ومعلومات محمية',
  'أنصح الجميع بالتسوق من هنا',
  'منتجات أصلية بأسعار ممتازة',
  'دائماً أجد ما أبحث عنه',
  'تجربة ملكية راقية ومميزة',
  'شكراً على حسن الاستقبال',
  'متجر يستحق الثقة 100%',
];

export const CATALOG_ITEMS = {};