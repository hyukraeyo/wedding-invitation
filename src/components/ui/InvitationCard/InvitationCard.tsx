"use client";

import React, { useState } from 'react';
import {
    MoreHorizontal,
    Edit2,
    Eye,
    Trash2,
    Bookmark,
    FileText,
    AlertCircle,
    Banana
} from 'lucide-react';
import { clsx } from 'clsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import type { InvitationSummaryRecord } from '@/lib/invitation-summary';
import type { ApprovalRequestSummary } from '@/services/approvalRequestService';
import styles from './InvitationCard.module.scss';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';

interface InvitationCardProps {
    invitation: InvitationSummaryRecord;
    isAdmin?: boolean;
    rejectionData?: ApprovalRequestSummary | null | undefined;
    onEdit: (inv: InvitationSummaryRecord) => void;
    onDelete: (inv: InvitationSummaryRecord) => void;
    onRequestApproval: (inv: InvitationSummaryRecord) => void;
    onCancelRequest: (inv: InvitationSummaryRecord) => void;
    onRevokeApproval: (inv: InvitationSummaryRecord) => void;
}

const InvitationCard = ({
    invitation,
    isAdmin = false,
    rejectionData = null,
    onEdit,
    onDelete,
    onRequestApproval,
    onCancelRequest,
    onRevokeApproval,
}: InvitationCardProps) => {
    const data = invitation.invitation_data;
    const isApproved = data?.isApproved;
    const isRequesting = data?.isRequestingApproval;
    const isRejected = !!rejectionData;
    const imageUrl = data?.imageUrl;
    const title = data?.mainScreen?.title || '제목없음';
    const slug = invitation.slug;

    const [showRejectionModal, setShowRejectionModal] = useState(false);

    const handlePreview = () => {
        window.open(`/v/${slug}`, '_blank');
    };

    const handlePrimaryAction = (e: React.MouseEvent) => {
        e.preventDefault();
        // Prevent action if approved or rejected (treat as disabled)
        if (isApproved || isRejected) return;

        if (isRequesting) {
            onCancelRequest(invitation);
        } else {
            onRequestApproval(invitation);
        }
    };

    const formattedDate = new Date(invitation.updated_at)
        .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .replace(/\. /g, '.')
        .replace(/\.$/, '');

    return (
        <div className={styles.cardWrapper}>
            <div className={styles.cardItem}>
                {imageUrl ? (
                    <div className={styles.imageWrapper}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageUrl} alt={title} />
                    </div>
                ) : (
                    <div className={styles.fallbackWrapper}>
                        <Banana className={styles.bananaIcon} />
                    </div>
                )}

                <div className={styles.overlay}>
                    <div className={styles.overlayTop}>
                        <span className={clsx(
                            styles.statusBadge,
                            isRejected ? styles.rejectedBadge :
                                isApproved ? styles.approvedBadge :
                                    isRequesting ? styles.pendingBadge : styles.sampleBadge
                        )}>
                            <span className={styles.dot} />
                            {isRejected ? '거절됨' : isApproved ? '승인 완료' : isRequesting ? '승인 대기중' : '샘플 이용중'}
                        </span>
                        <h3 className={styles.overlayTitle}>
                            <Bookmark size={20} fill="currentColor" />
                            {title}
                        </h3>
                    </div>

                    <div className={styles.footer}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <IconButton
                                    icon={MoreHorizontal}
                                    className={styles.footerIconButton}
                                    variant="outline"
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" align="start" style={{ width: '160px', padding: '0.4rem', borderRadius: '0.75rem' }}>
                                {!isRequesting && !isApproved && !isRejected && (
                                    <DropdownMenuItem onClick={() => onEdit(invitation)}>
                                        <Edit2 size={16} className="mr-2" /> 편집하기
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={handlePreview}>
                                    <Eye size={16} className="mr-2" /> 미리보기
                                </DropdownMenuItem>
                                {isRejected && (
                                    <DropdownMenuItem onClick={() => setShowRejectionModal(true)} style={{ color: '#DC2626' }}>
                                        <AlertCircle size={16} className="mr-2" /> 거절 사유
                                    </DropdownMenuItem>
                                )}
                                {!isRequesting && !isApproved && !isRejected && (
                                    <DropdownMenuItem
                                        onClick={() => setTimeout(() => onDelete(invitation), 0)}
                                        style={{ color: '#EF4444' }}
                                    >
                                        <Trash2 size={16} className="mr-2" /> 삭제하기
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {isRejected ? (
                            <>
                                <Button
                                    variant="outline"
                                    className={styles.footerSecondaryButton}
                                    onClick={handlePreview}
                                >
                                    미리보기
                                </Button>
                                <Button
                                    variant="outline"
                                    className={clsx(styles.footerPrimaryButton, styles.rejected)}
                                    onClick={() => setShowRejectionModal(true)}
                                >
                                    거절 사유
                                </Button>
                            </>
                        ) : !isRequesting && !isApproved ? (
                            <>
                                <Button
                                    variant="outline"
                                    className={styles.footerSecondaryButton}
                                    onClick={() => onEdit(invitation)}
                                >
                                    편집하기
                                </Button>
                                <Button
                                    className={styles.footerPrimaryButton}
                                    variant="solid"
                                    onClick={handlePrimaryAction}
                                >
                                    사용신청
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    className={styles.footerSecondaryButton}
                                    onClick={handlePreview}
                                >
                                    미리보기
                                </Button>
                                <Button
                                    className={clsx(
                                        styles.footerPrimaryButton,
                                        isApproved && styles.approved,
                                        isRequesting && styles.requesting
                                    )}
                                    variant={isApproved ? "secondary" : "solid"}
                                    disabled={(!isAdmin && isApproved)}
                                    onClick={handlePrimaryAction}
                                >
                                    {isApproved ? '승인완료' : '신청취소'}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.dateText}>
                생성일 {formattedDate}
            </div>

            {/* Rejection Reason Modal */}
            {isRejected && rejectionData && (
                <ResponsiveModal
                    open={showRejectionModal}
                    onOpenChange={setShowRejectionModal}
                    title="거절 사유"
                    description="관리자가 작성한 거절 사유입니다."
                    showCancel={false}
                    confirmText="확인"
                    onConfirm={() => setShowRejectionModal(false)}
                >
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        backgroundColor: '#FEF2F2',
                        borderRadius: '0.75rem',
                        border: '1px solid #FEE2E2',
                    }}>
                        <div
                            style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7 }}
                            dangerouslySetInnerHTML={{ __html: rejectionData.rejection_reason || '거절 사유가 없습니다.' }}
                        />
                    </div>
                </ResponsiveModal>
            )}
        </div>
    );
};

InvitationCard.displayName = "InvitationCard";

export { InvitationCard };
export type { InvitationCardProps };
