"use client";

import React, { useState } from 'react';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';
import dynamic from 'next/dynamic';
import styles from './RejectionReasonModal.module.scss';

const RichTextEditor = dynamic(() => import('@/components/common/RichTextEditor'), { ssr: false });

interface RejectionReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
    loading?: boolean;
    requesterName?: string;
}

export default function RejectionReasonModal({
    isOpen,
    onClose,
    onSubmit,
    loading = false,
    requesterName,
}: RejectionReasonModalProps) {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        if (!reason.trim()) {
            return;
        }
        onSubmit(reason);
        setReason('');
    };

    const handleClose = () => {
        if (loading) return;
        setReason('');
        onClose();
    };

    return (
        <ResponsiveModal
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) handleClose();
            }}
            title="사용 신청 거절"
            description={
                requesterName ? (
                    <>
                        <strong>{requesterName}</strong>님의 사용 신청을 거절합니다.<br />
                        거절 사유를 입력해주세요. 사용자가 확인할 수 있습니다.
                    </>
                ) : (
                    '거절 사유를 입력해주세요. 사용자가 확인할 수 있습니다.'
                )
            }
            confirmText="거절하기"
            cancelText="취소"
            onConfirm={handleSubmit}
            onCancel={handleClose}
            showCancel={!loading}
            confirmDisabled={!reason.trim() || loading}
            confirmLoading={loading}
            dismissible={!loading}
        >
            <div className={styles.editorWrapper}>
                <RichTextEditor
                    content={reason}
                    onChange={setReason}
                    placeholder="거절 사유를 입력하세요…"
                    minHeight="min-h-[180px]"
                />
            </div>
        </ResponsiveModal>
    );
}
