"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Loader2, User, LogIn, LogOut, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInvitationStore } from '@/store/useInvitationStore';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

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

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
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
            "fixed md:sticky top-0 left-0 right-0 flex h-14 items-center justify-between border-b bg-background px-4 md:px-6 z-50 transition-transform duration-300",
            !isVisible && "-translate-y-full md:translate-y-0"
        )}>
            {/* Logo */}
            <div className="flex items-center gap-2 font-serif font-bold text-xl tracking-tight">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    WEDDING
                </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <nav className="hidden md:flex items-center gap-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCreateNew}
                    >
                        <Plus size={14} className="mr-1" />
                        <span>새 청첩장 만들기</span>
                    </Button>

                    {user ? (
                        <Link href="/mypage">
                            <Button variant="ghost" size="sm">
                                마이페이지
                            </Button>
                        </Link>
                    ) : (
                        onLogin && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onLogin}
                            >
                                로그인
                            </Button>
                        )
                    )}
                </nav>

                <div className="flex items-center gap-2">
                    {user && (
                        <Link href="/mypage" className="md:hidden">
                            <Button variant="ghost" size="sm" className="px-2">
                                <User size={20} />
                            </Button>
                        </Link>
                    )}
                    {user && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden px-2"
                            onClick={handleLogout}
                            aria-label="로그아웃"
                        >
                            <LogOut size={20} />
                        </Button>
                    )}
                    {!user && onLogin && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden px-2"
                            onClick={onLogin}
                            aria-label="로그인"
                        >
                            <LogIn size={20} />
                        </Button>
                    )}
                    {user && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="hidden md:inline-flex"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </Button>
                    )}
                    <Button
                        className="md:hidden"
                        size="sm"
                        variant="secondary"
                        onClick={handleCreateNew}
                    >
                        <Plus size={14} />
                    </Button>
                    {onSave && (
                        <Button
                            onClick={onSave}
                            size="sm"
                            className="font-bold md:min-w-[60px] px-2 md:px-4"
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
