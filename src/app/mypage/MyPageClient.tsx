"use client";

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { invitationService } from '@/services/invitationService';
import { approvalRequestService, ApprovalRequestRecord } from '@/services/approvalRequestService';
import { Profile } from '@/services/profileService';
import { useInvitationStore, InvitationData } from '@/store/useInvitationStore';
import Header from '@/components/common/Header';
import { IconButton } from '@/components/ui/icon-button';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, ExternalLink, Edit2, Trash2, Loader2, FileText, MoreHorizontal, CheckCircle2, Send, PhoneCall, User, XCircle } from 'lucide-react';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';

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

export interface InvitationRecord {
    id: string;
    slug: string;
    invitation_data: InvitationData;
    updated_at: string;
    user_id: string;
}

export interface MyPageClientProps {
    userId: string | null;
    isAdmin: boolean;
    profile: Profile | null;
    initialInvitations: InvitationRecord[];
    initialApprovalRequests: ApprovalRequestRecord[];
}

type ConfirmActionType = 'DELETE' | 'CANCEL_REQUEST' | 'APPROVE' | 'REQUEST_APPROVAL' | 'INFO_ONLY';

interface ConfirmConfig {
    isOpen: boolean;
    type: ConfirmActionType;
    title: string;
    description: React.ReactNode;
    targetId: string | null;
    targetRecord?: InvitationRecord | null;
}

export default function MyPageClient({
    userId,
    isAdmin,
    profile,
    initialInvitations,
    initialApprovalRequests,
}: MyPageClientProps) {
    const router = useRouter();
    const [invitations, setInvitations] = useState<InvitationRecord[]>(initialInvitations);
    const [approvalRequests, setApprovalRequests] = useState<ApprovalRequestRecord[]>(initialApprovalRequests);
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
            const data = isAdmin
                ? await invitationService.getAdminInvitations()
                : await invitationService.getUserInvitations(userId);
            setInvitations(data as InvitationRecord[]);
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

    const handleEdit = useCallback((inv: { invitation_data: InvitationData; slug: string }) => {
        useInvitationStore.setState(inv.invitation_data);
        useInvitationStore.getState().setSlug(inv.slug);
        router.push('/builder?mode=edit');
    }, [router]);

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
            await fetchInvitations();
            await fetchApprovalRequests();
            toast({ description: '신청이 취소되었습니다.' });
        } catch {
            toast({ variant: 'destructive', description: '취소 처리에 실패했습니다.' });
        } finally {
            setActionLoading(null);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    }, [fetchInvitations, fetchApprovalRequests, toast]);

    const executeApprove = useCallback(async (inv: InvitationRecord) => {
        setActionLoading(inv.id);
        try {
            const updatedData = {
                ...inv.invitation_data,
                isApproved: true,
                isRequestingApproval: false
            };
            await invitationService.saveInvitation(inv.slug, updatedData, inv.user_id);
            toast({ description: '사용 승인이 완료되었습니다.' });
            await fetchInvitations();
            await fetchApprovalRequests();
        } catch {
            toast({ variant: 'destructive', description: '승인 처리 중 오류가 발생했습니다.', });
        } finally {
            setActionLoading(null);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    }, [fetchApprovalRequests, fetchInvitations, toast]);


    // --- Action Initiators (Open Dialog) ---

    const handleDeleteClick = useCallback((inv: InvitationRecord) => {
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

    const handleCancelRequestClick = useCallback((inv: InvitationRecord) => {
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

    const handleApproveClick = useCallback((inv: InvitationRecord) => {
        if (!isAdmin) {
            // User Logic
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
            return;
        }

        // Admin Logic
        setConfirmConfig({
            isOpen: true,
            type: 'APPROVE',
            title: '청첩장 승인',
            description: <>해당 청첩장의 사용을 승인하시겠습니까?<br />승인 후에는 워터마크가 제거됩니다.</>,
            targetId: inv.id,
            targetRecord: inv,
        });
    }, [isAdmin, toast, isProfileComplete, profile]);


    // Execute approval request using profile data
    const executeRequestApproval = useCallback(async (inv: InvitationRecord) => {
        if (!userId || !profile?.full_name || !profile?.phone) return;

        setActionLoading(inv.id);
        try {
            await approvalRequestService.createRequest({
                invitationId: inv.id,
                invitationSlug: inv.slug,
                requesterName: profile.full_name,
                requesterPhone: profile.phone,
            });

            const updatedData = {
                ...inv.invitation_data,
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
    }, [fetchInvitations, profile, toast, userId]);

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
                <div className={styles.header}>
                    <h1 className={styles.title}>나의 청첩장</h1>
                </div>

                {/* 1. Admin Approval Queue - Top Section */}
                {isAdmin && (
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
                                                        onClick={() => handleApproveClick(targetInv)}
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
                )}



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
                        <div className={styles.grid}>
                            {myInvitations.map((inv) => (
                                <div key={inv.id} className={styles.card}>
                                    {/* Card Image */}
                                    <div className="w-full bg-gray-50 border-b border-gray-100">
                                        <AspectRatio ratio={4 / 3}>
                                            {inv.invitation_data?.imageUrl ? (
                                                <Image
                                                    src={inv.invitation_data.imageUrl}
                                                    alt="Main Screen"
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-gray-300 bg-gray-50">
                                                    <FileText size={48} strokeWidth={1} />
                                                </div>
                                            )}
                                        </AspectRatio>
                                    </div>

                                    <div className={styles.cardBody}>
                                        <div className={styles.cardHeader}>
                                            <div>
                                                <h3 className={styles.cardTitle}>
                                                    {inv.invitation_data?.mainScreen?.title || '제목 없는 청첩장'}
                                                </h3>
                                                <p className={styles.cardDate}>
                                                    {isAdmin && <span className="block text-xs text-blue-600 mb-1 font-mono">My ID: {userId?.slice(0, 8)}</span>}
                                                    수정: {new Date(inv.updated_at).toLocaleDateString('ko-KR')} {new Date(inv.updated_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                </p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <IconButton
                                                        icon={MoreHorizontal}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-400 hover:text-gray-600"
                                                    />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-32">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            if (!isAdmin && inv.invitation_data?.isRequestingApproval) {
                                                                setConfirmConfig({
                                                                    isOpen: true,
                                                                    type: 'INFO_ONLY',
                                                                    title: '수정할 수 없습니다',
                                                                    description: <>승인 신청 중인 청첩장은 수정할 수 없습니다.<br />먼저 [신청취소]를 진행해 주세요.</>,
                                                                    targetId: null,
                                                                });
                                                                return;
                                                            }
                                                            handleEdit(inv);
                                                        }}
                                                        className={clsx(
                                                            "gap-2 cursor-pointer py-2.5",
                                                            !isAdmin && inv.invitation_data?.isRequestingApproval && "opacity-50 cursor-not-allowed"
                                                        )}
                                                    >
                                                        <Edit2 size={16} className="text-gray-500" />
                                                        <span className="font-medium">수정</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteClick(inv);
                                                        }}
                                                        disabled={actionLoading === inv.id}
                                                        className="gap-2 cursor-pointer py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50"
                                                    >
                                                        {actionLoading === inv.id ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={16} />
                                                        )}
                                                        <span className="font-medium">삭제</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className={styles.cardMeta}>
                                            <div className={styles.metaItem}>
                                                <Calendar />
                                                <span>{inv.invitation_data?.date || '날짜 미지정'}</span>
                                            </div>
                                            <div className={styles.metaItem}>
                                                <MapPin />
                                                <span>{inv.invitation_data?.location || '장소 미지정'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <Button
                                            variant="line"
                                            asChild
                                            className="flex-1"
                                        >
                                            <Link
                                                href={`/v/${inv.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalLink size={16} />
                                                청첩장 확인
                                            </Link>
                                        </Button>
                                        <Button
                                            variant={inv.invitation_data?.isApproved ? "solid" : "outline"}
                                            className={clsx(
                                                "flex-1 gap-2 h-12",
                                                inv.invitation_data?.isApproved && "bg-green-50 text-green-600 border-green-200 hover:bg-green-50 animate-none",
                                                !inv.invitation_data?.isApproved && inv.invitation_data?.isRequestingApproval && !isAdmin && "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-50"
                                            )}
                                            onClick={() => {
                                                if (inv.invitation_data?.isApproved) return;
                                                if (isAdmin) {
                                                    handleApproveClick(inv);
                                                } else {
                                                    if (inv.invitation_data?.isRequestingApproval) {
                                                        handleCancelRequestClick(inv);
                                                    } else {
                                                        handleApproveClick(inv);
                                                    }
                                                }
                                            }}
                                            loading={actionLoading === inv.id}
                                            disabled={inv.invitation_data?.isApproved && !isAdmin}
                                        >
                                            {inv.invitation_data?.isApproved ? <CheckCircle2 size={16} /> :
                                                isAdmin ? <CheckCircle2 size={16} /> :
                                                    inv.invitation_data?.isRequestingApproval ? <XCircle size={16} /> : <Send size={16} />}
                                            {inv.invitation_data?.isApproved
                                                ? '승인완료'
                                                : isAdmin
                                                    ? (inv.invitation_data?.isRequestingApproval ? '승인신청옴' : '사용승인')
                                                    : (inv.invitation_data?.isRequestingApproval ? '신청취소' : '사용신청')}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })()}

                {/* Profile Completion Modal - for users with incomplete profile */}
                {userId && (
                    <ProfileCompletionModal
                        isOpen={profileModalOpen}
                        userId={userId}
                        defaultName={profile?.full_name || ''}
                        onComplete={handleProfileComplete}
                    />
                )}

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
                />
            </main>
        </div>
    );
}
