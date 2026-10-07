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
          background: rgb(10, 7, 30, 0.95);
          border-bottom: 1px solid rgb(123, 41, 213, 0.4);
          padding: 0.2rem 0;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 3000;
          isolation: isolate;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 6px 24px rgb(9, 6, 27,0.35);
          transform: translateZ(0);
        }
        .navbar .logout-btn,
        .navbar .welcome-btn,
        .navbar .ai-header-btn,
        .navbar .mobile-toggle {
          color: #f4f1f9 !important;
          border-color: rgb(123, 41, 213,0.4) !important;
        }
        .navbar .user-name, .navbar .user-role { color: #f4f1f9 !important; }
        .nav-menu.open {
          background: #f4f1f9 !important;
          color: #0b0822 !important;
          box-shadow: -6px 0 28px rgb(9, 6, 27,0.2) !important;
        }

        .navbar-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0.18rem 0.4rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.35rem;
          border: 1.5px solid rgb(93, 43, 195,0.5);
          border-radius: 16px;
          background: linear-gradient(145deg, rgb(247, 246, 251,0.92), rgb(235, 229, 246,0.85));
          box-shadow: inset 0 0 0 1px rgb(255, 255, 255,0.65), 0 4px 14px rgb(93, 43, 195,0.14);
          min-width: 0;
        }

        .nav-right { order: 1; }
        .nav-menu { order: 2; }
        .navbar-brand { order: 3; }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          text-decoration: none;
          flex: 0 0 auto;
          min-width: 0;
        }

        .navbar-brand-logo {
          width: 38px;
          height: 38px;
          object-fit: cover;
          border-radius: 50%;
          border: 2px solid #9955ef;
          box-shadow: 0 0 0 1.5px rgb(137, 91, 228,0.3), 0 4px 12px rgb(93, 43, 195,0.4);
          transition: transform 0.25s ease;
        }

        .navbar-brand:hover .navbar-brand-logo {
          transform: scale(1.06);
        }

        .navbar-brand-name {
          font-size: clamp(0.92rem, 2vw, 1.18rem);
          font-weight: 900;
          background: linear-gradient(180deg, #6d3ad9 0%, #5b1c9b 45%, #0b0822 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          line-height: 1.15;
          white-space: nowrap;
        }

        .navbar-brand-sub {
          font-size: clamp(0.56rem, 1.2vw, 0.68rem);
          font-weight: 800;
          color: #5b1c9b;
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
          color: #0b0822 !important;
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
          background: rgb(137, 91, 228,0.25);
          border-color: rgb(93, 43, 195,0.45);
          color: #0b0822 !important;
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgb(137, 91, 228,0.55), rgb(93, 43, 195,0.35));
          border-color: #7b29d5;
          color: #0b0822 !important;
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
          color: #0d0a29;
          padding: 0.32rem 0.5rem;
          border-radius: 8px;
          background: linear-gradient(135deg, #b295f4 0%, #9955ef 40%, #7b29d5 100%);
          box-shadow: 0 3px 10px rgb(93, 43, 195,0.4);
          white-space: nowrap;
        }

        .owner-contact-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          border: 1.5px solid #0b477a;
          cursor: pointer;
          font-family: inherit;
          font-weight: 800;
          font-size: 0.65rem;
          color: #0b477a;
          padding: 0.3rem 0.48rem;
          border-radius: 8px;
          background: rgb(11, 71, 122, 0.08);
          white-space: nowrap;
        }

        .user-info {
          color: #281545;
          font-size: 0.65rem;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          white-space: nowrap;
        }

        .user-name { font-weight: 800; color: #0a071e; }
        .user-role { color: #5b1c9b; font-size: 0.6rem; font-weight: 700; }

        .toggle-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.3rem 0.42rem;
          border-radius: 999px;
          color: #281545;
          background: rgb(137, 91, 228,0.2);
          border: 1px solid rgb(93, 43, 195,0.35);
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
          color: #0b0822;
          background: linear-gradient(145deg, #f4f1f9, #ebe5f6);
          border: 1.5px solid rgb(93, 43, 195,0.5);
          cursor: pointer;
          transition: all 0.22s ease;
          box-shadow: 0 2px 6px rgb(93, 43, 195,0.12);
        }

        .icon-btn .badge {
          position: absolute;
          top: -4px;
          left: -4px;
          min-width: 16px;
          height: 16px;
          padding: 0 3px;
          border-radius: 999px;
          background: linear-gradient(135deg, #e44461, #c02541);
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
          background: linear-gradient(135deg, rgb(178, 149, 244,0.55), rgb(137, 91, 228,0.35));
          color: #281545;
          border: 1px solid rgb(93, 43, 195,0.45);
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
          background: #f4f1f9;
          color: #0b0822;
          border: 1.5px solid #7b29d5;
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
          background: rgb(202, 40, 70, 0.12);
          border-color: #ca2846;
          color: #84182c;
        }

        .ai-header-btn {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          border-radius: 9px;
          color: #7b29d5;
          background: rgb(247, 246, 251,0.9);
          border: 1.5px solid rgb(93, 43, 195,0.45);
          cursor: pointer;
        }

        .mobile-toggle {
          display: none;
          background: rgb(247, 246, 251,0.95);
          border: 2px solid #7b29d5;
          color: #0a071e;
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
          background: rgb(11, 8, 34, 0.48);
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
            border-radius: 13px;
          }

          .navbar-brand-logo {
            width: 36px;
            height: 36px;
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
            background: rgb(235, 229, 246, 0.99) !important;
            flex-direction: column;
            flex-wrap: nowrap;
            align-items: stretch;
            padding: calc(env(safe-area-inset-top, 0px) + 0.75rem) 0.65rem calc(env(safe-area-inset-bottom, 0px) + 1.1rem);
            gap: 0.25rem;
            overflow-y: auto;
            overflow-x: hidden;
            transform: translate3d(110%, 0, 0);
            transition: transform 0.3s cubic-bezier(0.22, 0.9, 0.3, 1);
            border-inline-start: 2px solid #7b29d5;
            box-shadow: -16px 0 36px rgb(11, 8, 34, 0.26);
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
            border-bottom: 1.5px solid rgb(93, 43, 195, 0.32);
          }

          .nav-drawer-title {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-weight: 900;
            font-size: 0.9rem;
            color: #0a071e;
          }

          .nav-drawer-close {
            display: grid;
            place-items: center;
            width: 36px;
            height: 36px;
            flex: 0 0 36px;
            border-radius: 11px;
            background: rgb(247, 246, 251, 0.92);
            border: 1px solid rgb(93, 43, 195, 0.38);
            color: #0a071e;
            cursor: pointer;
          }

          .nav-drawer-only { display: block; }
          .mobile-toggle { display: block; }

          .nav-menu-extras {
            display: block;
            padding: 0.35rem 0.15rem 0.5rem;
            border-bottom: 1px solid rgb(93, 43, 195, 0.22);
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
            color: #5b1c9b;
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
            background: linear-gradient(145deg, #f4f1f9 0%, #ebe5f6 100%);
            border: 1.5px solid rgb(93, 43, 195, 0.4);
            color: #0a071e !important;
            cursor: pointer;
            padding: 0.6rem 0.7rem;
            border-radius: 12px;
            font-family: inherit;
            font-weight: 800;
            font-size: 0.82rem;
            line-height: 1.35;
            box-shadow: 0 2px 8px rgb(93, 43, 195,0.08);
          }

          .nav-section-btn > span {
            flex: 1 1 auto;
            min-width: 0;
            white-space: normal;
            word-break: break-word;
            overflow-wrap: anywhere;
            color: #0a071e;
          }

          .nav-section-btn svg {
            flex: 0 0 auto;
            color: #5b1c9b;
          }

          .nav-section-count {
            flex: 0 0 auto;
            margin-right: 0;
            margin-left: auto;
            background: linear-gradient(135deg, #9955ef, #7b29d5);
            color: #0b0822;
            font-size: 0.68rem;
            font-weight: 900;
            padding: 0.15rem 0.45rem;
            border-radius: 999px;
            box-shadow: 0 1px 4px rgb(93, 43, 195,0.25);
          }

          .nav-drawer-group {
            margin: 0.35rem 0;
            padding: 0.45rem 0.3rem;
            border-radius: 11px;
            background: rgb(247, 246, 251, 0.55);
            border: 1px solid rgb(93, 43, 195, 0.18);
          }

          .nav-drawer-group-title {
            display: block;
            font-weight: 900;
            font-size: 0.75rem;
            color: #5b1c9b;
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
            background: rgb(247, 246, 251, 0.75);
            border: 1px solid rgb(93, 43, 195, 0.26);
            color: #0a071e !important;
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
            border-inline-start: 3px solid #7b29d5;
            margin-inline-start: 0.85rem;
            background: linear-gradient(180deg, #f4f1f9 0%, #ebe5f6 100%);
            border-radius: 12px;
            border: 1px solid rgb(93, 43, 195, 0.28);
            box-shadow: inset 0 1px 0 rgb(255, 255, 255,0.8);
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
            color: #0b0822 !important;
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
            background: rgb(137, 91, 228, 0.22);
          }

          .nav-branch-btn > span {
            flex: 1 1 auto;
            min-width: 0;
            white-space: normal;
            word-break: break-word;
            overflow-wrap: anywhere;
            color: #0b0822;
          }

          .nav-branch-btn svg {
            flex: 0 0 auto;
            margin-top: 2px;
            color: #5b1c9b;
          }

          
          /* drawer-tight */
          .nav-menu.open {
            box-shadow: -3px 0 14px rgb(70, 27, 154,0.15) !important;
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
            border: 1px solid rgb(93, 43, 195, 0.38);
            background: linear-gradient(135deg, rgb(178, 149, 244, 0.32), rgb(137, 91, 228, 0.18));
            font-weight: 900;
          }

          .nav-drawer-badge {
            margin-right: auto;
            background: linear-gradient(135deg, #e44461, #c02541);
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

      <nav className="navbar" dir="rtl">
        <div className="navbar-container">

          <Link to="/" className="navbar-brand" aria-label="الصفحة الرئيسية">
            <img
              src="/assets/logo-v2.webp"
              alt="شعار أناقة ROOZ"
              className="navbar-brand-logo"
              width={44}
              height={44}
              loading="eager"
            />
          </Link>

          <ul className={`nav-menu ${isOpen ? 'open' : ''}`}>

            <li className="nav-drawer-head nav-drawer-only">
              <span className="nav-drawer-title">
                <Store size={16} />
                <span>القائمة</span>
              </span>
              <button type="button" className="nav-drawer-close" onClick={closeMenu} aria-label="إغلاق القائمة">
                <X size={18} />
              </button>
            </li>

            <li className="nav-menu-extras">
              <div className="nav-user-inline">
                <span className="user-name">
                  {user?.name || user?.displayName || user?.email?.split('@')[0] || (userRole === 'guest' ? 'زائر' : 'مستخدم')}
                </span>
                <span className="user-role">
                  {userRole === 'owner' ? 'المالك' : userRole === 'admin' ? 'مدير' : userRole === 'guest' ? 'زائر' : 'عضو'}
                </span>
              </div>

              <button
                type="button"
                className="welcome-btn"
                onClick={() => {
                  setShowElegantWelcome(true);
                  closeMenu();
                }}
              >
                <Crown size={14} />
                <span>أهلاً بكم</span>
              </button>

              {isOwnerLoggedIn && (
                <label className="toggle-chip">
                  <input type="checkbox" checked={ownerHiddenMode} onChange={toggleOwnerHiddenMode} />
                  {ownerHiddenMode ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>التخفي</span>
                </label>
              )}
            </li>

            {visiblePages.map((page) => (
              <li key={page.id}>
                <button
                  type="button"
                  className={`nav-item ${!page.opensModal && location.pathname === page.path ? 'active' : ''}`}
                  onClick={() => {
                    if (page.opensModal) {
                      setShowOwnerContact(true);
                    } else {
                      navigate(page.path);
                    }
                    closeMenu();
                  }}
                >
                  <page.icon size={15} />
                  <span>{page.label}</span>
                </button>
              </li>
            ))}

            <li className="nav-drawer-only">
              <button
                type="button"
                className={`nav-item ${location.pathname === '/notifications' ? 'active' : ''}`}
                onClick={() => {
                  navigate('/notifications');
                  closeMenu();
                }}
              >
                <Bell size={15} />
                <span>الإشعارات</span>
                {unreadNotifications > 0 && (
                  <span className="nav-section-count nav-drawer-badge">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>
            </li>

            <li className="nav-drawer-only">
              <button
                type="button"
                className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
                onClick={() => {
                  navigate('/settings');
                  closeMenu();
                }}
              >
                <Settings size={15} />
                <span>الإعدادات</span>
              </button>
            </li>

            <li className="nav-drawer-only">
              <div className="nav-drawer-group">
                <span className="nav-drawer-group-title">روابط سريعة</span>
                <div className="nav-drawer-group-links">
                  <button type="button" className="nav-group-link" onClick={() => { navigate('/'); closeMenu(); }}>
                    <span>الرئيسية</span>
                  </button>
                  <button type="button" className="nav-group-link" onClick={() => { navigate('/about'); closeMenu(); }}>
                    <span>من نحن</span>
                  </button>
                  <button type="button" className="nav-group-link" onClick={() => { navigate('/contact'); closeMenu(); }}>
                    <span>تواصل معنا</span>
                  </button>
                  <button type="button" className="nav-group-link" onClick={() => { navigate('/faq'); closeMenu(); }}>
                    <span>الأسئلة الشائعة</span>
                  </button>
                </div>
              </div>
            </li>


            <li className="nav-drawer-only">
              <div className="nav-drawer-group">
                <span className="nav-drawer-group-title">معلومات أناقة ROOZ</span>
                <div className="nav-drawer-group-links">
                  <button type="button" className="nav-group-link" onClick={() => { setInfoModal('why'); closeMenu(); }}>
                    <ShieldCheck size={14} />
                    <span>لماذا أناقة ROOZ؟</span>
                  </button>
                  <button type="button" className="nav-group-link" onClick={() => { setInfoModal('contest'); closeMenu(); }}>
                    <Crown size={14} />
                    <span>المسابقة الكبرى</span>
                  </button>
                  <button type="button" className="nav-group-link" onClick={() => { setInfoModal('statement'); closeMenu(); }}>
                    <ShieldCheck size={14} />
                    <span>بيان الموقع الرسمي</span>
                  </button>
                  <button type="button" className="nav-group-link" onClick={() => { setInfoModal('journey'); closeMenu(); }}>
                    <MonitorSmartphone size={14} />
                    <span>رحلة التسوق في ROOZ</span>
                  </button>
                </div>
              </div>
            </li>

            {isOwnerLoggedIn && location.pathname === '/' && (
              <li className="nav-drawer-only">
                <button
                  type="button"
                  className="nav-item"
                  onClick={() => {
                    setShowBroadcast(true);
                    closeMenu();
                  }}
                >
                  <Megaphone size={15} />
                  <span>رسالة البث</span>
                </button>
              </li>
            )}

            <li className="nav-section" style={{ marginBottom: '0.35rem' }}>
              <button
                type="button"
                className="nav-section-btn"
                onClick={() => setStoreMenuOpen((v) => !v)}
                aria-expanded={storeMenuOpen}
                style={{ fontWeight: 900 }}
              >
                <Store size={16} />
                <span>أقسام متجر أناقة ROOZ</span>
                {storeMenuOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                <span className="nav-section-count">{catalogSections.length}</span>
              </button>

              {storeMenuOpen && (
                <ul className="nav-branches" style={{ marginTop: '0.35rem' }}>
                  {catalogSections.map((section) => {
                    const SIcon = SECTION_ICONS[section.id] || Sparkles;
                    const branches = Array.isArray(section.branches) ? section.branches : [];
                    const isExpanded = expandedSection === section.id;
                    return (
                      <li key={section.id} style={{ marginBottom: 4 }}>
                        <button
                          type="button"
                          className="nav-branch-btn"
                          onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                          aria-expanded={isExpanded}
                          style={{ fontWeight: 800 }}
                        >
                          <SIcon size={14} />
                          <span>{section.title}</span>
                          {branches.length > 0 && (isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
                        </button>
                        {isExpanded && branches.length > 0 && (
                          <ul style={{ listStyle: 'none', margin: '4px 0 8px', padding: '0 0 0 10px', borderInlineStart: '2px solid #7b29d5' }}>
                            {branches.map((branch) => (
                              <li key={branch.id}>
                                <button
                                  type="button"
                                  className="nav-branch-btn"
                                  onClick={() => {
                                    if (branch?.catalogId) {
                                      navigate(`/catalog/${branch.catalogId}`, {
                                        state: { branchId: branch.id, branchName: branch.name },
                                      });
                                    }
                                    closeMenu();
                                  }}
                                >
                                  <ArrowLeft size={12} />
                                  <span>{branch.name}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                  <li>
                    <button
                      type="button"
                      className="nav-branch-btn"
                      onClick={() => { navigate('/haraj'); closeMenu(); }}
                      style={{ fontWeight: 900, background: 'rgb(137, 91, 228,0.25)', marginTop: 6 }}
                    >
                      <ShoppingBag size={14} />
                      <span>الدخول إلى موقع حراج</span>
                      <ArrowLeft size={12} />
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {userRole === 'user' && (
              <li>
                <button
                  type="button"
                  className="nav-item"
                  onClick={() => {
                    navigate('/inbox');
                    closeMenu();
                  }}
                >
                  <Mail size={15} />
                  <span>بريد الوارد (رسائل صاحب الموقع)</span>
                </button>
              </li>
            )}
          </ul>

          <div className="nav-right">
            <button
              type="button"
              className="mobile-toggle"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <button
              type="button"
              className="ai-header-btn"
              onClick={() => {
                if (typeof onOpenAIChat === 'function') {
                  onOpenAIChat();
                } else {
                  navigate('/ai-chat');
                }
              }}
              aria-label="المساعد الذكي"
              title="المساعد الذكي"
            >
              <Bot size={17} />
            </button>

            <button type="button" className="logout-btn" onClick={handleLogout}>
              <LogOut size={15} />
              <span>خروج</span>
            </button>

            <div className="user-info">
              <span className="user-name">
                {user?.name || user?.displayName || user?.email?.split('@')[0] || (userRole === 'guest' ? 'زائر' : 'مستخدم')}
              </span>
              <span className="user-role">
                {userRole === 'owner' ? 'المالك' : userRole === 'admin' ? 'مدير' : userRole === 'guest' ? 'زائر' : 'عضو'}
              </span>
            </div>

            <button
              type="button"
              className="welcome-btn"
              onClick={() => setShowElegantWelcome(true)}
            >
              <Crown size={14} />
              <span>أهلاً بكم</span>
            </button>

            {isOwnerLoggedIn && location.pathname === '/' && (
              <button
                type="button"
                className="icon-btn"
                aria-label="رسالة البث"
                title="رسالة البث"
                onClick={() => setShowBroadcast(true)}
              >
                <Megaphone size={17} />
              </button>
            )}

            <button
              type="button"
              className="icon-btn"
              aria-label="الإشعارات"
              title="الإشعارات"
              onClick={() => navigate('/notifications')}
            >
              <Bell size={17} />
              {unreadNotifications > 0 && (
                <span className="badge">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>

            {isOwnerLoggedIn && (
              <label className="toggle-chip">
                <input type="checkbox" checked={ownerHiddenMode} onChange={toggleOwnerHiddenMode} />
                {ownerHiddenMode ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>التخفي</span>
              </label>
            )}

            {isOwnerLoggedIn && (
              <button
                type="button"
                className="owner-contact-btn"
                onClick={() => setShowOwnerContact(true)}
              >
                <Mail size={14} />
                <span>مراسلة</span>
              </button>
            )}

            {isOwnerLoggedIn && (
              <button
                type="button"
                className="owner-room-btn"
                onClick={() => navigate('/owner-private-room')}
              >
                <Crown size={14} />
                <span>غرفة صاحب الموقع</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {showElegantWelcome && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowElegantWelcome(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgb(13, 9, 39,0.55)',
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
              background: 'linear-gradient(145deg, #f4f1f9, #e0d7f5)',
              border: '1px solid rgb(64, 15, 180,0.45)',
              borderRadius: 18,
              padding: '1.5rem 1.25rem',
              maxWidth: 370,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 22px 55px rgb(15, 11, 46,0.35)',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <Crown size={30} color="#7b29d5" style={{ marginBottom: 10 }} />
            <h3 style={{ margin: '0 0 0.45rem', fontSize: '1.15rem', fontWeight: 800, color: '#200d4f' }}>
              أهلاً بكم في أناقة ROOZ
            </h3>
            <p style={{ margin: '0 0 1.1rem', fontSize: '0.88rem', color: '#2e1666', lineHeight: 1.65 }}>
              نورت المنصة. هنا تجدون الفخامة والثقة في كل تفصيلة.
              <br />
              استمتعوا بتجربة راقية تليق بذوقكم.
            </p>
            <button
              type="button"
              onClick={() => setShowElegantWelcome(false)}
              style={{
                background: 'linear-gradient(135deg, #7b29d5, #4b1fb5)',
                color: '#0b0822',
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
            background: 'rgb(13, 9, 39,0.55)',
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
              background: 'linear-gradient(145deg, #f4f1f9, #e0d7f5)',
              border: '1px solid rgb(64, 15, 180,0.45)',
              borderRadius: 18,
              padding: '1.35rem 1.15rem',
              maxWidth: 440,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              textAlign: 'right',
              boxShadow: '0 22px 55px rgb(15, 11, 46,0.35)',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, color: '#200d4f' }}>
                {infoModal === 'why' && 'لماذا أناقة ROOZ؟'}
                {infoModal === 'contest' && 'المسابقة الكبرى'}
                {infoModal === 'statement' && 'بيان الموقع الرسمي'}
                {infoModal === 'journey' && 'رحلة التسوق في ROOZ'}
              </h3>
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                style={{
                  background: 'rgb(64, 15, 180,0.12)',
                  border: '1px solid rgb(64, 15, 180,0.35)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#290d71',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {infoModal === 'why' && (
              <div style={{ display: 'grid', gap: 11 }}>
                <div style={{ background: 'rgb(255, 255, 255,0.65)', borderRadius: 12, padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <ShieldCheck size={17} color="#3a1496" />
                    <strong style={{ color: '#3a1496' }}>موثوق وآمن</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: '#2e1666' }}>نراجع الإعلانات ونضمن بيئة آمنة للتعامل</p>
                </div>
                <div style={{ background: 'rgb(255, 255, 255,0.65)', borderRadius: 12, padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Gem size={17} color="#3a1496" />
                    <strong style={{ color: '#3a1496' }}>جودة عالية</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: '#2e1666' }}>إعلانات راقية لأناس راقين مثلك</p>
                </div>
                <div style={{ background: 'rgb(255, 255, 255,0.65)', borderRadius: 12, padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <MonitorSmartphone size={17} color="#3a1496" />
                    <strong style={{ color: '#3a1496' }}>سهولة الاستخدام</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: '#2e1666' }}>واجهة بسيطة وتجربة سلسة</p>
                </div>
                <div style={{ background: 'rgb(255, 255, 255,0.65)', borderRadius: 12, padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Headphones size={17} color="#3a1496" />
                    <strong style={{ color: '#3a1496' }}>دعم على مدار الساعة</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: '#2e1666' }}>فريق الدعم جاهز لمساعدتك دائماً</p>
                </div>
              </div>
            )}

            {infoModal === 'contest' && (
              <div style={{ textAlign: 'center' }}>
                <Crown size={28} color="#7b29d5" style={{ marginBottom: 8 }} />
                <p style={{ fontSize: '1.02rem', color: '#2c1663', lineHeight: 1.7, margin: 0 }}>
                  ستُقام مسابقة كبرى قريباً على <strong style={{ color: '#330da6' }}>3 أطقم ذهب عيار 21</strong> وهدايا أخرى قيّمة.
                  <br /><br />
                  <span style={{ fontWeight: 700, color: '#3c12a8' }}>انتظرونا</span>
                </p>
              </div>
            )}

            {infoModal === 'statement' && (
              <p style={{ fontSize: '0.88rem', lineHeight: 1.9, color: '#2e1666', margin: 0 }}>
                منصة «أناقة ROOZ» تعمل تحت <strong style={{ color: '#5b1c9b' }}>حماية قانونية ومحاماة معتمدة</strong>.
                خصوصية جميع المستخدمين مصانة بالكامل، وجميع البيانات محمية بتشفير كامل.
                نلتزم بالاحترام المتبادل، وأعضاؤنا بالنسبة لصاحب الموقع <strong style={{ color: '#5b1c9b' }}>خط أحمر</strong> —
                لا يُقبل أي إساءة أو ضرر لأي شخص داخل المنصة، ومن يتجاوز ذلك يُحال للجهات المختصة.
              </p>
            )}

            {infoModal === 'journey' && (
              <div style={{ display: 'grid', gap: 9 }}>
                <div style={{ background: 'rgb(255, 255, 255,0.65)', borderRadius: 11, padding: '0.75rem' }}>
                  <strong style={{ color: '#3a1496' }}>01 اكتشف</strong>
                  <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: '#2e1666' }}>استعرض الأقسام واختر الفئة المناسبة.</p>
                </div>
                <div style={{ background: 'rgb(255, 255, 255,0.65)', borderRadius: 11, padding: '0.75rem' }}>
                  <strong style={{ color: '#3a1496' }}>02 اختر</strong>
                  <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: '#2e1666' }}>تصفح المنتجات وابحث عن القطعة المناسبة.</p>
                </div>
                <div style={{ background: 'rgb(255, 255, 255,0.65)', borderRadius: 11, padding: '0.75rem' }}>
                  <strong style={{ color: '#3a1496' }}>03 تواصل</strong>
                  <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: '#2e1666' }}>تواصل مع البائع أو الجهة المناسبة عند الحاجة.</p>
                </div>
                <div style={{ background: 'rgb(255, 255, 255,0.65)', borderRadius: 11, padding: '0.75rem' }}>
                  <strong style={{ color: '#3a1496' }}>04 استمتع</strong>
                  <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: '#2e1666' }}>استكمل تجربتك داخل أناقة ROOZ بكل سهولة.</p>
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