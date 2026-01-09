'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';

import styles from './ScrollReveal.module.scss';
import { clsx } from 'clsx';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    id?: string | undefined;
}

export default function ScrollReveal({ children, className = "", id }: ScrollRevealProps) {
    const { theme } = useInvitationStore();
    const [isVisible, setIsVisible] = useState(!theme.animateEntrance);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!theme.animateEntrance) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [theme.animateEntrance]);

    // If animation is disabled
    if (!theme.animateEntrance) {
        return <div id={id} className={className}>{children}</div>;
    }

    return (
        <div
            id={id}
            ref={ref}
            className={clsx(className, styles.reveal, isVisible && styles.visible)}
        >
            {children}
        </div>
    );
}
