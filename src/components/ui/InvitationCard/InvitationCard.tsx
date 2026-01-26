"use client";

import { parseRejection } from '@/lib/rejection-helpers';
import React, { useState } from 'react';
import {
    MoreHorizontal,
    Edit2,
    Eye,
    Trash2,
    AlertCircle,
    Banana,
    Share2,
    MessageCircle,
    Send,
    XCircle,
    Calendar,
} from 'lucide-react'; // eslint-disable-line @typescript-eslint/no-unused-vars
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
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
import { DynamicResponsiveModal as ResponsiveModal } from '@/components/common/ResponsiveModal/Dynamic';
import { useInvitationStatus } from '@/hooks/useInvitationStatus';
import { InvitationActionMenu } from '@/components/common/InvitationActionMenu';

interface InvitationCardProps {
    invitation: InvitationSummaryRecord;
    isAdmin?: boolean;
    rejectionData?: ApprovalRequestSummary | null | undefined;
    onEdit: (inv: InvitationSummaryRecord) => void;
    onDelete: (inv: InvitationSummaryRecord) => void;
    onRequestApproval: (inv: InvitationSummaryRecord) => void;
    onCancelRequest: (inv: InvitationSummaryRecord) => void;
    onRevokeApproval: (inv: InvitationSummaryRecord) => void;
    onRevertToDraft?: (inv: InvitationSummaryRecord) => void;
    index?: number;
    layout?: 'grid' | 'swiper';
}

const InvitationCard = React.memo(({
    invitation,
    onEdit,
    onDelete,
    onRequestApproval,
    onCancelRequest,
    onRevertToDraft,
    index,
    rejectionData = null,
    layout = 'swiper',
    onRevokeApproval,
}: InvitationCardProps) => {
    const { data, isApproved, isRequesting, isRejected, imageUrl, title, slug } = useInvitationStatus({ invitation, rejectionData }); // eslint-disable-line @typescript-eslint/no-unused-vars

    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const isGridMode = layout === 'grid';
    const { toast } = useToast();

    const handlePreview = () => {
        window.open(`/v/${slug}`, '_blank');
    };

    const handlePrimaryAction = (e: React.MouseEvent) => {
        e.preventDefault();
        // Prevent action if approved (treat as disabled)
        if (isApproved) return;

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

    // 유틸리티를 사용하여 상태 분석 및 텍스트 추출
    const {
        displayReason,
        label: REJECTION_LABEL,
        badge: REJECTION_BADGE,
        title: REJECTION_TITLE
    } = parseRejection(rejectionData);

    // DropdownMenuItem 클릭 시 모달 열기
    // setTimeout을 사용하여 드롭다운이 닫힌 후 모달이 열리도록 처리 (포커스 경고 방지)
    const handleRejectionModalOpen = () => {
        setTimeout(() => setShowRejectionModal(true), 0);
    };

    return (
        <div className={styles.cardWrapper}>
            <div className={styles.cardItem}>
                {imageUrl ? (
                    <div className={styles.imageWrapper}>
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            sizes="(max-width: 428px) 100vw, 400px"
                            priority={index !== undefined ? index < 2 : invitation.invitation_data?.isApproved}
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                ) : (
                    <div className={styles.fallbackWrapper}>
                        <Banana className={styles.bananaIcon} />
                    </div>
                )}

                <div className={clsx(styles.overlay, !imageUrl && styles.noImage)}>
                    <div className={styles.overlayTop}>
                        <div className={styles.statusRow}>
                            <span className={clsx(
                                styles.statusBadge,
                                isRejected ? styles.rejectedBadge :
                                    isApproved ? styles.approvedBadge :
                                        isRequesting ? styles.pendingBadge : styles.sampleBadge
                            )}>
                                {isRejected ? REJECTION_BADGE : isApproved ? '승인 완료' : isRequesting ? '승인 대기' : '샘플 이용중'}
                            </span>

                            <InvitationActionMenu
                                invitation={invitation}
                                isAdmin={false}
                                rejectionData={rejectionData}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onRequestApproval={onRequestApproval}
                                onCancelRequest={onCancelRequest}
                                onRevokeApproval={onRevokeApproval}
                                className={clsx(styles.moreButton, 'swiper-no-swiping')}
                                {...(onRevertToDraft ? { onRevertToDraft } : {})}
                            />
                        </div>

                        <h3 className={styles.overlayTitle}>
                            {title}
                        </h3>
                    </div>

                    {!isGridMode && (
                        <div className={styles.footer}>
                            {(!isRequesting && !isApproved) ? (
                                <>
                                    <Button
                                        variant="outline"
                                        className={clsx(styles.footerButton, styles.secondary, 'swiper-no-swiping')}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(invitation);
                                        }}
                                        onPointerDown={(e) => e.stopPropagation()}
                                    >
                                        편집하기
                                    </Button>
                                    <Button
                                        className={clsx(styles.footerButton, styles.primary, 'swiper-no-swiping')}
                                        variant="solid"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePrimaryAction(e);
                                        }}
                                        onPointerDown={(e) => e.stopPropagation()}
                                    >
                                        사용 신청
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        className={clsx(styles.footerButton, styles.secondary, 'swiper-no-swiping')}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePreview();
                                        }}
                                        onPointerDown={(e) => e.stopPropagation()}
                                    >
                                        미리보기
                                    </Button>
                                    <Button
                                        className={clsx(
                                            styles.footerButton,
                                            isApproved ? styles.share : styles.pending,
                                            'swiper-no-swiping'
                                        )}
                                        variant="solid"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (isApproved) {
                                                // 공유 모달은 InvitationActionMenu에서 처리
                                                return;
                                            }
                                            handlePrimaryAction(e);
                                        }}
                                        onPointerDown={(e) => e.stopPropagation()}
                                    >
                                        {isApproved ? '공유하기' : '신청 취소'}
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Rejection Reason Modal with Re-apply Option */}
            {isRejected && rejectionData && (
                <ResponsiveModal
                    open={showRejectionModal}
                    onOpenChange={setShowRejectionModal}
                    title={REJECTION_TITLE}
                    showCancel={true}
                    cancelText="닫기"
                    confirmText="사용 신청"
                    onConfirm={() => {
                        setShowRejectionModal(false);
                        onRequestApproval(invitation);
                    }}
                    onCancel={() => setShowRejectionModal(false)}
                >
                    <div
                        className={styles.rejectionMessage}
                        dangerouslySetInnerHTML={{ __html: displayReason || '내용이 없습니다.' }}
                    />
                </ResponsiveModal>
            )}
        </div>
    );
});

InvitationCard.displayName = "InvitationCard";

export { InvitationCard };
export type { InvitationCardProps };
