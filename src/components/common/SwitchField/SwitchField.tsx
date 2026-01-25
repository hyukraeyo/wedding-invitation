import React from 'react';
import { Switch as ShadcnSwitch } from '@/components/ui/Switch';
import { cn } from '@/lib/utils';
import { Field } from '@/components/common/FormPrimitives';
import styles from './SwitchField.module.scss';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    className?: string;
    disabled?: boolean;
}

export const SwitchField = ({ checked, onChange, label, description, className, disabled }: SwitchProps) => {
    const id = React.useId();
    return (
        <div
            className={cn(
                styles.container,
                disabled && styles.disabled,
                className
            )}
            onClick={() => !disabled && onChange(!checked)}
        >
            <Field
                id={id}
                label={label}
                description={description}
                layout="horizontal"
                align="center"
                className={styles.fieldOverride}
            >
                <ShadcnSwitch
                    id={id}
                    checked={checked}
                    onCheckedChange={onChange}
                    disabled={disabled}
                    onClick={(e) => e.stopPropagation()} // Prevent double trigger
                />
            </Field>
        </div>
    );
};
