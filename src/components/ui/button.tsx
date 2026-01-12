import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import styles from "./button.module.scss"

const buttonVariants = cva(
  styles.base,
  {
    variants: {
      variant: {
        default: styles.variantDefault,
        destructive: styles.variantDestructive,
        outline: styles.variantOutline,
        secondary: styles.variantSecondary,
        ghost: styles.variantGhost,
        link: styles.variantLink,
        // Toss Design System Inspired Variants
        "toss-text": styles.variantTossText,
        "toss-solid": styles.variantTossSolid,
        "toss-line": styles.variantTossLine,
      },
      size: {
        default: styles.sizeDefault,
        sm: styles.sizeSm,
        lg: styles.sizeLg,
        icon: styles.sizeIcon,
        "icon-sm": styles.sizeIconSm,
        "icon-lg": styles.sizeIconLg,
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
        className={cn(buttonVariants({ variant, size, className }))}
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
