"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useField } from "@/components/ui/Field"
import styles from "./Checkbox.module.scss"

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, id: customId, ...props }, ref) => {
    const field = useField()
    const id = customId || field?.id
    const describedBy = field?.isError ? field.errorId : field?.descriptionId
    const isError = field?.isError

    return (
        <CheckboxPrimitive.Root
            ref={ref}
            id={id}
            aria-describedby={describedBy}
            aria-invalid={isError ? "true" : undefined}
            className={cn(styles.checkbox, className)}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                className={styles.indicator}
            >
                <Check size={14} strokeWidth={3} />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
