"use client";

import React, { useState, useCallback } from 'react';
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
import { ExternalLink, Edit2, Trash2, Banana, FileText, MoreHorizontal, CheckCircle2, Send, PhoneCall, User, XCircle, BarChart2, Share, Eye, Pencil } from 'lucide-react';
import Image from 'next/image';


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ProfileCompletionModal from '@/components/auth/ProfileCompletionModal';
import { Button } from '@/components/ui/button';
import styles from './MyPage.module.scss';
import { clsx } from 'clsx';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';

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

type ConfirmActionType = 'DELETE' | 'CANCEL_REQUEST' | 'APPROVE' | 'REQUEST_APPROVAL' | 'INFO_ONLY';

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
    const isProfileComplete = profile?.full_name && profile?.phone;

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
        } else if (type === 'REQUEST_APPROVAL' && targetRecord) {
            executeRequestApproval(targetRecord);
        }
    }, [confirmConfig, executeDelete, executeCancelRequest, executeApprove, executeRequestApproval]);

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
            <div className={styles.authContainer}>
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
                <h1 className="sr-only">마이페이지</h1>

                {/* 1. Admin Approval Queue - Top Section */}
                {isAdmin ? (
                    <section className={styles.adminSection}>
                        <div className={styles.adminSectionHeader}>
                            <div>
                                <h2 className={styles.adminTitle}>신청한 청첩장</h2>
                                <p className={styles.adminSubtitle}>사용 승인 신청 목록입니다.</p>
                            </div>
                            <span className={styles.adminCount}>{approvalRequests.length}</span>
                        </div>
                        {approvalRequests.length === 0 ? (
                            <div className={styles.adminEmpty}>현재 승인 신청이 없습니다.</div>
                        ) : (
                            <div className={styles.adminList}>
                                {approvalRequests.map(request => {
                                    const targetInv = invitations.find(inv => inv.id === request.invitation_id);
                                    return (
                                        <div key={request.id} className={styles.adminItem}>
                                            <div className={styles.adminPrimary}>
                                                <div className={styles.adminName}>
                                                    <User size={16} />
                                                    <span>{request.requester_name}</span>
                                                </div>
                                                <div className={styles.adminPhone}>
                                                    <PhoneCall size={16} />
                                                    <a href={`tel:${request.requester_phone}`} className="hover:underline">
                                                        {request.requester_phone}
                                                    </a>
                                                </div>
                                                <div className={styles.adminMeta}>
                                                    <Link
                                                        href={`/v/${request.invitation_slug}`}
                                                        target="_blank"
                                                        className="flex items-center gap-1 text-blue-500 hover:underline"
                                                    >
                                                        <ExternalLink size={12} />
                                                        청첩장 보기
                                                    </Link>
                                                    <span className="text-gray-300">•</span>
                                                    <span>
                                                        {new Date(request.created_at).toLocaleDateString('ko-KR')} {new Date(request.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={styles.adminActions}>
                                                {targetInv ? (
                                                    <Button
                                                        size="sm"
                                                        className="gap-1.5 h-9 text-sm font-bold bg-banana-yellow text-amber-900 border-banana-yellow hover:bg-yellow-400"
                                                        onClick={() => handleAdminApproveClick(targetInv)}
                                                        disabled={actionLoading === targetInv.id}
                                                        loading={actionLoading === targetInv.id}
                                                    >
                                                        <CheckCircle2 size={14} />
                                                        즉시 승인
                                                    </Button>
                                                ) : (
                                                    <span className="text-xs text-red-500 py-2">원본 청첩장 없음</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                ) : null}



                {(() => {
                    const myInvitations = isAdmin
                        ? invitations.filter(inv => inv.user_id === userId)
                        : invitations;

                    if (myInvitations.length === 0) {
                        return (
                            <div className={styles.emptyState}>
                                <div className={styles.iconWrapper}><FileText /></div>
                                <p className={styles.emptyTitle}>아직 저장된 청첩장이 없습니다.</p>
                                <p className={styles.emptyDescription}>빌더에서 청첩장을 만들고 &apos;저장하기&apos;를 눌러보세요!</p>
                            </div>
                        );
                    }

                    return (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-20">
                            {myInvitations.map((inv, index) => (
                                <div key={inv.id} className="group relative aspect-[9/16] w-full overflow-hidden rounded-[30px] bg-gray-100 shadow-sm transition-all hover:shadow-lg">
                                    {/* 1. Background Image Layer */}
                                    <div className="absolute inset-0 h-full w-full">
                                        {(() => {
                                            // Priority logic: first 4 images are eager loaded (LCP optimization)
                                            const isPriority = index < 4;
                                            const imageSrc = inv.invitation_data?.mainScreen?.image || inv.invitation_data?.imageUrl || inv.invitation_data?.gallery?.[0];

                                            if (imageSrc) {
                                                return (
                                                    <Image
                                                        src={imageSrc}
                                                        alt="Cover"
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        priority={isPriority}
                                                        loading={isPriority ? "eager" : "lazy"}
                                                    />
                                                );
                                            }
                                            return (
                                                <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 text-gray-300">
                                                    <FileText size={48} strokeWidth={1} />
                                                </div>
                                            );
                                        })()}
                                        <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/30" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                                    </div>

                                    {/* 2. Content Layer */}
                                    <div className="absolute inset-0 flex flex-col justify-between p-5 pointer-events-none">
                                        {/* Header: Status Badge */}
                                        <div className="flex justify-between items-start pointer-events-auto">
                                            <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-gray-800 backdrop-blur-md shadow-sm">
                                                {inv.invitation_data?.isApproved ? (
                                                    <>
                                                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                                        <span>승인 완료</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                                                        <span>샘플 이용중</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Middle: Title */}
                                        <div className="mb-14 px-1 pointer-events-auto">
                                            <h3 className="break-keep text-2xl font-bold leading-tight text-white drop-shadow-md">
                                                {inv.invitation_data?.mainScreen?.title || '제목없음'}
                                            </h3>
                                            <p className="mt-1 text-xs text-white/80 font-medium">
                                                {new Date(inv.updated_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 3. Interaction Layer (Bottom Buttons) */}
                                    <div className="absolute bottom-5 left-4 right-4 z-20 flex items-center gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-transform active:scale-95 hover:bg-white text-gray-700">
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side="top" align="start" className="w-[240px] p-3 rounded-[24px] border border-gray-100/50 shadow-xl bg-white/95 backdrop-blur-md mb-2">
                                                {/* Top Grid: Stats & Share */}
                                                <div className="grid grid-cols-2 gap-2 mb-3">
                                                    <div
                                                        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors active:scale-95"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toast({ description: "통계 기능은 준비 중입니다." });
                                                        }}
                                                    >
                                                        <BarChart2 className="w-6 h-6 mb-2 text-gray-600" strokeWidth={1.5} />
                                                        <span className="text-[13px] text-gray-600 font-medium tracking-tight">관리·통계</span>
                                                    </div>
                                                    <div
                                                        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors active:scale-95"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const url = `${window.location.origin}/v/${inv.slug}`;
                                                            navigator.clipboard.writeText(url);
                                                            toast({ title: "링크 복사 완료", description: "청첩장 주소가 복사되었습니다." });
                                                        }}
                                                    >
                                                        <Share className="w-6 h-6 mb-2 text-gray-600" strokeWidth={1.5} />
                                                        <span className="text-[13px] text-gray-600 font-medium tracking-tight">공유하기</span>
                                                    </div>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="flex flex-col gap-1">
                                                    <DropdownMenuItem
                                                        asChild
                                                        className="flex w-full items-center justify-between cursor-pointer px-3 py-3 rounded-xl transition-colors hover:bg-gray-50 focus:bg-gray-50 outline-none"
                                                    >
                                                        <Link
                                                            href={`/v/${inv.slug}`}
                                                            target="_blank"
                                                            className="w-full flex items-center justify-between"
                                                        >
                                                            <span className="text-[15px] font-medium text-gray-700">청첩장 보기</span>
                                                            <Eye size={18} className="text-gray-400" />
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!isAdmin && inv.invitation_data?.isRequestingApproval) {
                                                                toast({ variant: "destructive", description: "승인 심사 중에는 수정할 수 없습니다." });
                                                                return;
                                                            }
                                                            handleEdit(inv);
                                                        }}
                                                        className="flex w-full items-center justify-between cursor-pointer px-3 py-3 rounded-xl transition-colors hover:bg-gray-50 focus:bg-gray-50 outline-none"
                                                    >
                                                        <span className="text-[15px] font-medium text-gray-700">청첩장 편집하기</span>
                                                        <Edit2 size={18} className="text-gray-400" />
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toast({ description: "제목 변경 기능은 준비 중입니다." });
                                                        }}
                                                        className="flex w-full items-center justify-between cursor-pointer px-3 py-3 rounded-xl transition-colors hover:bg-gray-50 focus:bg-gray-50 outline-none"
                                                    >
                                                        <span className="text-[15px] font-medium text-gray-700">프로젝트 제목변경</span>
                                                        <Pencil size={18} className="text-gray-400" />
                                                    </DropdownMenuItem>

                                                    <div className="h-px bg-gray-100 my-1 mx-2" />

                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setTimeout(() => handleDeleteClick(inv), 0);
                                                        }}
                                                        className="flex w-full items-center justify-between cursor-pointer px-3 py-3 rounded-xl transition-colors hover:bg-red-50 focus:bg-red-50 outline-none group/delete"
                                                    >
                                                        <span className="text-[15px] font-medium text-red-500 group-hover/delete:text-red-600">삭제하기</span>
                                                        <Trash2 size={18} className="text-red-400 group-hover/delete:text-red-500" />
                                                    </DropdownMenuItem>
                                                </div>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                // Edit Logic
                                                if (!isAdmin && inv.invitation_data?.isRequestingApproval) {
                                                    setConfirmConfig({
                                                        isOpen: true,
                                                        type: 'INFO_ONLY',
                                                        title: '수정 불가',
                                                        description: '승인 심사 중에는 수정할 수 없습니다.',
                                                        targetId: null
                                                    });
                                                    return;
                                                }
                                                void handleEdit(inv);
                                            }}
                                            className="flex h-11 flex-1 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-sm font-bold text-gray-800 shadow-lg transition-transform active:scale-95 hover:bg-white"
                                        >
                                            편집하기
                                        </button>

                                        <Button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (inv.invitation_data?.isApproved) return;
                                                const isMine = inv.user_id === userId;
                                                const showAdminActions = isAdmin && !isMine;

                                                if (showAdminActions) {
                                                    handleAdminApproveClick(inv);
                                                } else {
                                                    if (inv.invitation_data?.isRequestingApproval) {
                                                        handleCancelRequestClick(inv);
                                                    } else {
                                                        handleRequestApprovalClick(inv);
                                                    }
                                                }
                                            }}
                                            loading={actionLoading === inv.id}
                                            className={clsx(
                                                "flex h-11 flex-1 items-center justify-center rounded-full text-sm font-bold shadow-lg transition-transform active:scale-95 border-0",
                                                inv.invitation_data?.isApproved
                                                    ? "bg-green-500 hover:bg-green-600 text-white cursor-default"
                                                    : "bg-[#FBC02D] hover:bg-[#F9A825] text-gray-900" // Banana Yellow
                                            )}
                                        >
                                            {(() => {
                                                if (inv.invitation_data?.isApproved) return '승인완료';
                                                const isMine = inv.user_id === userId;
                                                const showAdminActions = isAdmin && !isMine;
                                                if (showAdminActions) return inv.invitation_data?.isRequestingApproval ? '승인하기' : '사용승인';
                                                return inv.invitation_data?.isRequestingApproval ? '신청취소' : '사용승인';
                                            })()}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })()}

                {/* Profile Completion Modal - for users with incomplete profile */}
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
