import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HIDDEN_PATHS = new Set(['/', '/login', '/register', '/forgot-password', '/unauthorized']);

/**
 * زر رجوع واحد ثابت داخل منطقة الترويسة.
 * يرجع صفحة واحدة للخلف فقط في كل ضغطة — بدون تذبذب أمام/خلف.
 */
const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (HIDDEN_PATHS.has(location.pathname)) return null;

  const handleBack = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const path = location.pathname;

    // استخدم history.state إن وُجد مسار سابق آمن
    const prev =
      (typeof window !== 'undefined' &&
        (window.history.state?.usr?.prevPath || window.history.state?.prevPath)) ||
      null;

    if (prev && typeof prev === 'string' && prev !== path && !HIDDEN_PATHS.has(prev)) {
      navigate(prev);
      return;
    }

    // رجوع خطوة واحدة في تاريخ المتصفح
    if (typeof window !== 'undefined' && window.history.length > 1) {
      navigate(-1);
      return;
    }

    // احتياطي حسب القسم
    if (path.startsWith('/haraj') || path.startsWith('/ad/')) {
      navigate('/haraj', { replace: true });
    } else if (path.startsWith('/catalog/')) {
      navigate('/', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="رجوع للصفحة السابقة"
      title="رجوع"
      style={{
        position: 'fixed',
        top: 'calc(var(--nav-height, 56px) + 6px)',
        insetInlineStart: '10px',
        zIndex: 3200,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 40,
        padding: '0 12px',
        borderRadius: 12,
        border: '1.5px solid #7b29d5',
        background: '#f4f1f9',
        color: '#0b0822',
        fontWeight: 800,
        fontSize: '0.82rem',
        fontFamily: 'Cairo, sans-serif',
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgb(93, 43, 195,0.2)',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <ArrowRight size={16} strokeWidth={2.5} aria-hidden="true" />
      رجوع
    </button>
  );
};

export default BackButton;
