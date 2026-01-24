import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Banana } from "lucide-react";
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
    size?: "default" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
    loading?: boolean | undefined;
    fullWidth?: boolean | undefined;
    // Theme Options (Granular Control)
    color?: string;       // Custom background color (hex, rgb, or brand name)
    textColor?: string;   // Custom text color
    radius?: number | string; // Custom border radius
}

// Compatibility helper for external usage (e.g. AlertDialog)
export const buttonVariants = (options: ButtonVariantsOptions = {}): ButtonVariantsResult => {
    const { variant = "default", size = "default", className } = options;
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
            size = "default",
            asChild = false,
            loading = false,
            fullWidth = false,
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

        return (
            <Comp
                className={buttonVariants({ variant, size, className: cn(fullWidth && styles["button--full-width"], className) })}
                style={dynamicStyles}
                disabled={disabled || loading}
                data-loading={loading ? "true" : undefined}
                ref={ref}
                {...props}
            >
                <span className={clsx(styles.content, loading && styles.loadingText)}>{children}</span>
                {loading && (
                    <div className={styles.loader}>
                        <div className={styles.spin}>
                            <Banana size={20} />
                        </div>
                    </div>
                )}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button };
