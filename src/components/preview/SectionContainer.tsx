'use client';

import React from 'react';
import ScrollReveal from './ScrollReveal';
import styles from './SectionContainer.module.css';
import { clsx } from 'clsx';

interface SectionContainerProps {
    children: React.ReactNode;
    className?: string;
    id?: string | undefined;
    fullWidth?: boolean;
    style?: React.CSSProperties;
}

/**
 * Common wrapper for preview sections to provide consistent padding and layout.
 * Optimized with CSS Modules and flexible properties.
 */
export default function SectionContainer({
    children,
    className = "",
    id,
    fullWidth = false,
    style
}: SectionContainerProps) {
    return (
        <ScrollReveal id={id}>
            <section
                className={clsx(
                    styles.container,
                    fullWidth && styles.fullWidth,
                    className
                )}
                style={style}
            >
                <div className={styles.inner}>
                    {children}
                </div>
            </section>
        </ScrollReveal>
    );
}
