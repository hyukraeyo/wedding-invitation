"use client";

import React, { useState } from 'react';
import { Dialog as Modal } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import dynamic from 'next/dynamic';
import styles from './RejectionReasonModal.module.scss';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor').then(mod => mod.RichTextEditor), { ssr: false });

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
        <Modal open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header title={title} />
                <Modal.Body>
                    <div className={styles.description}>
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
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        className={styles.button}
                        variant="weak"
                        size="lg"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        취소
                    </Button>
                    <Button
                        className={styles.button}
                        variant="fill"
                        size="lg"
                        loading={loading}
                        disabled={!reason.trim() || loading}
                        onClick={handleSubmit}
                    >
                        {confirmText}
                    </Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}
