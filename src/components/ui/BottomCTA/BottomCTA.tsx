"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "../Button/Button"
import { Checkbox } from "../Checkbox/Checkbox"
import styles from "./BottomCTA.module.scss"

interface BottomCTAProps extends React.HTMLAttributes<HTMLDivElement> {
    isFixed?: boolean;
    showGradient?: boolean;
    inModal?: boolean;
}

const FixedBottomCTA = React.forwardRef<HTMLDivElement, BottomCTAProps>(
    ({ className, children, isFixed = true, showGradient = true, inModal = false, ...props }, ref) => {
        const content = (
            <div
                ref={ref}
                className={cn(
                    isFixed && !inModal && styles.container,
                    inModal && styles.inModal,
                    className
                )}
                {...props}
            >
                {isFixed && showGradient && !inModal && <div className={styles.gradient} />}
                <div className={cn(styles.inner, isFixed && !inModal && styles.isFixed)}>
                    {children}
                </div>
            </div>
        );

        return content;
    }
);
FixedBottomCTA.displayName = "BottomCTA.Fixed"

interface SingleProps extends BottomCTAProps {
    buttonProps: ButtonProps;
}

const Single = ({ buttonProps, className, ...props }: SingleProps) => {
    return (
        <FixedBottomCTA className={className} {...props}>
            <div className={styles.single}>
                <Button fullWidth size="lg" {...buttonProps} />
            </div>
        </FixedBottomCTA>
    );
};

interface DoubleProps extends BottomCTAProps {
    primaryButtonProps: ButtonProps;
    secondaryButtonProps: ButtonProps;
}

const Double = ({ primaryButtonProps, secondaryButtonProps, className, ...props }: DoubleProps) => {
    return (
        <FixedBottomCTA className={className} {...props}>
            <div className={styles.double}>
                <Button
                    variant="outline"
                    size="lg"
                    className={styles.secondary}
                    {...secondaryButtonProps}
                />
                <Button
                    variant="default"
                    size="lg"
                    {...primaryButtonProps}
                />
            </div>
        </FixedBottomCTA>
    );
};

interface CheckFirstProps extends BottomCTAProps {
    buttonProps: ButtonProps;
    checkboxId: string;
    label: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

const CheckFirst = ({
    buttonProps,
    checkboxId,
    label,
    checked,
    onCheckedChange,
    className,
    ...props
}: CheckFirstProps) => {
    return (
        <FixedBottomCTA className={className} {...props}>
            <div className={styles.checkFirst}>
                <label htmlFor={checkboxId} className={styles.checkWrapper}>
                    <Checkbox
                        id={checkboxId}
                        checked={checked ?? false}
                        {...(onCheckedChange ? { onCheckedChange: (val: boolean | 'indeterminate') => onCheckedChange(val === true) } : {})}
                    />
                    <span className={styles.label}>{label}</span>
                </label>
                <div className={styles.single}>
                    <Button fullWidth size="lg" {...buttonProps} />
                </div>
            </div>
        </FixedBottomCTA>
    );
};

export const BottomCTA = Object.assign(FixedBottomCTA, {
    Single,
    Double,
    CheckFirst,
});
