import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Banana } from "lucide-react";
import { clsx } from "clsx";
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
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                className={buttonVariants({ variant, size, className })}
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
