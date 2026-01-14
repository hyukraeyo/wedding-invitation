"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Loader2, User, LogIn, LogOut, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInvitationStore } from '@/store/useInvitationStore';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/Dialog';

interface HeaderProps {
    onSave?: () => void;
    onLogin?: () => void;
    isLoading?: boolean;
}

import { cn } from '@/lib/utils';
import { useHeaderVisible } from '@/hooks/useHeaderVisible';

export default function Header({ onSave, onLogin, isLoading }: HeaderProps) {
    const router = useRouter();
    const { user } = useAuth();
    const reset = useInvitationStore(state => state.reset);
    const [showResetDialog, setShowResetDialog] = useState(false);
    const isVisible = useHeaderVisible(10, 'builder-sidebar-scroll');

    useEffect(() => {
        router.prefetch('/login');
    }, [router]);

    const handleLogout = async () => {
        try {
            // Use 'local' scope to prevent rare 403 Forbidden errors on global logout
            // and ensure the user's local session is cleared regardless of server response.
            await supabase.auth.signOut({ scope: 'local' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            router.push('/');
            router.refresh(); // Ensure UI updates to reflect logged out state
        }
    };

    const handleCreateNew = () => {
        const state = useInvitationStore.getState();
        const hasContent =
            state.groom.firstName !== '' ||
            state.bride.firstName !== '' ||
            state.location !== '' ||
            state.message !== '' ||
            state.imageUrl !== null ||
            state.gallery.length > 0;

        if (hasContent) {
            setShowResetDialog(true);
        } else {
            reset();
            router.push('/builder');
        }
    };

    const confirmReset = () => {
        reset();
        router.push('/builder');
        setShowResetDialog(false);
    };

    return (
        <header className={cn(
            "fixed md:sticky top-0 left-0 right-0 flex h-14 items-center justify-between border-b bg-background px-4 md:px-6 z-50 transition-transform duration-400 ease-ios",
            !isVisible && "-translate-y-full md:translate-y-0"
        )}>
            {/* Logo */}
            <div className="flex items-center">
                <Link href="/" className="hover:opacity-80 transition-opacity flex items-center">
                    <Image src="/logo.png" alt="Logo" width={44} height={44} className="object-contain" priority />
                </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 md:gap-2">
                {user && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCreateNew}
                        className="mr-1 md:mr-2"
                    >
                        <Plus size={16} className="hidden md:inline mr-1" />
                        <span className="hidden md:inline">새 청첩장 만들기</span>
                        <Plus size={20} className="md:hidden" />
                    </Button>
                )}

                {user ? (
                    <>
                        <Link href="/mypage">
                            <Button variant="ghost" size="sm" className="px-2">
                                <span className="hidden md:inline">마이페이지</span>
                                <User size={20} className="md:hidden" />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="px-2"
                            onClick={handleLogout}
                            aria-label="로그아웃"
                        >
                            <span className="hidden md:inline">로그아웃</span>
                            <LogOut size={20} className="md:hidden" />
                        </Button>
                    </>
                ) : (
                    onLogin && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="px-2"
                            onClick={onLogin}
                            aria-label="로그인"
                        >
                            <span className="hidden md:inline">로그인</span>
                            <LogIn size={20} className="md:hidden" />
                        </Button>
                    )
                )}

                {onSave && user && (
                    <Button
                        onClick={onSave}
                        size="sm"
                        className="font-bold min-w-[32px] md:min-w-[60px] px-2 md:px-4 ml-1 md:ml-2"
                        disabled={isLoading}
                        aria-label="저장"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Save size={20} className="md:hidden" />
                                <span className="hidden md:inline">저장</span>
                            </>
                        )}
                    </Button>
                )}
            </div>

            <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>새 청첩장 만들기</DialogTitle>
                        <DialogDescription>
                            작성 중인 내용이 있습니다. 정말 새 청첩장을 만드시겠습니까?
                            <br />
                            (작성된 내용은 초기화됩니다.)
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowResetDialog(false)}>
                            취소
                        </Button>
                        <Button variant="destructive" onClick={confirmReset}>
                            초기화 및 만들기
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </header>
    );
}
