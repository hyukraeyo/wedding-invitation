'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './PreviewAccordion.module.scss';
import { clsx } from 'clsx';

interface PreviewAccordionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
    accentColor?: string;
    mode?: 'accent' | 'subtle' | 'white';
}

/**
 * Common Accordion component for the preview canvas.
 * Used in Gift/Accounts and other expandable sections.
 */
export default function PreviewAccordion({
    title,
    children,
    defaultOpen = false,
    className,
    accentColor,
    mode = 'subtle'
}: PreviewAccordionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const getContrastColor = (hex?: string) => {
        if (!hex) return 'inherit';
        const cleanHex = hex.replace('#', '');
        const r = parseInt(cleanHex.slice(0, 2), 16);
        const g = parseInt(cleanHex.slice(2, 4), 16);
        const b = parseInt(cleanHex.slice(4, 6), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? '#000000' : '#ffffff';
    };

    const textColor = mode === 'accent' ? getContrastColor(accentColor) : 'inherit';

    // ... (existing code) ...

    return (
        <div
            className={clsx(styles.groupContainer, styles[mode], className)}
            style={{
                '--accent-bg': accentColor,
                '--accent-text': textColor
            } as React.CSSProperties}
        >
            <Button
                variant="ghost"
                className={styles.groupHeader}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                style={{ height: 'auto', padding: '16px 20px', justifyContent: 'space-between' }}
            >
                <span className={styles.groupTitle} dangerouslySetInnerHTML={{ __html: title }} />
                {isOpen ? (
                    <ChevronUp size={20} className={styles.icon} />
                ) : (
                    <ChevronDown size={20} className={styles.icon} />
                )}
            </Button>
            <div
                className={clsx(styles.groupContent, isOpen && styles.open)}
                style={{ maxHeight: isOpen ? '1000px' : '0' }}
            >
                <div className={styles.innerContent}>
                    {children}
                </div>
            </div>
        </div>
    );
}
