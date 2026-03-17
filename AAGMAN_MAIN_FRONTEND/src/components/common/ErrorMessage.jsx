import { X } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl relative mb-4 flex items-center gap-3">
      <span className="block sm:inline flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-rose-400 hover:text-rose-300 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

