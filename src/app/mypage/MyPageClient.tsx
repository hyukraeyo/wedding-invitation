"use client";

import React, { useMemo, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { invitationService } from '@/services/invitationService';
import { approvalRequestService } from '@/services/approvalRequestService';
import type { ApprovalRequestSummary } from '@/services/approvalRequestService';
import type { InvitationSummaryRecord } from '@/lib/invitation-summary';
import { useInvitationStore } from '@/store/useInvitationStore';
import type { InvitationData } from '@/store/useInvitationStore';
import Header from '@/components/common/Header';
// import { signOut } from 'next-auth/react';

import { useToast } from '@/hooks/use-toast';
import {
    Banana,
    Plus,
} from 'lucide-react';
import styles from './MyPage.module.scss';
import { InvitationCard } from '@/components/ui/InvitationCard';
import { MyPageSidebar } from '@/components/mypage/MyPageSidebar';

const ProfileCompletionModal = dynamic(
    () => import('@/components/auth/ProfileCompletionModal').then(mod => mod.ProfileCompletionModal),
    { ssr: false }
);
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

export interface MyPageClientProps {
    userId: string | null;
    isAdmin: boolean;
    profile: ProfileSummary | null;
    initialInvitations: InvitationSummaryRecord[];
    initialAdminInvitations: InvitationSummaryRecord[];
    initialApprovalRequests: ApprovalRequestSummary[];
    initialRejectedRequests?: ApprovalRequestSummary[];
}

type ConfirmActionType = 'DELETE' | 'CANCEL_REQUEST' | 'APPROVE' | 'REVOKE_APPROVAL' | 'REQUEST_APPROVAL' | 'INFO_ONLY';

interface ConfirmConfig {
    isOpen: boolean;
    type: ConfirmActionType;
    title: string;
    description: React.ReactNode;
    targetId: string | null;
    targetRecord?: InvitationSummaryRecord | null;
}

export default function MyPageClient({
    userId,
    isAdmin,
    profile,
    initialInvitations,
    initialApprovalRequests,
    initialRejectedRequests = [],
}: MyPageClientProps) {
    const router = useRouter();
    const [invitations, setInvitations] = useState<InvitationSummaryRecord[]>(initialInvitations);
    const [approvalRequests] = useState<ApprovalRequestSummary[]>(initialApprovalRequests);
    const [rejectedRequests] = useState<ApprovalRequestSummary[]>(initialRejectedRequests);

    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Profile Completion Modal State
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    // Rejection Modal State
    const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
    const [rejectionTarget, setRejectionTarget] = useState<InvitationSummaryRecord | null>(null);

    // Confirmation Dialog State
    const [confirmConfig, setConfirmConfig] = useState<ConfirmConfig>({
        isOpen: false,
        type: 'INFO_ONLY',
        title: '',
        description: '',
        targetId: null,
        targetRecord: null,
    });

    const reset = useInvitationStore(state => state.reset);
    const { toast } = useToast();

    const fetchInvitations = useCallback(async () => {
        if (!userId) return;
        try {
            const data = await invitationService.getUserInvitations(userId);
            setInvitations(data);
        } catch {
            // Silent fail - user can refresh
        }
    }, [userId]);

    const fetchFullInvitationData = useCallback(async (slug: string) => {
        const fullInvitation = await invitationService.getInvitation(slug);
        if (!fullInvitation?.invitation_data) {
            throw new Error('Invitation data missing');
        }
        return fullInvitation.invitation_data as InvitationData;
    }, []);

    const handleEdit = useCallback(async (inv: InvitationSummaryRecord) => {
        try {
            const fullData = await fetchFullInvitationData(inv.slug);
            useInvitationStore.setState(fullData);
            useInvitationStore.getState().setSlug(inv.slug);
            router.push('/builder?mode=edit');
        } catch {
            toast({
                variant: 'destructive',
                description: '청첩장 데이터를 불러오지 못했습니다.',
            });
        }
    }, [fetchFullInvitationData, router, toast]);

    // --- Action Executors ---

    const executeDelete = useCallback(async (id: string) => {
        setActionLoading(id);
        try {
            await invitationService.deleteInvitation(id);
            await fetchInvitations();
        } catch {
            toast({
                variant: 'destructive',
                description: '삭제 중 오류가 발생했습니다.',
            });
        } finally {
            setActionLoading(null);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    }, [fetchInvitations, toast]);

    const executeCancelRequest = useCallback(async (invitationId: string) => {
        setActionLoading(invitationId);
        try {
            await approvalRequestService.cancelRequest(invitationId);
            await fetchInvitations();
            toast({ description: '신청이 취소되었습니다.' });
        } catch {
            toast({ variant: 'destructive', description: '취소 처리에 실패했습니다.' });
        } finally {
            setActionLoading(null);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    }, [fetchInvitations, toast]);

    // --- Action Initiators ---

    const handleDeleteClick = useCallback((inv: InvitationSummaryRecord) => {
        if (inv.invitation_data?.isRequestingApproval || inv.invitation_data?.isApproved) {
            setConfirmConfig({
                isOpen: true,
                type: 'INFO_ONLY',
                title: '수정/삭제할 수 없습니다',
                description: <>
                    승인 신청 중이거나 승인 완료된 청첩장은 직접 수정/삭제할 수 없습니다.<br /><br />
                    신청 중인 경우 하단의 <strong>[신청취소]</strong> 버튼을 눌러 상태를 변경한 뒤 다시 시도해 주세요.
                </>,
                targetId: null,
            });
            return;
        }

        setConfirmConfig({
            isOpen: true,
            type: 'DELETE',
            title: '청첩장 삭제',
            description: '정말로 이 청첩장을 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.',
            targetId: inv.id,
        });
    }, []);

    const handleCancelRequestClick = useCallback((inv: InvitationSummaryRecord) => {
        setConfirmConfig({
            isOpen: true,
            type: 'CANCEL_REQUEST',
            title: '승인 신청 취소',
            description: '승인 신청을 취소하시겠습니까?',
            targetId: inv.id,
        });
    }, []);

    const isProfileComplete = useMemo(() => {
        return Boolean(profile?.full_name && profile?.phone);
    }, [profile]);

    const handleRequestApprovalClick = useCallback((inv: InvitationSummaryRecord) => {
        if (inv.invitation_data.isRequestingApproval) {
            toast({ description: '이미 승인 신청된 청첩장입니다.' });
            return;
        }

        if (isProfileComplete) {
            setConfirmConfig({
                isOpen: true,
                type: 'REQUEST_APPROVAL',
                title: '승인 신청',
                description: (
                    <>
                        <strong>{profile?.full_name}</strong>({profile?.phone}) 님으로 신청합니다.<br />
                        신청 후 관리자 확인 절차가 진행됩니다.
                    </>
                ),
                targetId: inv.id,
                targetRecord: inv,
            });
        } else {
            setProfileModalOpen(true);
        }
    }, [isProfileComplete, profile, toast]);

    const handleAdminRevokeClick = useCallback((inv: InvitationSummaryRecord) => {
        setRejectionTarget(inv);
        setRejectionModalOpen(true);
    }, []);

    const executeRequestApproval = useCallback(async (inv: InvitationSummaryRecord) => {
        if (!userId || !profile?.full_name || !profile?.phone) return;

        setActionLoading(inv.id);
        try {
            await approvalRequestService.createRequest({
                invitationId: inv.id,
                invitationSlug: inv.slug,
                requesterName: profile.full_name,
                requesterPhone: profile.phone,
            });

            const fullData = await fetchFullInvitationData(inv.slug);
            const updatedData = {
                ...fullData,
                isRequestingApproval: true,
            };
            await invitationService.saveInvitation(inv.slug, updatedData, userId);

            toast({
                description: '사용 신청이 완료되었습니다. 관리자 확인 후 처리됩니다.',
            });
            await fetchInvitations();
        } catch {
            toast({
                variant: 'destructive',
                description: '신청 처리 중 오류가 발생했습니다.',
            });
        } finally {
            setActionLoading(null);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    }, [fetchFullInvitationData, fetchInvitations, profile, toast, userId]);

    const handleConfirmAction = useCallback(() => {
        const { type, targetId, targetRecord } = confirmConfig;
        if (!type || type === 'INFO_ONLY') {
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            return;
        }

        if (type === 'DELETE' && targetId) {
            executeDelete(targetId);
        } else if (type === 'CANCEL_REQUEST' && targetId) {
            executeCancelRequest(targetId);
        } else if (type === 'REQUEST_APPROVAL' && targetRecord) {
            executeRequestApproval(targetRecord);
        }
    }, [confirmConfig, executeDelete, executeCancelRequest, executeRequestApproval]);

    const handleProfileComplete = useCallback(async () => {
        setProfileModalOpen(false);
        router.refresh();
        toast({ description: '프로필이 저장되었습니다. 다시 사용 신청을 진행해주세요.' });
    }, [router, toast]);

    const handleCreateNew = useCallback(() => {
        reset();
        router.push('/builder');
    }, [reset, router]);

    if (!userId) {
        return (
            <div className={styles.pageContainer}>
                <Header />
                <div className={styles.authCard}>
                    <div className={styles.authIcon}>
                        <Banana size={32} />
                    </div>
                    <h2 className={styles.authTitle}>로그인이 필요합니다</h2>
                    <p className={styles.authDescription}>저장된 청첩장을 보려면 먼저 로그인을 해주세요.</p>
                    <Link href="/login" className={styles.authButton}>
                        로그인하기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <Header />
            <div className={styles.layout}>
                {/* Sidebar */}
                <MyPageSidebar
                    profile={profile}
                    isAdmin={isAdmin}
                    invitationCount={invitations.length}
                    requestCount={approvalRequests.length}
                />

                {/* Main Content */}
                <main className={styles.mainContent}>
                    <div className={styles.sectionHeader}>
                        <h1 className={styles.sectionTitle}>내 청첩장</h1>
                    </div>

                    <div className={styles.cardGrid}>
                        {/* Create New Card */}
                        <div className={styles.createCardWrapper}>
                            <Link
                                href="/builder"
                                className={styles.createCard}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCreateNew();
                                }}
                            >
                                <div className={styles.createIcon}>
                                    <Plus size={28} />
                                </div>
                                <span className={styles.createText}>새 청첩장 만들기</span>
                            </Link>
                            <div className={styles.createDatePlaceholder} />
                        </div>

                        {/* Invitation Cards */}
                        {invitations.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <Banana size={40} />
                                </div>
                                <h3 className={styles.emptyTitle}>아직 청첩장이 없어요</h3>
                                <p className={styles.emptyDescription}>
                                    나만의 특별한 모바일 청첩장을<br />
                                    쉽고 빠르게 만들어보세요!
                                </p>
                            </div>
                        ) : (
                            invitations.map((inv) => {
                                const rejectionData = rejectedRequests.find(req => req.invitation_id === inv.id) || null;
                                return (
                                    <InvitationCard
                                        key={inv.id}
                                        invitation={inv}
                                        isAdmin={isAdmin}
                                        rejectionData={rejectionData}
                                        onEdit={handleEdit}
                                        onDelete={handleDeleteClick}
                                        onRequestApproval={handleRequestApprovalClick}
                                        onCancelRequest={handleCancelRequestClick}
                                        onRevokeApproval={handleAdminRevokeClick}
                                    />
                                );
                            })
                        )}
                    </div>
                </main>
            </div>

            {/* Modals */}
            {userId ? (
                <ProfileCompletionModal
                    isOpen={profileModalOpen}
                    userId={userId}
                    defaultName={profile?.full_name || ''}
                    onComplete={handleProfileComplete}
                />
            ) : null}

            <ResponsiveModal
                open={confirmConfig.isOpen}
                onOpenChange={(open) => setConfirmConfig(prev => ({ ...prev, isOpen: open }))}
                title={confirmConfig.title}
                description={confirmConfig.description}
                showCancel={confirmConfig.type !== 'INFO_ONLY'}
                onConfirm={() => {
                    if (confirmConfig.type !== 'INFO_ONLY') {
                        handleConfirmAction();
                    } else {
                        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
                    }
                }}
                confirmLoading={!!actionLoading}
                dismissible={!actionLoading}
            />

            {rejectionTarget ? (
                <RejectionReasonModal
                    isOpen={rejectionModalOpen}
                    onClose={() => {
                        setRejectionModalOpen(false);
                        setRejectionTarget(null);
                    }}
                    onSubmit={async () => {
                        // Not used in user view
                    }}
                    loading={!!actionLoading}
                    requesterName=""
                    title="승인 취소"
                    description={<></>}
                    confirmText="승인 취소"
                />
            ) : null}
        </div>
    );
}
