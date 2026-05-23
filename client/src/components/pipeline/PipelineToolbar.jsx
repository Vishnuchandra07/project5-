import { FiFilter, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { LEAD_STAGES } from '../../utils/constants';

const PipelineToolbar = ({
  assignedTo,
  onAssigneeChange,
  teamMembers,
  search,
  onSearchChange,
  stageFilter,
  onStageFilterChange,
  totalLeads,
  totalValueLabel,
  onRefresh,
  refreshing,
}) => (
  <div className="card space-y-4 p-4">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
      <div className="flex-1">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">Search</label>
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter cards on board..."
            className="input-field pl-10"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full sm:w-48">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
          <FiFilter className="mr-1 inline h-3.5 w-3.5" />
          Assignee
        </label>
        <select
          className="input-field"
          value={assignedTo}
          onChange={(e) => onAssigneeChange(e.target.value)}
        >
          <option value="">All team members</option>
          {teamMembers.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-44">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">Highlight stage</label>
        <select
          className="input-field"
          value={stageFilter}
          onChange={(e) => onStageFilterChange(e.target.value)}
        >
          <option value="">All stages</option>
          {LEAD_STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="btn-secondary h-[42px] shrink-0"
      >
        <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        Refresh
      </button>
    </div>

    <div className="flex flex-wrap items-center gap-4 border-t border-surface-100 pt-3 text-sm">
      <span className="text-slate-500">
        <strong className="text-surface-900">{totalLeads}</strong> leads on board
      </span>
      {totalValueLabel && (
        <span className="text-slate-500">
          · <strong className="text-surface-900">{totalValueLabel}</strong> total value
        </span>
      )}
    </div>
  </div>
);

export default PipelineToolbar;
