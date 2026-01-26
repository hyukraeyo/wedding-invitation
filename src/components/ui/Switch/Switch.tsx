"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
import styles from "./Switch.module.scss"
import { useFormField } from "@/components/common/FormField"

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, id: customId, ...props }, ref) => {
    const field = useFormField();
    const id = customId || field?.id;
    const describedBy = field?.isError ? field.errorId : field?.descriptionId;
    const isError = field?.isError;

    return (
        <SwitchPrimitive.Root
            id={id}
            aria-describedby={describedBy}
            aria-invalid={isError ? "true" : undefined}
            className={cn(styles.root, className)}
            {...props}
            ref={ref}
        >
            <SwitchPrimitive.Thumb
                className={styles.thumb}
            />
        </SwitchPrimitive.Root>
    );
})
Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }
