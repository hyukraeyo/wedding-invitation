"use client";

import { parseRejection } from '@/lib/rejection-helpers';
import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { approvalRequestService } from '@/services/approvalRequestService';
import type { ApprovalRequestSummary } from '@/services/approvalRequestService';
import type { InvitationSummaryRecord } from '@/lib/invitation-summary';
import { invitationService } from '@/services/invitationService';
import Header from '@/components/common/Header';
import { useToast } from '@/hooks/use-toast';
import {
    Clock,
    AlertCircle,
    CheckCircle,
    Inbox,
    Banana,
    FileText,
    ClipboardList,
    HelpCircle,
    User,
    LogOut
} from 'lucide-react';
import styles from './RequestsPage.module.scss';
import { clsx } from 'clsx';

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
    initialApprovalRequests: ApprovalRequestSummary[];
    initialAdminInvitations: InvitationSummaryRecord[];
    profile: ProfileSummary | null;
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

export default function RequestsPageClient({
    userId: _userId,
    initialApprovalRequests,
    initialAdminInvitations,
    profile,
}: RequestsPageClientProps) {
    const [approvalRequests, setApprovalRequests] = useState<ApprovalRequestSummary[]>(initialApprovalRequests);
    const [adminInvitations, setAdminInvitations] = useState<InvitationSummaryRecord[]>(initialAdminInvitations);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Rejection Modal State
    const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
    const [rejectionTarget, setRejectionTarget] = useState<InvitationSummaryRecord | null>(null);

    // View Rejection Reason Modal State
    const [viewRejectionModalOpen, setViewRejectionModalOpen] = useState(false);
    const [viewRejectionData, setViewRejectionData] = useState<ApprovalRequestSummary | null>(null);

    // Confirmation Dialog State
    const [confirmConfig, setConfirmConfig] = useState<ConfirmConfig>({
        isOpen: false,
        type: 'INFO_ONLY',
        title: '',
        description: '',
        targetId: null,
        targetRecord: null,
    });

    const { toast } = useToast();

    const fetchApprovalRequests = useCallback(async () => {
        try {
            const data = await approvalRequestService.getAllRequests();
            setApprovalRequests(data);
        } catch {
            // Silent fail
        }
    }, []);

    const fetchAdminInvitations = useCallback(async () => {
        try {
            const data = await invitationService.getAdminInvitations();
            setAdminInvitations(data);
        } catch {
            // Silent fail
        }
    }, []);

    const fetchFullInvitationData = useCallback(async (slug: string) => {
        const fullInvitation = await invitationService.getInvitation(slug);
        if (!fullInvitation?.invitation_data) {
            throw new Error('Invitation data missing');
        }
        return fullInvitation.invitation_data;
    }, []);

    const executeApprove = useCallback(async (inv: InvitationSummaryRecord) => {
        setActionLoading(inv.id);
        try {
            await approvalRequestService.approveRequest(inv.id);

            const fullData = await fetchFullInvitationData(inv.slug);
            const updatedData = {
                ...fullData,
                isApproved: true,
                isRequestingApproval: false
            };
            await invitationService.saveInvitation(inv.slug, updatedData, inv.user_id);
            toast({ description: '사용 승인이 완료되었습니다.' });
            await Promise.all([fetchAdminInvitations(), fetchApprovalRequests()]);
        } catch {
            toast({ variant: 'destructive', description: '승인 처리 중 오류가 발생했습니다.', });
        } finally {
            setActionLoading(null);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    }, [fetchApprovalRequests, fetchFullInvitationData, fetchAdminInvitations, toast]);

    const executeReject = useCallback(async (inv: InvitationSummaryRecord, reason: string) => {
        setActionLoading(inv.id);
        try {
            await approvalRequestService.rejectRequest(inv.id, reason);
            toast({ description: '신청이 거절되었습니다. 사용자가 거절 사유를 확인할 수 있습니다.' });
            await Promise.all([fetchAdminInvitations(), fetchApprovalRequests()]);
        } catch {
            toast({ variant: 'destructive', description: '거절 처리 중 오류가 발생했습니다.' });
        } finally {
            setActionLoading(null);
            setRejectionModalOpen(false);
            setRejectionTarget(null);
        }
    }, [fetchApprovalRequests, fetchAdminInvitations, toast]);

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

    const handleAdminRejectClick = useCallback((inv: InvitationSummaryRecord) => {
        setRejectionTarget(inv);
        setRejectionModalOpen(true);
    }, []);

    const handleConfirmAction = useCallback(() => {
        const { type, targetRecord } = confirmConfig;
        if (!type || type === 'INFO_ONLY') {
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            return;
        }

        if (type === 'APPROVE' && targetRecord) {
            executeApprove(targetRecord);
        }
    }, [confirmConfig, executeApprove]);

    const handleLogout = useCallback(async () => {
        await signOut({ callbackUrl: '/login' });
    }, []);

    // Coming Soon Handler (Placeholder)
    const handleComingSoon = (title: string) => {
        toast({ description: `${title} 기능은 준비 중입니다.` });
    };

    return (
        <div className={styles.pageContainer}>
            <Header />
            <div className={styles.layout}>
                {/* Desktop Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.profileSection}>
                        <div className={styles.avatar}>
                            <Banana size={24} />
                        </div>
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>
                                {profile?.full_name || '관리자'}
                            </div>
                            <div className={styles.userEmail}>
                                {profile?.phone || '전화번호 없음'}
                            </div>
                        </div>
                    </div>

                    <nav className={styles.menuList}>
                        <Link href="/mypage" className={styles.menuItem}>
                            <FileText className={styles.menuIcon} />
                            내 청첩장
                        </Link>

                        <Link href="/mypage/requests" className={`${styles.menuItem} ${styles.active}`}>
                            <ClipboardList className={styles.menuIcon} />
                            신청 관리
                            {approvalRequests.length > 0 && (
                                <span className={styles.menuBadge}>{approvalRequests.length}</span>
                            )}
                        </Link>

                        <button
                            className={styles.menuItem}
                            onClick={() => handleComingSoon('고객센터')}
                        >
                            <HelpCircle className={styles.menuIcon} />
                            고객센터
                        </button>

                        <button
                            className={styles.menuItem}
                            onClick={() => handleComingSoon('내 계정')}
                        >
                            <User className={styles.menuIcon} />
                            내 계정
                        </button>
                    </nav>

                    <button className={styles.logoutButton} onClick={handleLogout}>
                        <LogOut size={20} />
                        로그아웃
                    </button>
                </aside>

                {/* Main Content */}
                <main className={styles.mainContent}>
                    <div className={styles.sectionHeader}>
                        <h1 className={styles.sectionTitle}>신청 관리</h1>
                    </div>

                    {approvalRequests.length > 0 ? (
                        <div className={styles.requestList}>
                            {approvalRequests.map(request => {
                                const targetInv = adminInvitations.find(inv => inv.id === request.invitation_id);
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
                                                <strong style={
                                                    isRejected ? { color: '#DC2626' } :
                                                        isApproved ? { color: '#10B981' } : undefined
                                                }>
                                                    {request.requester_name}
                                                </strong>
                                                <span className={styles.phone}>({request.requester_phone})</span>
                                            </div>
                                            <div className={styles.requestTime}>
                                                <Clock size={12} />
                                                <span>
                                                    {formattedDate} {isRevoked ? '승인 취소' : isPureRejected ? '승인 거절' : isApproved ? '승인 완료' : '승인 신청'}
                                                </span>
                                            </div>
                                        </div>
                                        {targetInv ? (
                                            <div className={styles.adminButtonGroup}>
                                                <button
                                                    onClick={() => window.open(`/v/${targetInv.slug}`, '_blank')}
                                                    className={styles.previewButton}
                                                >
                                                    미리보기
                                                </button>
                                                {isRejected ? (
                                                    <button
                                                        onClick={() => {
                                                            setViewRejectionData(request);
                                                            setViewRejectionModalOpen(true);
                                                        }}
                                                        className={styles.viewReasonButton}
                                                    >
                                                        {isRevoked ? '취소 사유' : '거절 사유'}
                                                    </button>
                                                ) : isApproved ? (
                                                    <button
                                                        onClick={() => {
                                                            setRejectionTarget(targetInv);
                                                            setRejectionModalOpen(true);
                                                        }}
                                                        className={styles.revokeButton}
                                                    >
                                                        승인 취소
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleAdminRejectClick(targetInv)}
                                                            className={styles.rejectButton}
                                                        >
                                                            승인 거절
                                                        </button>
                                                        <button
                                                            onClick={() => handleAdminApproveClick(targetInv)}
                                                            className={styles.approveButton}
                                                        >
                                                            승인하기
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        ) : null}
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
                </main>
            </div>

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

            {
                rejectionTarget ? (
                    <RejectionReasonModal
                        isOpen={rejectionModalOpen}
                        onClose={() => {
                            setRejectionModalOpen(false);
                            setRejectionTarget(null);
                        }}
                        onSubmit={(reason) => executeReject(rejectionTarget, reason)}
                        loading={!!actionLoading}
                        requesterName={approvalRequests.find(req => req.invitation_id === rejectionTarget.id)?.requester_name || ''}
                        title={rejectionTarget.invitation_data.isApproved ? "승인 취소" : "승인 거절"}
                        description={<></>}
                        confirmText={rejectionTarget.invitation_data.isApproved ? "승인 취소" : "승인 거절"}
                    />
                ) : null
            }

            {
                viewRejectionData ? (
                    <ResponsiveModal
                        open={viewRejectionModalOpen}
                        onOpenChange={setViewRejectionModalOpen}
                        title="거절/취소 사유"
                        description={
                            <>
                                <strong>{viewRejectionData.requester_name}</strong>님의 신청 처리 내역입니다.
                            </>
                        }
                        showCancel={false}
                        confirmText="확인"
                        onConfirm={() => {
                            setViewRejectionModalOpen(false);
                            setViewRejectionData(null);
                        }}
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
                                dangerouslySetInnerHTML={{
                                    __html: parseRejection(viewRejectionData).displayReason || '내용이 없습니다.'
                                }}
                            />
                        </div>
                    </ResponsiveModal>
                ) : null
            }
        </div>
    );
}
