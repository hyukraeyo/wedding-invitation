import React from 'react';
import { twMerge } from 'tailwind-merge';

interface BuilderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const BuilderButton = ({
    variant = 'primary',
    size = 'md',
    children,
    className,
    ...props
}: BuilderButtonProps) => {
    const variants = {
        primary: "bg-forest-green text-white border-forest-green hover:bg-emerald-800",
        secondary: "bg-black text-white border-black hover:bg-gray-800",
        outline: "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
        ghost: "bg-transparent border-transparent text-gray-600 hover:bg-gray-100",
        danger: "bg-red-50 text-red-600 border-red-100 hover:bg-red-100",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2.5 text-[13px]",
        lg: "px-6 py-3 text-sm",
    };

    return (
        <button
            className={twMerge(
                "inline-flex items-center justify-center gap-2 font-bold rounded-xl border transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
