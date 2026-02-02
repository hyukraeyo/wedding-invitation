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

        const viewport = window.visualViewport;

        const handleResize = () => {
            if (viewport) {
                const vh = viewport.height * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
                
                // 키보드 높이 계산 (Layout Viewport Height - Visual Viewport Height)
                const keyboardOffset = window.innerHeight - viewport.height;
                const cappedOffset = Math.max(0, keyboardOffset);
                document.documentElement.style.setProperty('--keyboard-offset', `${cappedOffset}px`);
                
                // 키보드 오픈 여부 데이터 속성 추가 (스타일 제어용)
                // 보통 모바일 주소창 높이 변화는 60px 이하이므로 그 이상일 때 키보드로 판단
                if (cappedOffset > 60) {
                    document.documentElement.setAttribute('data-keyboard-open', 'true');
                } else {
                    document.documentElement.setAttribute('data-keyboard-open', 'false');
                }
            } else {
                updateVH();
                document.documentElement.setAttribute('data-keyboard-open', 'false');
            }
        };

        if (viewport) {
            viewport.addEventListener('resize', handleResize);
            viewport.addEventListener('scroll', handleResize);
            // 초기 실행 시에도 visualViewport 기준 계산 수행
            handleResize();
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
