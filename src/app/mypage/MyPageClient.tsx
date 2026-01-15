"use client";

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { invitationService } from '@/services/invitationService';
import { approvalRequestService, ApprovalRequestRecord } from '@/services/approvalRequestService';
import { Profile } from '@/services/profileService';
import { useInvitationStore, InvitationData } from '@/store/useInvitationStore';
import Header from '@/components/common/Header';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, ExternalLink, Edit2, Trash2, Loader2, FileText, MoreHorizontal, CheckCircle2, Send, PhoneCall, User, XCircle } from 'lucide-react';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/AspectRatio';


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';
import { TextField } from '@/components/builder/TextField';
import { PhoneField } from '@/components/builder/PhoneField';
import { Button } from '@/components/ui/Button';
import { isValidPhone } from '@/lib/utils';
import styles from './MyPage.module.scss';
import { clsx } from 'clsx';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/AlertDialog";

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
    const [requestDialogOpen, setRequestDialogOpen] = useState(false);
    const [requestName, setRequestName] = useState('');
    const [requestPhone, setRequestPhone] = useState('');
    const [requestTarget, setRequestTarget] = useState<InvitationRecord | null>(null);
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
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
        router.push('/builder');
    }, [router]);

    const handleDelete = useCallback(async (id: string) => {
        if (!confirm('정말로 이 청첩장을 삭제하시겠습니까?')) return;

        setActionLoading(id);
        try {
            if (isAdmin) {
                // 관리자는 전용 API 사용 (RLS 우회)
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
        }
    }, [fetchInvitations, isAdmin, toast]);

    const openRequestDialog = useCallback((inv: InvitationRecord) => {
        setRequestTarget(inv);
        // 프로필에서 이름과 전화번호 자동 채우기
        setRequestName(profile?.full_name || '');
        setRequestPhone(profile?.phone || '');
        setRequestDialogOpen(true);
    }, [profile]);

    const handleRequestSubmit = useCallback(async () => {
        if (!requestTarget || !userId) return;

        if (!requestName.trim()) {
            toast({ variant: 'destructive', description: '신청자 이름을 입력해주세요.' });
            return;
        }

        const sanitizedPhone = requestPhone.replace(/[^0-9+]/g, '');
        if (!isValidPhone(sanitizedPhone)) {
            toast({ variant: 'destructive', description: '전화번호 형식이 올바르지 않습니다.' });
            return;
        }

        setActionLoading(requestTarget.id);
        try {
            await approvalRequestService.createRequest({
                invitationId: requestTarget.id,
                invitationSlug: requestTarget.slug,
                requesterName: requestName.trim(),
                requesterPhone: sanitizedPhone,
            });

            const updatedData = {
                ...requestTarget.invitation_data,
                isRequestingApproval: true,
            };
            await invitationService.saveInvitation(requestTarget.slug, updatedData, userId);

            toast({
                description: '사용 신청이 완료되었습니다. 관리자 확인 후 처리됩니다.',
            });
            setRequestDialogOpen(false);
            setRequestTarget(null);
            await fetchInvitations();
        } catch {
            toast({
                variant: 'destructive',
                description: '신청 처리 중 오류가 발생했습니다.',
            });
        } finally {
            setActionLoading(null);
        }
    }, [fetchInvitations, requestName, requestPhone, requestTarget, toast, userId]);

    const handleCancelRequest = useCallback(async (inv: InvitationRecord) => {
        if (!confirm('승인 신청을 취소하시겠습니까?')) return;

        setActionLoading(inv.id);
        try {
            await approvalRequestService.cancelRequest(inv.id);

            // Refetch to reflect status change
            // The API updates the invitation status, so fetching invitations again will show the updated state.
            await fetchInvitations();
            await fetchApprovalRequests();

            toast({ description: '신청이 취소되었습니다.' });
        } catch {
            toast({ variant: 'destructive', description: '취소 처리에 실패했습니다.' });
        } finally {
            setActionLoading(null);
        }
    }, [fetchInvitations, fetchApprovalRequests, toast]);

    const handleApprove = useCallback(async (inv: InvitationRecord) => {
        if (!isAdmin) {
            // User Logic: Request Approval
            if (inv.invitation_data.isRequestingApproval) {
                toast({ description: '이미 승인 신청된 청첩장입니다.' });
                return;
            }

            openRequestDialog(inv);
            return;
        }

        // Admin Logic: Approve
        if (!confirm('해당 청첩장의 사용을 승인하시겠습니까?\n승인 후에는 워터마크가 제거됩니다.')) return;

        setActionLoading(inv.id);
        try {
            // Update data with approved status and clear request flag
            const updatedData = {
                ...inv.invitation_data,
                isApproved: true,
                isRequestingApproval: false
            };

            // Admin saves to the user's invitation (userId should be preserved from the record)
            await invitationService.saveInvitation(inv.slug, updatedData, inv.user_id);
            toast({
                description: '사용 승인이 완료되었습니다.',
            });
            await fetchInvitations();
            await fetchApprovalRequests();

        } catch {
            toast({
                variant: 'destructive',
                description: '승인 처리 중 오류가 발생했습니다.',
            });
        } finally {
            setActionLoading(null);
        }
    }, [fetchApprovalRequests, fetchInvitations, isAdmin, openRequestDialog, toast]);

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
                    <p className={styles.subtitle}>
                        {isAdmin ? '관리자 모드: 모든 청첩장을 관리합니다.' : '지금까지 제작한 소중한 청첩장 목록입니다.'}
                    </p>
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
                                            </div>

                                            <div className={styles.adminRight}>
                                                <div className={styles.adminMeta}>
                                                    <div className="flex items-center gap-2 mb-2 justify-end">
                                                        <Link
                                                            href={`/v/${request.invitation_slug}`}
                                                            target="_blank"
                                                            className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
                                                        >
                                                            <ExternalLink size={12} />
                                                            청첩장 보기
                                                        </Link>
                                                        <span className="text-gray-300">|</span>
                                                        <span className="text-xs">
                                                            {new Date(request.created_at).toLocaleDateString('ko-KR')} {new Date(request.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className={styles.adminActions}>
                                                    {targetInv ? (
                                                        <Button
                                                            size="sm"
                                                            className="gap-1 h-8 text-[11px] font-bold bg-banana-yellow text-amber-900 border-banana-yellow hover:bg-yellow-400"
                                                            onClick={() => handleApprove(targetInv)}
                                                            disabled={actionLoading === targetInv.id}
                                                        >
                                                            {actionLoading === targetInv.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                                                            즉시 승인
                                                        </Button>
                                                    ) : (
                                                        <span className="text-[10px] text-red-500">원본 청첩장 없음</span>
                                                    )}
                                                </div>
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
                                                    <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors outline-none active:scale-95">
                                                        <MoreHorizontal size={20} />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-32">
                                                    <DropdownMenuItem
                                                        onClick={() => handleEdit(inv)}
                                                        className="gap-2 cursor-pointer py-2.5"
                                                    >
                                                        <Edit2 size={16} className="text-gray-500" />
                                                        <span className="font-medium">수정</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            if (!isAdmin && inv.invitation_data?.isRequestingApproval) {
                                                                e.preventDefault();
                                                                setAlertDialogOpen(true);
                                                                return;
                                                            }
                                                            handleDelete(inv.id);
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
                                        <Link
                                            href={`/v/${inv.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={clsx(styles.actionButton, styles.primary)}
                                        >
                                            <ExternalLink size={16} />
                                            청첩장 확인
                                        </Link>
                                        <button
                                            type="button"
                                            className={clsx(
                                                styles.actionButton,
                                                styles.approval,
                                                inv.invitation_data?.isApproved && styles.approved,
                                                !inv.invitation_data?.isApproved && inv.invitation_data?.isRequestingApproval && !isAdmin && "bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-200"
                                            )}
                                            onClick={() => {
                                                if (inv.invitation_data?.isApproved) return;

                                                if (isAdmin) {
                                                    handleApprove(inv);
                                                } else {
                                                    if (inv.invitation_data?.isRequestingApproval) {
                                                        handleCancelRequest(inv);
                                                    } else {
                                                        handleApprove(inv);
                                                    }
                                                }
                                            }}
                                            disabled={inv.invitation_data?.isApproved || actionLoading === inv.id}
                                        >
                                            {actionLoading === inv.id ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                inv.invitation_data?.isApproved ? <CheckCircle2 size={16} /> :
                                                    isAdmin ? <CheckCircle2 size={16} /> :
                                                        inv.invitation_data?.isRequestingApproval ? <XCircle size={16} /> : <Send size={16} />
                                            )}
                                            {inv.invitation_data?.isApproved
                                                ? '승인완료'
                                                : isAdmin
                                                    ? (inv.invitation_data?.isRequestingApproval ? '승인신청옴' : '사용승인')
                                                    : (inv.invitation_data?.isRequestingApproval ? '신청취소' : '사용신청')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })()}

                <ResponsiveModal
                    open={requestDialogOpen}
                    onOpenChange={(open) => {
                        setRequestDialogOpen(open);
                        if (!open) {
                            setRequestTarget(null);
                        }
                    }}
                    title="사용 승인 신청"
                    description="신청자 이름과 연락처를 입력해주세요."
                    className={styles.requestModalContent}
                >
                    <div className={styles.requestForm}>
                        <TextField
                            placeholder="이름"
                            value={requestName}
                            onChange={(e) => setRequestName(e.target.value)}
                        />
                        <PhoneField
                            placeholder="전화번호 (예: 010-1234-5678)"
                            value={requestPhone}
                            onChange={(e) => setRequestPhone(e.target.value)}
                        />
                    </div>
                    <div className={styles.requestActions}>
                        <Button variant="ghost" onClick={() => setRequestDialogOpen(false)}>
                            취소
                        </Button>
                        <Button
                            onClick={handleRequestSubmit}
                            disabled={actionLoading === requestTarget?.id}
                        >
                            {actionLoading === requestTarget?.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                '신청하기'
                            )}
                        </Button>
                    </div>
                </ResponsiveModal>

                <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>삭제할 수 없습니다</AlertDialogTitle>
                            <AlertDialogDescription>
                                승인 신청 중인 청첩장은 삭제할 수 없습니다.<br />
                                먼저 [신청취소]를 진행해 주세요.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setAlertDialogOpen(false)}>확인</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </main>
        </div>
    );
}
