'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useMediaQuery } from '@/hooks/use-media-query';

import styles from './ScrollReveal.module.scss';
import { clsx } from 'clsx';


interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    id?: string | undefined;
}

export default function ScrollReveal({ children, className = "", id }: ScrollRevealProps) {
    const animateEntrance = useInvitationStore(state => state.theme.animateEntrance);
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    const shouldAnimate = animateEntrance && !prefersReducedMotion;
    const [isVisible, setIsVisible] = useState(!shouldAnimate);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!shouldAnimate) {
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
    }, [shouldAnimate]);

    // If animation is disabled
    if (!shouldAnimate) {
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
