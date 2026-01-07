import React from 'react';

interface BuilderLabelProps {
    children: React.ReactNode;
    className?: string; // Allow overriding or extending
}

export const BuilderLabel = ({ children, className = '' }: BuilderLabelProps) => {
    return (
        <label className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5 block ${className}`}>
            {children}
        </label>
    );
};
