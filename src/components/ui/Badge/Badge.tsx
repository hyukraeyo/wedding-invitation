import * as React from "react"
import { clsx } from "clsx"
import styles from "./Badge.module.scss"

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
