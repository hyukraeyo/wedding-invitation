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
    title?: string;
    description?: React.ReactNode;
    confirmText?: string;
}

export default function RejectionReasonModal({
    isOpen,
    onClose,
    onSubmit,
    loading = false,
    requesterName,
    title = "승인 거절",
    description,
    confirmText = "승인 거절",
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
            title={title}
            description={null}
            confirmText={confirmText}
            cancelText="취소"
            onConfirm={handleSubmit}
            onCancel={handleClose}
            showCancel={!loading}
            confirmDisabled={!reason.trim() || loading}
            confirmLoading={loading}
            dismissible={!loading}
        >
            <div style={{ textAlign: 'center', color: '#4E5968', marginBottom: '1.5rem', wordBreak: 'keep-all', lineHeight: '1.6' }}>
                {description || (requesterName ? (
                    <>
                        <strong>{requesterName}</strong>님의 사용 신청을 거절합니다.<br />
                        승인 거절 사유를 입력해주세요. 사용자가 확인할 수 있습니다.
                    </>
                ) : (
                    '승인 거절 사유를 입력해주세요. 사용자가 확인할 수 있습니다.'
                ))}
            </div>
            <div className={styles.editorWrapper}>
                <RichTextEditor
                    content={reason}
                    onChange={setReason}
                    placeholder="내용을 입력하세요…"
                    minHeight={180}
                />
            </div>
        </ResponsiveModal>
    );
}
