"use client"

import { useWebToast } from "@toss/tds-mobile"
import type { ReactNode } from "react"

/**
 * TDS Toast documentation: https://tossmini-docs.toss.im/tds-mobile/hooks/OverlayExtension/use-toast/
 */
export type ToastProps = {
  message?: string
  /** @deprecated message를 사용하세요 */
  text?: string
  /** @deprecated message를 사용하세요 */
  description?: string
  /** @deprecated message를 사용하세요 */
  title?: string
  /** 토스트의 시각적 테마 */
  variant?: "default" | "destructive" | "success"
  /** 토스트 표시 위치 */
  position?: "top" | "bottom"
  /** 토스트에 포함될 버튼 */
  button?: ReactNode | { text: string; onClick: () => void }
  /** 토스트 왼쪽에 표시될 요소 (아이콘 등) */
  leftAddon?: ReactNode
  /** TDS 표준 아이콘 */
  icon?: string
  /** TDS 표준 아이콘 타입 */
  iconType?: "circle" | "square"
  /** CTA 버튼보다 위에 표시할지 여부 */
  higherThanCTA?: boolean
  /** 표시 시간 (ms) */
  duration?: number
}

function useToast() {
  const { openToast: tdsOpenToast, closeToast } = useWebToast()

  const openToast = (message: string, options?: Omit<ToastProps, "message">) => {
    // TDS expects specifically named options
    // Mapping keys: position -> type
    const { position, duration, icon, button, ...rest } = options || {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tdsOptions: any = {
      type: position || "bottom",
      duration: typeof duration === 'number' ? duration : 3000,
      button: button,
      // Pass other known props if needed, or spread safe ones
      ...rest
    }

    // Explicitly handle icon mapping if needed, or pass through if TDS handles it
    if (icon) {
      tdsOptions.icon = icon
    }

    tdsOpenToast(message, tdsOptions)
  }

  const toast = (props: ToastProps | string) => {
    if (typeof props === "string") {
      openToast(props)
      return
    }

    const { message, text, description, title, ...options } = props
    const finalMessage = message || text || description || title || ""
    openToast(finalMessage, options)
  }

  return {
    toast,
    openToast,
    closeToast,
    dismiss: closeToast,
  }
}

export { useToast }
