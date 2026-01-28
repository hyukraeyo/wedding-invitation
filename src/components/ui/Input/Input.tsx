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
>(({ className, type, error, size = 'md', id: customId, onChange, ...props }, ref) => {
    const sizeClass = styles[size];
    const field = useFormField();
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    // Function to sync current value with Field context
    const syncHasValue = React.useCallback(() => {
        if (field?.setHasValue && inputRef.current) {
            field.setHasValue(inputRef.current.value.length > 0);
        }
    }, [field]);

    // Initial sync and sync on prop changes
    React.useEffect(() => {
        syncHasValue();
    }, [syncHasValue, props.value, props.defaultValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        syncHasValue();
        onChange?.(e);
    };

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
            data-variant={field?.variant}
            aria-describedby={describedBy}
            aria-invalid={isError ? "true" : undefined}
            ref={inputRef}
            onChange={handleChange}
            {...props}
        />
    )
})
Input.displayName = "Input"

export { Input }
