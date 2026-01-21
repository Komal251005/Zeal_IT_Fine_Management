import { FiAlertCircle, FiX } from 'react-icons/fi';

const ErrorMessage = ({ message, onClose, type = 'error' }) => {
    const typeStyles = {
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: 'text-red-500',
        },
        warning: {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-800',
            icon: 'text-amber-500',
        },
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: 'text-green-500',
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: 'text-blue-500',
        },
    };

    const styles = typeStyles[type];

    if (!message) return null;

    return (
        <div
            className={`flex items-start justify-between p-4 rounded-lg border 
                  ${styles.bg} ${styles.border} ${styles.text} animate-fadeIn`}
        >
            <div className="flex items-start space-x-3">
                <FiAlertCircle className={`w-5 h-5 mt-0.5 ${styles.icon} flex-shrink-0`} />
                <p className="text-sm font-medium">{message}</p>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className={`ml-4 ${styles.icon} hover:opacity-70 transition-opacity`}
                >
                    <FiX className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
