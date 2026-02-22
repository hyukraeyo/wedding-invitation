'use client';

import { parseRejection } from '@/lib/rejection-helpers';
import React, { useState } from 'react';
import { Banana } from 'lucide-react';
import Image from 'next/image';
import type { InvitationSummaryRecord } from '@/lib/invitation-summary';
import type { ApprovalRequestSummary } from '@/services/approvalRequestService';
import styles from './InvitationCard.module.scss';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { useInvitationStatus } from '@/hooks/useInvitationStatus';
import { InvitationActionMenu } from '@/components/common/InvitationActionMenu';
import { clsx } from 'clsx';
import { AspectRatio } from '@/components/ui/AspectRatio';

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
  isLoading?: boolean;
}

const InvitationCard = React.memo(
  ({
    invitation,
    onEdit,
    onDelete,
    onRequestApproval,
    onCancelRequest,
    onRevertToDraft,
    index,
    rejectionData = null,
    onRevokeApproval,
    isLoading = false,
  }: InvitationCardProps) => {
    const { isApproved, isRequesting, isRejected, imageUrl, title, slug } = useInvitationStatus({
      invitation,
      rejectionData,
    });

    const [showRejectionModal, setShowRejectionModal] = useState(false);

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

    // 유틸리티를 사용하여 상태 분석 및 텍스트 추출
    const {
      displayReason,
      badge: REJECTION_BADGE,
      title: REJECTION_TITLE,
    } = parseRejection(rejectionData);

    return (
      <div className={styles.cardWrapper}>
        <div className={styles.cardItem}>
          {imageUrl ? (
            <AspectRatio ratio={3 / 4.5} className={styles.imageWrapper}>
              <Image
                src={imageUrl}
                alt={title}
                fill
                sizes="(max-width: 428px) 100vw, 400px"
                priority={index !== undefined ? index < 2 : invitation.invitation_data?.isApproved}
                style={{ objectFit: 'cover' }}
              />
            </AspectRatio>
          ) : (
            <div className={styles.fallbackWrapper}>
              <Banana className={styles.bananaIcon} />
            </div>
          )}

          <div className={clsx(styles.overlay, !imageUrl && styles.noImage)}>
            <div className={styles.overlayTop}>
              <div className={styles.statusRow}>
                {isRejected ? (
                  <Badge color="red" variant="soft" size="sm">
                    {REJECTION_BADGE}
                  </Badge>
                ) : isApproved ? (
                  <Badge color="green" variant="soft" size="sm">
                    승인 완료
                  </Badge>
                ) : isRequesting ? (
                  <Badge color="secondary" variant="soft" size="sm">
                    승인 대기
                  </Badge>
                ) : (
                  <Badge color="primary" variant="soft" size="sm">
                    샘플 이용중
                  </Badge>
                )}

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

              <h3 className={styles.overlayTitle}>{title}</h3>
            </div>

            <div className={styles.footer}>
              {!isRequesting && !isApproved ? (
                <>
                  <Button
                    variant="ghost"
                    className={clsx(styles.footerButton, styles.secondary, 'swiper-no-swiping')}
                    loading={isLoading}
                    disabled={isLoading}
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
                    variant="ghost"
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
          </div>
        </div>

        {/* Rejection Reason Modal with Re-apply Option */}
        {isRejected && rejectionData && (
          <Dialog open={showRejectionModal} onOpenChange={setShowRejectionModal}>
            <Dialog.Overlay />
            <Dialog.Content>
              <Dialog.Header title={REJECTION_TITLE} />
              <Dialog.Body>
                <div
                  className={styles.rejectionMessage}
                  dangerouslySetInnerHTML={{ __html: displayReason || '내용이 없어요.' }}
                />
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="ghost" size="lg" onClick={() => setShowRejectionModal(false)}>
                  닫기
                </Button>
                <Button
                  size="lg"
                  onClick={() => {
                    setShowRejectionModal(false);
                    onRequestApproval(invitation);
                  }}
                >
                  사용 신청
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        )}
      </div>
    );
  }
);

InvitationCard.displayName = 'InvitationCard';

export { InvitationCard };
export type { InvitationCardProps };
