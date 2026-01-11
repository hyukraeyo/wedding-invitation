"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoginModal from '@/components/auth/LoginModal';
import { useAuth } from '@/hooks/useAuth';

/**
 * Intercepted Modal Component
 * - Parallel Routes에서 렌더링되어 기존 페이지 위에 오버레이
 * - router.back()을 사용하여 닫기 동작 수행
 */
export default function LoginModalIntercepted() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && user) {
            router.replace('/builder');
        }
    }, [user, authLoading, router]);

    const handleClose = () => {
        router.back();
    };

    if (authLoading || user) return null;

    return <LoginModal isOpen={true} onClose={handleClose} />;
}
