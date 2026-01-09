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
}

export const SubAccordion: React.FC<SubAccordionProps> = ({
    label,
    isOpen,
    onClick,
    showBadge = false,
    badgeText = "PREMIUM"
}) => {
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    return (
        <button
            onClick={onClick}
            type="button"
            className={clsx(styles.subAccordion, isOpen && styles.open)}
            style={{
                '--accent-color': accentColor
            } as React.CSSProperties}
        >
            <div className="flex items-center gap-2">
                <span className={clsx(styles.label, isOpen && styles.open)}>{label}</span>
                {showBadge && (
                    <span className="px-1.5 py-0.5 bg-white border border-gray-100 rounded text-[8px] text-gray-400 font-black tracking-tighter uppercase">
                        {badgeText}
                    </span>
                )}
            </div>

            <ChevronDown
                size={14}
                className={clsx(styles.icon, isOpen && styles.open)}
            />
        </button>
    );
};
