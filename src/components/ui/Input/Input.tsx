import * as React from "react"
import { cn } from "@/lib/utils"
import styles from "./Input.module.scss"
import { useFormField } from "@/components/common/FormField"

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    error?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const Input = React.forwardRef<
    HTMLInputElement,
    InputProps
>(({ className, type, error, size = 'md', id: customId, ...props }, ref) => {
    const sizeClass = styles[size];
    const field = useFormField();

    // Auto-sync with FormField context
    const id = customId || field?.id;
    const isError = error || field?.isError;
    const describedBy = field?.isError ? field.errorId : field?.descriptionId;

    return (
        <input
            id={id}
            type={type}
            className={cn(styles.input, sizeClass, className)}
            data-error={isError ? "true" : undefined}
            aria-describedby={describedBy}
            aria-invalid={isError ? "true" : undefined}
            ref={ref}
            {...props}
        />
    )
})
Input.displayName = "Input"

export { Input }
