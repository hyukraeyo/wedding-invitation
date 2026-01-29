"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
// useField removed
import styles from "./Checkbox.module.scss"

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, id: customId, ...props }, ref) => {
    return (
        <CheckboxPrimitive.Root
            ref={ref}
            id={customId}
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
