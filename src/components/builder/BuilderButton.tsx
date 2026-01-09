import React from 'react';
import { clsx } from 'clsx';
import { useInvitationStore } from '@/store/useInvitationStore';
import styles from './BuilderButton.module.scss';

interface BuilderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

// Helper to add opacity to hex colors
const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const BuilderButton = ({
    variant = 'primary',
    size = 'md',
    children,
    className,
    style,
    ...props
}: BuilderButtonProps) => {
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    const finalStyle = variant === 'primary' ? {
        backgroundColor: accentColor,
        boxShadow: `0 4px 12px ${hexToRgba(accentColor, 0.25)}`,
        ...style
    } : style;

    return (
        <button
            className={clsx(
                styles.base,
                styles[`variant-${variant}`],
                styles[`size-${size}`],
                className
            )}
            style={finalStyle}
            {...props}
        >
            {children}
        </button>
    );
};
