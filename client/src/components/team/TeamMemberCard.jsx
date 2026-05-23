import { FiMail, FiPhone, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatters';

const TeamMemberCard = ({ member, onEdit, onDelete }) => {
  const perf = member.performance || {};

  return (
    <div className="card group transition hover:shadow-elevated">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-lg font-bold text-brand-700">
            {member.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-surface-900">{member.name}</h3>
            <p className="text-xs text-slate-500">{member.role || 'BDA'}</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(member)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-brand-50 hover:text-brand-600"
          >
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(member)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 text-sm text-slate-500">
        <p className="flex items-center gap-2">
          <FiMail className="h-3.5 w-3.5" />
          {member.email}
        </p>
        {member.phone && (
          <p className="flex items-center gap-2">
            <FiPhone className="h-3.5 w-3.5" />
            {member.phone}
          </p>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-surface-100 pt-4">
        <div className="rounded-lg bg-surface-50 px-3 py-2">
          <p className="text-xs text-slate-500">Leads</p>
          <p className="text-lg font-bold text-surface-900">{perf.totalLeads ?? 0}</p>
        </div>
        <div className="rounded-lg bg-surface-50 px-3 py-2">
          <p className="text-xs text-slate-500">Active</p>
          <p className="text-lg font-bold text-amber-600">{perf.activeDeals ?? 0}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 px-3 py-2">
          <p className="text-xs text-emerald-600">Won</p>
          <p className="text-lg font-bold text-emerald-700">{perf.closedWon ?? 0}</p>
        </div>
        <div className="rounded-lg bg-brand-50 px-3 py-2">
          <p className="text-xs text-brand-600">Conversion</p>
          <p className="text-lg font-bold text-brand-700">{perf.conversionRate ?? 0}%</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Revenue: <span className="font-semibold text-surface-800">{formatCurrency(perf.totalRevenue)}</span>
      </p>
    </div>
  );
};

export default TeamMemberCard;
