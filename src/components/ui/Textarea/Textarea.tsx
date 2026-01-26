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
>(({ className, error, size = 'md', id: customId, ...props }, ref) => {
  const sizeClass = styles[size];
  const field = useFormField();

  // Auto-sync with FormField context
  const id = customId || field?.id;
  const isError = error || field?.isError;
  const describedBy = field?.isError ? field.errorId : field?.descriptionId;

  return (
    <textarea
      id={id}
      className={cn(styles.textarea, sizeClass, className)}
      data-error={isError ? "true" : undefined}
      aria-describedby={describedBy}
      aria-invalid={isError ? "true" : undefined}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
