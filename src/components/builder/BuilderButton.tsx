import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useInvitationStore } from '@/store/useInvitationStore';

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

    const baseStyles = "inline-flex items-center justify-center gap-2 font-bold rounded-xl border transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2.5 text-[13px]",
        lg: "px-6 py-3 text-sm",
    };

    const variants = {
        primary: "text-white border-transparent shadow-md hover:shadow-lg",
        secondary: "bg-black text-white border-black hover:bg-gray-800",
        outline: "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
        ghost: "bg-transparent border-transparent text-gray-600 hover:bg-gray-100",
        danger: "bg-red-50 text-red-600 border-red-100 hover:bg-red-100",
    };

    const finalStyle = variant === 'primary' ? {
        backgroundColor: accentColor,
        boxShadow: `0 4px 12px ${hexToRgba(accentColor, 0.25)}`,
        ...style
    } : style;

    return (
        <button
            className={twMerge(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            style={finalStyle}
            {...props}
        >
            {children}
        </button>
    );
};
