import { formatCurrency } from '../../utils/formatters';

const LeadStatsBar = ({ leads }) => {
  const total = leads.length;
  const active = leads.filter(
    (l) => !['Closed Won', 'Closed Lost'].includes(l.stage)
  ).length;
  const revenue = leads
    .filter((l) => l.stage === 'Closed Won')
    .reduce((sum, l) => sum + (l.value || 0), 0);

  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: 'Showing', value: total },
        { label: 'Active', value: active },
        { label: 'Won value', value: formatCurrency(revenue) },
      ].map(({ label, value }) => (
        <div
          key={label}
          className="rounded-xl border border-surface-200 bg-white px-4 py-3 text-center shadow-sm"
        >
          <p className="text-lg font-bold text-surface-900">{value}</p>
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default LeadStatsBar;
