"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { invitationService } from '@/services/invitationService';
import { approvalRequestService, ApprovalRequestRecord } from '@/services/approvalRequestService';
import { useInvitationStore, InvitationData } from '@/store/useInvitationStore';
import Header from '@/components/common/Header';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, ExternalLink, Edit2, Trash2, Loader2, FileText, MoreHorizontal, CheckCircle2, Send, PhoneCall, User } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';
import { TextField } from '@/components/builder/TextField';
import { Button } from '@/components/ui/Button';
import { isValidPhone } from '@/lib/utils';

import { useRouter } from 'next/navigation';
import styles from './MyPage.module.scss';
import { clsx } from 'clsx';

interface InvitationRecord {
    id: string;
    slug: string;
    invitation_data: InvitationData;
    updated_at: string;
    user_id: string;
}

export default function MyPage() {
    const router = useRouter();
    const { user, loading: authLoading, isAdmin, profile } = useAuth();
    const [invitations, setInvitations] = useState<InvitationRecord[]>([]);
    const [approvalRequests, setApprovalRequests] = useState<ApprovalRequestRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [requestDialogOpen, setRequestDialogOpen] = useState(false);
    const [requestName, setRequestName] = useState('');
    const [requestPhone, setRequestPhone] = useState('');
    const [requestTarget, setRequestTarget] = useState<InvitationRecord | null>(null);
    const reset = useInvitationStore(state => state.reset);
    const { toast } = useToast();


    const fetchInvitations = useCallback(async () => {
        if (!user) return;
        try {
            const data = isAdmin
                ? await invitationService.getAllInvitations()
                : await invitationService.getUserInvitations(user.id);
            setInvitations(data as InvitationRecord[]);
        } catch {
            // Silent fail - user can refresh
        } finally {
            setLoading(false);
        }
    }, [user, isAdmin]);

    const fetchApprovalRequests = useCallback(async () => {
        if (!user || !isAdmin) return;
        try {
            const data = await approvalRequestService.getAllRequests();
            setApprovalRequests(data);
        } catch {
            // Silent fail
        }
    }, [user, isAdmin]);


    useEffect(() => {
        if (user) {
            fetchInvitations();
            fetchApprovalRequests();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading, fetchInvitations, fetchApprovalRequests]);


    const handleEdit = useCallback((inv: { invitation_data: InvitationData; slug: string }) => {
        useInvitationStore.setState(inv.invitation_data);
        useInvitationStore.getState().setSlug(inv.slug);
        router.push('/builder');
    }, [router]);

    const handleDelete = useCallback(async (id: string) => {
        if (!confirm('정말로 이 청첩장을 삭제하시겠습니까?')) return;

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
        }
    }, [fetchInvitations, toast]);

    const openRequestDialog = useCallback((inv: InvitationRecord) => {
        setRequestTarget(inv);
        // 프로필에서 이름과 전화번호 자동 채우기
        setRequestName(profile?.full_name || '');
        setRequestPhone(profile?.phone || '');
        setRequestDialogOpen(true);
    }, [profile]);

    const handleRequestSubmit = useCallback(async () => {
        if (!requestTarget || !user) return;

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
                userId: user.id,
            });

            const updatedData = {
                ...requestTarget.invitation_data,
                isRequestingApproval: true,
            };
            await invitationService.saveInvitation(requestTarget.slug, updatedData, user.id);

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
    }, [fetchInvitations, requestName, requestPhone, requestTarget, toast, user]);

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

    if (authLoading || loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner} />
            </div>
        );
    }

    if (!user) {
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
                                {approvalRequests.map(request => (
                                    <div key={request.id} className={styles.adminItem}>
                                        <div className={styles.adminPrimary}>
                                            <div className={styles.adminName}>
                                                <User size={16} />
                                                <span>{request.requester_name}</span>
                                            </div>
                                            <div className={styles.adminPhone}>
                                                <PhoneCall size={16} />
                                                <span>{request.requester_phone}</span>
                                            </div>
                                        </div>
                                        <div className={styles.adminMeta}>
                                            {new Date(request.created_at).toLocaleDateString('ko-KR')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {invitations.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.iconWrapper}><FileText /></div>
                        <p className={styles.emptyTitle}>아직 저장된 청첩장이 없습니다.</p>
                        <p className={styles.emptyDescription}>빌더에서 청첩장을 만들고 &apos;저장하기&apos;를 눌러보세요!</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {invitations.map((inv) => (
                            <div key={inv.id} className={styles.card}>

                                <div className={styles.cardBody}>
                                    <div className={styles.cardHeader}>
                                        <div>
                                            <h3 className={styles.cardTitle}>
                                                {inv.invitation_data?.mainScreen?.title || '제목 없는 청첩장'}
                                            </h3>
                                            <p className={styles.cardDate}>
                                                {isAdmin && <span className="block text-xs text-blue-600 mb-1">User: {inv.user_id?.slice(0, 8)}...</span>}
                                                수정: {new Date(inv.updated_at).toLocaleDateString('ko-KR')}
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
                                                    onClick={() => handleDelete(inv.id)}
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
                                    <a
                                        href={`/v/${encodeURIComponent(inv.slug)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={clsx(styles.actionButton, styles.primary)}
                                    >
                                        <ExternalLink size={16} />
                                        청첩장 확인
                                    </a>
                                    <button
                                        type="button"
                                        className={clsx(
                                            styles.actionButton,
                                            styles.approval,
                                            inv.invitation_data?.isApproved && styles.approved,
                                            !inv.invitation_data?.isApproved && inv.invitation_data?.isRequestingApproval && !isAdmin && "bg-gray-100 text-gray-500 cursor-not-allowed"
                                        )}
                                        onClick={() => handleApprove(inv)}
                                        disabled={inv.invitation_data?.isApproved || (inv.invitation_data?.isRequestingApproval && !isAdmin) || actionLoading === inv.id}
                                    >
                                        {actionLoading === inv.id ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            inv.invitation_data?.isApproved ? <CheckCircle2 size={16} /> :
                                                isAdmin ? <CheckCircle2 size={16} /> :
                                                    inv.invitation_data?.isRequestingApproval ? <CheckCircle2 size={16} /> : <Send size={16} />
                                        )}
                                        {inv.invitation_data?.isApproved
                                            ? '승인완료'
                                            : isAdmin
                                                ? (inv.invitation_data?.isRequestingApproval ? '승인신청옴' : '사용승인')
                                                : (inv.invitation_data?.isRequestingApproval ? '신청완료' : '사용신청')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

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
                        <TextField
                            placeholder="전화번호 (예: 01012345678)"
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
            </main>
        </div>
    );

}
