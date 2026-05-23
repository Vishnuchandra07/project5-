const ChartCard = ({
  title,
  description,
  action,
  children,
  className = '',
  noPadding = false,
}) => (
  <div className={`card flex flex-col ${className}`}>
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h3 className="text-base font-semibold text-surface-900">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
    <div className={`min-h-[240px] flex-1 sm:min-h-[280px] ${noPadding ? '' : ''}`}>
      {children}
    </div>
  </div>
);

export default ChartCard;
