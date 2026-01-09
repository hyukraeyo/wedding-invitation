import React from 'react';
import styles from './AccordionItem.module.scss';
import { clsx } from 'clsx';
import { Check, ChevronDown } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';

interface AccordionItemProps {
    title: string;
    icon?: React.ElementType;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    isCompleted?: boolean;
    badge?: string;
}

// Helper to add opacity to hex colors
const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const hexToRgbValues = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
};

export const AccordionItem = ({
    title,
    icon: Icon,
    isOpen,
    onToggle,
    children,
    isCompleted = false,
    badge
}: AccordionItemProps) => {
    const { theme } = useInvitationStore();
    const accentColor = theme.accentColor;
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!isOpen || !containerRef.current) return;

        const timer = setTimeout(() => {
            containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);

        return () => clearTimeout(timer);
    }, [isOpen]);

    return (
        <div
            ref={containerRef}
            className={clsx(styles.accordion, isOpen && styles.open)}
            style={{
                '--accent-color': accentColor,
                '--accent-rgb': hexToRgbValues(accentColor),
                ...(isOpen ? {
                    borderColor: hexToRgba(accentColor, 0.2),
                    boxShadow: `0 20px 40px -12px rgba(0,0,0,0.06), 0 0 0 1px ${hexToRgba(accentColor, 0.05)}`
                } : {})
            } as React.CSSProperties}
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

                <div className="flex items-center gap-3">
                    {isCompleted && (
                        <div
                            className={styles.completedBadge}
                            style={{
                                backgroundColor: accentColor,
                                boxShadow: `0 4px 12px ${hexToRgba(accentColor, 0.3)}`
                            }}
                        >
                            <Check size={10} strokeWidth={5} />
                        </div>
                    )}
                    <div className={clsx(styles.arrowWrapper, isOpen && styles.open)}>
                        <ChevronDown size={16} className={styles.arrow} />
                    </div>
                </div>
            </button>

            {isOpen && (
                <div className={styles.content}>
                    <div className={styles.divider} />
                    {children}
                </div>
            )}
        </div>
    );
};
