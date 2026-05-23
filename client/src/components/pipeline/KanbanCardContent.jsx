import { FiUser, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { formatCurrency, formatDate } from '../../utils/formatters';

const priorityDot = {
  low: 'bg-slate-300',
  medium: 'bg-amber-400',
  high: 'bg-rose-500',
};

const KanbanCardContent = ({ lead, isOverlay = false }) => (
  <div
    className={`rounded-lg border border-surface-200 bg-white p-3.5 shadow-card ${
      isOverlay ? 'rotate-2 border-brand-300 shadow-elevated ring-2 ring-brand-200' : ''
    }`}
  >
    <div className="flex items-start justify-between gap-2">
      <p className="text-sm font-semibold leading-snug text-surface-900 line-clamp-2">
        {lead.companyName}
      </p>
      <span
        className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
          priorityDot[lead.priority] || priorityDot.medium
        }`}
        title={`${lead.priority} priority`}
      />
    </div>
    <p className="mt-1 text-xs text-slate-500 line-clamp-1">{lead.contactName}</p>

    {lead.industry && (
      <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-slate-400">
        {lead.industry}
      </p>
    )}

    <div className="mt-3 space-y-1.5 border-t border-surface-100 pt-3 text-xs text-slate-500">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 font-semibold text-surface-800">
          <FiDollarSign className="h-3.5 w-3.5 text-slate-400" />
          {formatCurrency(lead.value)}
        </span>
        {lead.assignedTo && (
          <span
            className="inline-flex max-w-[110px] items-center gap-1 truncate rounded-full bg-surface-50 px-2 py-0.5"
            title={lead.assignedTo.name}
          >
            <FiUser className="h-3 w-3 shrink-0" />
            <span className="truncate">{lead.assignedTo.name}</span>
          </span>
        )}
      </div>
      {lead.expectedCloseDate && (
        <span className="inline-flex items-center gap-1 text-slate-400">
          <FiCalendar className="h-3 w-3" />
          {formatDate(lead.expectedCloseDate)}
        </span>
      )}
    </div>
  </div>
);

export default KanbanCardContent;
