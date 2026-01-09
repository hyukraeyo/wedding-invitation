"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { invitationService } from '@/services/invitationService';
import { useInvitationStore, InvitationData } from '@/store/useInvitationStore';
import Header from '@/components/common/Header';
import { Calendar, MapPin, ExternalLink, Edit2, Trash2, Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchInvitations();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading, fetchInvitations]);

    const handleEdit = (inv: { invitation_data: InvitationData; slug: string }) => {
        // Load data into store
        useInvitationStore.setState(inv.invitation_data);
        // Force set the slug
        useInvitationStore.getState().setSlug(inv.slug);
        router.push('/builder');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('정말로 이 청첩장을 삭제하시겠습니까?')) return;

        setActionLoading(id);
        try {
            await invitationService.deleteInvitation(id);
            await fetchInvitations();
        } catch (err) {
            console.error(err);
            alert('삭제 중 오류가 발생했습니다.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCreateNew = () => {
        reset();
        router.push('/builder');
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full space-y-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Edit2 size={32} className="text-gray-400" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">로그인이 필요합니다</h2>
                        <p className="text-gray-500 text-sm">저장된 청첩장을 보려면 먼저 로그인을 해주세요.</p>
                    </div>
                    <Link
                        href="/builder"
                        onClick={handleCreateNew}
                        className="block w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
                    >
                        메인으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-gray-900">나의 청첩장</h1>
                        <p className="text-gray-500">지금까지 제작한 소중한 청첩장 목록입니다.</p>
                    </div>

                </div>

                {invitations.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                            <Calendar size={40} className="text-gray-300" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-bold text-gray-800">아직 저장된 청첩장이 없습니다.</p>
                            <p className="text-gray-500">빌더에서 청첩장을 만들고 &apos;저장하기&apos;를 눌러보세요!</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {invitations.map((inv) => (
                            <div key={inv.id} className="group bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
                                <div className="p-6 flex-1 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                                                {inv.invitation_data?.mainScreen?.title || '제목 없는 청첩장'}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                최종 수정: {new Date(inv.updated_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="px-3 py-1 bg-green-50 text-green-600 text-[11px] font-bold rounded-full border border-green-100">
                                            저장완료
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar size={14} />
                                            <span>{inv.invitation_data?.date || '날짜 미지정'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin size={14} />
                                            <span className="line-clamp-1">{inv.invitation_data?.location || '장소 미지정'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50/50 border-t border-gray-50 flex items-center gap-2">
                                    <Link
                                        href={`/v/${inv.slug}`}
                                        target="_blank"
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <ExternalLink size={16} />
                                        보기
                                    </Link>
                                    <button
                                        onClick={() => handleEdit(inv)}
                                        className="flex items-center justify-center p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-black hover:border-gray-400 transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(inv.id)}
                                        disabled={actionLoading === inv.id}
                                        className="flex items-center justify-center p-2.5 bg-white border border-gray-200 rounded-xl text-red-400 hover:text-red-600 hover:border-red-200 transition-all disabled:opacity-50"
                                    >
                                        {actionLoading === inv.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
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
