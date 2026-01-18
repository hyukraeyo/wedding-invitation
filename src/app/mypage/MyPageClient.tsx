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

import { useToast } from '@/hooks/use-toast';
import { Edit2, Trash2, FileText, MoreHorizontal, Eye, Inbox, Clock } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import styles from './MyPage.module.scss';
import { clsx } from 'clsx';

const ProfileCompletionModal = dynamic(
    () => import('@/components/auth/ProfileCompletionModal'),
    { ssr: false }
);
const ResponsiveModal = dynamic(
    () => import('@/components/common/ResponsiveModal').then(mod => mod.ResponsiveModal),
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
    initialApprovalRequests: ApprovalRequestSummary[];
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
}: MyPageClientProps) {
    const router = useRouter();
    const [invitations, setInvitations] = useState<InvitationSummaryRecord[]>(initialInvitations);
    const [approvalRequests, setApprovalRequests] = useState<ApprovalRequestSummary[]>(initialApprovalRequests);

    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Profile Completion Modal State
    const [profileModalOpen, setProfileModalOpen] = useState(false);

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
            if (isAdmin) {
                const [adminQueue, myInvitations] = await Promise.all([
                    invitationService.getAdminInvitations(),
                    invitationService.getUserInvitations(userId)
                ]);

                // Merge and deduplicate by ID
                const paramMap = new Map();
                adminQueue.forEach(inv => paramMap.set(inv.id, inv));
                myInvitations.forEach(inv => paramMap.set(inv.id, inv));

                const merged = Array.from(paramMap.values())
                    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

                setInvitations(merged);
            } else {
                const data = await invitationService.getUserInvitations(userId);
                setInvitations(data);
            }
        } catch {
            // Silent fail - user can refresh
        }
    }, [userId, isAdmin]);

    const fetchApprovalRequests = useCallback(async () => {
        if (!userId || !isAdmin) return;
        try {
            const data = await approvalRequestService.getAllRequests();
            setApprovalRequests(data);
        } catch {
            // Silent fail
        }
    }, [userId, isAdmin]);

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

    // --- Action Executors (Actual API Calls) ---

    const executeDelete = useCallback(async (id: string) => {
        setActionLoading(id);
        try {
            if (isAdmin) {
                const res = await fetch(`/api/admin/invitations/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Delete failed');
            } else {
                await invitationService.deleteInvitation(id);
            }
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
    }, [fetchInvitations, isAdmin, toast]);

    const executeCancelRequest = useCallback(async (invitationId: string) => {
        setActionLoading(invitationId);
        try {
            await approvalRequestService.cancelRequest(invitationId);
            await Promise.all([fetchInvitations(), fetchApprovalRequests()]);
            toast({ description: '신청이 취소되었습니다.' });
        } catch {
            toast({ variant: 'destructive', description: '취소 처리에 실패했습니다.' });
        } finally {
            setActionLoading(null);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    }, [fetchInvitations, fetchApprovalRequests, toast]);

    const executeApprove = useCallback(async (inv: InvitationSummaryRecord) => {
        setActionLoading(inv.id);
        try {
            const fullData = await fetchFullInvitationData(inv.slug);
            const updatedData = {
                ...fullData,
                isApproved: true,
                isRequestingApproval: false
            };
            await invitationService.saveInvitation(inv.slug, updatedData, inv.user_id);
            toast({ description: '사용 승인이 완료되었습니다.' });
            await Promise.all([fetchInvitations(), fetchApprovalRequests()]);
        } catch {
            toast({ variant: 'destructive', description: '승인 처리 중 오류가 발생했습니다.', });
        } finally {
            setActionLoading(null);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    }, [fetchApprovalRequests, fetchFullInvitationData, fetchInvitations, toast]);

    const executeRevokeApproval = useCallback(async (inv: InvitationSummaryRecord) => {
        setActionLoading(inv.id);
        try {
            const fullData = await fetchFullInvitationData(inv.slug);
            const updatedData = {
                ...fullData,
                isApproved: false,
                isRequestingApproval: false,
            };
            await invitationService.saveInvitation(inv.slug, updatedData, inv.user_id);
            toast({ description: '승인이 취소되었습니다.' });
            await Promise.all([fetchInvitations(), fetchApprovalRequests()]);
        } catch {
            toast({ variant: 'destructive', description: '승인 취소 중 오류가 발생했습니다.' });
        } finally {
            setActionLoading(null);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    }, [fetchApprovalRequests, fetchFullInvitationData, fetchInvitations, toast]);

    // --- Action Initiators (Open Dialog) ---

    const handleDeleteClick = useCallback((inv: InvitationSummaryRecord) => {
        // Validation for user logic
        if (!isAdmin && inv.invitation_data?.isRequestingApproval) {
            setConfirmConfig({
                isOpen: true,
                type: 'INFO_ONLY', // Can't proceed
                title: '삭제할 수 없습니다',
                description: <>승인 신청 중인 청첩장은 삭제할 수 없습니다.<br />먼저 [신청취소]를 진행해 주세요.</>,
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
    }, [isAdmin]);

    const handleCancelRequestClick = useCallback((inv: InvitationSummaryRecord) => {
        setConfirmConfig({
            isOpen: true,
            type: 'CANCEL_REQUEST',
            title: '승인 신청 취소',
            description: '승인 신청을 취소하시겠습니까?',
            targetId: inv.id,
        });
    }, []);

    // Helper to check if profile is complete
    const isProfileComplete = useMemo(() => {
        return Boolean(profile?.full_name && profile?.phone);
    }, [profile]);

    const handleRequestApprovalClick = useCallback((inv: InvitationSummaryRecord) => {
        if (inv.invitation_data.isRequestingApproval) {
            toast({ description: '이미 승인 신청된 청첩장입니다.' });
            return;
        }

        // Check if profile is complete
        if (isProfileComplete) {
            // Profile is complete - show confirmation dialog
            setConfirmConfig({
                isOpen: true,
                type: 'REQUEST_APPROVAL',
                title: '사용 승인 신청',
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
            // Profile is incomplete - show ProfileCompletionModal
            setProfileModalOpen(true);
        }
    }, [isProfileComplete, profile, toast]);

    const handleAdminApproveClick = useCallback((inv: InvitationSummaryRecord) => {
        setConfirmConfig({
            isOpen: true,
            type: 'APPROVE',
            title: '청첩장 승인',
            description: <>해당 청첩장의 사용을 승인하시겠습니까?<br />승인 후에는 워터마크가 제거됩니다.</>,
            targetId: inv.id,
            targetRecord: inv,
        });
    }, []);

    const handleAdminRevokeClick = useCallback((inv: InvitationSummaryRecord) => {
        setConfirmConfig({
            isOpen: true,
            type: 'REVOKE_APPROVAL',
            title: '승인 취소',
            description: '승인 상태를 취소하시겠습니까?',
            targetId: inv.id,
            targetRecord: inv,
        });
    }, []);


    // Execute approval request using profile data
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
            await Promise.all([fetchInvitations(), fetchApprovalRequests()]);
        } catch {
            toast({
                variant: 'destructive',
                description: '신청 처리 중 오류가 발생했습니다.',
            });
        } finally {
            setActionLoading(null);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    }, [fetchFullInvitationData, fetchInvitations, fetchApprovalRequests, profile, toast, userId]);

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
        } else if (type === 'APPROVE' && targetRecord) {
            executeApprove(targetRecord);
        } else if (type === 'REVOKE_APPROVAL' && targetRecord) {
            executeRevokeApproval(targetRecord);
        } else if (type === 'REQUEST_APPROVAL' && targetRecord) {
            executeRequestApproval(targetRecord);
        }
    }, [confirmConfig, executeDelete, executeCancelRequest, executeApprove, executeRevokeApproval, executeRequestApproval]);

    // Handle profile completion - auto submit approval after profile is saved
    const handleProfileComplete = useCallback(async () => {
        setProfileModalOpen(false);

        // Refresh page to get updated profile, then user can try again
        router.refresh();
        toast({ description: '프로필이 저장되었습니다. 다시 사용 신청을 진행해주세요.' });
    }, [router, toast]);

    const handleCreateNew = useCallback(() => {
        reset();
        router.push('/builder');
    }, [reset, router]);

    if (!userId) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1.5rem', backgroundColor: '#F2F4F6' }}>
                <div className={styles.authCard}>
                    <div className={styles.authIcon}><Edit2 /></div>
                    <h2 className={styles.authTitle}>로그인이 필요합니다</h2>
                    <p className={styles.authDescription}>저장된 청첩장을 보려면 먼저 로그인을 해주세요.</p>
                    <Link href="/builder" onClick={handleCreateNew} className={styles.authButton}>
                        메인으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                {/* 1. Summary Card */}
                {/* 1. Summary Card - Only visible to Admin */}
                {isAdmin && (
                    <section className={styles.summaryCard}>
                        <div className={styles.summaryHeader}>
                            <div>
                                <h2>신청한 청첩장</h2>
                                <p>사용 승인 신청 목록입니다.</p>
                            </div>
                            <span className={styles.countBadge}>
                                {approvalRequests.length}
                            </span>
                        </div>
                        {/* Admin sees request list */}
                        {approvalRequests.length > 0 ? (
                            <div className={styles.requestList}>
                                {approvalRequests.map(request => {
                                    const targetInv = invitations.find(inv => inv.id === request.invitation_id);
                                    const date = new Date(request.created_at);
                                    const formattedDate = `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

                                    return (
                                        <div key={request.id} className={styles.requestItem}>
                                            <div className={styles.requestInfo}>
                                                <div className={styles.requester}>
                                                    <strong>{request.requester_name}</strong>
                                                    <span className={styles.phone}>({request.requester_phone})</span>
                                                </div>
                                                <div className={styles.requestTime}>
                                                    <Clock size={12} />
                                                    <span>{formattedDate} 신청</span>
                                                </div>
                                            </div>
                                            {targetInv && (
                                                <button
                                                    onClick={() => handleAdminApproveClick(targetInv)}
                                                    className={styles.approveButton}
                                                >
                                                    승인하기
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className={styles.emptySummary}>
                                <div className={styles.emptyIconWrapper}>
                                    <Inbox size={48} strokeWidth={1} />
                                </div>
                                <p className={styles.emptyText}>현재 대기 중인 승인 신청이 없습니다.</p>
                                <p className={styles.emptySubText}>모든 요청을 처리했습니다.</p>
                            </div>
                        )}
                    </section>
                )}

                {/* 2. Invitation List */}
                <section className={styles.invitationList}>
                    {invitations.length === 0 ? (
                        <div className={styles.emptyFullState}>
                            <div className={styles.emptyIcon}>
                                <FileText size={32} />
                            </div>
                            <h3>청첩장을 만들어보세요</h3>
                            <p>나만의 특별한 모바일 청첩장을<br />쉽고 빠르게 만들 수 있습니다.</p>
                            <Link
                                href="/builder"
                                className={styles.createBtn}
                                onClick={handleCreateNew}
                            >
                                청첩장 만들기
                            </Link>
                        </div>
                    ) : (
                        invitations.map((inv) => (
                            <div key={inv.id} className={styles.invitationItem}>
                                <div className={styles.itemHeader}>
                                    <div className={styles.flexColStart}>
                                        <span className={styles.statusLabel}>
                                            {inv.invitation_data?.isApproved ? '승인 완료' : '샘플 이용중'}
                                        </span>
                                        <h3 className={styles.itemTitle}>
                                            {inv.invitation_data?.mainScreen?.title || '제목없음'}
                                        </h3>
                                        <p className={styles.itemDate}>
                                            {inv.invitation_data?.date || new Date(inv.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className={styles.itemHeaderRight}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className={styles.moreButton}>
                                                    <span className={styles.srOnly}>편집하기</span>
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" style={{ width: '200px', padding: '0.5rem', borderRadius: '0.75rem' }}>
                                                <DropdownMenuItem onClick={() => handleEdit(inv)}>
                                                    <Edit2 className="mr-2 h-4 w-4" /> 편집하기
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => window.open(`/v/${inv.slug}`, '_blank')}>
                                                    <Eye className="mr-2 h-4 w-4" /> 미리보기
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setTimeout(() => handleDeleteClick(inv), 0)}
                                                    style={{ color: '#EF4444' }}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> 삭제하기
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {inv.invitation_data?.imageUrl ? (
                                    <div className={styles.previewImageWrapper}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={inv.invitation_data.imageUrl}
                                            alt="Main Screen"
                                        />
                                    </div>
                                ) : (
                                    <div className={styles.iconWithText}>
                                        <FileText size={48} strokeWidth={1} className="text-gray-800" />
                                    </div>
                                )}

                                <button
                                    className={clsx(
                                        styles.actionButton,
                                        inv.invitation_data?.isApproved && styles.approved
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (inv.invitation_data?.isApproved) {
                                            if (isAdmin) handleAdminRevokeClick(inv);
                                            // User: Do nothing or share
                                        } else {
                                            if (inv.invitation_data?.isRequestingApproval) {
                                                handleCancelRequestClick(inv);
                                            } else {
                                                handleRequestApprovalClick(inv);
                                            }
                                        }
                                    }}
                                >
                                    {inv.invitation_data?.isApproved
                                        ? "승인 완료"
                                        : inv.invitation_data?.isRequestingApproval
                                            ? "신청 취소"
                                            : "사용신청"
                                    }
                                </button>
                            </div>
                        ))
                    )}
                </section>

                {/* Modals remain same */}
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
            </main>
        </div>
    );
}
