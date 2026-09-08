import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Konfirmasi',
    cancelText = 'Batal',
    isDestructive = false,
    isLoading = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 text-center">
                    <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 mb-6">{message}</p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 flex-1"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-lg text-white font-medium shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 flex-1 flex items-center justify-center ${isDestructive
                                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                    : 'bg-primary hover:bg-primary/90 focus:ring-primary'
                                } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </span>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
