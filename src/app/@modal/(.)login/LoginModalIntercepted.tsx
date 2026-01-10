"use client";

import { useRouter } from 'next/navigation';
import LoginModal from '@/components/auth/LoginModal';

/**
 * Intercepted Modal Component
 * - Parallel Routes에서 렌더링되어 기존 페이지 위에 오버레이
 * - router.back()을 사용하여 닫기 동작 수행
 */
export default function LoginModalIntercepted() {
    const router = useRouter();

    const handleClose = () => {
        router.back();
    };

    return <LoginModal isOpen={true} onClose={handleClose} />;
}
