"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import classNames from "classnames/bind"
import styles from "./styles.module.scss"

const cx = classNames.bind(styles)

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
        className={cx("root", className)}
        {...props}
        ref={ref}
    >
        <SwitchPrimitives.Thumb
            className={cx("thumb")}
        />
    </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
