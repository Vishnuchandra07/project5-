import Modal from '../ui/Modal';
import LeadForm from './LeadForm';

const LeadFormModal = ({
  isOpen,
  onClose,
  title,
  form,
  onChange,
  onSubmit,
  teamMembers,
  saving,
  submitLabel,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
    <form onSubmit={onSubmit}>
      <LeadForm form={form} onChange={onChange} teamMembers={teamMembers} />
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} className="btn-secondary" disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  </Modal>
);

export default LeadFormModal;
