'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CaseSensitive } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { cn } from '@/lib/utils';
import styles from './FontSizeControl.module.scss';

export function FontSizeControl() {
    const fontScale = useInvitationStore(state => state.theme.fontScale || 1);
    const setTheme = useInvitationStore(state => state.setTheme);

    const scales = [1, 1.1, 1.2];
    const labels = ['작게', '중간', '크게'];

    const handleToggle = () => {
        const currentIndex = scales.indexOf(fontScale);
        const nextIndex = (currentIndex + 1) % scales.length;
        setTheme({ fontScale: scales[nextIndex] });
    };

    const currentLabel = labels[scales.indexOf(fontScale)] || '중간';

    return (
        <div className={styles.container}>
            <button
                className={styles.trigger}
                onClick={handleToggle}
                aria-label={`글자 크기 조절 (현재: ${currentLabel})`}
                title={`글자 크기: ${currentLabel}`}
            >
                <div className={cn(
                    styles.iconWrapper,
                    fontScale === 1 && styles.small,
                    fontScale === 1.1 && styles.medium,
                    fontScale === 1.2 && styles.large
                )}>
                    <CaseSensitive size={20} strokeWidth={fontScale === 1 ? 1.5 : fontScale === 1.1 ? 2 : 2.5} />
                </div>
            </button>
        </div>
    );
}
