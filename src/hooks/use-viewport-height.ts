'use client';

import { useEffect } from 'react';

/**
 * 모바일 브라우저(특히 Safari)의 주소창 변화에 따른 뷰포트 높이 문제를 해결하기 위한 훅
 * --vh CSS 변수를 설정하여 실제 사용 가능한 높이를 계산합니다.
 * CSS 사용법: height: calc(var(--vh, 1vh) * 100);
 */
export function useViewportHeight() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        // 초기 실행
        updateVH();

        // visualViewport 지원 시 더 정밀한 계산 가능 (키보드 대응 등)
        const viewport = window.visualViewport;

        const handleResize = () => {
            if (viewport) {
                const vh = viewport.height * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            } else {
                updateVH();
            }
        };

        if (viewport) {
            viewport.addEventListener('resize', handleResize);
            viewport.addEventListener('scroll', handleResize);
        } else {
            window.addEventListener('resize', updateVH);
        }

        return () => {
            if (viewport) {
                viewport.removeEventListener('resize', handleResize);
                viewport.removeEventListener('scroll', handleResize);
            } else {
                window.removeEventListener('resize', updateVH);
            }
        };
    }, []);
}
