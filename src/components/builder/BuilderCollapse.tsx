import React from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './BuilderCollapse.module.scss';
import { clsx } from 'clsx';
import { useInvitationStore } from '@/store/useInvitationStore';

interface BuilderCollapseProps {
    label: string;
    isOpen: boolean;
    onToggle: () => void;
    showBadge?: boolean;
    badgeText?: string;
    children?: React.ReactNode;
    className?: string;
}

export const BuilderCollapse: React.FC<BuilderCollapseProps> = ({
    label,
    isOpen,
    onToggle,
    showBadge = false,
    badgeText = "PREMIUM",
    children,
    className
}) => {
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    return (
        <div className={clsx(styles.container, className)}>
            <button
                onClick={onToggle}
                type="button"
                className={clsx(styles.trigger, isOpen && styles.open)}
                style={{
                    '--accent-color': accentColor
                } as React.CSSProperties}
            >
                <div className={styles.headerContent}>
                    <span className={styles.label}>{label}</span>
                    {showBadge && (
                        <span className={styles.badge}>
                            {badgeText}
                        </span>
                    )}
                </div>

                <ChevronDown
                    size={14}
                    className={clsx(styles.icon, isOpen && styles.open)}
                />
            </button>

            <div className={clsx(styles.collapseWrapper, isOpen && styles.open)}>
                <div className={styles.collapseInner}>
                    <div className={styles.content}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
