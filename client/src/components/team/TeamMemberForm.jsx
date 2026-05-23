const TeamMemberForm = ({ form, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...form, [name]: value });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-medium">Full name *</label>
        <input
          name="name"
          className="input-field"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Email *</label>
        <input
          name="email"
          type="email"
          className="input-field"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Phone</label>
        <input
          name="phone"
          className="input-field"
          value={form.phone}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Role</label>
        <input
          name="role"
          className="input-field"
          placeholder="BDA"
          value={form.role}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Department</label>
        <input
          name="department"
          className="input-field"
          value={form.department}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export const emptyTeamForm = {
  name: '',
  email: '',
  phone: '',
  role: 'BDA',
  department: 'Business Development',
};

export const memberToForm = (member) => ({
  name: member.name || '',
  email: member.email || '',
  phone: member.phone || '',
  role: member.role || 'BDA',
  department: member.department || 'Business Development',
});

export default TeamMemberForm;
