import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    }[type];

    const icon = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    }[type];

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px]`}>
                <span className="text-2xl">{icon}</span>
                <span className="flex-1">{message}</span>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default Toast;
