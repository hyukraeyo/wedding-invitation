"use client";

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
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
import { ViewTransitionLink } from '@/components/common/ViewTransitionLink';
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

    // ?뜉 ?섏씠吏 ?대룞 ??濡쒕뵫 ?곹깭 珥덇린??
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
            
            // ?뜉 ?덉쟾???곹깭 ?낅뜲?댄듃: DB???곗씠?곌? ?쇰? ?꾨씫?섏뿀?붾씪??珥덇린媛?INITIAL_STATE)???좎??섎룄濡???蹂묓빀??
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
                description: '泥?꺽???곗씠?곕? 遺덈윭?ㅼ? 紐삵뻽?댁슂.',
            });
        } finally {
            // ?뜉 ?섏씠吏 ?대룞???쒖옉???쒓컙??以 ??濡쒕뵫 ?곹깭 ?댁젣 (?대룞???먮┫ 寃쎌슦 ?鍮?
            // ?대룞 ???ㅼ떆 ???섏씠吏濡??뚯븘?붿쓣 ??踰꾪듉??怨꾩냽 ?뚭퀬 ?덈뒗 ?꾩긽 諛⑹?
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
                description: '??젣 以??ㅻ쪟媛 諛쒖깮?덉뼱??',
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
            toast({ description: '?좎껌??痍⑥냼?섏뿀?댁슂.' });
            // Sync sidebar counts
            router.refresh();
        } catch {
            toast({ variant: 'destructive', description: '痍⑥냼 泥섎━???ㅽ뙣?덉뼱??' });
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

        // ?뱀씤 ?湲?以묒씤 寃쎌슦 ??젣 遺덇? (?좎껌 痍⑥냼 ?좊룄)
        if (inv.invitation_data?.isRequestingApproval && !isRejected && !isRevoked) {
            setConfirmConfig({
                isOpen: true,
                type: 'INFO_ONLY',
                title: 'Cannot delete now',
                description: <>
                    ?뱀씤 ?좎껌 以묒씤 泥?꺽?μ? ??젣?????놁뼱??<br /><br />
                    ?섎떒??<strong>[?좎껌痍⑥냼]</strong> 踰꾪듉???뚮윭 ?곹깭瑜?蹂寃쏀븳 ???ㅼ떆 ?쒕룄??二쇱꽭??
                </>,
                targetId: null,
            });
            return;
        }

        // ?뱀씤 ?꾨즺??寃쎌슦 (媛뺣젰??寃쎄퀬? ?④퍡 ??젣 ?덉슜)
        if (inv.invitation_data?.isApproved && !isRejected && !isRevoked) {
            setConfirmConfig({
                isOpen: true,
                type: 'DELETE',
                title: '泥?꺽????젣',
                description: (
                    <>
                        ?뺣쭚濡???泥?꺽?μ쓣 ??젣?좉퉴??<br />
                        <span className={styles.deleteWarning}>二쇱쓽: ?뱀씤 ?꾨즺??泥?꺽?μ쓣 ??젣?섎㈃ 怨듭쑀??留곹겕濡????댁긽 ?묒냽?????놁뼱??</span>
                        <br />
                        ??젣???곗씠?곕뒗 蹂듦뎄?????놁뼱??
                    </>
                ),
                targetId: inv.id,
            });
            return;
        }

        // 嫄곗젅 ?먮뒗 痍⑥냼??寃쎌슦
        if (isRejected || isRevoked) {
            const statusText = isRevoked ? '?뱀씤 痍⑥냼' : '?뱀씤 嫄곗젅';
            setConfirmConfig({
                isOpen: true,
                type: 'DELETE',
                title: '泥?꺽????젣',
                description: (
                    <>
                        ?뺣쭚濡???泥?꺽?μ쓣 ??젣?좉퉴??<br />
                        ?꾩옱 ??泥?꺽?μ? <strong>{statusText}</strong> ?곹깭?덉슂.<br /><br />
                        ??젣???곗씠?곕뒗 蹂듦뎄?????놁뼱??
                    </>
                ),
                targetId: inv.id,
            });
            return;
        }

        // ?쇰컲 ?곹깭 (?묒꽦 以?
        setConfirmConfig({
            isOpen: true,
            type: 'DELETE',
            title: '泥?꺽????젣',
            description: '?뺣쭚濡???泥?꺽?μ쓣 ??젣?좉퉴?? ??젣???곗씠?곕뒗 蹂듦뎄?????놁뼱??',
            targetId: inv.id,
        });
    }, [rejectedRequests]);

    const handleCancelRequestClick = useCallback((inv: InvitationSummaryRecord) => {
        setConfirmConfig({
            isOpen: true,
            type: 'CANCEL_REQUEST',
            title: '?뱀씤 ?좎껌 痍⑥냼',
            description: '?뱀씤 ?좎껌??痍⑥냼?좉퉴??',
            targetId: inv.id,
        });
    }, []);

    const isProfileComplete = useMemo(() => {
        return Boolean(profile?.full_name && profile?.phone);
    }, [profile]);

    const handleRequestApprovalClick = useCallback((inv: InvitationSummaryRecord) => {
        if (inv.invitation_data.isRequestingApproval) {
            toast({ description: '?대? ?뱀씤 ?좎껌??泥?꺽?μ씠?먯슂.' });
            return;
        }

        if (isProfileComplete) {
            setConfirmConfig({
                isOpen: true,
                type: 'REQUEST_APPROVAL',
                title: '?뱀씤 ?좎껌',
                description: (
                    <>
                        <strong>{profile?.full_name}</strong>({profile?.phone}) ?섏쑝濡??좎껌?댁슂.<br />
                        ?좎껌 ??愿由ъ옄 ?뺤씤 ?덉감媛 吏꾪뻾?⑸땲??
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
                description: '?ъ슜 ?좎껌???꾨즺?섏뿀?댁슂. 愿由ъ옄 ?뺤씤 ??泥섎━?쇱슂.',
            });
            // Sync sidebar counts
            router.refresh();
        } catch {
            toast({
                variant: 'destructive',
                description: '?좎껌 泥섎━ 以??ㅻ쪟媛 諛쒖깮?덉뼱??',
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

            toast({ description: '?섏젙 紐⑤뱶濡??꾪솚?섏뿀?댁슂. ?섏젙 ???ㅼ떆 ?뱀씤 ?좎껌???댁＜?몄슂.' });
            router.refresh();
        } catch (error) {
            console.error('Failed to revert to draft:', error);
            toast({ variant: 'destructive', description: '?섏젙 紐⑤뱶 ?꾪솚???ㅽ뙣?덉뼱??' });
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
        toast({ description: '?꾨줈?꾩씠 ??λ릺?덉뼱?? ?ㅼ떆 ?ъ슜 ?좎껌??吏꾪뻾?댁＜?몄슂.' });
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
                    <h2 className={styles.authTitle}>濡쒓렇?몄씠 ?꾩슂?댁슂</h2>
                    <p className={styles.authDescription}>??λ맂 泥?꺽?μ쓣 蹂대젮硫?癒쇱? 濡쒓렇?몄쓣 ?댁＜?몄슂.</p>
                    <ViewTransitionLink href="/login?returnTo=/mypage" className={styles.authButton}>
                        濡쒓렇?명븯湲?
                    </ViewTransitionLink>
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
                    title="No invitations yet"
                    description={<>Create your first invitation to get started.</>}
                    action={{
                        label: 'Create invitation',
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
                                aria-label={viewMode === 'grid' ? '?щ씪?대뱶 蹂닿린' : '洹몃━??蹂닿린'}
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
                                <ViewTransitionLink
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
                                    <span className={styles.createText}>Create invitation</span>
                                </ViewTransitionLink>
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
                                            <ViewTransitionLink
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
                                                <span className={styles.createText}>Create invitation</span>
                                            </ViewTransitionLink>
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
                                    痍⑥냼
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
                                ?뺤씤
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
                        <Dialog.Header title="?뱀씤 痍⑥냼" />
                        <Dialog.Body>
                            <div className={styles.rejectionEditorWrapper}>
                                <RichTextEditor
                                    content={rejectionReason.reason}
                                    onChange={rejectionReason.setReason}
                                    placeholder="Enter reason"
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
                                痍⑥냼
                            </Button>
                            <Button
                                variant="fill"
                                size="lg"
                                loading={!!actionLoadingId}
                                disabled={rejectionReason.isSubmitDisabled}
                                onClick={rejectionReason.handleSubmit}
                            >
                                ?뱀씤 痍⑥냼
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
                            <AlertDialogTitle>{autoNotificationTarget.isApproval ? '?뱀씤 ?꾨즺' : parseRejection(autoNotificationTarget.rejection).title}</AlertDialogTitle>
                            <AlertDialogDescription asChild>
                                <div
                                    className={`${styles.rejectionMessageBox} ${autoNotificationTarget.isApproval ? styles.success : ''}`}
                                    dangerouslySetInnerHTML={{
                                        __html: autoNotificationTarget.isApproval
                                            ? `<strong>${autoNotificationTarget.invitation.invitation_data.mainScreen.title}</strong> 泥?꺽???뱀씤???꾨즺?섏뿀?댁슂!<br/>?댁젣 ?먯쑀濡?쾶 怨듭쑀?????덉뼱??`
                                            : parseRejection(autoNotificationTarget.rejection).displayReason || '?댁슜???놁뼱??'
                                    }}
                                />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction asChild>
                                <Button variant="fill" size="lg" onClick={handleCloseAutoNotification}>
                                    ?뺤씤
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </MyPageContent >
    );
}


