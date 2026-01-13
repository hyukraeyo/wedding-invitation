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
    const animateEntrance = useInvitationStore(state => state.theme.animateEntrance);
    const [isVisible, setIsVisible] = useState(!animateEntrance);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!animateEntrance) {
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
    }, [animateEntrance]);

    // If animation is disabled
    if (!animateEntrance) {
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
