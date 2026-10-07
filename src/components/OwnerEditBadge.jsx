import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// شارة «تعديل» موحدة تظهر للمالك فقط فوق البطاقات (إعلان/قسم/كتالوج).
// الاستخدام: ضعها داخل حاوية عليها position:relative — تُثبَّت أعلى اليسار
// (نهاية السطر في RTL) وتفتح لوحة الإدارة المناسبة دون إيقاف تنقل البطاقة.
const OwnerEditBadge = ({ to, label = 'تعديل' }) => {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  if (userRole !== 'owner' || !to) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(to);
      }}
      aria-label={label}
      style={{
        position: 'absolute',
        top: 8,
        insetInlineEnd: 8,
        zIndex: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        background: 'linear-gradient(135deg, #e8a35c, #c47a3a)',
        color: '#0b0a09',
        border: '1.5px solid #8f5528',
        borderRadius: 999,
        padding: '5px 11px',
        fontFamily: 'Tajawal, sans-serif',
        fontWeight: 800,
        fontSize: '0.72rem',
        cursor: 'pointer',
        boxShadow: '0 3px 10px rgba(176,138,62,0.35)',
        minWidth: 64,
      }}
    >
      <Pencil size={13} strokeWidth={2.4} aria-hidden="true" />
      {label}
    </button>
  );
};

export default OwnerEditBadge;