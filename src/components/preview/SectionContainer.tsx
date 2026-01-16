'use client';

import React, { memo } from 'react';
import ScrollReveal from './ScrollReveal';
import styles from './SectionContainer.module.scss';
import { clsx } from 'clsx';

interface SectionContainerProps {
    children: React.ReactNode;
    className?: string;
    id?: string | undefined;
    fullWidth?: boolean;
    style?: React.CSSProperties;
    animateEntrance?: boolean | undefined;
}

/**
 * Common wrapper for preview sections to provide consistent padding and layout.
 * Optimized with CSS Modules and flexible properties.
 */
const SectionContainer = memo(function SectionContainer({
    children,
    className = "",
    id,
    fullWidth = false,
    style,
    animateEntrance
}: SectionContainerProps) {
    return (
        <ScrollReveal id={id} animateEntrance={animateEntrance ?? true}>
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
});

SectionContainer.displayName = 'SectionContainer';

export default SectionContainer;
