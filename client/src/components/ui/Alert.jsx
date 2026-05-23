import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

const variants = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
};

const icons = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiAlertCircle,
};

const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;
  const Icon = icons[type];

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${variants[type]}`}
      role="alert"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="flex-1">{message}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          <FiX className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
