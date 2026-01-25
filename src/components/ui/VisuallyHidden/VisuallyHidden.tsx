"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const VisuallyHidden = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
    ({ className, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={className}
                style={{
                    position: 'absolute',
                    border: 0,
                    width: 1,
                    height: 1,
                    padding: 0,
                    margin: -1,
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    wordWrap: 'normal',
                    ...props.style,
                }}
                {...props}
            />
        )
    }
)
VisuallyHidden.displayName = "VisuallyHidden"

export { VisuallyHidden }
