"use client";

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { invitationService } from '@/services/invitationService';
import { approvalRequestService } from '@/services/approvalRequestService';
import type { ApprovalRequestSummary } from '@/services/approvalRequestService';
import type { InvitationSummaryRecord } from '@/lib/invitation-summary';
import { useInvitationStore, INITIAL_STATE } from '@/store/useInvitationStore';
import type { InvitationData } from '@/store/useInvitationStore';
import { MyPageContent } from '@/components/mypage/MyPageContent';
import { MyPageLayout } from '@/components/mypage/MyPageLayout';
import { parseRejection } from '@/lib/rejection-helpers';
// import { signOut } from 'next-auth/react';

import { useToast } from '@/hooks/use-toast';
import { useRejectionReason } from '@/hooks/useRejectionReason';
import {
    Banana,
    Plus,
    LayoutGrid,
    GalleryHorizontal,
} from 'lucide-react';
import styles from './MyPage.module.scss';
import { InvitationCard } from '@/components/ui/InvitationCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { MyPageHeader } from '@/components/mypage/MyPageHeader';
import { IconButton } from '@/components/ui/IconButton';
import { Skeleton } from '@/components/ui/Skeleton';
import { MENU_TITLES } from '@/constants/navigation';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const ProfileCompletionModal = dynamic(
    () => import('@/components/auth/ProfileCompletionModal').then(mod => mod.ProfileCompletionModal),
    { ssr: false }
);
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from '@/components/ui/AlertDialog';
const RichTextEditor = dynamic(
    () => import('@/components/ui/RichTextEditor').then(mod => mod.RichTextEditor),
    { ssr: false }
);
const InvitationOnboardingModal = dynamic(
    () => import('@/components/features/onboarding/InvitationOnboardingModal').then(mod => mod.InvitationOnboardingModal),
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
    initialRejectedRequests = [],
}: MyPageClientProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    // 🍌 페이지 이동 시 로딩 상태 초기화
    useEffect(() => {
        setActionLoadingId(null);
    }, [pathname]);

    const [invitations, setInvitations] = useState<InvitationSummaryRecord[]>(initialInvitations);
    const [rejectedRequests] = useState<ApprovalRequestSummary[]>(initialRejectedRequests);
    const [viewMode, setViewMode] = useState<'grid' | 'swiper'>('swiper');
    const [isViewModeReady, setIsViewModeReady] = useState(false);

    useEffect(() => {
        setIsViewModeReady(true);
    }, []);

    const handleViewModeChange = useCallback((mode: 'grid' | 'swiper') => {
        setViewMode(mode);
    }, []);

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

    const [autoNotificationTarget, setAutoNotificationTarget] = useState<{
        invitation: InvitationSummaryRecord;
        rejection?: ApprovalRequestSummary;
        isApproval?: boolean;
    } | null>(null);

    const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);

    const handleRejectionSubmit = useCallback(() => {
        // Not used in user view
    }, []);

    const rejectionReason = useRejectionReason({
        onSubmit: handleRejectionSubmit,
        onClose: () => {
            setRejectionModalOpen(false);
            setRejectionTarget(null);
        },
        loading: !!actionLoadingId,
    });

    const reset = useInvitationStore(state => state.reset);
    const { toast } = useToast();

    // Check for unread notifications (rejections or approvals) on load
    useEffect(() => {
        if (invitations.length === 0) return;

        // 1. Check for new rejections
        const unreadRejection = invitations.find(inv => inv.invitation_data?.hasNewRejection);
        if (unreadRejection) {
            const rejection = rejectedRequests.find(req => req.invitation_id === unreadRejection.id);
            if (rejection) {
                setAutoNotificationTarget({
                    invitation: unreadRejection,
                    rejection
                });
                return; // Prioritize one notification at a time
            }
        }

        // 2. Check for new approvals
        const unreadApproval = invitations.find(inv => inv.invitation_data?.hasNewApproval);
        if (unreadApproval) {
            setAutoNotificationTarget({
                invitation: unreadApproval,
                isApproval: true
            });
        }
    }, [invitations, rejectedRequests]);

    const handleCloseAutoNotification = useCallback(async () => {
        if (!autoNotificationTarget) return;

        const targetId = autoNotificationTarget.invitation.id;
        setAutoNotificationTarget(null);

        try {
            // async-defer-await: Mark as read immediately, non-blocking UI update
            await invitationService.markNotificationAsRead(targetId);

            setInvitations(prev => prev.map(inv =>
                inv.id === targetId
                    ? { ...inv, invitation_data: { ...inv.invitation_data, hasNewRejection: false, hasNewApproval: false } }
                    : inv
            ));

            // Sync sidebar counts
            router.refresh();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }, [autoNotificationTarget, router]);

    const fetchFullInvitationData = useCallback(async (slug: string) => {
        const fullInvitation = await invitationService.getInvitation(slug);
        if (!fullInvitation?.invitation_data) {
            throw new Error('Invitation data missing');
        }
        return fullInvitation.invitation_data as InvitationData;
    }, []);

    const handleEdit = useCallback(async (inv: InvitationSummaryRecord) => {
        if (actionLoadingId === inv.id) return;
        
        setActionLoadingId(inv.id);
        try {
            const fullData = await fetchFullInvitationData(inv.slug);
            
            // 🍌 안전한 상태 업데이트: DB의 데이터가 일부 누락되었더라도 초기값(INITIAL_STATE)을 유지하도록 딥 병합함
            useInvitationStore.setState(() => ({
                ...INITIAL_STATE,
                ...fullData,
                groom: { ...INITIAL_STATE.groom, ...fullData.groom },
                bride: { ...INITIAL_STATE.bride, ...fullData.bride },
                theme: { ...INITIAL_STATE.theme, ...fullData.theme },
                mainScreen: { ...INITIAL_STATE.mainScreen, ...fullData.mainScreen },
                kakaoShare: { ...INITIAL_STATE.kakaoShare, ...fullData.kakaoShare },
                closing: { ...INITIAL_STATE.closing, ...fullData.closing },
                slug: inv.slug,
            }));

            router.push('/builder?mode=edit');
        } catch (error) {
            console.error('Fetch error:', error);
            toast({
                variant: 'destructive',
                description: '청첩장 데이터를 불러오지 못했어요.',
            });
        } finally {
            // 🍌 페이지 이동이 시작될 시간을 준 뒤 로딩 상태 해제 (이동이 느릴 경우 대비)
            // 이동 후 다시 이 페이지로 돌아왔을 때 버튼이 계속 돌고 있는 현상 방지
            setTimeout(() => setActionLoadingId(null), 1000);
        }
    }, [fetchFullInvitationData, router, toast, actionLoadingId]);

    // --- Action Executors ---

    const executeDelete = useCallback(async (targetId: string) => {
        setActionLoadingId(targetId);
        try {
            await invitationService.deleteInvitation(targetId);
            // Parallelize re-fetch
            const newInvitations = await invitationService.getUserInvitations(userId!);
            setInvitations(newInvitations);
            // Sync sidebar counts
            router.refresh();
        } catch {
            toast({
                variant: 'destructive',
                description: '삭제 중 오류가 발생했어요.',
            });
        } finally {
            setActionLoadingId(null);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    }, [userId, toast, router]);

    const executeCancelRequest = useCallback(async (invitationId: string) => {
        setActionLoadingId(invitationId);
        try {
            await approvalRequestService.cancelRequest(invitationId);
            // Parallelize re-fetch
            const newInvitations = await invitationService.getUserInvitations(userId!);
            setInvitations(newInvitations);
            toast({ description: '신청이 취소되었어요.' });
            // Sync sidebar counts
            router.refresh();
        } catch {
            toast({ variant: 'destructive', description: '취소 처리에 실패했어요.' });
        } finally {
            setActionLoadingId(null);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    }, [userId, toast, router]);

    // --- Action Initiators ---

    const handleDeleteClick = useCallback((inv: InvitationSummaryRecord) => {
        // Find if this invitation has rejection/revocation data
        const rejection = rejectedRequests.find(req => req.invitation_id === inv.id);
        const { isRejected, isRevoked } = parseRejection(rejection);

        // 승인 대기 중인 경우 삭제 불가 (신청 취소 유도)
        if (inv.invitation_data?.isRequestingApproval && !isRejected && !isRevoked) {
            setConfirmConfig({
                isOpen: true,
                type: 'INFO_ONLY',
                title: '삭제할 수 없어요',
                description: <>
                    승인 신청 중인 청첩장은 삭제할 수 없어요.<br /><br />
                    하단의 <strong>[신청취소]</strong> 버튼을 눌러 상태를 변경한 뒤 다시 시도해 주세요.
                </>,
                targetId: null,
            });
            return;
        }

        // 승인 완료된 경우 (강력한 경고와 함께 삭제 허용)
        if (inv.invitation_data?.isApproved && !isRejected && !isRevoked) {
            setConfirmConfig({
                isOpen: true,
                type: 'DELETE',
                title: '청첩장 삭제',
                description: (
                    <>
                        정말로 이 청첩장을 삭제할까요?<br />
                        <span className={styles.deleteWarning}>주의: 승인 완료된 청첩장을 삭제하면 공유된 링크로 더 이상 접속할 수 없어요.</span>
                        <br />
                        삭제된 데이터는 복구할 수 없어요.
                    </>
                ),
                targetId: inv.id,
            });
            return;
        }

        // 거절 또는 취소된 경우
        if (isRejected || isRevoked) {
            const statusText = isRevoked ? '승인 취소' : '승인 거절';
            setConfirmConfig({
                isOpen: true,
                type: 'DELETE',
                title: '청첩장 삭제',
                description: (
                    <>
                        정말로 이 청첩장을 삭제할까요?<br />
                        현재 이 청첩장은 <strong>{statusText}</strong> 상태예요.<br /><br />
                        삭제된 데이터는 복구할 수 없어요.
                    </>
                ),
                targetId: inv.id,
            });
            return;
        }

        // 일반 상태 (작성 중)
        setConfirmConfig({
            isOpen: true,
            type: 'DELETE',
            title: '청첩장 삭제',
            description: '정말로 이 청첩장을 삭제할까요? 삭제된 데이터는 복구할 수 없어요.',
            targetId: inv.id,
        });
    }, [rejectedRequests]);

    const handleCancelRequestClick = useCallback((inv: InvitationSummaryRecord) => {
        setConfirmConfig({
            isOpen: true,
            type: 'CANCEL_REQUEST',
            title: '승인 신청 취소',
            description: '승인 신청을 취소할까요?',
            targetId: inv.id,
        });
    }, []);

    const isProfileComplete = useMemo(() => {
        return Boolean(profile?.full_name && profile?.phone);
    }, [profile]);

    const handleRequestApprovalClick = useCallback((inv: InvitationSummaryRecord) => {
        if (inv.invitation_data.isRequestingApproval) {
            toast({ description: '이미 승인 신청된 청첩장이에요.' });
            return;
        }

        if (isProfileComplete) {
            setConfirmConfig({
                isOpen: true,
                type: 'REQUEST_APPROVAL',
                title: '승인 신청',
                description: (
                    <>
                        <strong>{profile?.full_name}</strong>({profile?.phone}) 님으로 신청해요.<br />
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

        setActionLoadingId(inv.id);
        try {
            // async-api-routes pattern: start operation
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

            // Wait for both save and re-fetch
            await Promise.all([
                invitationService.saveInvitation(inv.slug, updatedData, userId),
                invitationService.getUserInvitations(userId).then(setInvitations)
            ]);

            toast({
                description: '사용 신청이 완료되었어요. 관리자 확인 후 처리돼요.',
            });
            // Sync sidebar counts
            router.refresh();
        } catch {
            toast({
                variant: 'destructive',
                description: '신청 처리 중 오류가 발생했어요.',
            });
        } finally {
            setActionLoadingId(null);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    }, [fetchFullInvitationData, profile, toast, userId, router]);

    const executeRevertToDraft = useCallback(async (inv: InvitationSummaryRecord) => {
        if (!userId) return;
        setActionLoadingId(inv.id);
        try {
            const fullData = await fetchFullInvitationData(inv.slug);
            const updatedData = {
                ...fullData,
                isApproved: false,
                isRequestingApproval: false,
            };

            await invitationService.saveInvitation(inv.slug, updatedData, userId);

            // Re-fetch invitations
            const newInvitations = await invitationService.getUserInvitations(userId);
            setInvitations(newInvitations);

            toast({ description: '수정 모드로 전환되었어요. 수정 후 다시 승인 신청을 해주세요.' });
            router.refresh();
        } catch (error) {
            console.error('Failed to revert to draft:', error);
            toast({ variant: 'destructive', description: '수정 모드 전환에 실패했어요.' });
        } finally {
            setActionLoadingId(null);
        }
    }, [userId, fetchFullInvitationData, toast, router]);

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
        toast({ description: '프로필이 저장되었어요. 다시 사용 신청을 진행해주세요.' });
    }, [router, toast]);

    const handleCreateNew = useCallback(() => {
        reset();
        setOnboardingModalOpen(true);
    }, [reset]);

    if (!userId) {
        return (
            <MyPageLayout
                profile={profile}
                isAdmin={isAdmin}
                invitationCount={0}
                requestCount={0}
            >
                <div className={styles.authCard}>
                    <div className={styles.authIcon}>
                        <Banana size={32} />
                    </div>
                    <h2 className={styles.authTitle}>로그인이 필요해요</h2>
                    <p className={styles.authDescription}>저장된 청첩장을 보려면 먼저 로그인을 해주세요.</p>
                    <Link href="/login?returnTo=/mypage" className={styles.authButton}>
                        로그인하기
                    </Link>
                </div>
            </MyPageLayout>
        );
    }

    return (
        <MyPageContent className={styles.contentContainer}>

            {invitations.length === 0 ? (
                <EmptyState
                    icon={<Banana />}
                    variant="banana"
                    title="아직 만든 청첩장이 없어요"
                    description={<>세상에서 가장 행복한 시작을 위해,<br />나만의 특별한 모바일 청첩장을 지금 바로 만들어보세요.</>}
                    action={{
                        label: '첫 청첩장 만들기',
                        href: '/builder',
                        icon: <Plus size={20} />,
                        onClick: (e) => {
                            e.preventDefault();
                            handleCreateNew();
                        }
                    }}
                />
            ) : (
                <div className={styles.invitationListSection}>
                    <MyPageHeader
                        title={MENU_TITLES.DASHBOARD}
                        actions={
                            <IconButton
                                onClick={() => handleViewModeChange(viewMode === 'grid' ? 'swiper' : 'grid')}
                                variant="clear"
                                iconSize={20}
                                className={styles.viewToggleButton}
                                aria-label={viewMode === 'grid' ? '슬라이드 보기' : '그리드 보기'}
                                name=""
                            >
                                {viewMode === 'grid' ? <GalleryHorizontal size={20} /> : <LayoutGrid size={20} />}
                            </IconButton>
                        }
                    />

                    {!isViewModeReady ? (
                        viewMode === 'grid' ? (
                            <div className={styles.cardGrid}>
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={styles.createCardWrapper}>
                                        <div className={styles.skeletonCardItem}>
                                            <Skeleton className={styles.skeletonCard ?? ''} />
                                            <div className={styles.skeletonOverlay}>
                                                <Skeleton className={styles.skeletonBadge ?? ''} />
                                                <Skeleton className={styles.skeletonTitle ?? ''} />
                                            </div>
                                        </div>
                                        <div className={styles.skeletonFooter}>
                                            <Skeleton className={styles.skeletonButton ?? ''} />
                                            <Skeleton className={styles.skeletonButton ?? ''} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.swiperView}>
                                <div className={clsx(styles.dashboardSwiper, styles.skeletonSwiper)}>
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className={styles.autoWidthSlide}>
                                            <div className={styles.swiperCardWrapper}>
                                                <div className={styles.createCardWrapper}>
                                                    <div className={styles.skeletonCardItem}>
                                                        <Skeleton className={styles.skeletonCard ?? ''} />
                                                        <div className={styles.skeletonOverlay}>
                                                            <Skeleton className={styles.skeletonBadge ?? ''} />
                                                            <Skeleton className={styles.skeletonTitle ?? ''} />
                                                        </div>
                                                    </div>
                                                    <div className={styles.skeletonFooter}>
                                                        <Skeleton className={styles.skeletonButton ?? ''} />
                                                        <Skeleton className={styles.skeletonButton ?? ''} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ) : viewMode === 'grid' ? (
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
                            </div>

                            {/* Invitation Cards */}
                            {invitations.map((inv, index) => {
                                const rejectionData = rejectedRequests.find(req => req.invitation_id === inv.id) || null;
                                return (
                                    <InvitationCard
                                        key={inv.id}
                                        index={index}
                                        invitation={inv}
                                        isAdmin={isAdmin}
                                        rejectionData={rejectionData}
                                        onEdit={handleEdit}
                                        onDelete={handleDeleteClick}
                                        onRequestApproval={handleRequestApprovalClick}
                                        onCancelRequest={handleCancelRequestClick}
                                        onRevokeApproval={handleAdminRevokeClick}
                                        onRevertToDraft={executeRevertToDraft}
                                        isLoading={actionLoadingId === inv.id}
                                        layout="grid"
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className={styles.swiperView}>
                            <Swiper
                                modules={[Pagination, Navigation]}
                                spaceBetween={16}
                                slidesPerView="auto"
                                centeredSlides={false}
                                pagination={{ clickable: true }}
                                className={styles.dashboardSwiper}
                                grabCursor={true}
                            >
                                {/* Create New Card slide */}
                                <SwiperSlide className={styles.autoWidthSlide}>
                                    <div className={styles.swiperCardWrapper}>
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
                                                    <Plus size={32} />
                                                </div>
                                                <span className={styles.createText}>새 청첩장</span>
                                            </Link>
                                        </div>
                                    </div>
                                </SwiperSlide>

                                {invitations.map((inv, index) => {
                                    const rejectionData = rejectedRequests.find(req => req.invitation_id === inv.id) || null;
                                    return (
                                        <SwiperSlide key={inv.id} className={styles.autoWidthSlide}>
                                            <div className={styles.swiperCardWrapper}>
                                                <InvitationCard
                                                    index={index}
                                                    invitation={inv}
                                                    isAdmin={isAdmin}
                                                    rejectionData={rejectionData}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDeleteClick}
                                                    onRequestApproval={handleRequestApprovalClick}
                                                    onCancelRequest={handleCancelRequestClick}
                                                    onRevokeApproval={handleAdminRevokeClick}
                                                    onRevertToDraft={executeRevertToDraft}
                                                    isLoading={actionLoadingId === inv.id}
                                                    layout="swiper"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
            {userId ? (
                <ProfileCompletionModal
                    isOpen={profileModalOpen}
                    userId={userId}
                    defaultName={profile?.full_name || ''}
                    onComplete={handleProfileComplete}
                />
            ) : null}

            <InvitationOnboardingModal
                isOpen={onboardingModalOpen}
                onClose={() => setOnboardingModalOpen(false)}
            />


            <AlertDialog
                open={confirmConfig.isOpen}
                onOpenChange={(open) => setConfirmConfig(prev => ({ ...prev, isOpen: open }))}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{confirmConfig.title}</AlertDialogTitle>
                        <AlertDialogDescription className={styles.modalDescription}>
                            {confirmConfig.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {confirmConfig.type !== 'INFO_ONLY' && (
                            <AlertDialogCancel asChild>
                                <Button
                                    variant="weak"
                                    size="lg"
                                    onClick={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
                                    disabled={!!actionLoadingId}
                                >
                                    취소
                                </Button>
                            </AlertDialogCancel>
                        )}
                        <AlertDialogAction asChild>
                            <Button
                                variant="fill"
                                size="lg"
                                loading={!!actionLoadingId}
                                disabled={!!actionLoadingId}
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent default since we handle async actions
                                    if (confirmConfig.type !== 'INFO_ONLY') {
                                        handleConfirmAction();
                                    } else {
                                        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
                                    }
                                }}
                            >
                                확인
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {rejectionTarget ? (
                <Dialog
                    open={rejectionModalOpen}
                    onOpenChange={(open) => {
                        if (!open) rejectionReason.handleClose();
                    }}
                >
                    <Dialog.Overlay />
                    <Dialog.Content>
                        <Dialog.Header title="승인 취소" />
                        <Dialog.Body>
                            <div className={styles.rejectionEditorWrapper}>
                                <RichTextEditor
                                    content={rejectionReason.reason}
                                    onChange={rejectionReason.setReason}
                                    placeholder="내용을 입력하세요…"
                                    minHeight={180}
                                />
                            </div>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button
                                variant="weak"
                                size="lg"
                                onClick={rejectionReason.handleClose}
                                disabled={!!actionLoadingId}
                            >
                                취소
                            </Button>
                            <Button
                                variant="fill"
                                size="lg"
                                loading={!!actionLoadingId}
                                disabled={rejectionReason.isSubmitDisabled}
                                onClick={rejectionReason.handleSubmit}
                            >
                                승인 취소
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog>
            ) : null}

            {/* Auto-Notification Modal */}
            {autoNotificationTarget && (
                <AlertDialog
                    open={!!autoNotificationTarget}
                    onOpenChange={(open) => {
                        if (!open) handleCloseAutoNotification();
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{autoNotificationTarget.isApproval ? '승인 완료' : parseRejection(autoNotificationTarget.rejection).title}</AlertDialogTitle>
                            <AlertDialogDescription asChild>
                                <div
                                    className={`${styles.rejectionMessageBox} ${autoNotificationTarget.isApproval ? styles.success : ''}`}
                                    dangerouslySetInnerHTML={{
                                        __html: autoNotificationTarget.isApproval
                                            ? `<strong>${autoNotificationTarget.invitation.invitation_data.mainScreen.title}</strong> 청첩장 승인이 완료되었어요!<br/>이제 자유롭게 공유할 수 있어요.`
                                            : parseRejection(autoNotificationTarget.rejection).displayReason || '내용이 없어요.'
                                    }}
                                />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction asChild>
                                <Button variant="fill" size="lg" onClick={handleCloseAutoNotification}>
                                    확인
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </MyPageContent >
    );
}
