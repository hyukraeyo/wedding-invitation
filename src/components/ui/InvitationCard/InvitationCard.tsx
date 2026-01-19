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
    Banana,
    Share2,
    MessageCircle
} from 'lucide-react';
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
        if (!window.Kakao) {
            toast({ description: '카카오 SDK 로딩 중입니다. 잠시 후 다시 시도해 주세요.', variant: 'destructive' });
            return;
        }

        const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
        if (!window.Kakao.isInitialized() && kakaoAppKey) {
            window.Kakao.init(kakaoAppKey);
        }

        // Ensure invitationUrl is clean and matches registered domain precisely
        const origin = window.location.origin;
        const invitationUrl = `${origin}/v/${slug}`.trim();

        // Default values for robustness
        const kakaoShare = data?.kakaoShare || { title: '', description: '', buttonType: 'location' };
        const shareTitle = (kakaoShare.title || data?.mainScreen?.title || '결혼식에 초대합니다').trim();
        const shareDesc = (kakaoShare.description || `${data?.date || ''} ${data?.location || ''}`.trim() || '소중한 날에 초대합니다').trim();
        let shareImageUrl = kakaoShare.imageUrl || data?.imageUrl || `${origin}/logo.png`;

        // 카카오 서버는 blob: URL에 접근할 수 없으므로, 공개 URL만 사용
        if (shareImageUrl.startsWith('blob:')) {
            shareImageUrl = `${origin}/logo.png`;
        } else if (shareImageUrl.startsWith('/')) {
            shareImageUrl = `${origin}${shareImageUrl}`;
        }

        try {
            if (!window.Kakao.Share?.sendDefault) {
                toast({ description: '카카오 공유 기능을 사용할 수 없습니다.', variant: 'destructive' });
                return;
            }

            const buttonType = kakaoShare.buttonType ?? 'location';

            // Helpful logs
            console.log('Kakao Share Invitation URL:', invitationUrl);

            window.Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: shareTitle,
                    description: shareDesc,
                    imageUrl: shareImageUrl,
                    link: {
                        mobileWebUrl: invitationUrl,
                        webUrl: invitationUrl,
                    },
                },
                buttons: buttonType !== 'none' ? [
                    {
                        title: '모바일 초대장',
                        link: {
                            mobileWebUrl: invitationUrl,
                            webUrl: invitationUrl,
                        },
                    },
                    {
                        title: buttonType === 'location' ? '위치 안내' : '참석 여부',
                        link: {
                            mobileWebUrl: `${invitationUrl}${buttonType === 'location' ? '#section-location' : '#section-account'}`,
                            webUrl: `${invitationUrl}${buttonType === 'location' ? '#section-location' : '#section-account'}`,
                        },
                    },
                ] : [
                    {
                        title: '모바일 초대장',
                        link: {
                            mobileWebUrl: invitationUrl,
                            webUrl: invitationUrl,
                        },
                    },
                ],
            });
            setShowShareModal(false);
        } catch (error) {
            console.error('Kakao Share Error:', error);
            toast({ description: '공유 중 오류가 발생했습니다.', variant: 'destructive' });
        }
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
                                    className={clsx(styles.footerSecondaryButton, styles.blueButton)}
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
                                    사용신청
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
                                    onClick={isApproved ? () => setShowShareModal(true) : handlePrimaryAction}
                                >
                                    {isApproved ? '공유하기' : '신청취소'}
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
