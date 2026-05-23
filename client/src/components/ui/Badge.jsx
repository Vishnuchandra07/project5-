import { STAGE_COLORS } from '../../utils/constants';

const Badge = ({ children, variant = 'default', className = '' }) => {
  if (STAGE_COLORS[children]) {
    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STAGE_COLORS[children]} ${className}`}
      >
        {children}
      </span>
    );
  }

  const variants = {
    default: 'bg-surface-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-rose-50 text-rose-700',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
