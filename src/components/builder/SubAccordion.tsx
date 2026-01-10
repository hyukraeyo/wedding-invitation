import React from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Builder.module.scss';
import { clsx } from 'clsx';
import { useInvitationStore } from '@/store/useInvitationStore';

interface SubAccordionProps {
    label: string;
    isOpen: boolean;
    onClick: () => void;
    showBadge?: boolean;
    badgeText?: string;
    children?: React.ReactNode;
}

export const SubAccordion: React.FC<SubAccordionProps> = ({
    label,
    isOpen,
    onClick,
    showBadge = false,
    badgeText = "PREMIUM",
    children
}) => {
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    return (
        <div className={styles.subAccordionContainer}>
            <button
                onClick={onClick}
                type="button"
                className={clsx(styles.subAccordion, isOpen && styles.open)}
                style={{
                    '--accent-color': accentColor
                } as React.CSSProperties}
            >
                <div className={styles.subHeader}>
                    <span className={styles.subLabel}>{label}</span>
                    {showBadge && (
                        <span className={styles.subBadge}>
                            {badgeText}
                        </span>
                    )}
                </div>

                <ChevronDown
                    size={14}
                    className={clsx(styles.icon, isOpen && styles.open)}
                />
            </button>

            {children && (
                <div className={clsx(styles.subAccordionCollapse, isOpen && styles.open)}>
                    <div className={styles.subAccordionInner}>
                        <div className={styles.subAccordionContent}>
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
