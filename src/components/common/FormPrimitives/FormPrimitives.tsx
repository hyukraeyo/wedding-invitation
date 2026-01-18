import React from 'react';
import { Info, AlertCircle } from 'lucide-react';
import { Label as ShadcnLabel } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import styles from './styles.module.scss';

// --- Label ---

interface LabelProps extends React.ComponentPropsWithoutRef<typeof ShadcnLabel> {
    required?: boolean | undefined;
}

export const Label = ({ children, className, required, ...props }: LabelProps) => {
    return (
        <ShadcnLabel className={cn(className)} {...props}>
            {children}
            {required ? <span className={styles.requiredStar}>*</span> : null}
        </ShadcnLabel>
    );
};

// --- HelpText ---

interface HelpTextProps {
    children: React.ReactNode;
    variant?: 'info' | 'warning';
    className?: string;
    showIcon?: boolean;
    iconSize?: number;
}

export const HelpText = ({
    children,
    variant = 'info',
    className,
    showIcon = true,
    iconSize = 14,
}: HelpTextProps) => {
    const Icon = variant === 'warning' ? AlertCircle : Info;

    return (
        <div className={cn(
            styles.helpText,
            variant === 'info' && styles.info,
            variant === 'warning' && styles.warning,
            className
        )}>
            {showIcon ? <Icon size={iconSize} className={styles.helpIcon} /> : null}
            <span className={styles.leadingNormal}>{children}</span>
        </div>
    );
};

// --- Field (Form Group) ---

interface FieldProps {
    label: React.ReactNode;
    children: React.ReactNode;
    className?: string | undefined;
    required?: boolean | undefined;
    description?: string | undefined;
    error?: React.ReactNode;
    id?: string;
    action?: React.ReactNode;
}

export const Field = ({ label, children, className, required, description, error, id, action }: FieldProps) => {
    return (
        <div className={cn(styles.spaceY2, className)}>
            <div className={styles.fieldContainer}>
                {label ? (
                    <div className={styles.fieldHeader}>
                        <Label htmlFor={id} required={!!required}>
                            {label}
                        </Label>
                        {action}
                    </div>
                ) : null}
                {children}
                {description ? (
                    <p className={cn(styles.description, error && styles.error)}>
                        {description}
                    </p>
                ) : null}
                {error ? (
                    <p className={styles.errorMessage}>
                        {error}
                    </p>
                ) : null}
            </div>
        </div>
    );
};

// --- Section Container ---

interface SectionContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const SectionContainer = ({ children, className }: SectionContainerProps) => {
    return (
        <div className={cn(styles.sectionContainer, className)}>
            {children}
        </div>
    );
};

// --- Option Group ---

export const OptionGroup = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={cn(styles.optionGroup, className)}>
            {children}
        </div>
    );
};
