import { FiEdit2, FiTrash2, FiEye, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import { LEAD_STAGES } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { updateLeadStage } from '../../services/leadService';

const priorityStyles = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-50 text-amber-700',
  high: 'bg-rose-50 text-rose-700',
};

const LeadTable = ({ leads, onEdit, onDelete, onStageChange }) => {
  const handleStageChange = async (leadId, stage) => {
    try {
      await updateLeadStage(leadId, stage);
      onStageChange?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card hidden overflow-hidden p-0 md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-surface-200 bg-surface-50/80">
              <th className="px-5 py-3.5 font-medium text-slate-600">Company</th>
              <th className="px-5 py-3.5 font-medium text-slate-600">Contact</th>
              <th className="px-5 py-3.5 font-medium text-slate-600">Stage</th>
              <th className="px-5 py-3.5 font-medium text-slate-600">Priority</th>
              <th className="px-5 py-3.5 font-medium text-slate-600">Value</th>
              <th className="px-5 py-3.5 font-medium text-slate-600">Assigned</th>
              <th className="px-5 py-3.5 font-medium text-slate-600">Updated</th>
              <th className="px-5 py-3.5 text-right font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {leads.map((lead) => (
              <tr key={lead._id} className="transition hover:bg-surface-50/50">
                <td className="px-5 py-4">
                  <Link
                    to={`/leads/${lead._id}`}
                    className="font-medium text-surface-900 hover:text-brand-600"
                  >
                    {lead.companyName}
                  </Link>
                  <p className="text-xs text-slate-500">{lead.industry || '—'}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-surface-800">{lead.contactName}</p>
                  <p className="text-xs text-slate-500">{lead.email || lead.phone || '—'}</p>
                </td>
                <td className="px-5 py-4">
                  <select
                    value={lead.stage}
                    onChange={(e) => handleStageChange(lead._id, e.target.value)}
                    className="max-w-[140px] rounded-lg border border-surface-200 bg-white px-2 py-1 text-xs font-medium focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {LEAD_STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                      priorityStyles[lead.priority] || priorityStyles.medium
                    }`}
                  >
                    {lead.priority}
                  </span>
                </td>
                <td className="px-5 py-4 font-medium tabular-nums">
                  {formatCurrency(lead.value)}
                </td>
                <td className="px-5 py-4">
                  {lead.assignedTo ? (
                    <span className="inline-flex items-center gap-1.5 text-surface-700">
                      <FiUser className="h-3.5 w-3.5 text-slate-400" />
                      {lead.assignedTo.name}
                    </span>
                  ) : (
                    <span className="text-slate-400">Unassigned</span>
                  )}
                </td>
                <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                  {formatDate(lead.updatedAt)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Link
                      to={`/leads/${lead._id}`}
                      className="rounded-lg p-2 text-slate-500 hover:bg-surface-100 hover:text-surface-800"
                      title="View"
                    >
                      <FiEye className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onEdit(lead)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-brand-50 hover:text-brand-600"
                      title="Edit"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(lead)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                      title="Delete"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
