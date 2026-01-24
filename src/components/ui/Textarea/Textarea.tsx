import * as React from "react"
import { cn } from "@/lib/utils"
import styles from "./Textarea.module.scss"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, error, ...props }, ref) => {
  return (
    <textarea
      className={cn(styles.textarea, className)}
      data-error={error ? "true" : undefined}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
