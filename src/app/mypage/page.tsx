"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { invitationService } from '@/services/invitationService';
import { useInvitationStore, InvitationData } from '@/store/useInvitationStore';
import Header from '@/components/common/Header';
import { Calendar, MapPin, ExternalLink, Edit2, Trash2, Loader2, FileText } from 'lucide-react';
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
    const { user, loading: authLoading } = useAuth();
    const [invitations, setInvitations] = useState<InvitationRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const reset = useInvitationStore(state => state.reset);

    const fetchInvitations = useCallback(async () => {
        if (!user) return;
        try {
            const data = await invitationService.getUserInvitations(user.id);
            setInvitations(data as InvitationRecord[]);
        } catch {
            // Silent fail - user can refresh
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) fetchInvitations();
        else if (!authLoading) setLoading(false);
    }, [user, authLoading, fetchInvitations]);

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
            alert('삭제 중 오류가 발생했습니다.');
        } finally {
            setActionLoading(null);
        }
    }, [fetchInvitations]);

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
                    <p className={styles.subtitle}>지금까지 제작한 소중한 청첩장 목록입니다.</p>
                </div>

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
                                                수정: {new Date(inv.updated_at).toLocaleDateString('ko-KR')}
                                            </p>
                                        </div>
                                        <span className={styles.statusBadge}>저장됨</span>
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
                                        className={clsx(styles.actionButton, styles.primary)}
                                    >
                                        <ExternalLink size={14} />
                                        보기
                                    </Link>
                                    <button
                                        onClick={() => handleEdit(inv)}
                                        className={clsx(styles.actionButton, styles.icon)}
                                        title="수정"
                                    >
                                        <Edit2 />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(inv.id)}
                                        disabled={actionLoading === inv.id}
                                        className={clsx(styles.actionButton, styles.icon, styles.danger)}
                                        title="삭제"
                                    >
                                        {actionLoading === inv.id ? <Loader2 className="animate-spin" /> : <Trash2 />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
