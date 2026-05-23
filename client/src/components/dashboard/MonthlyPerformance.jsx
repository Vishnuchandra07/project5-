import { FiTarget, FiCheckCircle, FiDollarSign, FiUsers } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatters';

const rows = [
  {
    label: 'Leads created',
    icon: FiTarget,
    getValue: (monthly) => monthly?.leadsCreated ?? 0,
    highlight: false,
  },
  {
    label: 'Deals closed',
    icon: FiCheckCircle,
    getValue: (monthly) => monthly?.dealsClosed ?? 0,
    highlight: false,
  },
  {
    label: 'Revenue',
    icon: FiDollarSign,
    getValue: (monthly) => formatCurrency(monthly?.revenue),
    highlight: true,
  },
  {
    label: 'Team members',
    icon: FiUsers,
    getValue: (_, teamCount) => teamCount ?? 0,
    highlight: false,
  },
];

const MonthlyPerformance = ({ monthly, teamCount }) => (
  <dl className="space-y-2.5">
    {rows.map(({ label, icon: Icon, getValue, highlight }) => (
      <div
        key={label}
        className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 ${
          highlight ? 'bg-brand-50 ring-1 ring-brand-100' : 'bg-surface-50'
        }`}
      >
        <dt className="flex items-center gap-2.5 text-sm text-slate-600">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              highlight ? 'bg-brand-100 text-brand-600' : 'bg-white text-slate-500 shadow-sm'
            }`}
          >
            <Icon className="h-4 w-4" />
          </span>
          {label}
        </dt>
        <dd
          className={`text-sm font-bold tabular-nums ${
            highlight ? 'text-brand-700' : 'text-surface-900'
          }`}
        >
          {getValue(monthly, teamCount)}
        </dd>
      </div>
    ))}
  </dl>
);

export default MonthlyPerformance;
