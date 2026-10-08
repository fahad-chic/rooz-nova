// src/components/Navigation.jsx
// ============================================================
// Navigation Component - أناقة ROOZ
// تحسينات الأداء + تعليقات توضيحية كاملة
// ============================================================

import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  LogOut,
  Home,
  Users,
  Zap,
  MessageSquare,
  Info,
  Menu,
  X,
  Eye,
  EyeOff,
  ShoppingBag,
  Crown,
  Settings,
  Bell,
  Mail,
  Megaphone,
  Bot,
  Store,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Gem,
  Headphones,
  MonitorSmartphone
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useNotifications from '../store/useNotifications';
import ContactOwnerModal from './ContactOwnerModal';
import BroadcastModal from './BroadcastModal';
import { ROYAL_SECTIONS } from './RoyalHome/sectionsData';
import OwnerEditBadge from './OwnerEditBadge';
import SmartDropdownMenu from './SmartDropdownMenu';
import RoyalHeader from './RoyalHeader';
import '../styles/smart-menu.css';

// ============================================================
// ثوابت خارج المكوّن → لا يُعاد إنشاؤها في كل تصيير (تحسين أداء)
// ============================================================
const SECTION_ICONS = {
  'dresses': Home,
  'wedding-dresses': Sparkles,
  'girls-dresses': Sparkles,
  'abayas': Sparkles,
  'bags': ShoppingBag,
  'shoes': Sparkles,
  'used-dresses': Sparkles,
  'perfumes': Sparkles,
  'golden-mothers': Crown,
  'jewelry': Sparkles,
  'home-products': Store,
};

const PAGES = [
  { id: 'dashboard', label: 'الرئيسية', icon: Home, path: '/' },
  { id: 'owner-private', label: 'غرفة صاحب موقع أناقة ROOZ', icon: Crown, path: '/owner-private-room', ownerOnly: true },
  { id: 'admin-panel', label: 'الإدارة', icon: Settings, path: '/admin', ownerOnly: true },
  { id: 'contact-owner', label: 'مراسلة صاحب الموقع', icon: Mail, opensModal: true },
  { id: 'ads', label: 'موقع الحراج الرسمي', icon: ShoppingBag, path: '/haraj' },
  { id: 'branches', label: 'الفروع', icon: Zap, path: '/branches' },
  { id: 'employees', label: 'فريق العمل', icon: Users, path: '/employees' },
  { id: 'contact', label: 'تواصل معنا', icon: MessageSquare, path: '/contact' },
  { id: 'about', label: 'حول الموقع', icon: Info, path: '/about' }
];

// ============================================================
// المكوّن الرئيسي
// ============================================================
const Navigation = ({ onOpenWelcome, onOpenAIChat }) => {
  const {
    user,
    userRole,
    logout,
    isOwnerLoggedIn,
    ownerHiddenMode,
    toggleOwnerHiddenMode
  } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);
  const [showOwnerContact, setShowOwnerContact] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [infoModal, setInfoModal] = useState(null);
  const [showElegantWelcome, setShowElegantWelcome] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setExpandedSection(null);
  }, []);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    closeMenu();
    try {
      await logout?.();
    } catch (e) {
      console.warn('logout error:', e);
    }
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      window.sessionStorage.removeItem('rooz_owner_banner');
    } catch {
      // تجاهل الأخطاء غير الحرجة
    }
    navigate('/login', { replace: true });
    window.setTimeout(() => setLoggingOut(false), 300);
  }, [logout, navigate, closeMenu]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeMenu]);

  useEffect(() => {
    setExpandedSection(null);
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const hideNavPaths = ['/login', '/register', '/forgot-password', '/unauthorized'];
    if (hideNavPaths.includes(location.pathname)) {
      document.body.classList.remove('rooz-has-nav');
      return undefined;
    }
    document.body.classList.add('rooz-has-nav');
    document.documentElement.style.setProperty('--nav-height', '52px');
    return () => {
      document.body.classList.remove('rooz-has-nav');
    };
  }, [location.pathname]);

  const unreadNotifications = useNotifications((s) =>
    s.muted ? 0 : s.items.filter((i) => i.at > s.lastSeenAt).length
  );

  // زر الرجوع يعكس تاريخ المتصفح الحقيقي.
  // location.key === 'default' يعني أن هذه أول صفحة في الجلسة → لا يوجد سابق.
  const canGoBack = location.key !== 'default' && !['/login', '/register', '/forgot-password', '/unauthorized'].includes(location.pathname);
  const handleHeaderBack = useCallback(() => {
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/');
    }
  }, [location.key, navigate]);

  const visiblePages = useMemo(
    () => PAGES.filter((p) => !p.ownerOnly || isOwnerLoggedIn),
    [isOwnerLoggedIn]
  );

  const catalogSections = useMemo(
    () => ROYAL_SECTIONS.filter((s) => !s.isAction),
    []
  );

  return (
    <>
      <style>{`
        .navbar {
          background: rgba(253, 251, 247, 0.72);
          border-bottom: 1px solid rgba(107, 29, 47, 0.18);
          padding: 0.28rem 0;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 3000;
          isolation: isolate;
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          box-shadow: 0 6px 26px rgba(31, 17, 22, 0.10);
          transform: translateZ(0);
        }
        .navbar .logout-btn,
        .navbar .welcome-btn,
        .navbar .ai-header-btn,
        .navbar .mobile-toggle {
          color: #1f1116 !important;
          border-color: rgba(107, 29, 47, 0.35) !important;
        }
        .navbar .user-name, .navbar .user-role { color: #1f1116 !important; }
        .nav-menu.open {
          background: #fdfbf7 !important;
          color: #1f1116 !important;
          box-shadow: -6px 0 28px rgba(31, 17, 22,0.2) !important;
        }

        .navbar-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0.22rem 0.6rem;
          display: grid;
          grid-template-columns: 1fr auto auto 1fr;
          align-items: center;
          gap: 0.4rem;
          border: none;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
          min-width: 0;
        }

        .nav-right { order: 4; justify-self: end; }
        .nav-menu { order: 1; justify-self: start; }
        .nav-smart-desktop { order: 2; justify-self: center; }
        .navbar-brand { order: 3; justify-self: center; }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          text-decoration: none;
          flex: 0 0 auto;
          min-width: 0;
        }

        .navbar-brand-logo {
          height: 45px;
          width: auto;
          max-height: 45px;
          object-fit: contain;
          border: none;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
          filter: drop-shadow(0 3px 9px rgba(107, 29, 47, 0.30));
          transition: transform 0.25s ease;
        }

        .navbar-brand:hover .navbar-brand-logo {
          transform: scale(1.05);
        }

        .navbar-brand-name {
          font-size: clamp(0.92rem, 2vw, 1.18rem);
          font-weight: 900;
          background: linear-gradient(180deg, #6b1d2f 0%, #6b1d2f 45%, #1f1116 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          line-height: 1.15;
          white-space: nowrap;
        }

        .navbar-brand-sub {
          font-size: clamp(0.56rem, 1.2vw, 0.68rem);
          font-weight: 800;
          color: #6b1d2f;
          line-height: 1.2;
          display: block;
          max-width: 240px;
          white-space: nowrap;
        }

        .nav-menu {
          display: flex;
          gap: 0.15rem;
          list-style: none;
          flex-wrap: nowrap;
          justify-content: center;
          align-items: center;
          margin: 0;
          padding: 0.12rem;
          min-width: 0;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          flex: 1 1 auto;
        }

        .nav-menu::-webkit-scrollbar {
          display: none;
        }

        .nav-drawer-head,
        .nav-drawer-only {
          display: none;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.28rem;
          color: #1f1116 !important;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          padding: 0.45rem 0.65rem;
          border-radius: 10px;
          transition: all 0.22s ease;
          font-weight: 800;
          font-size: clamp(0.72rem, 1.25vw, 0.84rem);
          font-family: inherit;
          white-space: nowrap;
          flex: 0 0 auto;
        }

        .nav-item:hover {
          background: rgba(61, 15, 24,0.25);
          border-color: rgba(61, 15, 24,0.45);
          color: #1f1116 !important;
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(61, 15, 24,0.55), rgba(61, 15, 24,0.35));
          border-color: #6b1d2f;
          color: #1f1116 !important;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex: 0 0 auto;
          min-width: 0;
        }

        .owner-room-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-weight: 900;
          font-size: 0.65rem;
          color: #1f1116;
          padding: 0.32rem 0.5rem;
          border-radius: 8px;
          background: linear-gradient(135deg, #d4a5a5 0%, #6b1d2f 40%, #6b1d2f 100%);
          box-shadow: 0 3px 10px rgba(61, 15, 24,0.4);
          white-space: nowrap;
        }

        .owner-contact-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          border: 1.5px solid #1f1116;
          cursor: pointer;
          font-family: inherit;
          font-weight: 800;
          font-size: 0.65rem;
          color: #1f1116;
          padding: 0.3rem 0.48rem;
          border-radius: 8px;
          background: rgba(31, 17, 22, 0.08);
          white-space: nowrap;
        }

        .user-info {
          color: #1f1116;
          font-size: 0.65rem;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          white-space: nowrap;
        }

        .user-name { font-weight: 800; color: #1f1116; }
        .user-role { color: #6b1d2f; font-size: 0.6rem; font-weight: 700; }

        .toggle-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.3rem 0.42rem;
          border-radius: 999px;
          color: #1f1116;
          background: rgba(61, 15, 24,0.2);
          border: 1px solid rgba(61, 15, 24,0.35);
          font-size: 0.62rem;
          cursor: pointer;
          font-weight: 700;
          white-space: nowrap;
        }

        .icon-btn {
          position: relative;
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          border-radius: 10px;
          color: #1f1116;
          background: linear-gradient(145deg, #fdfbf7, #fdfbf7);
          border: 1.5px solid rgba(61, 15, 24,0.5);
          cursor: pointer;
          transition: all 0.22s ease;
          box-shadow: 0 2px 6px rgba(61, 15, 24,0.12);
        }

        .icon-btn .badge {
          position: absolute;
          top: -4px;
          left: -4px;
          min-width: 16px;
          height: 16px;
          padding: 0 3px;
          border-radius: 999px;
          background: linear-gradient(135deg, #8f2a40, #6b1d2f);
          color: #fff;
          font-size: 0.58rem;
          font-weight: 900;
          display: grid;
          place-items: center;
        }

        .welcome-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: linear-gradient(135deg, rgba(212, 165, 165,0.55), rgba(61, 15, 24,0.35));
          color: #1f1116;
          border: 1px solid rgba(61, 15, 24,0.45);
          padding: 0.32rem 0.5rem;
          border-radius: 9px;
          cursor: pointer;
          font-weight: 800;
          font-size: 0.68rem;
          font-family: inherit;
          white-space: nowrap;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: #fdfbf7;
          color: #1f1116;
          border: 1.5px solid #6b1d2f;
          padding: 0.35rem 0.55rem;
          border-radius: 9px;
          cursor: pointer;
          font-weight: 800;
          font-size: 0.7rem;
          font-family: inherit;
          box-shadow: none;
          white-space: nowrap;
        }
        .logout-btn:hover {
          background: rgba(61, 15, 24, 0.12);
          border-color: #8f2a40;
          color: #6b1d2f;
        }

        .ai-header-btn {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          border-radius: 9px;
          color: #6b1d2f;
          background: rgba(253, 251, 247,0.9);
          border: 1.5px solid rgba(61, 15, 24,0.45);
          cursor: pointer;
        }

        .mobile-toggle {
          display: none;
          background: rgba(253, 251, 247,0.95);
          border: 2px solid #6b1d2f;
          color: #1f1116;
          cursor: pointer;
          padding: 0.42rem;
          border-radius: 9px;
        }

        .nav-menu-extras { display: none; }

        .nav-overlay {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100dvh;
          background: rgba(31, 17, 22, 0.48);
          z-index: 2500;
          border: none;
          cursor: pointer;
        }

        .nav-drawer-head,
        .nav-drawer-close {
          display: none;
        }

        .nav-drawer-only { display: none; }

        @media (max-width: 1100px) and (min-width: 901px) {
          .navbar-container {
            max-width: 100%;
            padding-inline: 0.3rem;
            gap: 0.18rem;
          }

          .navbar-brand-sub {
            display: none;
          }

          .navbar-brand-logo {
            width: 36px;
            height: 36px;
          }

          .nav-item {
            padding: 0.45rem 0.65rem;
            font-size: 0.82rem;
          }

          .nav-right {
            gap: 0.16rem;
          }

          .user-info {
            display: none;
          }

          .owner-room-btn {
            font-size: 0.6rem;
            padding-inline: 0.4rem;
          }
        }

        @media (max-width: 900px) {
          .navbar {
            padding: 0.22rem 0;
          }

          .navbar-container {
            margin-inline: 0.35rem;
            padding: 0.2rem 0.35rem;
            border-radius: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          /* الجوال: الشعار في اليمين */
          .navbar-brand { order: 1; justify-self: auto; }
          .nav-right { order: 2; justify-self: auto; }
          .nav-menu { order: 3; }
          .nav-smart-desktop { display: none; }

          .navbar-brand-logo {
            height: 45px;
            width: auto;
            max-height: 45px;
          }

          .navbar-brand-sub {
            display: none;
          }

          .navbar-brand-name {
            font-size: 0.92rem;
          }

          .nav-menu {
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            left: auto !important;
            width: min(86vw, 330px) !important;
            max-width: 330px;
            height: 100dvh !important;
            min-height: 100vh;
            margin: 0 !important;
            background: rgba(253, 251, 247, 0.99) !important;
            flex-direction: column;
            flex-wrap: nowrap;
            align-items: stretch;
            padding: calc(env(safe-area-inset-top, 0px) + 0.75rem) 0.65rem calc(env(safe-area-inset-bottom, 0px) + 1.1rem);
            gap: 0.25rem;
            overflow-y: auto;
            overflow-x: hidden;
            transform: translate3d(110%, 0, 0);
            transition: transform 0.3s cubic-bezier(0.22, 0.9, 0.3, 1);
            border-inline-start: 2px solid #6b1d2f;
            box-shadow: -16px 0 36px rgba(31, 17, 22, 0.26);
            z-index: 4000 !important;
            visibility: hidden;
            pointer-events: none;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
          }

          .nav-menu.open {
            transform: translate3d(0, 0, 0);
            visibility: visible;
            pointer-events: auto;
          }

          .nav-drawer-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.45rem;
            padding: 0.1rem 0.15rem 0.55rem;
            margin-bottom: 0.3rem;
            border-bottom: 1.5px solid rgba(61, 15, 24, 0.32);
          }

          .nav-drawer-title {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-weight: 900;
            font-size: 0.9rem;
            color: #1f1116;
          }

          .nav-drawer-close {
            display: grid;
            place-items: center;
            width: 36px;
            height: 36px;
            flex: 0 0 36px;
            border-radius: 11px;
            background: rgba(253, 251, 247, 0.92);
            border: 1px solid rgba(61, 15, 24, 0.38);
            color: #1f1116;
            cursor: pointer;
          }

          .nav-drawer-only { display: block; }
          .mobile-toggle { display: block; }

          .nav-menu-extras {
            display: block;
            padding: 0.35rem 0.15rem 0.5rem;
            border-bottom: 1px solid rgba(61, 15, 24, 0.22);
            margin-bottom: 0.3rem;
          }

          .nav-user-inline {
            display: flex;
            flex-direction: column;
            gap: 2px;
            margin-bottom: 0.45rem;
          }

          .nav-sections-title {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.5rem 0.35rem 0.3rem;
            font-weight: 900;
            font-size: 0.8rem;
            color: #6b1d2f;
            margin-top: 0.35rem;
          }

          .nav-section { margin-bottom: 0.12rem; }
          .nav-section-row { display: flex; align-items: center; gap: 0.3rem; }

          .nav-section-btn {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 0.4rem;
            width: 100%;
            min-width: 0;
            text-align: right;
            background: linear-gradient(145deg, #fdfbf7 0%, #fdfbf7 100%);
            border: 1.5px solid rgba(61, 15, 24, 0.4);
            color: #1f1116 !important;
            cursor: pointer;
            padding: 0.6rem 0.7rem;
            border-radius: 12px;
            font-family: inherit;
            font-weight: 800;
            font-size: 0.82rem;
            line-height: 1.35;
            box-shadow: 0 2px 8px rgba(61, 15, 24,0.08);
          }

          .nav-section-btn > span {
            flex: 1 1 auto;
            min-width: 0;
            white-space: normal;
            word-break: break-word;
            overflow-wrap: anywhere;
            color: #1f1116;
          }

          .nav-section-btn svg {
            flex: 0 0 auto;
            color: #6b1d2f;
          }

          .nav-section-count {
            flex: 0 0 auto;
            margin-right: 0;
            margin-left: auto;
            background: linear-gradient(135deg, #6b1d2f, #6b1d2f);
            color: #1f1116;
            font-size: 0.68rem;
            font-weight: 900;
            padding: 0.15rem 0.45rem;
            border-radius: 999px;
            box-shadow: 0 1px 4px rgba(61, 15, 24,0.25);
          }

          .nav-drawer-group {
            margin: 0.35rem 0;
            padding: 0.45rem 0.3rem;
            border-radius: 11px;
            background: rgba(253, 251, 247, 0.55);
            border: 1px solid rgba(61, 15, 24, 0.18);
          }

          .nav-drawer-group-title {
            display: block;
            font-weight: 900;
            font-size: 0.75rem;
            color: #6b1d2f;
            margin-bottom: 0.35rem;
            padding-inline: 0.25rem;
          }

          .nav-drawer-group-links {
            display: flex;
            flex-direction: column;
            gap: 0.22rem;
          }

          .nav-group-link {
            display: flex;
            align-items: center;
            gap: 0.35rem;
            width: 100%;
            text-align: right;
            background: rgba(253, 251, 247, 0.75);
            border: 1px solid rgba(61, 15, 24, 0.26);
            color: #1f1116 !important;
            cursor: pointer;
            padding: 0.5rem 0.55rem;
            border-radius: 10px;
            font-family: inherit;
            font-weight: 800;
            font-size: 0.76rem;
            min-height: 42px;
          }

          .nav-branches {
            list-style: none;
            margin: 0 0 0.25rem;
            padding: 0.2rem 0.4rem 0.35rem 0.5rem;
            border-inline-start: 3px solid #6b1d2f;
            margin-inline-start: 0.85rem;
            background: linear-gradient(180deg, #fdfbf7 0%, #fdfbf7 100%);
            border-radius: 12px;
            border: 1px solid rgba(61, 15, 24, 0.28);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255,0.8);
            margin-bottom: 0.55rem;
          }

          .nav-branch-btn {
            display: flex;
            align-items: flex-start;
            gap: 0.4rem;
            width: 100%;
            min-width: 0;
            text-align: right;
            background: transparent;
            border: none;
            color: #1f1116 !important;
            cursor: pointer;
            padding: 0.5rem 0.55rem;
            border-radius: 9px;
            font-weight: 700;
            font-size: 0.78rem;
            font-family: inherit;
            line-height: 1.4;
            transition: background 0.2s ease;
          }

          .nav-branch-btn:hover {
            background: rgba(61, 15, 24, 0.22);
          }

          .nav-branch-btn > span {
            flex: 1 1 auto;
            min-width: 0;
            white-space: normal;
            word-break: break-word;
            overflow-wrap: anywhere;
            color: #1f1116;
          }

          .nav-branch-btn svg {
            flex: 0 0 auto;
            margin-top: 2px;
            color: #6b1d2f;
          }

          
          /* drawer-tight */
          .nav-menu.open {
            box-shadow: -3px 0 14px rgba(61, 15, 24,0.15) !important;
            padding-bottom: 1.5rem !important;
          }
          .nav-menu .nav-item {
            padding: 0.42rem 0.65rem !important;
            font-size: 0.8rem !important;
            margin: 0 !important;
            min-height: 0 !important;
          }
          .nav-menu li {
            margin: 0 !important;
            padding: 0 !important;
          }
          .nav-section-btn {
            padding: 0.45rem 0.6rem !important;
            font-size: 0.8rem !important;
          }
          .nav-branch-btn {
            padding: 0.32rem 0.5rem !important;
            font-size: 0.75rem !important;
          }
          .nav-sections-title,
          .nav-menu-extras {
            margin: 0.25rem 0 !important;
            padding: 0.25rem 0.5rem !important;
          }
          .nav-drawer-only {
            margin: 0 !important;
          }

          .nav-haraj-entry {
            margin-top: 0.35rem;
            border: 1px solid rgba(61, 15, 24, 0.38);
            background: linear-gradient(135deg, rgba(212, 165, 165, 0.32), rgba(61, 15, 24, 0.18));
            font-weight: 900;
          }

          .nav-drawer-badge {
            margin-right: auto;
            background: linear-gradient(135deg, #8f2a40, #6b1d2f);
            color: #fff;
            font-size: 0.65rem;
            font-weight: 900;
            padding: 0.1rem 0.35rem;
            border-radius: 999px;
          }

          .user-info,
          .owner-room-btn,
          .owner-contact-btn,
          .toggle-chip {
            display: none;
          }
        }

        @media (min-width: 901px) {
          .nav-sections-title,
          .nav-section,
          .nav-drawer-group,
          .nav-drawer-only,
          .nav-menu-extras {
            display: none !important;
          }
          .navbar-brand-sub { display: block; }
        }
      `}</style>

      {showOwnerContact && (
        <ContactOwnerModal onClose={() => setShowOwnerContact(false)} />
      )}
      {showBroadcast && (
        <BroadcastModal onClose={() => setShowBroadcast(false)} />
      )}

      {isOpen && (
        <button
          type="button"
          className="nav-overlay"
          aria-label="إغلاق القائمة"
          tabIndex={-1}
          onClick={closeMenu}
        />
      )}

      <RoyalHeader
        user={user}
        userRole={userRole}
        isOwnerLoggedIn={isOwnerLoggedIn}
        unreadNotifications={unreadNotifications}
        onOpenAIChat={onOpenAIChat}
        onLogout={handleLogout}
        onOpenOwnerContact={() => setShowOwnerContact(true)}
        onOpenBroadcast={() => setShowBroadcast(true)}
        onOpenWelcome={() => setShowElegantWelcome(true)}
        canGoBack={canGoBack}
        onBack={handleHeaderBack}
      />

      {showElegantWelcome && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowElegantWelcome(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(31, 17, 22,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 6000,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(145deg, #fdfbf7, #fdfbf7)',
              border: '1px solid rgba(61, 15, 24,0.45)',
              borderRadius: 18,
              padding: '1.5rem 1.25rem',
              maxWidth: 370,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 22px 55px rgba(31, 17, 22,0.35)',
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            <Crown size={30} color="#6b1d2f" style={{ marginBottom: 10 }} />
            <h3 style={{ margin: '0 0 0.45rem', fontSize: '1.15rem', fontWeight: 800, color: '#1f1116' }}>
              أهلاً بكم في أناقة ROOZ
            </h3>
            <p style={{ margin: '0 0 1.1rem', fontSize: '0.88rem', color: '#1f1116', lineHeight: 1.65 }}>
              نورت المنصة. هنا تجدون الفخامة والثقة في كل تفصيلة.
              <br />
              استمتعوا بتجربة راقية تليق بذوقكم.
            </p>
            <button
              type="button"
              onClick={() => setShowElegantWelcome(false)}
              style={{
                background: 'linear-gradient(135deg, #6b1d2f, #6b1d2f)',
                color: '#1f1116',
                border: 'none',
                borderRadius: 11,
                padding: '0.55rem 1.5rem',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              متابعة التصفح
            </button>
          </div>
        </div>
      )}

      {infoModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setInfoModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(31, 17, 22,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 6000,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(145deg, #fdfbf7, #fdfbf7)',
              border: '1px solid rgba(61, 15, 24,0.45)',
              borderRadius: 18,
              padding: '1.35rem 1.15rem',
              maxWidth: 440,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              textAlign: 'right',
              boxShadow: '0 22px 55px rgba(31, 17, 22,0.35)',
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, color: '#1f1116' }}>
                {infoModal === 'why' && 'لماذا أناقة ROOZ؟'}
                {infoModal === 'contest' && 'المسابقة الكبرى'}
                {infoModal === 'statement' && 'بيان الموقع الرسمي'}
                {infoModal === 'journey' && 'رحلة التسوق في ROOZ'}
              </h3>
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                style={{
                  background: 'rgba(61, 15, 24,0.12)',
                  border: '1px solid rgba(61, 15, 24,0.35)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#1f1116',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {infoModal === 'why' && (
              <div style={{ display: 'grid', gap: 11 }}>
                <div style={{ background: 'rgba(255, 255, 255,0.65)', borderRadius: 12, padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <ShieldCheck size={17} color="#6b1d2f" />
                    <strong style={{ color: '#6b1d2f' }}>موثوق وآمن</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: '#1f1116' }}>نراجع الإعلانات ونضمن بيئة آمنة للتعامل</p>
                </div>
                <div style={{ background: 'rgba(255, 255, 255,0.65)', borderRadius: 12, padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Gem size={17} color="#6b1d2f" />
                    <strong style={{ color: '#6b1d2f' }}>جودة عالية</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: '#1f1116' }}>إعلانات راقية لأناس راقين مثلك</p>
                </div>
                <div style={{ background: 'rgba(255, 255, 255,0.65)', borderRadius: 12, padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <MonitorSmartphone size={17} color="#6b1d2f" />
                    <strong style={{ color: '#6b1d2f' }}>سهولة الاستخدام</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: '#1f1116' }}>واجهة بسيطة وتجربة سلسة</p>
                </div>
                <div style={{ background: 'rgba(255, 255, 255,0.65)', borderRadius: 12, padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Headphones size={17} color="#6b1d2f" />
                    <strong style={{ color: '#6b1d2f' }}>دعم على مدار الساعة</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: '#1f1116' }}>فريق الدعم جاهز لمساعدتك دائماً</p>
                </div>
              </div>
            )}

            {infoModal === 'contest' && (
              <div style={{ textAlign: 'center' }}>
                <Crown size={28} color="#6b1d2f" style={{ marginBottom: 8 }} />
                <p style={{ fontSize: '1.02rem', color: '#6b1d2f', lineHeight: 1.7, margin: 0 }}>
                  ستُقام مسابقة كبرى قريباً على <strong style={{ color: '#6b1d2f' }}>3 أطقم ذهب عيار 21</strong> وهدايا أخرى قيّمة.
                  <br /><br />
                  <span style={{ fontWeight: 700, color: '#6b1d2f' }}>انتظرونا</span>
                </p>
              </div>
            )}

            {infoModal === 'statement' && (
              <p style={{ fontSize: '0.88rem', lineHeight: 1.9, color: '#1f1116', margin: 0 }}>
                منصة «أناقة ROOZ» تعمل تحت <strong style={{ color: '#6b1d2f' }}>حماية قانونية ومحاماة معتمدة</strong>.
                خصوصية جميع المستخدمين مصانة بالكامل، وجميع البيانات محمية بتشفير كامل.
                نلتزم بالاحترام المتبادل، وأعضاؤنا بالنسبة لصاحب الموقع <strong style={{ color: '#6b1d2f' }}>خط أحمر</strong> —
                لا يُقبل أي إساءة أو ضرر لأي شخص داخل المنصة، ومن يتجاوز ذلك يُحال للجهات المختصة.
              </p>
            )}

            {infoModal === 'journey' && (
              <div style={{ display: 'grid', gap: 9 }}>
                <div style={{ background: 'rgba(255, 255, 255,0.65)', borderRadius: 11, padding: '0.75rem' }}>
                  <strong style={{ color: '#6b1d2f' }}>01 اكتشف</strong>
                  <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: '#1f1116' }}>استعرض الأقسام واختر الفئة المناسبة.</p>
                </div>
                <div style={{ background: 'rgba(255, 255, 255,0.65)', borderRadius: 11, padding: '0.75rem' }}>
                  <strong style={{ color: '#6b1d2f' }}>02 اختر</strong>
                  <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: '#1f1116' }}>تصفح المنتجات وابحث عن القطعة المناسبة.</p>
                </div>
                <div style={{ background: 'rgba(255, 255, 255,0.65)', borderRadius: 11, padding: '0.75rem' }}>
                  <strong style={{ color: '#6b1d2f' }}>03 تواصل</strong>
                  <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: '#1f1116' }}>تواصل مع البائع أو الجهة المناسبة عند الحاجة.</p>
                </div>
                <div style={{ background: 'rgba(255, 255, 255,0.65)', borderRadius: 11, padding: '0.75rem' }}>
                  <strong style={{ color: '#6b1d2f' }}>04 استمتع</strong>
                  <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: '#1f1116' }}>استكمل تجربتك داخل أناقة ROOZ بكل سهولة.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;