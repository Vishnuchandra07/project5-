import { Link } from 'react-router-dom';

const colorMap = {
  brand: {
    icon: 'bg-teal-50 text-brand-600',
    accent: 'from-teal-500/10 to-transparent',
  },
  green: {
    icon: 'bg-emerald-50 text-emerald-600',
    accent: 'from-emerald-500/10 to-transparent',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-600',
    accent: 'from-amber-500/10 to-transparent',
  },
  purple: {
    icon: 'bg-purple-50 text-purple-600',
    accent: 'from-purple-500/10 to-transparent',
  },
  rose: {
    icon: 'bg-rose-50 text-rose-600',
    accent: 'from-rose-500/10 to-transparent',
  },
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'brand',
  href,
  className = '',
}) => {
  const colors = colorMap[color] || colorMap.brand;

  const content = (
    <div
      className={`card relative overflow-hidden transition hover:shadow-elevated ${href ? 'hover:border-brand-200' : ''} ${className}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${colors.accent}`}
      />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-1 truncate text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl">
              {value}
            </p>
            {subtitle && (
              <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors.icon}`}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
        {trend !== undefined && (
          <p
            className={`text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }

  return content;
};

export default StatCard;
