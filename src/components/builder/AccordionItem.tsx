import React, { useRef, useEffect } from 'react';
import styles from './AccordionItem.module.scss';
import { clsx } from 'clsx';
import { Check, ChevronDown } from 'lucide-react';

interface AccordionItemProps {
    title: string;
    icon?: React.ElementType;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    isCompleted?: boolean;
    badge?: string;
}

export const AccordionItem = ({
    title,
    icon: Icon,
    isOpen,
    onToggle,
    children,
    isCompleted = false,
    badge
}: AccordionItemProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen || !containerRef.current) return;

        const timer = setTimeout(() => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect && rect.top < 100 && rect.top > 0) return;
            containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);

        return () => clearTimeout(timer);
    }, [isOpen]);

    return (
        <div
            ref={containerRef}
            className={clsx(styles.accordion, isOpen && styles.open)}
        >
            <button onClick={onToggle} className={styles.trigger}>
                <div className={styles.headerInfo}>
                    {Icon && (
                        <div className={clsx(styles.iconWrapper, isOpen && styles.open)}>
                            <Icon size={18} />
                        </div>
                    )}
                    <div className={styles.titleWrapper}>
                        <span className={clsx(styles.title, isOpen && styles.open)}>
                            {title}
                        </span>
                        {badge && <span className={styles.badge}>{badge}</span>}
                    </div>
                </div>

                <div className={styles.actions}>
                    {isCompleted && (
                        <div className={styles.completedBadge} style={{ backgroundColor: '#3182f6' }}>
                            <Check size={10} strokeWidth={5} />
                        </div>
                    )}
                    <div className={clsx(styles.arrowWrapper, isOpen && styles.open)}>
                        <ChevronDown size={18} className={styles.arrow} />
                    </div>
                </div>
            </button>

            <div
                className={clsx(styles.collapseWrapper, isOpen && styles.open)}
                aria-hidden={!isOpen}
            >
                <div className={styles.collapseInner}>
                    <div className={styles.content}>
                        <div className={styles.divider} />
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
