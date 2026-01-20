'use client';

import React from 'react';
import { CaseSensitive } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './FontSizeControl.module.scss';

interface FontSizeControlProps {
    value: number;
    onChange: (value: number) => void;
}

export function FontSizeControl({ value, onChange }: FontSizeControlProps) {
    const SCALES = [1, 1.1, 1.2];

    const labels: Record<number, string> = {
        1: '기본',
        1.1: '크게',
        1.2: '더 크게'
    };

    const handleClick = () => {
        const currentIndex = SCALES.indexOf(value);
        const nextIndex = (currentIndex + 1) % SCALES.length;
        const nextValue = SCALES[nextIndex];
        if (nextValue !== undefined) {
            onChange(nextValue);
        }
    };

    const currentLabel = labels[value] || '기본';

    return (
        <div className={styles.container}>
            <button
                className={styles.trigger}
                onClick={handleClick}
                aria-label={`글자 크기 설정 (현재: ${currentLabel})`}
                title={`글자 크기 조절 (현재: ${currentLabel})`}
            >
                <div className={cn(
                    styles.iconWrapper,
                    value === 1 && styles.small,
                    value === 1.1 && styles.medium,
                    value === 1.2 && styles.large
                )}>
                    <CaseSensitive
                        size={20}
                        strokeWidth={value === 1 ? 1.5 : value === 1.1 ? 2 : 2.5}
                    />
                </div>
            </button>
        </div>
    );
}
