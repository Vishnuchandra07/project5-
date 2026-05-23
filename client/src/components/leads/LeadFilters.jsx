import { FiSearch, FiX } from 'react-icons/fi';
import { LEAD_STAGES } from '../../utils/constants';

const LeadFilters = ({ filters, onChange, teamMembers = [], onClear, hasActiveFilters }) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Search</label>
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search company, contact, email..."
              className="input-field pl-10"
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
            />
          </div>
        </div>

        <div className="w-full sm:w-44">
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Stage</label>
          <select
            className="input-field"
            value={filters.stage}
            onChange={(e) => handleChange('stage', e.target.value)}
          >
            <option value="">All stages</option>
            {LEAD_STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-44">
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Assigned to</label>
          <select
            className="input-field"
            value={filters.assignedTo}
            onChange={(e) => handleChange('assignedTo', e.target.value)}
          >
            <option value="">All members</option>
            {teamMembers.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-36">
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Priority</label>
          <select
            className="input-field"
            value={filters.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button type="button" onClick={onClear} className="btn-secondary h-[42px] shrink-0">
            <FiX className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default LeadFilters;
