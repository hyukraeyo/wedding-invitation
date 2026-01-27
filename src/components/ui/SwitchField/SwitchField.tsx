"use client";

import React from "react";
import styles from "./SwitchField.module.scss";
import { Switch, SwitchProps } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";

interface SwitchFieldProps extends SwitchProps {
    label?: React.ReactNode;
    description?: React.ReactNode;
}

export const SwitchField = React.forwardRef<HTMLDivElement, SwitchFieldProps>(
    ({ label, description, className, id: customId, checked, onCheckedChange, disabled, ...props }, ref) => {
        const generatedId = React.useId();
        const id = customId || generatedId;

        const handleContainerClick = (e: React.MouseEvent) => {
            if (disabled) return;
            // 스위치 자체(버튼)를 클릭한 경우에는 Radix가 직접 처리하므로 중복 처리를 방지합니다.
            if ((e.target as HTMLElement).closest('button')) return;

            onCheckedChange?.(!checked);
        };

        return (
            <div
                className={cn(styles.root, disabled && styles.disabled, className)}
                ref={ref}
                onClick={handleContainerClick}
            >
                {(label || description) && (
                    <div className={styles.info}>
                        {label && (
                            <label htmlFor={id} className={styles.label}>
                                {label}
                            </label>
                        )}
                        {description && <span className={styles.description}>{description}</span>}
                    </div>
                )}
                <Switch
                    id={id}
                    {...(checked !== undefined ? { checked } : {})}
                    {...(onCheckedChange !== undefined ? { onCheckedChange } : {})}
                    disabled={disabled}
                    {...props}
                />
            </div>
        );
    }
);

SwitchField.displayName = "SwitchField";
