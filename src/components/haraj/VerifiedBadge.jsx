// src/components/haraj/VerifiedBadge.jsx
// شارة "مستخدم موثق" ذهبية بجانب اسم المعلن الموثق.
import { BadgeCheck } from 'lucide-react';

export default function VerifiedBadge({ verified, size = 16, withLabel = false }) {
  if (!verified) return null;
  return (
    <span
      className="rooz-verified-badge"
      title="مستخدم موثق — تم التحقق من الهوية"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: 'linear-gradient(135deg, #f3d79b 0%, #c9a24b 45%, #a67c2e 100%)',
        color: '#3d0f18',
        border: '1px solid rgba(61, 15, 24, 0.35)',
        borderRadius: 999,
        padding: withLabel ? '3px 10px' : '3px',
        fontSize: 12,
        fontWeight: 900,
        boxShadow: '0 3px 10px rgba(166, 124, 46, 0.35)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      <BadgeCheck size={size} color="#3d0f18" strokeWidth={2.4} />
      {withLabel && <span>موثق</span>}
    </span>
  );
}
