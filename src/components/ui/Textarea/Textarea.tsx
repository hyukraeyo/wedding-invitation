import * as React from "react"
import { cn } from "@/lib/utils"
import styles from "./Textarea.module.scss"
import { useFormField } from "@/components/common/FormField"

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  error?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, error, size = 'md', id: customId, onChange, ...props }, ref) => {
  const sizeClass = styles[size];
  const field = useFormField();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Merge refs
  React.useImperativeHandle(ref, () => textareaRef.current!);

  // Function to sync current value with Field context
  const syncHasValue = React.useCallback(() => {
    if (field?.setHasValue && textareaRef.current) {
      field.setHasValue(textareaRef.current.value.length > 0);
    }
  }, [field]);

  // Initial sync and sync on prop changes
  React.useEffect(() => {
    syncHasValue();
  }, [syncHasValue, props.value, props.defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    syncHasValue();
    onChange?.(e);
  };

  // Auto-sync with FormField context
  const id = customId || field?.id;
  const isError = error || field?.isError;
  const describedBy = field?.isError ? field.errorId : field?.descriptionId;

  return (
    <textarea
      id={id}
      className={cn(styles.textarea, sizeClass, className)}
      data-error={isError ? "true" : undefined}
      data-variant={field?.variant}
      aria-describedby={describedBy}
      aria-invalid={isError ? "true" : undefined}
      ref={textareaRef}
      onChange={handleChange}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
