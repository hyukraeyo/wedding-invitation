'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Type, X } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { cn } from '@/lib/utils';
import styles from './FontSizeControl.module.scss';

export function FontSizeControl() {
    const [isOpen, setIsOpen] = useState(false);
    const fontScale = useInvitationStore(state => state.theme.fontScale || 1);
    const setTheme = useInvitationStore(state => state.setTheme);
    const containerRef = useRef<HTMLDivElement>(null);

    const options = [
        { label: '작게', value: 1, className: styles.small },
        { label: '중간', value: 1.1, className: styles.large },
        { label: '크게', value: 1.2, className: styles.extraLarge },
    ];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className={styles.container} ref={containerRef}>
            <button
                className={cn(styles.trigger, isOpen && styles.active)}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="글자 크기 조절"
            >
                {isOpen ? <X size={20} /> : <Type size={20} />}
            </button>
            {isOpen && (
                <div className={styles.panel}>
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            className={cn(
                                styles.option,
                                opt.className,
                                fontScale === opt.value && styles.active
                            )}
                            onClick={() => {
                                setTheme({ fontScale: opt.value });
                                // Keep open to allow rapid testing? Or close?
                                // Let's keep it open for now.
                            }}
                            title={`글자 크기 ${opt.value * 100}%`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
