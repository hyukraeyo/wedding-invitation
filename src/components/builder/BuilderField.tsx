import React from 'react';
import { BuilderLabel } from './BuilderLabel';

interface BuilderFieldProps {
    label?: React.ReactNode;
    children: React.ReactNode;
    className?: string; // For additional styling if absolutely needed
}

/**
 * Standardized wrapper for Builder input fields.
 * Renders an optional label and the input content.
 * Intended to be used as a direct child of a container with standard spacing (e.g. space-y-5).
 */
export const BuilderField = ({ label, children, className = "" }: BuilderFieldProps) => {
    return (
        <div className={className}>
            {label && (typeof label === 'string' ? <BuilderLabel>{label}</BuilderLabel> : label)}
            {children}
        </div>
    );
};
