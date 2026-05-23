import Modal from './Modal';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm action',
  message,
  confirmLabel = 'Delete',
  loading = false,
  variant = 'danger',
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <p className="text-sm text-slate-600">{message}</p>
    <div className="mt-6 flex justify-end gap-3">
      <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={loading}
        className={
          variant === 'danger'
            ? 'inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50'
            : 'btn-primary'
        }
      >
        {loading ? 'Processing...' : confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
