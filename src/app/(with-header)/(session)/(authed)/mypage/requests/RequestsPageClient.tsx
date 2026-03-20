'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalRequestService } from '@/services/approvalRequestService';
import { invitationService } from '@/services/invitationService';
import { MyPageContent } from '@/components/mypage/MyPageContent';
import { useToast } from '@/hooks/use-toast';
import { useRejectionReason } from '@/hooks/useRejectionReason';
import { Clock, AlertCircle, CheckCircle, Inbox, Banana } from 'lucide-react';
import styles from './RequestsPage.module.scss';
import { clsx } from 'clsx';
import type { ApprovalRequestSummary } from '@/services/approvalRequestService';
import type { InvitationSummaryRecord } from '@/lib/invitation-summary';
import { EmptyState } from '@/components/common/EmptyState';
import { parseRejection } from '@/lib/rejection-helpers';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { useGlobalLoadingStore } from '@/store/useGlobalLoadingStore';
const RichTextEditor = dynamic(
  () =>
    import('@/components/common/RichTextEditor/RichTextEditor').then((mod) => mod.RichTextEditor),
  { ssr: false }
);

interface ProfileSummary {
  full_name: string | null;
  phone: string | null;
}

interface RequestsPageClientProps {
  userId: string;
  profile: ProfileSummary | null;
  initialLimit: number;
}

type ConfirmActionType = 'APPROVE' | 'REVOKE_APPROVAL' | 'INFO_ONLY';

interface ConfirmConfig {
  isOpen: boolean;
  type: ConfirmActionType;
  title: string;
  description: React.ReactNode;
  targetId: string | null;
  targetRecord?: InvitationSummaryRecord | null;
}

import { SectionLoader } from '@/components/ui/SectionLoader';
import { SectionError } from '@/components/ui/SectionError';

/**
 * 🍌 신청 관리 클라이언트 (최적화 버전)
 * TanStack Query의 useInfiniteQuery를 사용하여 고성능 무한 스크롤 및 캐싱을 구현했습니다.
 */
export default function RequestsPageClient({ initialLimit }: RequestsPageClientProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const startLoading = useGlobalLoadingStore((state) => state.startLoading);
  const stopLoading = useGlobalLoadingStore((state) => state.stopLoading);

  // 1. 초대장 정보 캐시 (매번 fetch하지 않도록)
  const [invitationCache, setInvitationCache] = useState<Record<string, InvitationSummaryRecord>>(
    {}
  );

  // 2. 무한 스크롤 쿼리
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, refetch } =
    useInfiniteQuery({
      queryKey: ['approval-requests'],
      queryFn: async ({ pageParam = 0 }) => {
        return await approvalRequestService.getAllRequests(initialLimit, pageParam);
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === initialLimit ? allPages.flat().length : undefined;
      },
    });

  const allRequests = useMemo(() => data?.pages.flat() ?? [], [data]);

  // 2-1. Hydration 및 무한 스크롤 시 초대장 정보 보완
  useEffect(() => {
    const missingIds = allRequests.map((r) => r.invitation_id).filter((id) => !invitationCache[id]);

    if (missingIds.length > 0) {
      invitationService.getInvitationsByIds(missingIds).then((newInvs) => {
        if (newInvs.length === 0) return;
        setInvitationCache((prev) => {
          const next = { ...prev };
          newInvs.forEach((inv) => {
            next[inv.id] = inv;
          });
          return next;
        });
      });
    }
  }, [allRequests]); // eslint-disable-line react-hooks/exhaustive-deps

  // 3. 승인/거절 뮤테이션
  const approveMutation = useMutation({
    onMutate: () => startLoading('승인 처리 중...'),
    onSettled: () => stopLoading(),
    mutationFn: async (inv: InvitationSummaryRecord) => {
      await approvalRequestService.approveRequest(inv.id);
      const fullInv = await invitationService.getInvitation(inv.slug);
      if (!fullInv) throw new Error('Invitation not found');

      const updatedData = {
        ...fullInv.invitation_data,
        isApproved: true,
        isRequestingApproval: false,
      };
      return await invitationService.saveInvitation(inv.slug, updatedData, inv.user_id);
    },
    onSuccess: async () => {
      toast({ description: '사용 승인이 완료됐어요.' });
      await queryClient.invalidateQueries({ queryKey: ['approval-requests'] });
      router.refresh();
    },
    onError: () => toast({ variant: 'destructive', description: '승인 처리 중 오류 발생' }),
  });

  const rejectMutation = useMutation({
    onMutate: () => startLoading('처리 중...'),
    onSettled: () => stopLoading(),
    mutationFn: async ({ inv, reason }: { inv: InvitationSummaryRecord; reason: string }) => {
      return await approvalRequestService.rejectRequest(inv.id, reason);
    },
    onSuccess: async () => {
      toast({ description: '신청이 거절됐어요.' });
      await queryClient.invalidateQueries({ queryKey: ['approval-requests'] });
      router.refresh();
    },
    onError: () => toast({ variant: 'destructive', description: '거절 처리 중 오류 발생' }),
  });

  // --- UI State ---
  const [rejectionTarget, setRejectionTarget] = useState<InvitationSummaryRecord | null>(null);
  const [viewRejectionData, setViewRejectionData] = useState<ApprovalRequestSummary | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmConfig>({
    isOpen: false,
    type: 'INFO_ONLY',
    title: '',
    description: '',
    targetId: null,
  });

  const handleConfirmAction = useCallback(() => {
    if (confirmConfig.type === 'APPROVE' && confirmConfig.targetRecord) {
      approveMutation.mutate(confirmConfig.targetRecord);
    }
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
  }, [confirmConfig, approveMutation]);

  const handleRejectionSubmit = useCallback(
    (reason: string) => {
      if (!rejectionTarget) return;
      rejectMutation.mutate({ inv: rejectionTarget, reason });
      setRejectionTarget(null);
    },
    [rejectionTarget, rejectMutation]
  );

  const rejectionReason = useRejectionReason({
    onSubmit: handleRejectionSubmit,
    onClose: () => setRejectionTarget(null),
    loading: false,
  });

  if (status === 'pending') {
    return (
      <MyPageContent className={styles.container}>
        <SectionLoader height={300} message="신청 내역을 불러오고 있어요" />
      </MyPageContent>
    );
  }

  if (status === 'error') {
    return (
      <MyPageContent className={styles.container}>
        <SectionError height={300} onRetry={() => refetch()} />
      </MyPageContent>
    );
  }

  return (
    <MyPageContent className={styles.container}>
      {allRequests.length > 0 ? (
        <div className={styles.requestList}>
          {allRequests.map((request) => {
            const targetInv = invitationCache[request.invitation_id];
            const date = new Date(request.created_at);
            const formattedDate = `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            const { isRevoked, isRejected: isPureRejected } = parseRejection(request);
            const isRejected = isRevoked || isPureRejected;
            const isApproved = request.status === 'approved';

            return (
              <div
                key={request.id}
                className={clsx(
                  styles.requestItem,
                  isRejected && styles.rejectedItem,
                  isApproved && styles.approvedItem
                )}
              >
                <div className={styles.requestInfo}>
                  <div className={styles.requester}>
                    {isRejected ? (
                      <AlertCircle
                        size={14}
                        color="var(--color-error)"
                        style={{ marginRight: '0.25rem' }}
                      />
                    ) : null}
                    {isApproved ? (
                      <CheckCircle
                        size={14}
                        color="var(--color-success)"
                        style={{ marginRight: '0.25rem' }}
                      />
                    ) : null}
                    <strong>{request.requester_name}</strong>
                    <span className={styles.phone}>({request.requester_phone})</span>
                  </div>
                  <div className={styles.requestTime}>
                    <Clock size={12} />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                {targetInv && (
                  <div className={styles.adminButtonGroup}>
                    <Button
                      onClick={() => window.open(`/v/${targetInv.slug}`, '_blank')}
                      variant="outline"
                      size="sm"
                    >
                      미리보기
                    </Button>
                    {isRejected ? (
                      <Button
                        onClick={() => setViewRejectionData(request)}
                        variant="soft"
                        size="sm"
                      >
                        이유 확인
                      </Button>
                    ) : isApproved ? (
                      <Button
                        onClick={() => {
                          setRejectionTarget(targetInv);
                        }}
                        variant="secondary"
                        size="sm"
                      >
                        승인 취소
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => setRejectionTarget(targetInv)}
                          variant="secondary"
                          size="sm"
                        >
                          거절
                        </Button>
                        <Button
                          onClick={() =>
                            setConfirmConfig({
                              isOpen: true,
                              type: 'APPROVE',
                              title: '청첩장 승인',
                              description: '승인할까요?',
                              targetId: targetInv.id,
                              targetRecord: targetInv,
                            })
                          }
                          variant="primary"
                          size="sm"
                        >
                          승인
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {hasNextPage && (
            <div className={styles.loadMoreWrapper}>
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="secondary"
                size="md"
                radius="full"
              >
                {isFetchingNextPage ? <Banana className={styles.spin} /> : '더 보기'}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={<Inbox size={48} strokeWidth={1} />}
          title="대기 중인 신청이 없습니다"
          description="중요한 업데이트나 신청 결과가 있을 때 이곳에서 알려드릴게요."
        />
      )}

      {/* Modals... */}
      {/* Modals... */}
      <Dialog
        open={confirmConfig.isOpen}
        onOpenChange={(o) => setConfirmConfig((p) => ({ ...p, isOpen: o }))}
      >
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Header title={confirmConfig.title} />
          <Dialog.Body align="center">{confirmConfig.description}</Dialog.Body>
          <Dialog.Footer>
            {confirmConfig.type !== 'INFO_ONLY' && (
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
              >
                취소
              </Button>
            )}
            <Button size="lg" onClick={handleConfirmAction}>
              승인
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>

      {rejectionTarget &&
        (() => {
          const targetRequest = allRequests.find((r) => r.invitation_id === rejectionTarget.id);
          const isRevoked = targetRequest?.status === 'approved';
          const statusText = isRevoked ? '승인 취소' : '승인 거절';
          const requesterName = targetRequest?.requester_name || '';

          return (
            <Dialog
              open={!!rejectionTarget}
              onOpenChange={(open) => {
                if (!open) rejectionReason.handleClose();
              }}
            >
              <Dialog.Overlay />
              <Dialog.Content>
                <Dialog.Header title={statusText} />
                <Dialog.Body>
                  <div className={styles.rejectionDescription}>
                    <strong>{requesterName}</strong>님의{' '}
                    {isRevoked ? '승인을 취소' : '사용 신청을 거절'}해요.
                  </div>
                  <div className={styles.rejectionEditorWrapper}>
                    <RichTextEditor
                      content={rejectionReason.reason}
                      onChange={rejectionReason.setReason}
                      placeholder="내용을 입력해주세요…"
                      minHeight={180}
                    />
                  </div>
                </Dialog.Body>
                <Dialog.Footer>
                  <Button variant="ghost" size="lg" onClick={rejectionReason.handleClose}>
                    취소
                  </Button>
                  <Button
                    size="lg"
                    disabled={rejectionReason.isSubmitDisabled}
                    onClick={rejectionReason.handleSubmit}
                  >
                    {statusText}
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog>
          );
        })()}

      {viewRejectionData && (
        <Dialog open={!!viewRejectionData} onOpenChange={() => setViewRejectionData(null)}>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Header title="거절/취소 사유" />
            <Dialog.Body>
              <div
                className={styles.rejectionReasonBox}
                dangerouslySetInnerHTML={{
                  __html: parseRejection(viewRejectionData).displayReason || '내용이 없습니다.',
                }}
              />
            </Dialog.Body>
            <Dialog.Footer>
              <Button size="lg" onClick={() => setViewRejectionData(null)}>
                확인
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      )}
    </MyPageContent>
  );
}
