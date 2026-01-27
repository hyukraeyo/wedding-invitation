"use client";

import React from "react";
import { clsx } from "clsx";
import { X } from "lucide-react";
import styles from "./Chip.module.scss";

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "primary" | "outline" | "glass";
    leftIcon?: React.ReactNode;
    onRemove?: (e: React.MouseEvent) => void;
    disabled?: boolean;
    clickable?: boolean;
}

/**
 * Chip Component
 * A compact element used for tags, attributes, or actions.
 */
export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
    (
        {
            className,
            variant = "default",
            leftIcon,
            onRemove,
            disabled,
            clickable,
            children,
            onClick,
            ...props
        },
        ref
    ) => {
        const isClickable = (clickable || !!onClick) && !disabled;

        return (
            <div
                ref={ref}
                className={clsx(
                    styles.chip,
                    styles[`chip--variant-${variant}`],
                    isClickable && styles.clickable,
                    disabled && styles.disabled,
                    className
                )}
                onClick={disabled ? undefined : onClick}
                {...props}
            >
                {leftIcon && <span className={styles.chip__icon}>{leftIcon}</span>}
                <span className={styles.chip__content}>{children}</span>
                {onRemove && !disabled && (
                    <span
                        className={styles.chip__remove}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(e);
                        }}
                        role="button"
                        aria-label="Remove"
                    >
                        <X size={14} />
                    </span>
                )}
            </div>
        );
    }
);

Chip.displayName = "Chip";

export default Chip;
