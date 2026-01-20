import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { LucideIcon, Banana } from "lucide-react"
import styles from "./IconButton.module.scss"

export interface IconButtonProps extends Omit<ButtonProps, "size" | "variant"> {
    /**
     * The icon to display from lucide-react
     */
    icon?: LucideIcon
    /**
     * Size of the button.
     * @default "md"
     */
    size?: "xs" | "sm" | "md" | "lg" | "xl"
    /**
     * Color variant of the button.
     * @default "ghost"
     */
    variant?: "solid" | "line" | "ghost" | "secondary" | "outline" | "destructive" | "default"
    loading?: boolean | undefined;
    "aria-label"?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, icon: Icon, size = "md", variant = "ghost", children, "aria-label": ariaLabel, ...props }, ref) => {
        // Map custom size props to Button's size variants
        const sizeMap: Record<NonNullable<IconButtonProps["size"]>, NonNullable<ButtonProps["size"]>> = {
            xs: "icon-xs", // 28px
            sm: "icon-sm", // 32px
            md: "icon",    // 48px (Standard Touch Area)
            lg: "icon-lg", // 56px
            xl: "icon-lg",
        }

        const { loading, ...rest } = props;

        return (
            <Button
                variant={variant}
                size={sizeMap[size]}
                className={cn(styles.iconButton, className)}
                ref={ref}
                loading={false} // Prevent Button from hiding content
                disabled={loading || rest.disabled}
                aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
                {...rest}
            >
                {Icon ? (
                    <Icon
                        className={cn(
                            styles.icon,
                            styles[size],
                            loading && styles.faded
                        )}
                    />
                ) : null}

                {loading && (
                    <div className={styles.spinnerOverlay}>
                        <Banana
                            className={styles.spinner}
                            size={size === 'sm' ? 14 : 20}
                        />
                    </div>
                )}

                {children}
            </Button>
        )
    }
)
IconButton.displayName = "IconButton"

export { IconButton }
