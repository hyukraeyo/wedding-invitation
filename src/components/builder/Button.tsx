import React from 'react';
import { clsx } from 'clsx';
import styles from './Button.module.scss';
import { useInvitationStore } from '@/store/useInvitationStore';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'fill' | 'weak' | 'outline';
    color?: 'primary' | 'dark' | 'danger' | 'accent';
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    block?: boolean;
    loading?: boolean;
    children: React.ReactNode;
}

export const Button = ({
    variant = 'fill',
    color = 'primary',
    size = 'medium',
    block = false,
    loading = false,
    children,
    className,
    style,
    ...props
}: ButtonProps) => {
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    // If color is 'accent' and variant is 'fill', we use the store's accent color
    const customStyle = { ...style };
    if (color === 'accent' && variant === 'fill') {
        customStyle.backgroundColor = accentColor;
        customStyle.color = 'white';
    } else if (color === 'accent' && variant === 'weak') {
        customStyle.backgroundColor = `${accentColor}1A`; // 10% opacity
        customStyle.color = accentColor;
    }

    return (
        <button
            className={clsx(
                styles.base,
                styles[`variant-${variant}`],
                color !== 'accent' && styles[`color-${color}`],
                styles[`size-${size}`],
                block && styles.block,
                className
            )}
            style={customStyle}
            disabled={props.disabled || loading}
            {...props}
        >
            {loading ? (
                // Simple dot loading animation for now (TDS style)
                <span className={styles.loadingDots}>
                    <span>.</span><span>.</span><span>.</span>
                </span>
            ) : (
                children
            )}
        </button>
    );
};
