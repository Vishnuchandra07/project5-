import { FiEdit2, FiTrash2, FiEye, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';

const priorityLabel = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const LeadCardList = ({ leads, onEdit, onDelete }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {leads.map((lead) => (
      <article
        key={lead._id}
        className="card flex flex-col gap-3 transition hover:shadow-elevated"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/leads/${lead._id}`}
              className="font-semibold text-surface-900 hover:text-brand-600 line-clamp-1"
            >
              {lead.companyName}
            </Link>
            <p className="text-sm text-slate-500">{lead.contactName}</p>
          </div>
          <Badge>{lead.stage}</Badge>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-surface-100 px-2 py-0.5 capitalize text-slate-600">
            {priorityLabel[lead.priority] || lead.priority} priority
          </span>
          <span className="font-semibold text-surface-800">{formatCurrency(lead.value)}</span>
        </div>

        <div className="flex items-center justify-between border-t border-surface-100 pt-3 text-xs text-slate-500">
          {lead.assignedTo ? (
            <span className="inline-flex items-center gap-1">
              <FiUser className="h-3.5 w-3.5" />
              {lead.assignedTo.name}
            </span>
          ) : (
            <span>Unassigned</span>
          )}
          <span>{formatDate(lead.updatedAt)}</span>
        </div>

        <div className="flex gap-1 border-t border-surface-100 pt-2">
          <Link
            to={`/leads/${lead._id}`}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-xs font-medium text-slate-600 hover:bg-surface-50"
          >
            <FiEye className="h-3.5 w-3.5" />
            View
          </Link>
          <button
            type="button"
            onClick={() => onEdit(lead)}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-xs font-medium text-brand-600 hover:bg-brand-50"
          >
            <FiEdit2 className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(lead)}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </article>
    ))}
  </div>
);

export default LeadCardList;
