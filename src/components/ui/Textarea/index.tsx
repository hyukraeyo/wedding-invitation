import * as React from "react"

import { cn } from "@/lib/utils"
import styles from "./styles.module.scss"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        styles.textarea,
        className
      )}
      style={{
        ...props.style
      }}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
