import { LEAD_STAGES, PRIORITY_OPTIONS } from '../../utils/constants';

const LeadForm = ({ form, onChange, teamMembers = [] }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...form, [name]: value });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-medium text-surface-800">
          Company name *
        </label>
        <input
          name="companyName"
          className="input-field"
          value={form.companyName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-surface-800">
          Contact name *
        </label>
        <input
          name="contactName"
          className="input-field"
          value={form.contactName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-surface-800">Email</label>
        <input
          name="email"
          type="email"
          className="input-field"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-surface-800">Phone</label>
        <input
          name="phone"
          className="input-field"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-surface-800">Industry</label>
        <input
          name="industry"
          className="input-field"
          value={form.industry}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-surface-800">Source</label>
        <input
          name="source"
          className="input-field"
          placeholder="e.g. Referral, Website"
          value={form.source}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-surface-800">Deal value (₹)</label>
        <input
          name="value"
          type="number"
          min="0"
          className="input-field"
          value={form.value}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-surface-800">Stage</label>
        <select name="stage" className="input-field" value={form.stage} onChange={handleChange}>
          {LEAD_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-surface-800">Priority</label>
        <select
          name="priority"
          className="input-field"
          value={form.priority}
          onChange={handleChange}
        >
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-surface-800">
          Assign to
        </label>
        <select
          name="assignedTo"
          className="input-field"
          value={form.assignedTo || ''}
          onChange={handleChange}
        >
          <option value="">Unassigned</option>
          {teamMembers.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-surface-800">
          Expected close date
        </label>
        <input
          name="expectedCloseDate"
          type="date"
          className="input-field"
          value={form.expectedCloseDate || ''}
          onChange={handleChange}
        />
      </div>

      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-medium text-surface-800">Notes</label>
        <textarea
          name="notes"
          rows={3}
          className="input-field resize-none"
          value={form.notes}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export const emptyLeadForm = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  industry: '',
  source: '',
  stage: 'New',
  value: '',
  notes: '',
  priority: 'medium',
  assignedTo: '',
  expectedCloseDate: '',
};

export const leadToForm = (lead) => ({
  companyName: lead.companyName || '',
  contactName: lead.contactName || '',
  email: lead.email || '',
  phone: lead.phone || '',
  industry: lead.industry || '',
  source: lead.source || '',
  stage: lead.stage || 'New',
  value: lead.value ?? '',
  notes: lead.notes || '',
  priority: lead.priority || 'medium',
  assignedTo: lead.assignedTo?._id || lead.assignedTo || '',
  expectedCloseDate: lead.expectedCloseDate
    ? new Date(lead.expectedCloseDate).toISOString().split('T')[0]
    : '',
});

export default LeadForm;
