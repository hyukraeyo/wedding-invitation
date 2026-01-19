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
import { Edit2, Trash2, FileText, MoreHorizontal, Eye, Inbox, Clock, Bookmark, AlertCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import styles from './MyPage.module.scss';
import { clsx } from 'clsx';
import { InvitationCard } from '@/components/ui/InvitationCard';

const ProfileCompletionModal = dynamic(
    () => import('@/components/auth/ProfileCompletionModal'),
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
    initialAdminInvitations,
    initialApprovalRequests,
    initialRejectedRequests = [],
}: MyPageClientProps) {
    const router = useRouter();
    const [invitations, setInvitations] = useState<InvitationSummaryRecord[]>(initialInvitations);
    const [adminInvitations, setAdminInvitations] = useState<InvitationSummaryRecord[]>(initialAdminInvitations);
    const [approvalRequests, setApprovalRequests] = useState<ApprovalRequestSummary[]>(initialApprovalRequests);
    const [rejectedRequests, setRejectedRequests] = useState<ApprovalRequestSummary[]>(initialRejectedRequests);

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
            if (isAdmin) {
                const [adminQueue, myInvitations] = await Promise.all([
                    invitationService.getAdminInvitations(),
                    invitationService.getUserInvitations(userId)
                ]);

                setAdminInvitations(adminQueue);
                setInvitations(myInvitations);
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

    const fetchRejectedRequests = useCallback(async () => {
        if (!userId) return;
        try {
            const data = await approvalRequestService.getUserRejectedRequests();
            setRejectedRequests(data);
        } catch {
            // Silent fail
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

    const executeReject = useCallback(async (inv: InvitationSummaryRecord, reason: string) => {
        setActionLoading(inv.id);
        try {
            await approvalRequestService.rejectRequest(inv.id, reason);
            toast({ description: '신청이 거절되었습니다. 사용자가 거절 사유를 확인할 수 있습니다.' });
            await Promise.all([fetchInvitations(), fetchApprovalRequests(), fetchRejectedRequests()]);
        } catch {
            toast({ variant: 'destructive', description: '거절 처리 중 오류가 발생했습니다.' });
        } finally {
            setActionLoading(null);
            setRejectionModalOpen(false);
            setRejectionTarget(null);
        }
    }, [fetchApprovalRequests, fetchInvitations, fetchRejectedRequests, toast]);

    // --- Action Initiators (Open Dialog) ---

    const handleDeleteClick = useCallback((inv: InvitationSummaryRecord) => {
        // Validation for user logic: Block deletion if requesting or approved
        // Admin also follows this for their own invitations
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

    const handleAdminRejectClick = useCallback((inv: InvitationSummaryRecord) => {
        const request = approvalRequests.find(req => req.invitation_id === inv.id);
        setRejectionTarget(inv);
        setRejectionModalOpen(true);
    }, [approvalRequests]);


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
                                    const targetInv = adminInvitations.find(inv => inv.id === request.invitation_id);
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
                                                <div className={styles.adminButtonGroup}>
                                                    <button
                                                        onClick={() => window.open(`/v/${targetInv.slug}`, '_blank')}
                                                        className={styles.previewButton}
                                                    >
                                                        미리보기
                                                    </button>
                                                    <button
                                                        onClick={() => handleAdminRejectClick(targetInv)}
                                                        className={styles.rejectButton}
                                                    >
                                                        거절하기
                                                    </button>
                                                    <button
                                                        onClick={() => handleAdminApproveClick(targetInv)}
                                                        className={styles.approveButton}
                                                    >
                                                        승인하기
                                                    </button>
                                                </div>
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

                {/* Rejected Requests Section - Visible to all users (including admins) */}
                {rejectedRequests.length > 0 && (
                    <section className={styles.summaryCard} style={{ borderColor: '#FEE2E2' }}>
                        <div className={styles.summaryHeader}>
                            <div>
                                <h2 style={{ color: '#DC2626' }}>거절된 신청</h2>
                                <p>관리자가 거절한 사용 신청 내역입니다.</p>
                            </div>
                            <span className={styles.countBadge} style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                                {rejectedRequests.length}
                            </span>
                        </div>
                        <div className={styles.requestList}>
                            {rejectedRequests.map(request => {
                                const date = new Date(request.created_at);
                                const formattedDate = `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

                                return (
                                    <div key={request.id} className={styles.requestItem} style={{ backgroundColor: '#FEF2F2' }}>
                                        <div className={styles.requestInfo}>
                                            <div className={styles.requester}>
                                                <AlertCircle size={16} color="#DC2626" style={{ marginRight: '0.5rem' }} />
                                                <strong style={{ color: '#DC2626' }}>거절됨</strong>
                                            </div>
                                            <div className={styles.requestTime}>
                                                <Clock size={12} />
                                                <span>{formattedDate}</span>
                                            </div>
                                        </div>
                                        {request.rejection_reason && (
                                            <div style={{
                                                marginTop: '0.75rem',
                                                padding: '0.75rem',
                                                backgroundColor: '#FFF',
                                                borderRadius: '0.5rem',
                                                border: '1px solid #FEE2E2',
                                            }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#DC2626', marginBottom: '0.5rem' }}>
                                                    거절 사유
                                                </div>
                                                <div
                                                    style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.6 }}
                                                    dangerouslySetInnerHTML={{ __html: request.rejection_reason }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* 2. Invitation List */}
                <section className={styles.invitationSection}>
                    <div className={styles.summaryHeader}>
                        <div>
                            <h2>저장한 청첩장</h2>
                            <p>내가 제작 중인 청첩장 목록입니다.</p>
                        </div>
                        <span className={styles.countBadge}>
                            {invitations.length}
                        </span>
                    </div>

                    <div className={styles.invitationList}>
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
                                <InvitationCard
                                    key={inv.id}
                                    invitation={inv}
                                    isAdmin={isAdmin}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteClick}
                                    onRequestApproval={handleRequestApprovalClick}
                                    onCancelRequest={handleCancelRequestClick}
                                    onRevokeApproval={handleAdminRevokeClick}
                                />
                            ))
                        )}
                    </div>
                </section>
            </main>

            {/* Modals remain same */}
            {
                userId ? (
                    <ProfileCompletionModal
                        isOpen={profileModalOpen}
                        userId={userId}
                        defaultName={profile?.full_name || ''}
                        onComplete={handleProfileComplete}
                    />
                ) : null
            }

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

            {rejectionTarget && (
                <RejectionReasonModal
                    isOpen={rejectionModalOpen}
                    onClose={() => {
                        setRejectionModalOpen(false);
                        setRejectionTarget(null);
                    }}
                    onSubmit={(reason) => executeReject(rejectionTarget, reason)}
                    loading={!!actionLoading}
                    requesterName={approvalRequests.find(req => req.invitation_id === rejectionTarget.id)?.requester_name || ''}
                />
            )}
        </div>
    );
}
