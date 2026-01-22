import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Banana } from 'lucide-react';
import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
    variant?: 'fixed' | 'full';
    className?: string;
}

export default function LoadingSpinner({ variant = 'fixed', className }: LoadingSpinnerProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
        if (!mounted) return null;
        return createPortal(content, document.body);
    }

    return content;
}
