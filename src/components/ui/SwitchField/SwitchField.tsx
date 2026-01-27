"use client";

import React from "react";
import styles from "./SwitchField.module.scss";
import { Switch, SwitchProps } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";

interface SwitchFieldProps extends SwitchProps {
    label?: React.ReactNode;
    description?: React.ReactNode;
}

export const SwitchField = React.forwardRef<HTMLLabelElement, SwitchFieldProps>(
    ({ label, description, className, ...props }, ref) => {
        return (
            <label className={cn(styles.root, className)} ref={ref}>
                {(label || description) && (
                    <div className={styles.info}>
                        {label && <span className={styles.label}>{label}</span>}
                        {description && <span className={styles.description}>{description}</span>}
                    </div>
                )}
                <Switch
                    {...props}
                />
            </label>
        );
    }
);

SwitchField.displayName = "SwitchField";
