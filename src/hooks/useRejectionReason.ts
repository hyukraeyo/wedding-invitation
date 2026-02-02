import * as React from 'react';

interface UseRejectionReasonParams {
    onSubmit: (reason: string) => void;
    onClose: () => void;
    loading?: boolean;
}

interface UseRejectionReasonResult {
    reason: string;
    setReason: (value: string) => void;
    isSubmitDisabled: boolean;
    handleSubmit: () => void;
    handleClose: () => void;
}

export const useRejectionReason = ({
    onSubmit,
    onClose,
    loading = false,
}: UseRejectionReasonParams): UseRejectionReasonResult => {
    const [reason, setReason] = React.useState('');

    const handleSubmit = React.useCallback(() => {
        if (!reason.trim()) return;
        onSubmit(reason);
        setReason('');
    }, [onSubmit, reason]);

    const handleClose = React.useCallback(() => {
        if (loading) return;
        setReason('');
        onClose();
    }, [loading, onClose]);

    return {
        reason,
        setReason,
        isSubmitDisabled: !reason.trim() || loading,
        handleSubmit,
        handleClose,
    };
};
