"use client"

import { useDialog as useTDSDialog } from "@toss/tds-mobile"
import type { ReactNode } from "react"

/**
 * TDS useDialog documentation: https://tossmini-docs.toss.im/tds-mobile/hooks/OverlayExtension/use-dialog/
 */
export function useDialog() {
    const { openAlert: tdsOpenAlert, openConfirm: tdsOpenConfirm, close } = useTDSDialog() as unknown as {
        openAlert: (options: unknown) => Promise<void>;
        openConfirm: (options: unknown) => Promise<boolean>;
        close: () => void;
    }

    const openAlert = (options: {
        title?: string
        description?: ReactNode
        button?: string | { text: string; onClick?: () => void }
        onClose?: () => void
    }) => {
        return tdsOpenAlert({
            title: options.title,
            description: options.description as ReactNode,
            alertButton: typeof options.button === "string" ? options.button : options.button?.text || "확인",
        }).then(() => {
            options.onClose?.()
        })
    }

    const openConfirm = (options: {
        title?: string
        description?: ReactNode
        confirmButton?: string | { text: string; onClick?: () => void }
        cancelButton?: string | { text: string; onClick?: () => void }
        onClose?: () => void
    }) => {
        return tdsOpenConfirm({
            title: options.title,
            description: options.description as ReactNode,
            confirmButton: typeof options.confirmButton === "string" ? options.confirmButton : options.confirmButton?.text || "확인",
            cancelButton: typeof options.cancelButton === "string" ? options.cancelButton : options.cancelButton?.text || "취소",
        }).then((confirmed: boolean) => {
            if (confirmed) {
                if (typeof options.confirmButton === "object") options.confirmButton.onClick?.()
            } else {
                if (typeof options.cancelButton === "object") options.cancelButton.onClick?.()
            }
            options.onClose?.()
            return confirmed
        })
    }

    return {
        openAlert,
        openConfirm,
        closeDialog: close,
        close,
    }
}
