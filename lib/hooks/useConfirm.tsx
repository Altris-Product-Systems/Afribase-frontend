
import { useState, useCallback } from 'react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'default';
}

export function useConfirm() {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions | null>(null);
    const [resolveRef, setResolveRef] = useState<{ resolve: (value: boolean) => void } | null>(null);

    const confirm = useCallback((opts: ConfirmOptions) => {
        setOptions(opts);
        setIsOpen(true);
        return new Promise<boolean>((resolve) => {
            setResolveRef({ resolve });
        });
    }, []);

    const handleConfirm = useCallback(() => {
        if (resolveRef) {
            resolveRef.resolve(true);
        }
        setIsOpen(false);
    }, [resolveRef]);

    const handleCancel = useCallback(() => {
        if (resolveRef) {
            resolveRef.resolve(false);
        }
        setIsOpen(false);
    }, [resolveRef]);

    const ConfirmDialog = () => (
        options ? (
            <ConfirmModal
                isOpen= { isOpen }
                onClose = { handleCancel }
    onConfirm = { handleConfirm }
    title = { options.title }
    message = { options.message }
    confirmText = { options.confirmText }
    cancelText = { options.cancelText }
    variant = { options.variant }
        />
        ) : null
    );

    return {
        confirm,
        ConfirmDialog
    };
}
