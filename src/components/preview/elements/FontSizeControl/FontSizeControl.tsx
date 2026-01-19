'use client';

import React, { useState } from 'react';
import { CaseSensitive } from 'lucide-react';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { cn } from '@/lib/utils';
import styles from './FontSizeControl.module.scss';

interface FontSizeControlProps {
    value: number;
    onChange: (value: number) => void;
}

export function FontSizeControl({ value, onChange }: FontSizeControlProps) {
    const [isOpen, setIsOpen] = useState(false);

    const labels = {
        1: '기본',
        1.1: '크게',
        1.2: '더 크게'
    };

    const currentLabel = labels[value as keyof typeof labels] || '기본';

    return (
        <div className={styles.container}>
            <ResponsiveModal
                open={isOpen}
                onOpenChange={setIsOpen}
                title="보기 설정"
                trigger={
                    <button
                        className={styles.trigger}
                        aria-label={`글자 크기 설정 (현재: ${currentLabel})`}
                        title="글자 크기 조절"
                    >
                        <div className={cn(
                            styles.iconWrapper,
                            value === 1 && styles.small,
                            value === 1.1 && styles.medium,
                            value === 1.2 && styles.large
                        )}>
                            <CaseSensitive size={20} strokeWidth={value === 1 ? 1.5 : value === 1.1 ? 2 : 2.5} />
                        </div>
                    </button>
                }
            >
                <div className={styles.modalBody}>
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>글자 크기</h4>
                        <SegmentedControl
                            value={value}
                            onChange={(val) => onChange(val as number)}
                            className={styles.control}
                        >
                            <SegmentedControl.Item value={1}>기본</SegmentedControl.Item>
                            <SegmentedControl.Item value={1.1}>크게</SegmentedControl.Item>
                            <SegmentedControl.Item value={1.2}>더 크게</SegmentedControl.Item>
                        </SegmentedControl>
                    </div>
                </div>
            </ResponsiveModal>
        </div>
    );
}
