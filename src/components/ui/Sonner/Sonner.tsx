"use client"

import { Toaster as Sonner } from "sonner"
import styles from "./styles.module.scss"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: styles.toast || "",
                    description: styles.description || "",
                    actionButton: styles.actionButton || "",
                    cancelButton: styles.cancelButton || "",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
