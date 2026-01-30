"use client"

import { useToastStore } from "@/store/useToastStore"
import type { ReactNode } from "react"

export type ToastProps = {
  message?: string | undefined
  text?: string | undefined
  description?: string | undefined
  title?: string | undefined
  variant?: "default" | "destructive" | "success" | undefined
  position?: "top" | "bottom" | undefined
  button?: ReactNode | { text: string; onClick: () => void } | undefined
  duration?: number | undefined
}

function useToast() {
  const addToast = useToastStore((state) => state.addToast)

  const openToast = (message: string, options?: Omit<ToastProps, "message">) => {
    const { variant, duration } = options || {}
    addToast(message, {
      variant,
      duration
    })
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
    dismiss: () => { },
  }
}

export { useToast }
