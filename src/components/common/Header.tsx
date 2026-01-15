"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Loader2, User, LogIn, Save, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';

interface HeaderProps {
    onSave?: () => void;
    onLogin?: () => void;
    isLoading?: boolean;
}

import { cn } from '@/lib/utils';


export default function Header({ onSave, onLogin, isLoading }: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isMyPage = pathname?.startsWith('/mypage');
    const { user, signOut } = useAuth();
    const reset = useInvitationStore(state => state.reset);
    const [showResetDialog, setShowResetDialog] = useState(false);
    const isVisible = true; // Always visible as per user request

    useEffect(() => {
        router.prefetch('/login');
    }, [router]);


    const handleCreateNew = () => {
        const state = useInvitationStore.getState();

        // 마이페이지에서는 바로 초기화하고 빌더로 이동
        if (isMyPage) {
            reset();
            router.push('/builder');
            return;
        }

        const hasActualContent =
            state.groom.firstName !== '' ||
            state.bride.firstName !== '' ||
            state.location !== '' ||
            state.imageUrl !== null ||
            state.gallery.length > 0;

        if (hasActualContent) {
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
            "sticky top-0 left-0 right-0 flex h-14 items-center justify-between border-b bg-background px-4 md:px-6 z-50 transition-transform duration-400 ease-ios",
            !isVisible && "-translate-y-full"
        )}>
            {/* Logo */}
            <div className="flex items-center shrink-0">
                <Link href="/" className="hover:opacity-80 transition-opacity flex items-center">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={44}
                        height={44}
                        className="h-9 w-9 md:h-11 md:w-11 object-contain shrink-0 aspect-square"
                        quality={100}
                        priority
                    />
                </Link>
            </div>

            {/* Actions */}
            {/* Actions */}
            <div className="flex items-center gap-1">
                {user ? (
                    <>
                        {isMyPage ? (
                            <IconButton
                                icon={Plus}
                                size="md"
                                variant="ghost"
                                onClick={handleCreateNew}
                                aria-label="새 청첩장 만들기"
                            />
                        ) : (
                            <Link href="/mypage">
                                <IconButton
                                    icon={User}
                                    size="md"
                                    variant="ghost"
                                    aria-label="마이페이지"
                                />
                            </Link>
                        )}
                        <IconButton
                            icon={LogOut}
                            size="md"
                            variant="ghost"
                            onClick={async () => {
                                await signOut();
                                router.push('/');
                            }}
                            aria-label="로그아웃"
                        />
                    </>
                ) : (
                    onLogin && (
                        <IconButton
                            icon={LogIn}
                            size="md"
                            variant="ghost"
                            onClick={onLogin}
                            aria-label="로그인"
                        />
                    )
                )}

                {onSave && user && (
                    <IconButton
                        icon={Save}
                        onClick={onSave}
                        loading={isLoading}
                        size="md"
                        variant="default"
                        className="ml-1"
                        aria-label="저장하기"
                    />
                )}
            </div>

            <ResponsiveModal
                open={showResetDialog}
                onOpenChange={setShowResetDialog}
                title="새 청첩장 만들기"
                description={
                    <>
                        작성 중인 내용이 있습니다. 정말 새 청첩장을 만드시겠습니까?
                        <br />
                        (작성된 내용은 초기화됩니다.)
                    </>
                }
            >
                <div className="flex flex-col gap-3 py-4">
                    <Button
                        variant="destructive"
                        className="w-full py-6 text-lg font-bold"
                        onClick={confirmReset}
                    >
                        초기화 및 만들기
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full py-6 text-base"
                        onClick={() => setShowResetDialog(false)}
                    >
                        취소
                    </Button>
                </div>
            </ResponsiveModal>
        </header>
    );
}
