import React from 'react';

interface BuilderLabelProps {
    children: React.ReactNode;
    className?: string; // Allow overriding or extending
}

export const BuilderLabel = ({ children, className = '' }: BuilderLabelProps) => {
    return (
        <label className={`text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 px-1 block ${className}`}>
            {children}
        </label>
    );
};
