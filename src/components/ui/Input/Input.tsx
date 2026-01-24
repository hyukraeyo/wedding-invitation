import * as React from "react"
import { cn } from "@/lib/utils"
import styles from "./Input.module.scss"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

const Input = React.forwardRef<
    HTMLInputElement,
    InputProps
>(({ className, type, error, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(styles.input, className)}
            data-error={error ? "true" : undefined}
            ref={ref}
            {...props}
        />
    )
})
Input.displayName = "Input"

export { Input }
