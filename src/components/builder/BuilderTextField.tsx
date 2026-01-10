'use client';

import React from 'react';
import { BuilderInput } from './BuilderInput';
import styles from './Builder.module.scss';
import { clsx } from 'clsx';

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
        <div className={clsx(styles.field, containerClassName)}>
            {label && <label className={styles.label}>{label}</label>}
            <BuilderInput className={className} {...props} />
            {helperText && (
                <p className={styles.helperText}>{helperText}</p>
            )}
        </div>
    );
};
