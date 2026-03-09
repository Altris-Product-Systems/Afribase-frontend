
import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, Info } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'default';
    loading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
    loading = false
}: ConfirmModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            variant={variant}
            footer={
                <>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-2 rounded-xl text-sm font-bold text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                        }}
                        disabled={loading}
                        className={`px-6 py-2 rounded-xl text-sm font-black tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50 ${variant === 'danger'
                                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                                : 'bg-white hover:bg-emerald-500 text-black shadow-lg shadow-white/10'
                            }`}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </>
            }
        >
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {variant === 'danger' ? <AlertTriangle size={24} /> : <Info size={24} />}
                </div>
                <div className="space-y-1">
                    <p className="text-zinc-300 text-sm font-medium leading-relaxed">
                        {message}
                    </p>
                </div>
            </div>
        </Modal>
    );
}
