import React from 'react';
import { Label as ShadcnLabel } from '@/components/ui/label';
import { cn } from '@/lib/utils';

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
