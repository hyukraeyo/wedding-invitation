import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "builder-input-unified file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          className
        )}
        style={{
          fontSize: 'var(--builder-font-size)',
          fontFamily: 'var(--builder-font-family)',
          lineHeight: 'var(--builder-line-height)',
          ...props.style
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
