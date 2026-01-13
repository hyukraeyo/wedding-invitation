import React from 'react';
import { Info, AlertCircle } from 'lucide-react';
import { Label as ShadcnLabel } from '@/components/ui/Label';
import { cn } from '@/lib/utils';

// --- Label ---

interface LabelProps extends React.ComponentPropsWithoutRef<typeof ShadcnLabel> {
    required?: boolean | undefined;
}

export const Label = ({ children, className, required, ...props }: LabelProps) => {
    return (
        <ShadcnLabel className={cn(className)} {...props}>
            {children}
            {required && <span className="text-destructive ml-1">*</span>}
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
            "flex items-start gap-1.5 text-xs py-1",
            variant === 'info' && "text-muted-foreground",
            variant === 'warning' && "text-destructive font-medium",
            className
        )}>
            {showIcon && <Icon size={iconSize} className="mt-0.5 shrink-0" />}
            <span className="leading-normal">{children}</span>
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
}

export const Field = ({ label, children, className, required, description, error, id }: FieldProps) => {
    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex flex-col gap-1.5">
                {label && (
                    <Label htmlFor={id} required={!!required}>
                        {label}
                    </Label>
                )}
                {children}
                {description && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", error && "text-destructive")}>
                        {description}
                    </p>
                )}
                {error && (
                    <p className="text-[0.8rem] font-medium text-destructive">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};
