import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import styles from "./Badge.module.scss"
import { clsx } from "clsx"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return (
        <div
            className={clsx(
                styles.badge,
                styles[`badge--variant-${variant}`],
                className
            )}
            {...props}
        />
    )
}

export { Badge }
