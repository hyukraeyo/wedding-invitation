"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './ProgressBar.module.scss';

/**
 * 페이지 이동 시 상단에 표시되는 얇은 진행바 컴포넌트입니다.
 */
export function ProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // 경로가 바뀌면 로딩 종료 (비동기 처리로 린트 에러 방지)
        const timer = requestAnimationFrame(() => setLoading(false));
        return () => cancelAnimationFrame(timer);
    }, [pathname, searchParams]);

    // 전역 이벤트를 통해 로딩 상태를 수신할 수 있도록 설정
    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleStop = () => setLoading(false);

        window.addEventListener('routeChangeStart', handleStart);
        window.addEventListener('routeChangeComplete', handleStop);

        return () => {
            window.removeEventListener('routeChangeStart', handleStart);
            window.removeEventListener('routeChangeComplete', handleStop);
        };
    }, []);

    if (!loading) return null;

    return (
        <div className={styles.progressContainer}>
            <div className={styles.progressBar} />
        </div>
    );
}
