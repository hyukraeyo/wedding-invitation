"use client"

import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive"
  action?: React.ReactNode
  [key: string]: unknown
}

function toast({ title, description, variant, ...props }: ToastProps) {
  const content = title || description;
  const options = {
    description: title ? description : undefined,
    ...props,
  };

  if (variant === "destructive") {
    return sonnerToast.error(content, options)
  }
  return sonnerToast(content, options)
}

function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  }
}

export { useToast, toast }
