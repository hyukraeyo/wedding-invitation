"use client"

import { useToastStore, ToastData } from "@/store/useToastStore"
import type { ReactNode } from "react"

export type ToastProps = {
  message?: string
  text?: string
  description?: string
  title?: string
  variant?: "default" | "destructive" | "success"
  position?: "top" | "bottom"
  button?: ReactNode | { text: string; onClick: () => void }
  duration?: number
}

function useToast() {
  const addToast = useToastStore((state) => state.addToast)

  const openToast = (message: string, options?: Omit<ToastProps, "message">) => {
    const { variant, duration } = options || {}
    addToast(message, {
      variant: variant as any,
      duration: duration as any
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
