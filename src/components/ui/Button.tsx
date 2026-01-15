import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "btn-base",
  {
    variants: {
      variant: {
        default: "btn-default",
        destructive: "btn-destructive",
        outline: "btn-outline",
        secondary: "btn-secondary",
        ghost: "btn-ghost",
        link: "btn-link",
        // 디자인 시스템 가이드에 맞춘 바나나웨딩 전용 스타일
        solid: "btn-solid",
        line: "btn-line",
      },
      size: {
        default: "btn-size-default", // 48px (Touch Friendly)
        sm: "btn-size-sm",          // 32px
        lg: "btn-size-lg",          // 56px
        icon: "btn-size-icon",      // 48px
        "icon-sm": "btn-size-icon-sm",
        "icon-lg": "btn-size-icon-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        style={{
          fontSize: 'var(--builder-font-size)',
          fontFamily: 'var(--builder-font-family)',
          lineHeight: 'var(--builder-line-height)',
        }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
