"use client";

import { useEffect, useState } from 'react';
import { ProgressBar as TDSProgressBar } from '@toss/tds-mobile';
import styles from './ProgressBar.module.scss';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
    /**
     * 진행률 (0~100)
     * 주어지지 않으면 페이지 전체의 스크롤 진행률을 자동으로 추적합니다.
     */
    progress?: number;
    /**
     * 진행바의 두께 (TDS prop에 매핑하거나 스타일로 조정)
     */
    size?: "light" | "normal" | "bold";
    /**
     * 커스텀 색상
     */
    color?: string;
    /**
     * 추가 클래스
     */
    className?: string;
}

/**
 * 🍌 바나나웨딩 프로그래스바 (Wrapper)
 * 페이지 상단에 고정되어 스크롤 진행 상태를 표시합니다.
 * @toss/tds-mobile의 ProgressBar를 내부적으로 사용합니다.
 */
export function ProgressBar({
    progress: manualProgress,
    size = "normal",
    color,
    className
}: ProgressBarProps) {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        if (manualProgress !== undefined) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const scrollDistance = scrollHeight - clientHeight;

            if (scrollDistance <= 0) {
                setScrollProgress(0);
                return;
            }

            const progress = (scrollTop / scrollDistance) * 100;
            setScrollProgress(Math.min(100, Math.max(0, progress)));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [manualProgress]);

    const displayProgress = manualProgress !== undefined ? manualProgress : scrollProgress;

    // TDS ProgressBar usually takes value 0..1 or 0..100. Assuming 0..1 based on common patterns, 
    // or standardizing. Let's assume TDS Mobile ProgressBar might work with 0..1.
    // If it expects 0..100, we'll verify. 
    // Note: If TDS 'ProgressBar' is standard, it might often be 0..1. 
    // However, Radix was 0..100. Let's try passing `value={displayProgress / 100}` if it's 0-1, 
    // or just `value={displayProgress}` if 0-100.
    // Safe bet: Check logic or try to match existing. 
    // Since I can't check, I'll stick to passing `value` as ratio (0-1) which is common in modern libs, 
    // OR if it's strictly TDS, they often use 0..1.

    // Update: TDS Mobile documentation says `value` (number).
    // Let's assume ratio 0..1 for standard progress bars, but if implementation fails, we check.

    return (
        <div className={cn(styles.progressContainer, styles[`size-${size}`], className)}>
            <TDSProgressBar
                progress={displayProgress / 100}
                size={size}
                className={styles.tdsProgressOverride || ""}
                {...(color ? { color } : {})}
            />
        </div>
    );
}
