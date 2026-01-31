"use client"

import { useToastStore } from "@/store/useToastStore"
import type { ReactNode } from "react"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"

export type ToastVariant = "default" | "destructive" | "success" | "info"

export type ToastProps = {
  message?: string | undefined
  text?: string | undefined
  description?: string | undefined
  title?: string | undefined
  variant?: ToastVariant | undefined
  position?: "top" | "bottom" | undefined
  button?: ReactNode | { text: string; onClick: () => void } | undefined
  duration?: number | undefined
  icon?: ReactNode | undefined
}

function useToast() {
  const toast = (props: ToastProps | string) => {
    if (typeof props === "string") {
      openToast(props)
      return
    }

    const { message, text, description, title, ...options } = props

    // If both title and description are present, we pass description as message and keep title
    const finalMessage = message || text || description || ""
    const finalTitle = title || undefined

    addToast(finalMessage, {
      ...options,
      title: finalTitle,
    })
  }

  const openToast = (message: string, options?: Omit<ToastProps, "message">) => {
    addToast(message, options)
  }

  const addToast = (message: string, options?: Omit<ToastProps, "message">) => {
    const { variant, duration, icon, title } = options || {}
    let finalIcon = icon
    if (!finalIcon) {
      switch (variant) {
        case "success":
          finalIcon = <CheckCircle2 />
          break
        case "destructive":
          finalIcon = <AlertCircle />
          break
        case "info":
          finalIcon = <Info />
          break
        default:
          break
      }
    }

    useToastStore.getState().addToast(message, {
      variant,
      duration,
      icon: finalIcon,
      title,
    })
  }

  return {
    toast,
    openToast,
    dismiss: () => { },
  }
}

export { useToast }
