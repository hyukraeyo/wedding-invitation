"use client"

import { useBottomSheet as useTDSBottomSheet } from "@toss/tds-mobile"

/**
 * TDS useBottomSheet documentation: https://tossmini-docs.toss.im/tds-mobile/hooks/OverlayExtension/use-bottom-sheet/
 */
export function useBottomSheet() {
    const { open, close, openOneButtonSheet, openTwoButtonSheet } = useTDSBottomSheet()

    return {
        open,
        close,
        dismiss: close,
        openOneButtonSheet,
        openTwoButtonSheet
    }
}
