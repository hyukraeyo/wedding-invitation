import React from 'react';
import { Info, AlertCircle } from 'lucide-react';
import { Label as ShadcnLabel } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import styles from './FormFields.module.scss';

// --- Label ---

interface LabelProps extends React.ComponentPropsWithoutRef<typeof ShadcnLabel> {
    required?: boolean | undefined;
}

export const Label = React.memo(({ children, className, required, ...props }: LabelProps) => {
    return (
        <ShadcnLabel className={cn(className)} {...props}>
            {children}
            {required ? <span className={styles.requiredStar}>*</span> : null}
        </ShadcnLabel>
    );
});
Label.displayName = 'Label';

// --- HelpText ---

interface HelpTextProps {
    children: React.ReactNode;
    variant?: 'info' | 'warning';
    className?: string;
    showIcon?: boolean;
    iconSize?: number;
}

export const HelpText = React.memo(({
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
});
HelpText.displayName = 'HelpText';

import { FormField } from '../FormField';
export { FormField as Field };
export type { FormFieldProps as FieldProps } from '../FormField';

// --- Section Container ---

interface SectionContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const SectionContainer = React.memo(({ children, className }: SectionContainerProps) => {
    return (
        <div className={cn(styles.sectionContainer, className)}>
            {children}
        </div>
    );
});
SectionContainer.displayName = 'SectionContainer';

// --- Option Group ---

export const OptionGroup = React.memo(({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={cn(styles.optionGroup, className)}>
            {children}
        </div>
    );
});
OptionGroup.displayName = 'OptionGroup';
