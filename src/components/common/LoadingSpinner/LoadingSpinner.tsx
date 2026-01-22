"use client";

import React from 'react';
import { createPortal } from 'react-dom';
import { Banana } from 'lucide-react';
import styles from './LoadingSpinner.module.scss';
import { useCanUseDom } from '@/hooks/useCanUseDom';

interface LoadingSpinnerProps {
    variant?: 'fixed' | 'full';
    className?: string;
}

export default function LoadingSpinner({ variant = 'fixed', className }: LoadingSpinnerProps) {
    const canUseDOM = useCanUseDom();

    const containerClass = variant === 'fixed' ? styles.fixed : styles.full;

    const content = (
        <div className={`${containerClass} ${className || ''}`}>
            <div className={styles.iconWrapper}>
                {/* Rotating Banana Icon wrapper for hardware acceleration */}
                <div className={styles.spin}>
                    <Banana className={styles.icon} />
                </div>
            </div>

            {/* Subtle floating background elements */}
            <div className={styles.backgroundDecoration1} />
            <div className={styles.backgroundDecoration2} />
        </div>
    );

    if (variant === 'fixed') {
        if (!canUseDOM) return null;
        return createPortal(content, document.body);
    }

    return content;
}
