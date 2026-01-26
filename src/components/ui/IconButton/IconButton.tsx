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
    size?: "sm" | "md" | "lg"
    /**
     * Size of the icon specifically. If not provided, will use defaults based on button size.
     */
    iconSize?: number
    /**
     * Stroke width of the icon.
     * @default 2
     */
    strokeWidth?: number
    /**
     * Whether the button should be perfectly round.
     * @default false
     */
    rounded?: boolean
    /**
     * Color variant of the button.
     * @default "ghost"
     */
    variant?: ButtonProps["variant"]
    loading?: boolean | undefined;
    "aria-label"?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({
        className,
        icon: Icon,
        size = "md",
        iconSize,
        strokeWidth,
        variant = "ghost",
        rounded = false,
        children,
        "aria-label": ariaLabel,
        ...props
    }, ref) => {
        const { loading, ...rest } = props;

        return (
            <Button
                variant={variant}
                size="icon"
                className={cn(
                    styles.iconButton,
                    styles[size],
                    rounded && styles.rounded,
                    className
                )}
                ref={ref}
                loading={false}
                disabled={loading || rest.disabled}
                aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
                {...rest}
            >
                {Icon ? (
                    <Icon
                        {...(iconSize !== undefined ? { size: iconSize } : {})}
                        {...(strokeWidth !== undefined ? { strokeWidth } : {})}
                        className={cn(
                            styles.icon,
                            !iconSize && styles[size],
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
