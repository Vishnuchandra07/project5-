import { Link } from 'react-router-dom';
import { FiPlus, FiColumns, FiUsers } from 'react-icons/fi';

const actions = [
  {
    to: '/leads',
    label: 'New lead',
    description: 'Add prospect',
    icon: FiPlus,
    className: 'bg-brand-600 text-white hover:bg-brand-700',
  },
  {
    to: '/pipeline',
    label: 'Pipeline',
    description: 'Kanban board',
    icon: FiColumns,
    className: 'bg-white text-surface-800 border border-surface-200 hover:bg-surface-50',
  },
  {
    to: '/team',
    label: 'Team',
    description: 'Manage BDAs',
    icon: FiUsers,
    className: 'bg-white text-surface-800 border border-surface-200 hover:bg-surface-50',
  },
];

const QuickActions = () => (
  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
    {actions.map(({ to, label, description, icon: Icon, className }) => (
      <Link
        key={to}
        to={to}
        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition ${className}`}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs opacity-80">{description}</p>
        </div>
      </Link>
    ))}
  </div>
);

export default QuickActions;
