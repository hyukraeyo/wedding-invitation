'use client';

import React from 'react';
import { BuilderInput } from './BuilderInput';
import { BuilderField } from './BuilderField';

interface BuilderTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    containerClassName?: string;
}

export const BuilderTextField = ({
    label,
    helperText,
    containerClassName,
    className,
    ...props
}: BuilderTextFieldProps) => {
    return (
        <div className={containerClassName}>
            {label && <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">{label}</label>}
            <BuilderInput className={className} {...props} />
            {helperText && (
                <p className="mt-1.5 text-xs text-gray-500 px-1">{helperText}</p>
            )}
        </div>
    );
};
