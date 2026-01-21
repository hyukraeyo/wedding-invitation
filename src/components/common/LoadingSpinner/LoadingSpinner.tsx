import React from 'react';
import { Banana } from 'lucide-react';
import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
    variant?: 'fixed' | 'full';
    className?: string;
}

export default function LoadingSpinner({ variant = 'fixed', className }: LoadingSpinnerProps) {
    const containerClass = variant === 'fixed' ? styles.fixed : styles.full;

    return (
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
}
