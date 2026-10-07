// src/components/RoyalHome/RoyalHarajPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Crown,
  Plus,
  ArrowRight,
  Search,
  MapPin,
  X,
  Phone,
  MessageCircle,
  CreditCard,
  Copy,
  Check,
  ShoppingBag,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Shield,
  Building2,
  Landmark,
  Zap,
  BedDouble,
  Car,
  Watch,
  Shirt,
  House,
  BriefcaseBusiness,
  Armchair,
  Home,
  Smartphone,
  Laptop,
  Baby,
  UserRound,
  Package,
  Tv,
  Gem,
} from 'lucide-react';

import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
} from 'firebase/firestore';

import { db } from '../../firebase';
import { ensureFirebaseSession } from '../../utils/firebaseSession';
import HarajUserRegistration from '../haraj/HarajUserRegistration';
import HarajAuth from '../haraj/HarajAuth';

import OwnerEditBadge from '../OwnerEditBadge';
import '../../styles/RoyalHome.css';

const C = {
  gold: '#c47a3a',
  goldLight: '#8f5528',
  goldDark: '#6B521C',
  black: '#0b0a09',
  blackLight: '#2e2513',
  darkBg: '#F4ECDB',
  gray: '#F5EEE0',
  grayLight: '#EDEBE3',
  grayMid: '#8A7A5C',
  white: '#FDFBF7',
  cream: '#241b08',
  green: '#1F9D55',
  red: '#D94646',
};


const LOGO_SRC = '/assets/logo-v2.webp';

const BANK_ACCOUNTS = [
  {
    id: 'alrajhi',
    name: 'بنك الراجحي',
    icon: Building2,
    color: '#00A651',
    iban: 'SA0980000509608010069017',
    account: '09608010069017',
  },
  {
    id: 'arabank',
    name: 'بنك العربي',
    icon: Landmark,
    color: '#0066B2',
    iban: 'SA9830400108088851870011',
    account: '0108088851870011',
  },
];

const HARAJ_SECTIONS = [
  {
    id: 'electronics',
    name: 'أجهزة كهربائية',
    icon: Zap,
    color: '#3B82F6',
  },
  {
    id: 'bedrooms',
    name: 'غرف نوم',
    icon: BedDouble,
    color: '#8B5CF6',
  },
  {
    id: 'cars',
    name: 'سيارات',
    icon: Car,
    color: '#EF4444',
  },
  {
    id: 'watches',
    name: 'ساعات',
    icon: Watch,
    color: '#F59E0B',
  },
  {
    id: 'bags',
    name: 'شنط',
    icon: ShoppingBag,
    color: '#EC4899',
  },
  {
    id: 'clothes',
    name: 'ملابس',
    icon: Shirt,
    color: '#10B981',
  },
  {
    id: 'realestate',
    name: 'عقارات',
    icon: House,
    color: '#6366F1',
  },
  {
    id: 'jobs',
    name: 'وظائف',
    icon: BriefcaseBusiness,
    color: '#14B8A6',
  },
  {
    id: 'furniture',
    name: 'أثاث',
    icon: Armchair,
    color: '#F97316',
  },
  {
    id: 'homeware',
    name: 'مستلزمات',
    icon: Home,
    color: '#84CC16',
  },
  {
    id: 'mobiles',
    name: 'جوالات',
    icon: Smartphone,
    color: '#A855F7',
  },
  {
    id: 'laptops',
    name: 'حواسب',
    icon: Laptop,
    color: '#64748B',
  },
  {
    id: 'kids',
    name: 'أطفال',
    icon: Baby,
    color: '#F472B6',
  },
  {
    id: 'women',
    name: 'نسائي',
    icon: UserRound,
    color: '#FB7185',
  },
  {
    id: 'men',
    name: 'رجالي',
    icon: UserRound,
    color: '#0EA5E9',
  },
  {
    id: 'other',
    name: 'أخرى',
    icon: Package,
    color: '#78716C',
  },
];

const normalizeSaudiPhone = (phone) => {
  if (!phone) return '';

  const digits = String(phone).replace(/\D/g, '');

  if (digits.startsWith('966')) {
    return digits;
  }

  if (digits.startsWith('05') && digits.length === 10) {
    return `966${digits.substring(1)}`;
  }

  if (digits.startsWith('5') && digits.length === 9) {
    return `966${digits}`;
  }

  return digits;
};

const AdCard = ({
  ad,
  onContact,
  isRegistered,
  navigate,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const conditionText =
    ad.condition === true || ad.isNew === true
      ? 'جديد'
      : ad.condition || ad.desc_condition || '';

  const getConditionColor = () => {
    if (conditionText === 'جديد') return C.green;
    if (conditionText === 'ممتازة') return '#10B981';
    return '#F59E0B';
  };

  const imageSource = ad.images?.[0] || ad.image;

  const isImageUrl =
    typeof imageSource === 'string' &&
    /^(https?:\/\/|data:image\/|\/)/i.test(imageSource);

  const locationText = ad.location || ad.city || 'غير محدد';

  const handleCardClick = () => {
    if (ad.id) {
      navigate(`/haraj/ad/${ad.id}`);
    }
  };

  const handleWhatsApp = (event) => {
    event.stopPropagation();

    if (!onContact()) {
      return;
    }

    const phone =
      ad.userPhone ||
      ad.phone ||
      ad.sellerPhone;

    const cleanPhone = normalizeSaudiPhone(phone);

    if (!cleanPhone) {
      return;
    }

    window.open(
      `https://wa.me/${cleanPhone}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleCall = (event) => {
    event.stopPropagation();

    if (!onContact()) {
      return;
    }

    const phone =
      ad.userPhone ||
      ad.phone ||
      ad.sellerPhone;

    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        background: `linear-gradient(145deg, #ffffff 0%, #F8F2E3 100%)`,
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${
          isHovered
            ? `${C.gold}50`
            : C.grayLight
        }`,
        transition: 'all 0.3s ease',
        transform: isHovered
          ? 'translateY(-4px)'
          : 'translateY(0)',
        boxShadow: isHovered
          ? `0 12px 24px ${C.black}60, 0 0 20px ${C.gold}10`
          : `0 4px 12px ${C.black}40`,
        cursor: 'pointer',
        opacity: isRegistered ? 1 : 0.85,
      }}
    >
      <OwnerEditBadge to="/owner-private-room" label="تعديل" />
      <div
        style={{
          height: '120px',
          background: isImageUrl
            ? C.grayLight
            : `linear-gradient(135deg, ${C.grayLight} 0%, ${C.gray} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {isImageUrl ? (
          <img loading="lazy" decoding="async"
            src={imageSource}
            alt={ad.title || 'إعلان'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <ShoppingBag
            size={42}
            color={C.gold}
            strokeWidth={1.5}
          />
        )}

        {conditionText && (
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: getConditionColor(),
              color: C.white,
              padding: '2px 6px',
              borderRadius: 12,
              fontSize: '10px',
              fontWeight: 600,
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            {conditionText}
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, transparent 50%, ${C.black}aa 100%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        />
      </div>

      <div style={{ padding: '10px' }}>
        <h3
          style={{
            margin: '0 0 4px',
            fontSize: '14px',
            fontWeight: 700,
            color: C.cream,
            fontFamily: 'Tajawal, sans-serif',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {ad.title || 'إعلان بدون عنوان'}
        </h3>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: C.gold,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {Number(ad.price || 0).toLocaleString()} ر.س
          </span>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '12px',
              color: '#5a4a32',
              minWidth: 0,
            }}
          >
            <MapPin size={10} />

            <span
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.25,
              }}
            >
              {locationText}
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            marginTop: '8px',
          }}
        >
          <button
            type="button"
            onClick={handleWhatsApp}
            style={{
              background:
                'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              border: 'none',
              borderRadius: 8,
              padding: '6px 4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            <MessageCircle
              size={11}
              color="white"
            />

            <span
              style={{
                color: 'white',
                fontSize: '10px',
                fontWeight: 600,
              }}
            >
              واتساب
            </span>
          </button>

          <button
            type="button"
            onClick={handleCall}
            style={{
              background:
                'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
              border: 'none',
              borderRadius: 8,
              padding: '6px 4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            <Phone
              size={12}
              color={C.black}
            />

            <span
              style={{
                color: C.black,
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              اتصال
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({
  section,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const Icon = section.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: '#ffffff',
        border: `2px solid ${
          isHovered
            ? `${section.color}80`
            : C.grayLight
        }`,
        borderRadius: 14,
        padding: '6px 4px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        transition: 'all 0.3s ease',
        transform: isHovered
          ? 'translateY(-3px)'
          : 'translateY(0)',
        boxShadow: isHovered
          ? `0 8px 20px ${section.color}20`
          : '0 2px 6px rgba(0,0,0,0.2)',
        width: '100%',
        height: '70px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '10px',
          background: `${section.color}25`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isHovered
            ? 'scale(1.08)'
            : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}
      >
        <Icon
          size={18}
          color={section.color}
          strokeWidth={1.8}
        />
      </div>

      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#12100e',
          fontFamily: 'Tajawal, sans-serif',
          textAlign: 'center',
          lineHeight: 1.2,
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: '0 2px',
        }}
      >
        {section.name}
      </span>
    </button>
  );
};

const BankCard = ({ bank }) => {
  const [copied, setCopied] = useState(null);

  const BankIcon = bank.icon;

  const copy = async (text, id) => {
    try {
      if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
      ) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(id);

      window.setTimeout(() => {
        setCopied(null);
      }, 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, #faf6f0 0%, #f3ede4 100%)',
        border: '1.5px solid #c47a3a',
        borderRadius: 14,
        padding: '0.7rem 0.8rem',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 8,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          background: `${bank.color}10`,
          borderRadius: '50%',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '0.45rem',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: `${bank.color}20`,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BankIcon
            size={24}
            color={bank.color}
            strokeWidth={1.8}
          />
        </div>

        <h4
          style={{
            margin: 0,
            fontSize: '0.95rem',
            fontWeight: 900,
            color: '#12100e',
            fontFamily: 'Tajawal, sans-serif',
          }}
        >
          {bank.name}
        </h4>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <p
          style={{
            margin: '0 0 0.25rem',
            fontSize: '0.7rem',
            color: '#5a4a32',
          }}
        >
          IBAN
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #f0e4c4, #e2d09a)',
            border: '1px solid #c47a3a',
            borderRadius: 10,
            padding: '0.4rem 0.6rem',
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#12100e',
              fontFamily: 'monospace',
              direction: 'ltr',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {bank.iban}
          </span>

          <button
            type="button"
            onClick={() =>
              copy(
                bank.iban,
                `${bank.id}-iban`
              )
            }
            aria-label="نسخ رقم الآيبان"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              flexShrink: 0,
            }}
          >
            {copied === `${bank.id}-iban` ? (
              <Check
                size={14}
                color={C.green}
              />
            ) : (
              <Copy
                size={14}
                color={bank.color}
              />
            )}
          </button>
        </div>
      </div>

      <div>
        <p
          style={{
            margin: '0 0 0.25rem',
            fontSize: '0.7rem',
            color: '#5a4a32',
          }}
        >
          رقم الحساب
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #f0e4c4, #e2d09a)',
            border: '1px solid #c47a3a',
            borderRadius: 10,
            padding: '0.4rem 0.6rem',
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#12100e',
              fontFamily: 'monospace',
              direction: 'ltr',
              whiteSpace: 'nowrap',
            }}
          >
            {bank.account}
          </span>

          <button
            type="button"
            onClick={() =>
              copy(
                bank.account,
                `${bank.id}-acc`
              )
            }
            aria-label="نسخ رقم الحساب"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              flexShrink: 0,
            }}
          >
            {copied === `${bank.id}-acc` ? (
              <Check
                size={14}
                color={C.green}
              />
            ) : (
              <Copy
                size={14}
                color={bank.color}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const RoyalHarajPage = () => {
  const navigate = useNavigate();
  const [sectionsOpen, setSectionsOpen] = useState(false);

  const [harajUser, setHarajUser] = useState(null);
  const [showRegisterModal, setShowRegisterModal] =
    useState(false);
  const [showHarajAuth, setShowHarajAuth] =
    useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('الكل');

  // دعم الوصول من الرئيسية: ?q=نص البحث و ?cat=القسم
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('cat');
    if (q) setSearchTerm(q);
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const [visibleAds, setVisibleAds] =
    useState(6);

  const [showAllSections, setShowAllSections] =
    // الأقسام تظهر كاملة تلقائياً (تعديل: متلغّة التبديل)
    useState(true);

  const [realAds, setRealAds] = useState([]);
  const [loadingAds, setLoadingAds] =
    useState(true);

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem('harajUser');

      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored);

      if (
        parsed &&
        typeof parsed === 'object'
      ) {
        setHarajUser(parsed);
      } else {
        localStorage.removeItem('harajUser');
      }
    } catch (error) {
      console.error(
        'Invalid harajUser in localStorage:',
        error
      );

      localStorage.removeItem('harajUser');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchAds = async () => {
      setLoadingAds(true);

      await ensureFirebaseSession();

      const sortByCreatedDesc = (list) =>
        [...list].sort(
          (a, b) =>
            (b.createdAt?.toMillis?.() ?? 0) -
            (a.createdAt?.toMillis?.() ?? 0)
        );

      try {
        let snapshot;
        try {
          // المحاولة الأولى: استعلام مرتب (يحتاج فهرساً مركباً)
          snapshot = await getDocs(
            query(
              collection(db, 'haraj_ads'),
              where('status', '==', 'active'),
              orderBy('createdAt', 'desc')
            )
          );
        } catch (queryError) {
          // في حال غياب الفهرس (failed-precondition) نستعلم بدون ترتيب
          // ونرتّب النتائج على العميل حتى تعمل الصفحة بدون توقف.
          console.warn('haraj index fallback:', queryError?.message);
          snapshot = await getDocs(
            query(
              collection(db, 'haraj_ads'),
              where('status', '==', 'active')
            )
          );
        }

        const ads = sortByCreatedDesc(
          snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );

        if (isMounted) {
          setRealAds(ads);
        }
      } catch (error) {
        console.error(
          'Error fetching ads:',
          error
        );

        if (isMounted) {
          setRealAds([]);
        }
      } finally {
        if (isMounted) {
          setLoadingAds(false);
        }
      }
    };

    fetchAds();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleContact = useCallback(() => {
    if (!harajUser) {
      setShowHarajAuth(true);
      return false;
    }

    return true;
  }, [harajUser]);

  const handleRegistrationSuccess = (
    data
  ) => {
    setHarajUser(data);
    setShowRegisterModal(false);
    setShowHarajAuth(false);

    try {
      localStorage.setItem(
        'harajUser',
        JSON.stringify(data)
      );
    } catch (error) {
      console.error(
        'Unable to save harajUser:',
        error
      );
    }
  };

  const handleHarajAuthSuccess = (
    userData
  ) => {
    setHarajUser(userData);
    setShowHarajAuth(false);
    setShowRegisterModal(false);

    try {
      localStorage.setItem(
        'harajUser',
        JSON.stringify(userData)
      );
    } catch (error) {
      console.error(
        'Unable to save harajUser:',
        error
      );
    }
  };

  const openAuth = () => {
    setShowHarajAuth(true);
  };

  const openRegistration = () => {
    setShowHarajAuth(false);
    setShowRegisterModal(true);
  };

  const adsData = Array.isArray(realAds)
    ? realAds
    : [];

  const search = searchTerm
    .toLowerCase()
    .trim();

  const filteredAds = adsData.filter((ad) => {
    const title = String(
      ad.title || ''
    ).toLowerCase();

    const description = String(
      ad.description || ''
    ).toLowerCase();

    const matchSearch =
      !search ||
      title.includes(search) ||
      description.includes(search);

    const matchCategory =
      selectedCategory === 'الكل' ||
      ad.category === selectedCategory;

    return (
      matchSearch &&
      matchCategory
    );
  });

  const categories = [
    'الكل',
    ...new Set(
      adsData
        .map((ad) => ad.category)
        .filter(Boolean)
    ),
  ];

  const displayedSections =
    showAllSections
      ? HARAJ_SECTIONS
      : HARAJ_SECTIONS.slice(0, 8);

  const displayedAds =
    filteredAds.slice(0, visibleAds);

  const hasMoreAds =
    visibleAds < filteredAds.length;

  return (
    <div
      className="rh-root haraj-page"
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'transparent',
        fontFamily:
          'Tajawal, sans-serif',
        direction: 'rtl',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      <div className="rh-bg" aria-hidden="true" />
      <div className="rh-topline" aria-hidden="true" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Tajawal:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          overflow-x: hidden !important;
        }

        .haraj-page {
          overflow-x: hidden !important;
          width: 100%;
        }

        .haraj-page * {
          max-width: 100%;
        }

        .ads-grid {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 14px !important;
          width: 100% !important;
        }

        .sections-grid {
          display: grid !important;
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          gap: 8px !important;
          width: 100% !important;
        }

        @media (min-width: 768px) {
          .ads-grid {
            grid-template-columns: 1fr !important;
          }

          .sections-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
        }

        @media (max-width: 400px) {
          .sections-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            gap: 6px !important;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.08);
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(-50%);
          }

          100% {
            transform: translateX(0);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }

          50% {
            background-position: 100% 50%;
          }

          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(100%);
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }

          100% {
            transform: rotate(360deg);
          }
        }

        .shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        /* لافتة «أعلن الآن» — تتغلب على قاعدة الأزرار الذهبية العامة */
        .haraj-page .haraj-cta-banner {
          background: linear-gradient(120deg, #4338ca 0%, #7c3aed 45%, #a4163f 100%) !important;
          border: none !important;
          box-shadow: 0 10px 28px rgba(67, 56, 202, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25) !important;
          font-weight: 800 !important;
        }
      `}</style>

      <header
        style={{
          background: `linear-gradient(180deg, ${C.darkBg} 0%, #F8F2E3 100%)`,
          borderBottom: `1px solid ${C.gold}30`,
          padding: '1rem',
          position: 'sticky',
          top: 'var(--rooz-top-offset, 0px)',
          zIndex: 100,
          backdropFilter: 'blur(20px)',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            maxWidth: '600px',
            width: '100%',
            margin: '0 auto',
            overflow: 'hidden',
          }}
        >
          {/* زر الرجوع العام من App فقط — لتجنب تداخل الرجوع */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flex: 1,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 15px ${C.gold}40`,
              }}
            >
              <ShoppingBag
                size={20}
                color={C.black}
              />
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: 800,
                color: C.cream,
                fontFamily:
                  'Tajawal, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <img fetchPriority="high"
                src={LOGO_SRC}
                alt="أناقة ROOZ"
                style={{
                  width: 48,
                  height: 48,
                  objectFit: 'contain',
                  clipPath: 'circle(48%)',
                  background: '#141003',
                  borderRadius: '50%',
                  border: `2px solid ${C.gold}`,
                  boxShadow: `0 0 12px ${C.gold}60`,
                }}
              />
            </h1>
          </div>
        </div>
      </header>

      {/* لافتات حراج الإبداعية — شريط متحرك ملوّن يمين ← يسار */}
      {/* رسالة البث تظهر في الصفحة الرئيسية فقط (كما طلب المستخدم) — لا شريط بث في الحراج */}

      {/* لافتة الدعوة للإعلان — بطاقة متدرجة ملفتة */}
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          margin: '0 auto',
          padding: '0.5rem 0.75rem 0',
          boxSizing: 'border-box',
        }}
      >
        <button
          type="button"
          className="haraj-cta-banner"
          onClick={() => {
            // لا يمكن الإعلان دون تسجيل: فتح نافذة الدخول/التسجيل أولاً
            if (!harajUser) {
              setShowHarajAuth(true);
            } else {
              navigate('/haraj/post');
            }
          }}
          style={{
            width: '100%',
            cursor: 'pointer',
            borderRadius: 16,
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            direction: 'rtl',
            color: '#ffffff',
            fontFamily: 'Tajawal, sans-serif',
            textAlign: 'right',
          }}
        >
          <span
            style={{
              flexShrink: 0,
              width: 46,
              height: 46,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.16)',
              border: '1.5px solid rgba(212,175,55,0.7)',
            }}
          >
            <Sparkles size={22} color="#ffd978" aria-hidden="true" />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontWeight: 900, fontSize: '1.02rem', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
              أعلن عن سلعتك الآن — مجاناً
            </span>
            <span style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', opacity: 0.92, marginTop: 2 }}>
              إعلانك يُراجع ويُنشر أمام آلاف الزوار خلال وقت قصير
            </span>
          </span>
          <Plus
            size={20}
            color="#ffd978"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          />
        </button>
      </div>

      <main
        style={{
          maxWidth: '600px',
          width: '100%',
          margin: '0 auto',
          padding: '1rem',
          overflowX: 'hidden',
        }}
      >
        {!harajUser && (
          <div
            style={{
              background: `linear-gradient(145deg, rgba(255,252,245,0.95) 0%, rgba(244,232,209,0.9) 100%)`,
              border: `1px solid ${C.gold}30`,
              borderRadius: 12,
              padding: '1rem',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
            }}
            onClick={openAuth}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' ||
                event.key === ' '
              ) {
                openAuth();
              }
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Crown
                size={20}
                color={C.black}
              />
            </div>

            <p
              style={{
                margin: 0,
                fontSize: '0.9rem',
                fontWeight: 600,
                color: C.cream,
                lineHeight: 1.5,
              }}
            >
              عزيزي الزائر: سجل في منصة الإعلانات ليتم فتح جميع المميزات
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            if (!harajUser) {
              openAuth();
            } else {
              navigate('/haraj/post');
            }
          }}
          style={{
            width: '70%',
            height: '55px',
            background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 50%, ${C.gold} 100%)`,
            backgroundSize: '200% 200%',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            margin: '0 auto 1.5rem',
            boxShadow: `0 6px 20px ${C.gold}40`,
            animation:
              'gradient 3s ease infinite',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            className="shimmer"
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg, transparent, ${C.white}15, transparent)`,
            }}
          />

          <Plus
            size={22}
            color={C.black}
          />

          <span
            style={{
              fontSize: '17px',
              fontWeight: 800,
              color: C.black,
              fontFamily:
                'Tajawal, sans-serif',
              position: 'relative',
            }}
          >
            ضع إعلانك هنا
          </span>
        </button>

        <div
          style={{
            position: 'relative',
            marginBottom: '0.75rem',
          }}
        >
          <Search
            size={18}
            color={C.grayMid}
            style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform:
                'translateY(-50%)',
            }}
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(
                event.target.value
              );
              setVisibleAds(6);
            }}
            placeholder="ابحث عن سلعة..."
            aria-label="البحث عن سلعة"
            style={{
              width: '100%',
              background: `linear-gradient(145deg, #ffffff 0%, #F8F2E3 100%)`,
              border: `1px solid #c9b476`,
              borderRadius: 14,
              padding:
                '0.85rem 1rem 0.85rem 3rem',
              color: '#12100e',
              caretColor: '#12100e',
              fontSize: '0.9rem',
              fontFamily:
                'Tajawal, sans-serif',
              outline: 'none',
              fontWeight: 600,
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <select
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(
                event.target.value
              );
              setVisibleAds(6);
            }}
            aria-label="اختر القسم"
            style={{
              width: '100%',
              background: '#ffffff',
              border: `1px solid #c9b476`,
              borderRadius: 14,
              padding: '0.75rem 1rem',
              color: '#12100e',
              fontSize: '0.9rem',
              fontFamily:
                'Tajawal, sans-serif',
              outline: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
                style={{ color: '#12100e', background: '#ffffff' }}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        <section
          style={{ marginBottom: '0.85rem' }}
        >
          <button
            type="button"
            onClick={() => setSectionsOpen((v) => !v)}
            style={{
              width: '100%',
              marginBottom: sectionsOpen ? '0.75rem' : 0,
              background: 'linear-gradient(145deg, #faf6f0, #f3ede4)',
              border: '1.5px solid #c47a3a',
              borderRadius: 14,
              padding: '0.85rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              color: '#12100e',
              fontSize: '0.95rem',
              fontWeight: 900,
              fontFamily: 'Tajawal, sans-serif',
              boxShadow: '0 2px 10px rgba(176,138,62,0.15)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Crown size={18} color="#c47a3a" />
              أقسام الحراج
              <span style={{
                background: '#c47a3a',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 900,
                padding: '2px 8px',
                borderRadius: 999,
              }}>{HARAJ_SECTIONS.length}</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 800 }}>
              {sectionsOpen ? 'إخفاء' : 'عرض'}
              {sectionsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </span>
          </button>

          {sectionsOpen && (
            <>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.78rem', color: '#5a4a32', fontWeight: 600 }}>
                اختر قسماً لتصفية الإعلانات حسب النوع
              </p>
              <div className="sections-grid">
                {HARAJ_SECTIONS.map((section) => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    onClick={() => {
                      setSelectedCategory(section.name);
                      setSectionsOpen(false);
                      setVisibleAds(6);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        <section
          style={{ marginBottom: '0.85rem' }}
        >
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: C.cream,
              marginBottom: '1rem',
            }}
          >
            {loadingAds
              ? 'جاري تحميل الإعلانات...'
              : `أحدث الإعلانات (${filteredAds.length})`}
          </h2>

          {loadingAds ? (
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'center',
                padding: '3rem',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: `3px solid ${C.grayLight}`,
                  borderTopColor: C.gold,
                  borderRadius: '50%',
                  animation:
                    'spin 1s linear infinite',
                }}
              />
            </div>
          ) : filteredAds.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                background: `linear-gradient(145deg, #ffffff 0%, #F8F2E3 100%)`,
                border: `1px solid ${C.grayLight}`,
                borderRadius: 16,
                color: '#5a4a32',
                fontFamily:
                  'Tajawal, sans-serif',
              }}
            >
              لا توجد إعلانات متاحة حاليًا
            </div>
          ) : (
            <div className="ads-grid">
              {displayedAds.map((ad) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  isRegistered={
                    !!harajUser
                  }
                  onContact={
                    handleContact
                  }
                  navigate={navigate}
                />
              ))}
            </div>
          )}

          {hasMoreAds && (
            <button
              type="button"
              onClick={() =>
                setVisibleAds(
                  (previous) =>
                    previous + 6
                )
              }
              style={{
                width: '100%',
                marginTop: '1.5rem',
                background: `linear-gradient(135deg, ${C.gold} 0%, #cdb27a 100%)`,
                border: `1px solid ${C.gold}`,
                borderRadius: 14,
                padding: '1rem',
                cursor: 'pointer',
                color: '#1c1408',
                fontSize: '0.9rem',
                fontWeight: 800,
                fontFamily:
                  'Tajawal, sans-serif',
                boxShadow: '0 6px 18px rgba(141,109,29,0.25)',
              }}
            >
              عرض المزيد من الإعلانات (
              {Math.max(
                filteredAds.length -
                  visibleAds,
                0
              )}{' '}
              متبقي)
            </button>
          )}
        </section>

        <section
          style={{ marginBottom: '0.85rem' }}
        >
          <div
            style={{
              background: `linear-gradient(145deg, #ffffff 0%, #F8F2E3 100%)`,
              border: `1px solid ${C.gold}30`,
              borderRadius: 20,
              padding: '0.75rem 0.85rem',
            }}
          >
            <h2
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: '#12100e',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CreditCard
                size={18}
                color={C.gold}
              />

              نسبة الموقع
            </h2>

            <div
              style={{
                background: 'linear-gradient(145deg, #e8a35c 0%, #c47a3a 55%, #8f5528 100%)',
                borderRadius: 12,
                padding: '0.55rem 0.75rem',
                border: '1.5px solid #8f5528',
                boxShadow: '0 2px 8px rgba(176,138,62,0.25)',
                display: 'inline-block',
                width: '100%',
                maxWidth: 320,
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    flex: 1,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: '1.15rem',
                      fontWeight: 900,
                      color: '#0a0804',
                    }}
                  >
                    1%
                  </p>

                  <p
                    style={{
                      margin:
                        '0.25rem 0 0',
                      fontSize:
                        '0.75rem',
                      color: '#12100e',
                    }}
                  >
                    المستخدمة
                  </p>
                </div>

                <div
                  style={{
                    width: 1,
                    background:
                      C.grayLight,
                  }}
                />

                <div
                  style={{
                    textAlign: 'center',
                    flex: 1,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: '1.15rem',
                      fontWeight: 900,
                      color: C.gold,
                    }}
                  >
                    2%
                  </p>

                  <p
                    style={{
                      margin:
                        '0.25rem 0 0',
                      fontSize:
                        '0.75rem',
                      color: C.grayMid,
                    }}
                  >
                    الجديدة
                  </p>
                </div>
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: '0.8rem',
                  color: C.grayMid,
                  fontFamily:
                    'Tajawal, sans-serif',
                }}
              >
                وتعتبر هذه النسبة في ذمة المعلن عند بيع السلعة
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            marginBottom: '0.85rem',
            padding: '0.75rem 0.85rem',
            background: `linear-gradient(135deg, ${C.darkBg} 0%, rgba(197,168,92,0.1) 100%)`,
            borderRadius: '16px',
            border: `1px solid ${C.gold}40`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldLight} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield
                size={24}
                color={C.darkBg}
              />
            </div>

            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: C.gold,
                }}
              >
                منصة الإعلانات في أناقة ROOZ
              </h3>

              <p
                style={{
                  margin:
                    '0.15rem 0 0',
                  fontSize:
                    '0.75rem',
                  color: C.grayMid,
                }}
              >
                موثوقية وأمان بمعايير عالمية
              </p>
            </div>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: '0.9rem',
              lineHeight: 1.8,
              color: C.cream,
              fontFamily:
                'Tajawal, sans-serif',
              textAlign: 'justify',
            }}
          >
            تجمع منصة الإعلانات في موقع «أناقة ROOZ» بين الموثوقية المطلقة
            وأعلى معايير الحماية لبيانات زوار الموقع ومستخدميه، مما يضمن بيئة
            تصفح آمنة وتجربة إعلانية موثوقة للجميع.
          </p>
        </section>

        <section
          style={{ marginBottom: '0.85rem' }}
        >
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: C.cream,
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CreditCard
              size={18}
              color={C.gold}
            />

            الحسابات البنكية
          </h2>

          <div
            style={{
              display: 'grid',
              gap: '1rem',
            }}
          >
            {BANK_ACCOUNTS.map((bank) => (
              <BankCard
                key={bank.id}
                bank={bank}
              />
            ))}
          </div>
        </section>

        <footer
          style={{
            textAlign: 'center',
            padding: '0.75rem 0.85rem',
            borderTop: `1px solid ${C.grayLight}`,
            marginTop: '1rem',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.8rem',
              color: C.grayMid,
              fontFamily:
                'Tajawal, sans-serif',
            }}
          >
            جميع الحقوق محفوظة © أناقة ROOZ 2026
          </p>
        </footer>
      </main>

      {harajUser && (
        <div
          style={{
            position: 'fixed',
            bottom: '1rem',
            left: '50%',
            transform:
              'translateX(-50%)',
            background: `linear-gradient(135deg, ${C.green} 0%, #16A34A 100%)`,
            borderRadius: 50,
            padding: '0.6rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: `0 8px 30px ${C.green}40`,
            zIndex: 100,
            maxWidth: '90%',
          }}
        >
          <Check
            size={16}
            color="white"
          />

          <span
            style={{
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 600,
              fontFamily:
                'Tajawal, sans-serif',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            مسجل:{' '}
            {harajUser.name ||
              harajUser.displayName ||
              'مستخدم'}
          </span>

          {/* زر تسجيل الخروج من حساب حراج — يمسح الجلسة ويعيد تحميل الصفحة */}
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('harajUser');
              setHarajUser(null);
            }}
            aria-label="تسجيل الخروج"
            style={{
              marginInlineStart: '0.5rem',
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.4)',
              color: 'white',
              borderRadius: 999,
              padding: '0.35rem 0.9rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'Tajawal, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            خروج
          </button>
        </div>
      )}

      <HarajUserRegistration
        isOpen={showRegisterModal}
        onClose={() =>
          setShowRegisterModal(false)
        }
        onSuccess={
          handleRegistrationSuccess
        }
      />

      <HarajAuth
        isOpen={showHarajAuth}
        onClose={() =>
          setShowHarajAuth(false)
        }
        onCreateAccount={
          openRegistration
        }
        onSuccess={
          handleHarajAuthSuccess
        }
      />
    </div>
  );
};

export default RoyalHarajPage;
