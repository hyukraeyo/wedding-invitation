"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
import styles from "./Switch.module.scss"
import { useFormField } from "@/components/common/FormField"


export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
    variant?: 'block' | 'basic';
    label?: React.ReactNode;
    description?: React.ReactNode;
}

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitive.Root>,
    SwitchProps
>(({ className, variant = 'block', label, description, id: customId, ...props }, ref) => {
    const field = useFormField();
    const id = customId || field?.id;
    const describedBy = field?.isError ? field.errorId : field?.descriptionId;
    const isError = field?.isError;

    const switchNode = (
        <SwitchPrimitive.Root
            id={id}
            aria-describedby={describedBy}
            aria-invalid={isError ? "true" : undefined}
            className={cn(
                styles.root,
                variant === 'basic' ? styles['variant-basic'] : styles['variant-block'],
                variant === 'basic' && className
            )}
            {...props}
            ref={ref}
        >
            <SwitchPrimitive.Thumb
                className={cn(styles.thumb, styles[`thumb-${variant}`])}
            />
        </SwitchPrimitive.Root>
    );

    if (variant === 'block') {
        return (
            <label className={cn(styles.blockContainer, className)}>
                {(label || description) && (
                    <div className={styles.blockInfo}>
                        {label && <span className={styles.blockLabel}>{label}</span>}
                        {description && <span className={styles.blockDescription}>{description}</span>}
                    </div>
                )}
                {switchNode}
            </label>
        );
    }

    return switchNode;
})
Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }
