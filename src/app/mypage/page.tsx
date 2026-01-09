"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { invitationService } from '@/services/invitationService';
import Header from '@/components/common/Header';
import { Calendar, MapPin, ExternalLink, Edit2, Trash2, Plus } from 'lucide-react';

export default function MyPage() {
    const { user, loading: authLoading } = useAuth();
    const [invitations, setInvitations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            invitationService.getUserInvitations(user.id)
                .then(data => setInvitations(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading]);

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
                    <Link
                        href="/builder"
                        className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        <span>새 청첩장 만들기</span>
                    </Link>
                </div>

                {invitations.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                            <Calendar size={40} className="text-gray-300" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-bold text-gray-800">아직 저장된 청첩장이 없습니다.</p>
                            <p className="text-gray-500">빌더에서 청첩장을 만들고 '저장하기'를 눌러보세요!</p>
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
                                            <span>{inv.invitation_data?.dateTime?.date || '날짜 미지정'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin size={14} />
                                            <span className="line-clamp-1">{inv.invitation_data?.location?.locationTitle || '장소 미지정'}</span>
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
                                        disabled
                                        className="flex items-center justify-center p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed"
                                        title="준비 중인 기능입니다"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        disabled
                                        className="flex items-center justify-center p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed"
                                        title="준비 중인 기능입니다"
                                    >
                                        <Trash2 size={16} />
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
