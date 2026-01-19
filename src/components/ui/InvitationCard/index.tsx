"use client";

import React from 'react';
import {
    MoreHorizontal,
    Edit2,
    Eye,
    Trash2,
    Bookmark,
    FileText
} from 'lucide-react';
import { clsx } from 'clsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import type { InvitationSummaryRecord } from '@/lib/invitation-summary';
import styles from './styles.module.scss';

interface InvitationCardProps {
    invitation: InvitationSummaryRecord;
    isAdmin?: boolean;
    onEdit: (inv: InvitationSummaryRecord) => void;
    onDelete: (inv: InvitationSummaryRecord) => void;
    onRequestApproval: (inv: InvitationSummaryRecord) => void;
    onCancelRequest: (inv: InvitationSummaryRecord) => void;
    onRevokeApproval: (inv: InvitationSummaryRecord) => void;
}

const InvitationCard = ({
    invitation,
    isAdmin = false,
    onEdit,
    onDelete,
    onRequestApproval,
    onCancelRequest,
    onRevokeApproval,
}: InvitationCardProps) => {
    const data = invitation.invitation_data;
    const isApproved = data?.isApproved;
    const isRequesting = data?.isRequestingApproval;
    const imageUrl = data?.imageUrl;
    const title = data?.mainScreen?.title || '제목없음';
    const slug = invitation.slug;

    const handlePreview = () => {
        window.open(`/v/${slug}`, '_blank');
    };

    const handlePrimaryAction = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isApproved) {
            if (isAdmin) onRevokeApproval(invitation);
        } else if (isRequesting) {
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
                        <FileText size={48} strokeWidth={1} className="text-gray-200" />
                    </div>
                )}

                <div className={styles.overlay}>
                    <div className={styles.overlayTop}>
                        <span className={clsx(
                            styles.statusBadge,
                            isApproved ? styles.approvedBadge :
                                isRequesting ? styles.pendingBadge : styles.sampleBadge
                        )}>
                            <span className={styles.dot} />
                            {isApproved ? '승인 완료' : isRequesting ? '승인 대기중' : '샘플 이용중'}
                        </span>
                        <h3 className={styles.overlayTitle}>
                            <Bookmark size={20} fill="currentColor" />
                            {title}
                        </h3>
                    </div>

                    <div className={styles.footer}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className={styles.footerIconButton}>
                                    <MoreHorizontal size={18} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" align="start" style={{ width: '160px', padding: '0.4rem', borderRadius: '0.75rem' }}>
                                {!isRequesting && !isApproved && (
                                    <DropdownMenuItem onClick={() => onEdit(invitation)}>
                                        <Edit2 size={16} className="mr-2" /> 편집하기
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={handlePreview}>
                                    <Eye size={16} className="mr-2" /> 미리보기
                                </DropdownMenuItem>
                                {!isRequesting && !isApproved && (
                                    <DropdownMenuItem
                                        onClick={() => setTimeout(() => onDelete(invitation), 0)}
                                        style={{ color: '#EF4444' }}
                                    >
                                        <Trash2 size={16} className="mr-2" /> 삭제하기
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {!isRequesting && !isApproved ? (
                            <button className={styles.footerSecondaryButton} onClick={() => onEdit(invitation)}>
                                편집하기
                            </button>
                        ) : (
                            <button className={styles.footerSecondaryButton} onClick={handlePreview}>
                                미리보기
                            </button>
                        )}

                        <button
                            className={clsx(
                                styles.footerPrimaryButton,
                                isApproved && styles.approved,
                                isRequesting && styles.requesting
                            )}
                            disabled={!isAdmin && isApproved}
                            onClick={handlePrimaryAction}
                        >
                            {isApproved ? "승인완료" : isRequesting ? "신청취소" : "사용신청"}
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles.dateText}>
                생성일 {formattedDate}
            </div>
        </div>
    );
};

InvitationCard.displayName = "InvitationCard";

export { InvitationCard };
export type { InvitationCardProps };
