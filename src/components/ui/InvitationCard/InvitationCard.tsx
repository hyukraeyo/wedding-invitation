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
    MessageCircle
} from 'lucide-react';
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
    rejectionData = null,
    onEdit,
    onDelete,
    onRequestApproval,
    onCancelRequest,
}: InvitationCardProps) => {
    const data = invitation.invitation_data;
    const isApproved = data?.isApproved;
    const isRequesting = data?.isRequestingApproval;
    const isRejected = !!rejectionData;
    const imageUrl = data?.imageUrl;
    const title = data?.mainScreen?.title || '제목없음';
    const slug = invitation.slug;

    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const { toast } = useToast();

    const handleLinkShare = () => {
        const url = `${window.location.origin}/v/${slug}`;
        navigator.clipboard.writeText(url);
        toast({
            description: '청첩장 주소가 복사되었습니다.',
        });
        setShowShareModal(false);
    };

    const handleKakaoShare = () => {
        const origin = window.location.origin;
        const invitationUrl = `${origin}/v/${slug}`;

        // Default values for robustness
        const kakaoShareData = data?.kakaoShare || { title: '', description: '', buttonType: 'location' as const };
        const shareTitle = (kakaoShareData.title || data?.mainScreen?.title || '결혼식에 초대합니다').trim();
        const shareDesc = (kakaoShareData.description || `${data?.date || ''} ${data?.location || ''}`.trim() || '소중한 날에 초대합니다').trim();
        const shareImageUrl = kakaoShareData.imageUrl || data?.imageUrl || `${origin}/logo.png`;
        const buttonType = kakaoShareData.buttonType ?? 'location';

        // bundle-dynamic-imports: 동적 import로 번들 최적화
        import('@/lib/kakao-share').then(({ sendKakaoShare, normalizeImageUrl }) => {
            sendKakaoShare({
                invitationUrl,
                options: {
                    title: shareTitle,
                    description: shareDesc,
                    imageUrl: normalizeImageUrl(shareImageUrl, origin),
                    buttonType,
                    address: data?.address,
                    location: data?.location,
                },
                slug,
                onSuccess: () => setShowShareModal(false),
                onError: () => toast({ description: '공유 중 오류가 발생했습니다.', variant: 'destructive' }),
            });
        }).catch(() => {
            toast({ description: '카카오 SDK 로딩 중입니다. 잠시 후 다시 시도해 주세요.', variant: 'destructive' });
        });
    };

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

    const handleShareModalOpen = () => {
        setShowShareModal(true);
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
                            priority={invitation.invitation_data?.isApproved}
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
                        <span className={clsx(
                            styles.statusBadge,
                            isRejected ? styles.rejectedBadge :
                                isApproved ? styles.approvedBadge :
                                    isRequesting ? styles.pendingBadge : styles.sampleBadge
                        )}>
                            {isRejected ? REJECTION_BADGE : isApproved ? '승인 완료' : isRequesting ? '승인 대기' : '샘플 이용중'}
                        </span>
                        <h3 className={styles.overlayTitle}>
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
                            <DropdownMenuContent side="top" align="start" className={styles.dropdownContent}>
                                <DropdownMenuItem onClick={() => onEdit(invitation)}>
                                    <Edit2 size={16} className="mr-2" /> 편집하기
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handlePreview}>
                                    <Eye size={16} className="mr-2" /> 미리보기
                                </DropdownMenuItem>
                                {isRejected && (
                                    <DropdownMenuItem onSelect={handleRejectionModalOpen}>
                                        <AlertCircle size={16} className="mr-2" /> {REJECTION_LABEL} 확인
                                    </DropdownMenuItem>
                                )}
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

                        {isRejected ? (
                            <>
                                <Button
                                    variant="outline"
                                    className={clsx(styles.footerSecondaryButton, styles.editButton)}
                                    onClick={() => onEdit(invitation)}
                                >
                                    편집하기
                                </Button>
                                <Button
                                    className={styles.footerPrimaryButton}
                                    variant="solid"
                                    onClick={() => setShowRejectionModal(true)}
                                >
                                    사용 신청
                                </Button>
                            </>
                        ) : !isRequesting && !isApproved ? (
                            <>
                                <Button
                                    variant="outline"
                                    className={clsx(styles.footerSecondaryButton, styles.editButton)}
                                    onClick={() => onEdit(invitation)}
                                >
                                    편집하기
                                </Button>
                                <Button
                                    className={styles.footerPrimaryButton}
                                    variant="solid"
                                    onClick={handlePrimaryAction}
                                >
                                    사용 신청
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    className={clsx(styles.footerSecondaryButton, styles.blueButton)}
                                    onClick={handlePreview}
                                >
                                    미리보기
                                </Button>
                                <Button
                                    className={clsx(
                                        styles.footerPrimaryButton,
                                        isApproved ? styles.shareYellowButton : styles.requesting
                                    )}
                                    variant={isApproved ? "solid" : "solid"}
                                    onClick={isApproved ? handleShareModalOpen : handlePrimaryAction}
                                >
                                    {isApproved ? '공유하기' : '신청 취소'}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.dateText}>
                생성일 {formattedDate}
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

            {/* Share Modal */}
            <ResponsiveModal
                open={showShareModal}
                onOpenChange={setShowShareModal}
                title="청첩장 공유하기"
                description="청첩장을 공유할 방법을 선택해주세요."
                showCancel={false}
            >
                <div className={styles.shareContainer}>
                    <Button
                        className={clsx(styles.modalShareButton, styles.kakaoShare)}
                        onClick={handleKakaoShare}
                    >
                        <MessageCircle size={18} fill="currentColor" />
                        카카오톡 공유하기
                    </Button>
                    <Button
                        className={clsx(styles.modalShareButton, styles.linkShare)}
                        onClick={handleLinkShare}
                    >
                        <Share2 size={18} />
                        링크 주소 복사하기
                    </Button>
                </div>
            </ResponsiveModal>
        </div>
    );
};

InvitationCard.displayName = "InvitationCard";

export { InvitationCard };
export type { InvitationCardProps };
