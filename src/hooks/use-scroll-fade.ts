"use client";

import { useState, useCallback, useEffect, useRef } from 'react';

interface UseScrollFadeOptions {
    enabled?: boolean;
    threshold?: number;
}

/**
 * 🍌 useScrollFade Hook
 * 스크롤 상태에 따라 상하단 페이드 효과를 제어하기 위한 훅입니다.
 * 리액티브한 처리를 위해 setViewportRef를 사용하는 것을 권장합니다.
 */
export function useScrollFade<T extends HTMLElement>(options: UseScrollFadeOptions = {}) {
    const { enabled = true, threshold = 5 } = options;
    const [showTopFade, setShowTopFade] = useState(false);
    const [showBottomFade, setShowBottomFade] = useState(false);
    const [element, setElement] = useState<T | null>(null);
    const viewportRef = useRef<T>(null);

    const handleScroll = useCallback(() => {
        const viewport = element || viewportRef.current;
        if (!viewport || !enabled) return;

        const { scrollTop, scrollHeight, clientHeight } = viewport;
        setShowTopFade(scrollTop > threshold);
        setShowBottomFade(scrollTop + clientHeight < scrollHeight - threshold);
    }, [element, enabled, threshold]);

    // 리플렉션을 통해 ref.current와 state를 동시 업데이트
    const setViewportRef = useCallback((node: T | null) => {
        (viewportRef as React.MutableRefObject<T | null>).current = node;
        setElement(node);
    }, []);

    useEffect(() => {
        const viewport = element || viewportRef.current;
        if (!viewport || !enabled) return;

        // 초기 상태 체크
        requestAnimationFrame(handleScroll);

        viewport.addEventListener('scroll', handleScroll, { passive: true });

        // 콘텐츠 크기 변경 감지
        const resizeObserver = new ResizeObserver(handleScroll);
        resizeObserver.observe(viewport);

        return () => {
            viewport.removeEventListener('scroll', handleScroll);
            resizeObserver.disconnect();
        };
    }, [element, handleScroll, enabled]);

    return {
        viewportRef,
        setViewportRef,
        showTopFade,
        showBottomFade,
        handleScroll
    };
}
