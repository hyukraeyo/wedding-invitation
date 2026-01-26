import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Banana, LucideIcon } from "lucide-react";
import { clsx } from "clsx";
import { cn } from "@/lib/utils";
import styles from "./Button.module.scss";

type ButtonVariantsOptions = {
    variant?: ButtonProps["variant"];
    size?: ButtonProps["size"];
    className?: string | undefined;
};

type ButtonVariantsResult = string;

// Types match the old component for compatibility
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "solid"
    | "line"
    | "glass";
    size?: "sm" | "md" | "lg" | "icon";
    loading?: boolean | undefined;
    fullWidth?: boolean | undefined;
    // Icon Options (Text + Icon)
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    iconSize?: number;
    // Theme Options (Granular Control)
    color?: string;       // Custom background color (hex, rgb, or brand name)
    textColor?: string;   // Custom text color
    radius?: number | string; // Custom border radius
}

// Compatibility helper for external usage (e.g. AlertDialog)
export const buttonVariants = (options: ButtonVariantsOptions = {}): ButtonVariantsResult => {
    const { variant = "default", size = "md", className } = options;
    return clsx(
        styles.button,
        styles[`button--variant-${variant}`],
        styles[`button--size-${size}`],
        className
    );
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "default",
            size = "md",
            asChild = false,
            loading = false,
            fullWidth = false,
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            iconSize,
            color,
            textColor,
            radius,
            disabled,
            children,
            style, // Extract original style to merge
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : "button";

        // Generate dynamic styles from props
        const dynamicStyles = {
            ...(color && { "--btn-bg": color }),
            ...(textColor && { "--btn-color": textColor }),
            ...(radius !== undefined && { "--btn-radius": typeof radius === 'number' ? `${radius}px` : radius }),
            ...style
        } as React.CSSProperties;

        // Determine default icon size based on button size
        const defaultIconSize = size === "sm" ? 14 : size === "lg" ? 22 : 18;
        const currentIconSize = iconSize || defaultIconSize;

        return (
            <Comp
                className={buttonVariants({ variant, size, className: cn(fullWidth && styles["button--full-width"], className) })}
                style={dynamicStyles}
                disabled={disabled || loading}
                data-loading={loading ? "true" : undefined}
                ref={ref}
                {...props}
            >
                <div className={clsx(styles.content, loading && styles.loadingText)}>
                    {LeftIcon && <LeftIcon size={currentIconSize} className={styles.leftIcon} />}
                    {children}
                    {RightIcon && <RightIcon size={currentIconSize} className={styles.rightIcon} />}
                </div>
                {loading && (
                    <div className={styles.loader}>
                        <div className={styles.spin}>
                            <Banana size={currentIconSize} />
                        </div>
                    </div>
                )}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button };
