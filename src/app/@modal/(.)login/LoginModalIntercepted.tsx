"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import LoginModal from '@/components/auth/LoginModal';
import ProfileCompletionModal from '@/components/auth/ProfileCompletionModal';
import { useAuth } from '@/hooks/useAuth';

/**
 * Intercepted Modal Component
 * - Parallel Routes에서 렌더링되어 기존 페이지 위에 오버레이
 * - router.back()을 사용하여 닫기 동작 수행
 */
export default function LoginModalIntercepted() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isProfileComplete, loading: authLoading, refreshProfile } = useAuth();

    useEffect(() => {
        // Only redirect if we are actually ON the /login route (not just showing modally on another page)
        // This prevents MyPage from snapping to builder when something triggers a re-render
        if (!authLoading && user && isProfileComplete && pathname === '/login') {
            router.replace('/builder');
        }
    }, [user, authLoading, isProfileComplete, router, pathname]);

    const handleClose = () => {
        router.back();
    };

    const handleProfileComplete = async () => {
        await refreshProfile();
        // The useEffect above will handle redirection to /builder
    };

    if (authLoading) return null;

    if (!user) {
        return <LoginModal isOpen={true} onClose={handleClose} />;
    }

    if (!isProfileComplete) {
        return (
            <ProfileCompletionModal
                isOpen={true}
                userId={user.id}
                defaultName={user.user_metadata?.full_name || ''}
                onComplete={handleProfileComplete}
            />
        );
    }

    return null;
}
