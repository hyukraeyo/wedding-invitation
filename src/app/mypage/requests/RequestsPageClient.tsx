"use client";

import { parseRejection } from '@/lib/rejection-helpers';
import React, { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalRequestService } from '@/services/approvalRequestService';
import { invitationService } from '@/services/invitationService';
import { MyPageHeader } from '@/components/mypage/MyPageHeader';
import { useToast } from '@/hooks/use-toast';
import {
    Clock,
    AlertCircle,
    CheckCircle,
    Inbox,
    Loader2
} from 'lucide-react';
import styles from './RequestsPage.module.scss';
import { clsx } from 'clsx';
import type { ApprovalRequestSummary } from '@/services/approvalRequestService';
import type { InvitationSummaryRecord } from '@/lib/invitation-summary';

const ResponsiveModal = dynamic(
    () => import('@/components/common/ResponsiveModal').then(mod => mod.ResponsiveModal),
    { ssr: false }
);
const RejectionReasonModal = dynamic(
    () => import('@/components/common/RejectionReasonModal'),
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

/**
 * 🍌 신청 관리 클라이언트 (최적화 버전)
 * TanStack Query의 useInfiniteQuery를 사용하여 고성능 무한 스크롤 및 캐싱을 구현했습니다.
 */
export default function RequestsPageClient({
    initialLimit,
}: RequestsPageClientProps) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { toast } = useToast();

    // 1. 초대장 정보 캐시 (매번 fetch하지 않도록)
    const [invitationCache, setInvitationCache] = useState<Record<string, InvitationSummaryRecord>>({});

    // 2. 무한 스크롤 쿼리
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['approval-requests'],
        queryFn: async ({ pageParam = 0 }) => {
            const requests = await approvalRequestService.getAllRequests(initialLimit, pageParam);

            // 부족한 초대장 정보 보완
            const missingIds = requests
                .map(r => r.invitation_id)
                .filter(id => !invitationCache[id]);

            if (missingIds.length > 0) {
                const newInvs = await invitationService.getInvitationsByIds(missingIds);
                setInvitationCache(prev => {
                    const next = { ...prev };
                    newInvs.forEach(inv => next[inv.id] = inv);
                    return next;
                });
            }

            return requests;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === initialLimit ? allPages.flat().length : undefined;
        },
    });

    // 3. 승인/거절 뮤테이션
    const approveMutation = useMutation({
        mutationFn: async (inv: InvitationSummaryRecord) => {
            await approvalRequestService.approveRequest(inv.id);
            const fullInv = await invitationService.getInvitation(inv.slug);
            if (!fullInv) throw new Error('Invitation not found');

            const updatedData = {
                ...fullInv.invitation_data,
                isApproved: true,
                isRequestingApproval: false
            };
            return await invitationService.saveInvitation(inv.slug, updatedData, inv.user_id);
        },
        onSuccess: () => {
            toast({ description: '사용 승인이 완료되었습니다.' });
            queryClient.invalidateQueries({ queryKey: ['approval-requests'] });
            router.refresh();
        },
        onError: () => toast({ variant: 'destructive', description: '승인 처리 중 오류 발생' }),
    });

    const rejectMutation = useMutation({
        mutationFn: async ({ inv, reason }: { inv: InvitationSummaryRecord, reason: string }) => {
            return await approvalRequestService.rejectRequest(inv.id, reason);
        },
        onSuccess: () => {
            toast({ description: '신청이 거절되었습니다.' });
            queryClient.invalidateQueries({ queryKey: ['approval-requests'] });
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

    const allRequests = useMemo(() => data?.pages.flat() ?? [], [data]);

    const handleConfirmAction = useCallback(() => {
        if (confirmConfig.type === 'APPROVE' && confirmConfig.targetRecord) {
            approveMutation.mutate(confirmConfig.targetRecord);
        }
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
    }, [confirmConfig, approveMutation]);

    if (status === 'error') return <div className={styles.error}>데이터 로딩 중 오류가 발생했습니다.</div>;

    return (
        <div className={styles.container}>
            <MyPageHeader title="신청 관리" />

            {allRequests.length > 0 ? (
                <div className={styles.requestList}>
                    {allRequests.map(request => {
                        const targetInv = invitationCache[request.invitation_id];
                        const date = new Date(request.created_at);
                        const formattedDate = `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                        const { isRevoked, isRejected: isPureRejected } = parseRejection(request);
                        const isRejected = isRevoked || isPureRejected;
                        const isApproved = request.status === 'approved';

                        return (
                            <div key={request.id} className={clsx(
                                styles.requestItem,
                                isRejected && styles.rejectedItem,
                                isApproved && styles.approvedItem
                            )}>
                                <div className={styles.requestInfo}>
                                    <div className={styles.requester}>
                                        {isRejected ? <AlertCircle size={14} color="#DC2626" style={{ marginRight: '0.25rem' }} /> : null}
                                        {isApproved ? <CheckCircle size={14} color="#10B981" style={{ marginRight: '0.25rem' }} /> : null}
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
                                        <button onClick={() => window.open(`/v/${targetInv.slug}`, '_blank')} className={styles.previewButton}>
                                            미리보기
                                        </button>
                                        {isRejected ? (
                                            <button onClick={() => setViewRejectionData(request)} className={styles.viewReasonButton}>
                                                이유 확인
                                            </button>
                                        ) : isApproved ? (
                                            <button
                                                onClick={() => { setRejectionTarget(targetInv); }}
                                                className={styles.revokeButton}
                                                disabled={approveMutation.isPending || rejectMutation.isPending}
                                            >
                                                승인 취소
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => setRejectionTarget(targetInv)}
                                                    className={styles.rejectButton}
                                                    disabled={approveMutation.isPending || rejectMutation.isPending}
                                                >
                                                    거절
                                                </button>
                                                <button
                                                    onClick={() => setConfirmConfig({
                                                        isOpen: true,
                                                        type: 'APPROVE',
                                                        title: '청첩장 승인',
                                                        description: '승인하시겠습니까?',
                                                        targetId: targetInv.id,
                                                        targetRecord: targetInv
                                                    })}
                                                    className={styles.approveButton}
                                                    disabled={approveMutation.isPending || rejectMutation.isPending}
                                                >
                                                    {approveMutation.isPending && approveMutation.variables?.id === targetInv.id ? <Loader2 className={styles.spin} size={14} /> : '승인'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {hasNextPage && (
                        <div className={styles.loadMoreWrapper}>
                            <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className={styles.loadMoreButton}
                            >
                                {isFetchingNextPage ? <Loader2 className={styles.spin} /> : '더 보기'}
                            </button>
                        </div>
                    )}
                </div>
            ) : status !== 'pending' ? (
                <div className={styles.emptySummary}>
                    <Inbox size={48} strokeWidth={1} />
                    <p>대기 중인 신청이 없습니다.</p>
                </div>
            ) : null}

            {/* Modals... */}
            <ResponsiveModal
                open={confirmConfig.isOpen}
                onOpenChange={(o) => setConfirmConfig(p => ({ ...p, isOpen: o }))}
                title={confirmConfig.title}
                onConfirm={handleConfirmAction}
                confirmLoading={approveMutation.isPending}
            >
                <div style={{ textAlign: 'center' }}>{confirmConfig.description}</div>
            </ResponsiveModal>

            {rejectionTarget && (() => {
                const targetRequest = allRequests.find(r => r.invitation_id === rejectionTarget.id);
                const isRevoked = targetRequest?.status === 'approved';
                const statusText = isRevoked ? "승인 취소" : "승인 거절";
                const requesterName = targetRequest?.requester_name || '';

                return (
                    <RejectionReasonModal
                        isOpen={!!rejectionTarget}
                        onClose={() => setRejectionTarget(null)}
                        onSubmit={(reason) => {
                            rejectMutation.mutate({ inv: rejectionTarget, reason });
                            setRejectionTarget(null);
                        }}
                        loading={rejectMutation.isPending}
                        requesterName={requesterName}
                        title={statusText}
                        confirmText={statusText}
                        description={
                            <>
                                <strong>{requesterName}</strong>님의 {isRevoked ? "승인을 취소" : "사용 신청을 거절"}합니다.<br />
                                {statusText} 사유를 입력해주세요. 사용자가 확인할 수 있습니다.
                            </>
                        }
                    />
                );
            })()}

            {viewRejectionData && (
                <ResponsiveModal
                    open={!!viewRejectionData}
                    onOpenChange={() => setViewRejectionData(null)}
                    title="거절/취소 사유"
                    showCancel={false}
                >
                    <div
                        className={styles.rejectionReasonBox}
                        dangerouslySetInnerHTML={{ __html: parseRejection(viewRejectionData).displayReason || '내용이 없습니다.' }}
                    />
                </ResponsiveModal>
            )}
        </div>
    );
}
