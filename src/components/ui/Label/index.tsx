"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import classNames from "classnames/bind"
import styles from "./styles.module.scss"

const cx = classNames.bind(styles)

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cx("label", className)}
        {...props}
    />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
