import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface IconButtonProps extends Omit<ButtonProps, "size" | "variant"> {
    /**
     * The icon to display. structure: from lucide-react
     */
    icon?: LucideIcon
    /**
     * Size of the button.
     * @default "md"
     */
    size?: "sm" | "md" | "lg" | "xl"
    /**
     * Color variant of the button.
     * @default "toss-text"
     */
    variant?: "toss-text" | "toss-solid" | "toss-line" | "ghost" | "secondary" | "outline" | "destructive" | "default"
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, icon: Icon, size = "md", variant = "toss-text", children, ...props }, ref) => {
        // Map custom size props to Button's size variants
        const sizeMap: Record<NonNullable<IconButtonProps["size"]>, NonNullable<ButtonProps["size"]>> = {
            sm: "icon-sm", // 32px
            md: "icon",    // 48px
            lg: "icon-lg", // 56px
            xl: "icon-lg", // Fallback or larger if defined, sticking to lg for now
        }

        // Map size to icon size classes
        const iconSizeMap = {
            sm: "h-4 w-4",
            md: "h-6 w-6",
            lg: "h-7 w-7",
            xl: "h-8 w-8",
        }

        return (
            <Button
                variant={variant}
                size={sizeMap[size]}
                className={cn(
                    "rounded-full transition-transform active:scale-95", // TDS-like extensive rounding and press effect
                    className
                )}
                ref={ref}
                {...props}
            >
                {Icon && <Icon className={cn(iconSizeMap[size as keyof typeof iconSizeMap])} />}
                {children}
            </Button>
        )
    }
)
IconButton.displayName = "IconButton"

export { IconButton }
